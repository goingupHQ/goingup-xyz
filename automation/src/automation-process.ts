import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env')});

import { ethers } from 'ethers';

import webpush from './get-web-push';
import cacheUtilityTokenData from './cache-utility-token-data';
import { getDb } from './get-db-client';
import { Collection, Db } from 'mongodb';
import {
  GoingUpProjects,
  GoingUpProjects__factory,
  GoingUpUtilityTokens,
  GoingUpUtilityTokens__factory,
} from './typechain';

import { stopMailListener, startMailListener } from './email-mint-listener';

import { Account } from './types/account';
import { PushNotificationSubscription } from './types/psn';
import { mintAcceptedEmails, processConfirmedEmailMints } from './email-mint';

// prevent process from exiting when an unhandled exception occurs
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
  console.log(`Process is still alive`);
});

process.on('unhandledRejection', function (err) {
  console.log('Caught exception: ', err);
  console.log(`Process is still alive`);
});

process.on('SIGINT', function () {
  cleanup();
});

process.on('SIGTERM', function () {
  cleanup();
});

const cleanup = () => {
  console.log('Cleaning up');
  stopMailListener();
  process.exit();
};

let db: Db | null = null;
let accounts: Collection<Account> | null = null;
const main = async () => {
  db = await getDb();
  accounts = await db.collection<Account>('accounts');
  startMailListener();
};

main();

// const polygonProvider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_KEY);
// const mumbaiProvider = new ethers.providers.AlchemyProvider(80001, process.env.ALCHEMY_MUMBAI_KEY);

const polygonProvider = new ethers.providers.JsonRpcProvider(`https://polygon-rpc.com`);
const mumbaiProvider = new ethers.providers.JsonRpcProvider(`https://matic-mumbai.chainstacklabs.com`);

let utilityContract: GoingUpUtilityTokens | null = null;
let projectsContract: GoingUpProjects | null = null;
if (process.env.DEPLOYMENT === 'dev') {
  projectsContract = GoingUpProjects__factory.connect('0x825D5014239a59d7587b9F53b3186a76BF58aF72', mumbaiProvider);
} else if (process.env.DEPLOYMENT === 'production') {
  projectsContract = GoingUpProjects__factory.connect('0x9C28e833aE76A1e123c2799034cA6865A1113CA5', polygonProvider);

  utilityContract = GoingUpUtilityTokens__factory.connect(
    '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2',
    polygonProvider
  );
}

const sendNotificationToAddress = async (address: string, title: string, body: string, urlToOpen: string | null) => {
  if (db == null) {
    console.error('db is null in sendNotificationToAddress');
    return;
  }
  const subscriptions = await db
    .collection<PushNotificationSubscription>('psn-subscriptions')
    .find({ address })
    .toArray();
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify({ title, body, urlToOpen }));
      console.log('Sent notification to address:', address);
    } catch (error) {
      console.error(error);
    }
  }
};

