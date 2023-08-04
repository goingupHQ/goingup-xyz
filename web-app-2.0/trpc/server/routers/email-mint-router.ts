import { z } from "zod";
import { procedure, router } from "../trpc";
import { getDb } from "@/utils/database";
import { EmailMintRequest } from "@/types/email-mint";

export const emailMintRouter = router({
  getMintRequests: procedure
    .input(z.object({
      confirmationId: z.string()
    }))
    .query(async ({ input }) => {
      const { confirmationId } = input;

      const db = await getDb();
      const collection = db.collection<EmailMintRequest>('email-mint-requests');

      const mintRequests = await collection.find({ confirmationId }).toArray();
      return mintRequests;
    })
});