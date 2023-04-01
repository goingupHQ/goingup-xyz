import { trpc } from "@/utils/trpc";
import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

const Latest = () => {
  const router = useRouter();
  const { data: partnerOrg } = trpc.eventPartners.get.useQuery({ partnerOrgCode: 'cryptomondays' });

  if (partnerOrg) {
    const { latestTokenId } = partnerOrg;
    if (latestTokenId) {
      if (typeof window !== 'undefined') {
        router.push(`/claim-event-token/${latestTokenId}`)
      }
    }
  }

  return (
    <Backdrop open={true} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Stack direction="column" spacing={10} alignItems="center" sx={{ color: '#FFF' }}>
      <Typography variant="h1" sx={{ color: '#FFF'}}>Redirecting you to CryptoMondays latest event</Typography>
      <CircularProgress color="inherit" size="100px" />
      </Stack>
    </Backdrop>
  );
};

export default Latest;