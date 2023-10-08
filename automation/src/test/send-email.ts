import { sendEmail } from '../send-email';

const main = async () => {
  const subject = 'GoingUP Wallet Login Code';
  const textBody = 'Your GoingUP Wallet Login Code is: 1234567';

  sendEmail('app@goingup.xyz', 'mark.ibanez@gmail.com', subject, textBody, textBody);
};

main();
