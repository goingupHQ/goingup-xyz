import { ethers } from 'ethers';
import { webAppBaseUrl } from './constants';
import { createAcceptTokenEmail, createEmailMintErrorEmail } from './email-builder';
import { getDb } from './get-db-client';
import { EmailMintRequest } from './types/email-mint';
import { sendEmailViaMinter } from './send-email';
import { GoingUpUtilityTokens__factory } from './typechain';
import { Account } from './types/account';
import { decrypt } from './kms';

export const processConfirmedEmailMints = async () => {
  const db = await getDb();
  const col = await db.collection<EmailMintRequest>('email-mint-requests');

  const requests = await col
    .find({
      confirmedBySenderOn: { $exists: true },
      emailSentToRecipient: {
        $exists: false,
      },
    })
    .toArray();

  console.log(`Found ${requests.length} confirmed email mint requests`);

  for (const request of requests) {
    const fromName = request.mintFrom.name;
    const fromEmail = request.mintFrom.address;
    const mintMessage = request.finalMintMessage || '(no message)';
    const id = request._id as string;

    const acceptUrl = `${webAppBaseUrl}/email-mint/accept/${id}`;

    const emailHtml = createAcceptTokenEmail(fromName, fromEmail, mintMessage, acceptUrl);
    const mintEmailAddress = process.env.MINT_EMAIL_ADDR!;

    sendEmailViaMinter(
      mintEmailAddress,
      request.mintTo.address,
      `${fromName || 'Someone'} has sent you token(s)!`,
      '',
      emailHtml
    );

    col.updateOne(
      {
        _id: request._id,
      },
      {
        $set: {
          emailSentToRecipient: new Date(),
        },
      }
    );

    console.log(`Sent email to ${request.mintTo.address} for mint request ${request._id}`);
  }

  console.log(`Finished processing ${requests.length} confirmed email mint requests`);
};

export const mintAcceptedEmails = async () => {
  const db = await getDb();
  const emailMintRequests = await db.collection<EmailMintRequest>('email-mint-requests');

  const acceptedRequests = await emailMintRequests
    .find({
      acceptedByRecipient: { $exists: true },
      mintTxResult: { $ne: 1 },
    })
    .toArray();

  console.log(`Found ${acceptedRequests.length} accepted email mint requests`);

  // mint the tokens
  const polygonProvider = new ethers.providers.AlchemyProvider(137, process.env.ALCHEMY_POLYGON_KEY);
  const contractAddress = '0x10d7b3afa213d93a922a062fb91e8ecbd4a703d2';

  const gasStationURL = 'https://gasstation.polygon.technology/v2';
  const gasPriceDataResponse = await fetch(gasStationURL);
  const gasPriceData = await gasPriceDataResponse.json();

  const maxPriorityFeeGwei = gasPriceData?.standard?.maxPriorityFee || 40;
  const maxFeeGwei = gasPriceData?.standard?.maxFee || 200;

  const accounts = await db.collection<Account>('accounts');
  for (const request of acceptedRequests) {
    const recipientEmail = request.mintTo.address;
    const recipientAccount = await accounts.findOne({ email: recipientEmail });
    if (!recipientAccount) {
      console.log(`No account found for email ${recipientEmail}`);
      emailMintRequests.deleteOne({ _id: request._id });
      console.log(`Deleted mint request ${request._id}`);
      continue;
    }

    const senderEmail = request.mintFrom.address;
    const senderAccount = await accounts.findOne({ email: senderEmail });
    if (!senderAccount) {
      console.log(`No account found for email ${senderEmail}`);
      emailMintRequests.deleteOne({ _id: request._id });
      console.log(`Deleted mint request ${request._id}`);
      continue;
    }

    if (!senderAccount.isCustodial || !senderAccount.encryptedPrivateKey || !senderAccount.address) {
      console.log(`Account ${senderAccount.email} is not custodial`);
      emailMintRequests.deleteOne({ _id: request._id });
      console.log(`Deleted mint request ${request._id}`);
      continue;
    }

    const recipientAddress = recipientAccount.address;
    if (!recipientAddress) {
      console.log(`No wallet address found for email ${recipientEmail}`);
      emailMintRequests.deleteOne({ _id: request._id });
      console.log(`Deleted mint request ${request._id}`);
      continue;
    }

    const senderAddress = senderAccount.address;
    if (!senderAddress) {
      console.log(`No wallet address found for email ${senderEmail}`);
      emailMintRequests.deleteOne({ _id: request._id });
      console.log(`Deleted mint request ${request._id}`);
      continue;
    }

    const tokenId = request.tokenIdToMint;
    if (!tokenId) {
      console.log(`No tokenId found for mint request ${request._id}`);
      emailMintRequests.deleteOne({ _id: request._id });
      console.log(`Deleted mint request ${request._id}`);
      continue;
    }

    const qty = request.qtyToMint;
    if (!qty) {
      console.log(`No qty found for mint request ${request._id}`);
      emailMintRequests.deleteOne({ _id: request._id });
      console.log(`Deleted mint request ${request._id}`);
      continue;
    }

    if (!request.mintedTxHash) {
      const decryptionResult = await decrypt(senderAccount.encryptedPrivateKey);
      const privateKey = decryptionResult.plainText;
      const signer = new ethers.Wallet(privateKey, polygonProvider);
      const utilityContract = GoingUpUtilityTokens__factory.connect(contractAddress, signer);

      const signerBalance = await signer.getBalance();

      const tokenSettings = await utilityContract.tokenSettings(tokenId);
      const totalAmount = tokenSettings.price.mul(qty);

      if (signerBalance.lt(totalAmount)) {
        console.log(`Signer ${signer.address} balance ${signerBalance} is less than total amount ${totalAmount}`);
        emailMintRequests.deleteOne({ _id: request._id });
        console.log(`Deleted mint request ${request._id}`);

        // send error email
        const errorHtml = createEmailMintErrorEmail(
          `Your wallet ${senderAddress} does not have enough MATIC to mint`,
          `Your wallet ${senderAddress} does not have enough MATIC to mint ${qty} of token ${tokenId}. You need at least ${totalAmount} MATIC to mint. This mint request has been deleted.`
        )

        continue;
      }

      const message = request.finalMintMessage || '';

      const mintTx = await utilityContract.mint(recipientAddress, tokenId, qty, true, message, {
        value: totalAmount,
        maxPriorityFeePerGas: ethers.utils.parseUnits(maxPriorityFeeGwei.toString(), 'gwei'),
        maxFeePerGas: ethers.utils.parseUnits(maxFeeGwei.toString(), 'gwei'),
      })

      emailMintRequests.updateOne(
        {
          _id: request._id,
        },
        {
          $set: {
            mintedTxHash: mintTx.hash,
          },
        }
      );

      console.log(`Minted ${qty} of token ${tokenId} to ${recipientAddress} for mint request ${request._id}`);
      mintTx.wait().then((receipt) => {
        const result = receipt.status;
        emailMintRequests.updateOne(
          {
            _id: request._id,
          },
          {
            $set: {
              mintTxResult: result,
            },
          }
        );
        console.log(`Mint tx ${mintTx.hash} result: ${result}`);
      });
    } else {
      const mintTx = await polygonProvider.getTransactionReceipt(request.mintedTxHash);
      const result = mintTx.status;
      emailMintRequests.updateOne(
        {
          _id: request._id,
        },
        {
          $set: {
            mintTxResult: result,
          },
        }
      );
      console.log(`Mint tx ${request.mintedTxHash} result: ${result}`);
    }
  }
};
