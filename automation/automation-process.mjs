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

const utilityAddress = '0x10D7B3aFA213D93a922a062fb91E8EcbD4A703d2';
const utilityArtifact = JSON.parse(fs.readFileSync('./artifacts/GoingUpUtilityTokens.json'));
const utilityContract = new ethers.Contract(utilityAddress, utilityArtifact.abi, polygonProvider);

const projectsArtifact = JSON.parse(fs.readFileSync('./artifacts/GoingUpProjects.json'));
let projectsContract;
if (process.env.DEPLOYMENT === 'dev') {
    projectsContract = new ethers.Contract('0xF5df032832cb3c4BEf2D28B440fA57D5dAC47881', projectsArtifact.abi, mumbaiProvider);
} else if (process.env.DEPLOYMENT === 'production') {
    projectsContract = new ethers.Contract('NONE', projectsArtifact.abi, polygonProvider);
}

const sendNotificationToAddress = async (address, title, body, urlToOpen) => {
    const subscriptions = await db.collection('psn-subscriptions').find({ address }).toArray();
    for (const subscription of subscriptions) {
        try {
            await webpush.sendNotification(subscription, JSON.stringify({ title, body, urlToOpen }));
        } catch (error) {
            console.error(error);
        }
    }
};

utilityContract.on('TransferSingle', async (operator, from, to, tokenId) => {
    console.log(`TransferSingle: ${operator} ${from} ${to} ${tokenId}`);
    const token = await utilityContract.tokenSettings(tokenId);

    if (token.category.eq(1)) {
        const message = `You have received a Tier ${tokenId} Appreciation Token from ${
            from === '0x0000000000000000000000000000000000000000' ? operator : from
        }`;

        sendNotificationToAddress(to, 'Appreciation Token Received', message, null);

        // appreciation tokens
        // const now = new Date();
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
            console.info(updateResp);
        }
    }
});

if (projectsContract) {
    projectsContract.on('InviteMember', async (projectId, from, to) => {
        console.log(`InviteMember: ${projectId} ${from} ${to}`);
        const project = await projectsContract.projects(projectId);

        sendNotificationToAddress(from, `Transaction Confirmed`, `Your invitation to ${to} to ${project.name} has been confirmed in the blockchain.`, `/projects/page/${projectId}`);

        sendNotificationToAddress(to, `Project Invitation Received`, `You have been invited to ${project.name}\n\nClick here to open your pending invites list`, `/projects/pending-invites`);
    });

    projectsContract.on('DisinviteMember', async (projectId, from, to) => {
        console.log(`DisinviteMember: ${projectId} ${from} ${to}`);
        const project = await projectsContract.projects(projectId);

        sendNotificationToAddress(from, `Transaction Confirmed`, `Your disinvitation to ${to} from ${project.name} has been confirmed in the blockchain.`, `/projects/page/${projectId}`);

        sendNotificationToAddress(to, `Project Disinvitation Received`, `You have been disinvited from ${project.name}`, `/projects/pending-invites`);
    });

    projectsContract.on('AcceptProjectInvitation', async (projectId, member) => {
        console.log(`AcceptProjectInvitation: ${projectId} ${member}`);
        const project = await projectsContract.projects(projectId);

        sendNotificationToAddress(project.owner, `Project Invitation Accepted`, `${member} has accepted your invitation to ${project.name}`, `/projects/page/${projectId}`);

        sendNotificationToAddress(member, `Project Invitation Accepted`, `Your transaction to accept the invitation to ${project.name} has been confirmed in the blockchain`, `/projects/page/${projectId}`);
    });
}

console.info('Event Listener Started');
setInterval(() => {}, 1 << 30);
