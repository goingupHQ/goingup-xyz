import { decrypt, encrypt } from "@/utils/kms";
import { procedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const kmsRouter = router({
  encrypt: procedure
    .input(
      z.object({
        plainText: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (process.env.VERCEL_ENV !== "development") throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });
      const { plainText } = input;
      const encrypted = await encrypt(plainText);
      return encrypted;
    }),
  decrypt: procedure
    .input(
      z.object({
        cipherText: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (process.env.VERCEL_ENV !== "development") throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });
      const { cipherText } = input;
      const decrypted = await decrypt(cipherText);
      return decrypted;
    })
});