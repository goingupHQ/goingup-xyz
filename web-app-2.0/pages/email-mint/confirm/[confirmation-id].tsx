import { trpc } from '@/utils/trpc';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';

const EmailMintConfirmPage = () => {
  const router = useRouter();
  const confirmationId = router.query['confirmation-id'] as string;

  const { data: requests } = trpc.emailMint.getMintRequests.useQuery(
    { confirmationId },
    { enabled: router.isReady && Boolean(confirmationId) }
  );

  const senderName = requests?.[0]?.mintFrom.name;
  const senderEmail = requests?.[0]?.mintFrom.address;
  const recipients = requests?.map((request) => request.mintTo.address).join(', ');

  return (
    <>
      <Typography variant="h4">Send tokens confirmation {confirmationId}</Typography>
      <Typography variant="body1">Sender: {senderName} ({senderEmail})</Typography>
      <Typography variant="body1">Recipients: {recipients}</Typography>
    </>
  );
};

export default EmailMintConfirmPage;
