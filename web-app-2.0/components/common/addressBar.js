   import {Stack, Typography} from "@mui/material"
   import { trim } from "../utils";

   export default function AddressBar ({ ethName, address }) {

    return (
            <Stack
              height={4}
              width="320px"
              direction="row"
              sx={{ spacing: "0px", height: "28px" }}
            >
              <Stack
                sx={{
                  backgroundColor: "#111921",
                  border: "2px solid #253340",
                  width: "50%",
                  py: "2px",
                }}
                borderRadius="6px 0px 0px 6px"
              >
                <Typography textAlign="center" fontSize="14px">
                  {ethName}
                </Typography>
              </Stack>
              <Stack
                sx={{
                  backgroundColor: "#253340",
                  width: "50%",
                  py: "4px",
                }}
                borderRadius="0px 6px 6px 0px"
              >
                <Typography
                  textAlign="center"
                  fontSize="14px"
                  variant="h6"
                  color="white"
                  sx={{ fontFamily: "Gilroy", fontWeight: "600" }}
                >
                  {trim(address, 4, 5)}
                </Typography>
              </Stack>
            </Stack>
          );
}