import { Organization } from "@/types/organization";
import { Button } from "@mui/material";

type CreateRewardTokenProps = {
  org: Organization;
};

const CreateRewardToken = ({ org }: CreateRewardTokenProps) => {
  return (
    <>
      <Button variant="contained" sx={{ my: 2 }}>Create a reward token</Button>
    </>
  )
}

export default CreateRewardToken;