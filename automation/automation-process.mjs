import 'dotenv/config';
import { ethers } from 'ethers';
import fs from 'fs';
// import { sendEmail } from './services/_sendinblue.mjs';
import { MongoClient } from 'mongodb';
import webpush from './get-web-push.mjs';

const uri = process.env.MONGODB_URI;
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true });
await dbClient.connect();
const db = await dbClient.db();

const notifications = await db.collection('notifications');
const accounts = await db.collection('accounts');

const polygonProvider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_KEY);
const mumbaiProvider = new ethers.providers.AlchemyProvider(80001, process.env.ALCHEMY_MUMBAI_KEY);

const utilityArtifact = JSON.parse(fs.readFileSync('./artifacts/GoingUpUtilityTokens.json'));
const projectsArtifact = JSON.parse(fs.readFileSync('./artifacts/GoingUpProjects.json'));
let utilityContract, projectsContract;
if (process.env.DEPLOYMENT === 'dev') {
    projectsContract = new ethers.Contract(
        '0xF5df032832cb3c4BEf2D28B440fA57D5dAC47881',
        projectsArtifact.abi,
        mumbaiProvider
    );
    utilityContract = new ethers.Contract(
        '0x825D5014239a59d7587b9F53b3186a76BF58aF72',
        utilityArtifact.abi,
        mumbaiProvider
    );
} else if (process.env.DEPLOYMENT === 'production') {
    // projectsContract = new ethers.Contract('NONE', projectsArtifact.abi, polygonProvider);
    // utilityContract = new ethers.Contract(
    //     '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2',
    //     utilityArtifact.abi,
    //     polygonProvider
    // );
}

const sendNotificationToAddress = async (address, title, body, urlToOpen) => {
    const subscriptions = await db.collection('psn-subscriptions').find({ address }).toArray();
    for (const subscription of subscriptions) {
        try {
            await webpush.sendNotification(subscription, JSON.stringify({ title, body, urlToOpen }));
            console.log('Sent notification to address:', address);
        } catch (error) {
            console.error(error);
        }
    }
};

utilityContract.on('TransferSingle', async (operator, from, to, tokenId, event) => {
    console.log(`TransferSingle: ${operator} ${from} ${to} ${tokenId}`);
    console.log(`TransferSingle: ${event.blockNumber} ${event.blockHash} ${event.transactionHash}`);

    verifyReward(event.transactionHash);

    const token = await utilityContract.tokenSettings(tokenId);

    if (token.category.eq(1)) {
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
            const updateResp = await accounts.updateOne(
                { address: to },
                { $push: { mintedUtilityTokens: { tokenId, timestamp: now } } }
            );
        }
    }
});

if (projectsContract) {
    projectsContract.on('InviteMember', async (projectId, from, to) => {
        console.log(`InviteMember: ${projectId} ${from} ${to}`);
        const project = await projectsContract.projects(projectId);

        sendNotificationToAddress(
            from,
            `Transaction Confirmed`,
            `Your invitation to ${to} to ${project.name} has been confirmed in the blockchain.`,
            `/projects/page/${projectId}`
        );

        sendNotificationToAddress(
            to,
            `Project Invitation Received`,
            `You have been invited to ${project.name}\n\nClick here to open your pending invites list`,
            `/projects/pending-invites`
        );
    });

    projectsContract.on('DisinviteMember', async (projectId, from, to) => {
        console.log(`DisinviteMember: ${projectId} ${from} ${to}`);
        const project = await projectsContract.projects(projectId);

        sendNotificationToAddress(
            from,
            `Transaction Confirmed`,
            `Your disinvitation to ${to} from ${project.name} has been confirmed in the blockchain.`,
            `/projects/page/${projectId}`
        );

        sendNotificationToAddress(
            to,
            `Project Disinvitation Received`,
            `You have been disinvited from ${project.name}`,
            `/projects/pending-invites`
        );
    });

    projectsContract.on('AcceptProjectInvitation', async (projectId, member) => {
        console.log(`AcceptProjectInvitation: ${projectId} ${member}`);
        const project = await projectsContract.projects(projectId);

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

    projectsContract.on('LeaveProject', async (projectId, member, reason) => {
        console.log(`LeaveProject: ${projectId} ${member} ${reason}`);
        const project = await projectsContract.projects(projectId);

        sendNotificationToAddress(
            project.owner,
            `Project Member Left`,
            `${member} has left ${project.name}`,
            `/projects/page/${projectId}`
        );

        sendNotificationToAddress(
            member,
            `Leave Project`,
            `Your transaction to leave ${project.name} has been confirmed in the blockchain`,
            null
        );
    });

    projectsContract.on('SetMemberGoalAsAchieved', async (projectId, setBy, member) => {
        console.log(`SetMemberGoalAsAchieved: ${projectId} ${setBy} ${member}`);
        const project = await projectsContract.projects(projectId);

        sendNotificationToAddress(
            project.owner,
            `Member Goal Achieved`,
            `${member} has achieved their goal in ${project.name}`,
            `/projects/page/${projectId}`
        );

        sendNotificationToAddress(
            member,
            `Goal Achieved`,
            `Your goal in ${project.name} has been marked as achieved`,
            null
        );
    });
}

// verify pending rewards
setInterval(async () => {
    try {
        const unverifiedRewards = await db.collection('project-reward-txs').find({ verified: false }).toArray();
        for (const reward of unverifiedRewards) {
            verifyReward(reward.txhash);
        }
    } catch (error) {
        console.error(error);
    }
}, 10000 * 60);

const verifyReward = async (txhash) => {
    [polygonProvider, mumbaiProvider].forEach(async (provider) => {
        try {
            provider.getTransactionReceipt(txhash).then(async (receipt) => {
                if (receipt) {
                    if (receipt.status === 1) {
                        const reward = await db.collection('project-reward-txs').findOne({ txhash });

                        const signer = new ethers.Wallet(process.env.BACKEND_WALLET_PK, provider);
                        const projectsContractAsSigner = projectsContract.connect(signer);

                        const memberData = await projectsContractAsSigner.projectMemberMapping(
                            reward.projectId,
                            reward.member
                        );

                        if (memberData?.rewardVerified === false) {
                            projectsContractAsSigner
                                .setMemberRewardAsVerified(reward.projectId, reward.member)
                                .then(async (tx) => {
                                    const txReceipt = await tx.wait();
                                    console.log(`Reward verified for ${reward.member} in project ${reward.projectId}`);
                                    await db.collection('backend-wallet-tx-receipts').insertOne(txReceipt);

                                    if (txReceipt.status === 1) {
                                        db.collection('project-reward-txs').updateOne(
                                            { txhash },
                                            { $set: { verified: true } }
                                        );
                                    }
                                });
                        }

                        // const tx = await projectsContractAsSigner.setMemberRewardAsVerified(
                        //     reward.projectId,
                        //     reward.member
                        // );
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

verifyReward('0x307ecb79dfa96f857c6431b7f4a1932e77d5bf70279833fbb33a17ae8dd5fe0d');

console.info('Event Listener Started');
setInterval(() => {}, 1 << 30);
