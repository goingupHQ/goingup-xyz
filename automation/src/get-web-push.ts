import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env')});

import webpush from 'web-push';

const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!
}

console.log(vapidKeys);

webpush.setVapidDetails('mailto:app@goingup.xyz', vapidKeys.publicKey, vapidKeys.privateKey);

export default webpush;