if (utilityContract != null) {
  utilityContract.on('TransferSingle', async (operator, from, to, tokenId, amount, event) => {
    try {
      console.log(`TransferSingle: ${operator} ${from} ${to} ${tokenId} ${amount}`);
      console.log(`TransferSingle: ${event.blockNumber} ${event.blockHash} ${event.transactionHash}`);

      verifyReward(event.transactionHash);

      const token = await utilityContract?.tokenSettings(tokenId);

      if (token?.category.eq(1)) {
        const message = `You have received a Tier ${tokenId} Appreciation Token from ${
          from === '0x0000000000000000000000000000000000000000' ? operator : from
        }`;

        sendNotificationToAddress(to, 'Appreciation Token Received', message, null);

        const now = new Date();
        // const insertResp = await notifications.insertOne({
        //     address: to,
        //     message: `You have received a Tier ${tokenId} Appreciation Token from ${
        //         from === '0x0000000000000000000000000000000000000000' ? operator : from
        //     }`,
        //     timestamp: now,
        //     read: false,
        // });

        if (from === '0x0000000000000000000000000000000000000000') {
          const updateResp = await accounts?.updateOne(
            { address: to },
            { $push: { mintedUtilityTokens: { tokenId, timestamp: new Date().getTime() } } }
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
}

if (projectsContract) {
  projectsContract.on('InviteMember', async (projectId, from, to) => {
    console.log(`InviteMember: ${projectId} ${from} ${to}`);
    const project = await projectsContract?.projects(projectId);

    sendNotificationToAddress(
      from,
      `Transaction Confirmed`,
      `Your invitation to ${to} to ${project?.name} has been confirmed in the blockchain.`,
      `/projects/page/${projectId}`
    );

    sendNotificationToAddress(
      to,
      `Project Invitation Received`,
      `You have been invited to ${project?.name}\n\nClick here to open your pending invites list`,
      `/projects/pending-invites`
    );
  });

  projectsContract.on('DisinviteMember', async (projectId, from, memberRecordId) => {
    console.log(`DisinviteMember: ${projectId} ${from} ${memberRecordId}`);
    const project = await projectsContract?.projects(projectId);
    const memberRecord = await projectsContract?.projectMemberStorage(memberRecordId);

    sendNotificationToAddress(
      from,
      `Transaction Confirmed`,
      `Your disinvitation to ${memberRecord?.member} from ${project?.name} has been confirmed in the blockchain.`,
      `/projects/page/${projectId}`
    );
  });

  projectsContract.on('AcceptProjectInvitation', async (projectId, member) => {
    console.log(`AcceptProjectInvitation: ${projectId} ${member}`);
    const project = await projectsContract?.projects(projectId);

    if (project == null) return;

    sendNotificationToAddress(
      project.owner,
      `Project Invitation Accepted`,
      `${member} has accepted your invitation to ${project.name}`,
      `/projects/page/${projectId}`
    );

    sendNotificationToAddress(
      member,
      `Project Invitation Accepted`,
      `Your transaction to accept the invitation to ${project.name} has been confirmed in the blockchain`,
      `/projects/page/${projectId}`
    );
  });

  projectsContract.on('LeaveProject', async (projectId, memberRecordId, reason) => {
    console.log(`LeaveProject: ${projectId} ${memberRecordId} ${reason}`);

    if (projectsContract == null) return;
    const project = await projectsContract.projects(projectId);
    const memberRecord = await projectsContract.projectMemberStorage(memberRecordId);

    sendNotificationToAddress(
      project.owner,
      `Project Member Left`,
      `${memberRecord.member} has left ${project.name}`,
      `/projects/page/${projectId}`
    );

    sendNotificationToAddress(
      memberRecord.member,
      `Leave Project`,
      `Your transaction to leave ${project.name} has been confirmed in the blockchain`,
      null
    );
  });

  projectsContract.on('SetMemberGoalAsAchieved', async (projectId, setBy, memberRecordId) => {
    console.log(`SetMemberGoalAsAchieved: ${projectId} ${setBy} ${memberRecordId}`);

    if (projectsContract == null) return;
    const project = await projectsContract.projects(projectId);
    const memberRecord = await projectsContract.projectMemberStorage(memberRecordId);

    sendNotificationToAddress(
      project.owner,
      `Member Goal Achieved`,
      `${memberRecord.id} has achieved their goal in ${project.name}`,
      `/projects/page/${projectId}`
    );

    sendNotificationToAddress(
      memberRecord.member,
      `Goal Achieved`,
      `Your goal in ${project.name} has been marked as achieved`,
      null
    );
  });

  projectsContract.on('Create', async (creator, projectId) => {
    console.log(`Create: ${creator} ${projectId}`);

    if (projectsContract == null) return;
    if (db == null) return;
    const project = await projectsContract.projects(projectId);
    await db.collection('goingup-projects').updateOne({ id: projectId }, { $set: { ...project } }, { upsert: true });
  });

  projectsContract.on('Update', async (updater, projectId) => {
    console.log(`Update: ${updater} ${projectId}`);

    if (projectsContract == null) return;
    if (db == null) return;

    const project = await projectsContract.projects(projectId);
    await db.collection('goingup-projects').updateOne({ id: projectId }, { $set: { ...project } }, { upsert: true });
  });

  projectsContract.on('TransferProjectOwnership', async (projectId, from, to) => {
    console.log(`TransferProjectOwnership: ${projectId} ${from} ${to}`);

    if (projectsContract == null) return;
    if (db == null) return;

    const project = await projectsContract.projects(projectId);
    await db.collection('goingup-projects').updateOne({ id: projectId }, { $set: { ...project } }, { upsert: true });
  });
}

// verify pending rewards
setInterval(async () => {
  try {
    if (db == null) return;
    const unverifiedRewards = await db.collection('project-reward-txs').find({ verified: false }).toArray();
    for (const reward of unverifiedRewards) {
      verifyReward(reward.txhash);
    }
  } catch (error) {
    console.error(error);
  }
}, 10000 * 60);

const verifyReward = async (txhash: string) => {
  [polygonProvider, mumbaiProvider].forEach(async (provider) => {
    try {
      provider.getTransactionReceipt(txhash).then(async (receipt) => {
        if (provider == null) return;
        if (projectsContract == null) return;
        if (db == null) return;

        if (receipt) {
          if (receipt.status === 1) {
            const reward = await db.collection('project-reward-txs').findOne({ txhash });

            if (reward == null) return;

            const signer = new ethers.Wallet(process.env.BACKEND_WALLET_PK!, provider);
            const projectsContractAsSigner = projectsContract.connect(signer);

            const memberData = await projectsContractAsSigner.projectMemberStorage(
              ethers.BigNumber.from(reward.memberRecordId)
            );

            if (memberData?.rewardVerified === false) {
              projectsContractAsSigner
                .setMemberRewardAsVerified(reward.projectId, ethers.BigNumber.from(reward.memberRecordId))
                .then(async (tx) => {
                  const txReceipt = await tx.wait();
                  console.log(`Reward verified for ${reward.member} in project ${reward.projectId}`);

                  if (db == null) return;

                  await db.collection('backend-wallet-tx-receipts').insertOne(txReceipt);

                  if (txReceipt.status === 1) {
                    db.collection('project-reward-txs').updateOne({ txhash }, { $set: { verified: true } });
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }

          if (receipt.status === 0) {
            db.collection('project-reward-txs').deleteOne({ txhash });
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
};

// cache utility token data every 6 hours
setInterval(async () => {
  cacheUtilityTokenData();
}, 1000 * 60 * 60 * 6);
cacheUtilityTokenData();

let processingConfirmedEmailMints = false;
// process confirmed email mints every 15 seconds
// send accept token email to token recipients
setInterval(async () => {
  if (processingConfirmedEmailMints) return;
  processingConfirmedEmailMints = true;

  try {
    await processConfirmedEmailMints();
  } catch (err) {
    console.error(err);
  } finally {
    processingConfirmedEmailMints = false;
  }
}, 1000 * 15);

let mintingAcceptedEmailMints = false;
// mint accepted email mints every 90 seconds
setInterval(async () => {
  if (mintingAcceptedEmailMints) return;
  mintingAcceptedEmailMints = true;

  try {
    await mintAcceptedEmails();
  } catch (err) {
    console.error(err);
  } finally {
    mintingAcceptedEmailMints = false;
  }
}, 1000 * 90);

console.info('Event Listener Started');
setInterval(() => {}, 1 << 30);
