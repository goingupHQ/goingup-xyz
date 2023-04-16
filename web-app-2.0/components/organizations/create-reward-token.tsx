import { Organization } from "@/types/organization";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useAccount } from "wagmi";

type CreateRewardTokenProps = {
  org: Organization;
};

const CreateRewardToken = ({ org }: CreateRewardTokenProps) => {
  const { isConnected } = useAccount();
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateClick = () => {
    if (!isConnected) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' });
      return;
    }
  };

  return (
    <>
      <Button variant="contained" sx={{ my: 2 }}>Create a reward token</Button>
    </>
  )
}

export default CreateRewardToken;
