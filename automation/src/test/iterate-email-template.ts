import { writeFileSync } from 'fs';
import { createEmailMintConfirmation, createEmailMintErrorEmail } from '../email-builder';

const main = async () => {
  const html = createEmailMintErrorEmail("Error Title", "Error Message");

  writeFileSync('./email.html', html);
};

main();