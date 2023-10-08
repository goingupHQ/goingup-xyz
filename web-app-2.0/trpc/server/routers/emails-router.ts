import { getDb } from '@/utils/database';
import { z } from 'zod';
import { router, procedure } from '../trpc';
import { render } from 'mjml-react';
import { sendEmail } from '@/utils/sendinblue';
import * as EmailWalletLogin from '../../../templates/email/email-wallet-login';
import { getAccount, getAccountByEmail } from '@/utils/database/account';
import { TRPCError } from '@trpc/server';
import { EmailLoginCode } from '@/types/auth';

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
      // check if email is already in use in a non-custodial account
      const account = await getAccountByEmail(input.email);
      if (account && !account.isCustodial) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Email is already associated with a non-custodial account'});
      }

      // generate a random 12 character mixed case alphanumeric code
      // const code = Math.random().toString(36).slice(2, 14).toUpperCase();

      // generate a random 7 digit numeric code
      const code = Math.floor(1000000 + Math.random() * 9000000).toString();

      // save code to database
      const codeRecord: EmailLoginCode = {
        code: code,
        email: input.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 60 minutes from now
      };

      const db = await getDb();
      const insertResult = await db.collection<EmailLoginCode>('email-login-codes').insertOne(codeRecord);

      if (insertResult.insertedId) {
        const { html } = render(EmailWalletLogin.generate({ code }), { validationLevel: 'soft' });
        await sendEmail(null, input.email, 'Your GoingUP Wallet Login Code', null, html);
      }

      return { success: true }
    }),
});
