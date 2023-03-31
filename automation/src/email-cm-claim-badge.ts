import { sendEmail } from './send-email';
// import data from './data/cm-women-in-web3.json';
// already sent this so not a good idea to send again

const data = [
  { Email: 'mark.ibanez@gmail.com', 'Name': 'Mark Ibanez' },
]

const capitalizeName = (name: string) => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const sendClaimBadgeEmails = async () => {
  console.log(`Sending ${data.length} emails...`);

  for (const item of data) {
    const { Name, Email } = item;
    const subject = `Thank You for Attending Crypto Mondays' Women in Web3 Event!`;

    const textBody = `Dear ${capitalizeName(Name)},

We hope this message finds you well. I am Mark Ibanez, Co-Founder of GoingUP, and I wanted to extend my heartfelt thanks for your attendance at the Crypto Mondays' Women in Web3 event held on March 27th, 2023. Your presence made the event more insightful, engaging, and impactful.

We're thrilled to announce that, as a token of our appreciation, we have created a special attendance badge for all the attendees. This unique badge can be claimed through GoingUP and added to your Web3 wallet.

To claim your attendance badge, please follow the steps below:

    1. Click the link: https://app.goingup.xyz/claim-event-token/1
    2. Connect your Web3 wallet
    3. Confirm the transaction to receive your badge
    4. Once the transaction is complete, you'll find the Women in Web3 attendance badge in your Web3 wallet. Feel free to showcase it on your social media or any other platform to highlight your participation in this event.

In case you don't have a Web3 wallet, please let me know and we'll notify you once we have finished building our own custodial wallets and will be able to send you your badge.

We appreciate your continued support and interest in the Women in Web3 initiative. Stay tuned for more updates and upcoming events by following our social media channels and subscribing to our newsletter.

Thank you once again for being a part of our growing community.

Warm regards,

Mark Ibanez
Co-Founder, GoingUP`;

    console.log(`Sending email to ${capitalizeName(Name)} - ${Email}...`);
    try {
      await sendEmail('mark@goingup.xyz', Email, subject, textBody, null);
    } catch (err) {}
  }
};

sendClaimBadgeEmails();
