import { getDb } from '@/utils/database';
import { z } from 'zod';
import { router, procedure } from '../trpc';
import { render } from 'mjml-react';
import { sendEmail } from '@/utils/sendinblue';
import * as EmailWalletLogin from '../../../templates/email/email-wallet-login';

type WalletLoginCode = {
  code: string;
  email: string;
  expiresAt: Date;
};

export const emailsRouter = router({
  sendWalletLoginCode: procedure
    .input(
      z.object({
        email: z.string({
          required_error: 'Email is required',
        }),
      })
    )
    .mutation(async ({ input }) => {
      // generate a random 12 character mixed case alphanumeric code
      const code = Math.random().toString(36).slice(2, 14).toUpperCase();

      // save code to database
      const codeRecord = {
        code: code,
        email: input.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 60 minutes from now
      };

      const db = await getDb();
      const insertResult = await db.collection<WalletLoginCode>('wallet-login-codes').insertOne(codeRecord);

      if (insertResult.insertedId) {
        const { html } = render(EmailWalletLogin.generate({ code }), { validationLevel: 'soft' });
        await sendEmail(null, input.email, 'Your GoingUP Wallet Login Code', null, html);
      }

      return { success: true }
    }),
});
