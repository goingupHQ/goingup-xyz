import {
    Stack,
    Button,
    Typography,
    Box,
    Divider
} from "@mui/material";

import AddressBar from "../../common/addressBar";

export default function TeamMember() {

    return (
             <Stack
                p={4}
                sx={{ backgroundColor: "#111921" }}
                direction="row"
                justifyContent="space-between"
                alignItems={"center"}
            >
                <Stack spacing="32px" direction="row">
                <Box
                    component="img"
                    sx={{
                    height: "50px",
                    width: "50px",
                    }}
                    borderRadius="360px"
                    alt="Project owner."
                    src="https://th-thumbnailer.cdn-si-edu.com/bBoKmhmRwKgjpcq3pMMV9VldIsc=/fit-in/1600x0/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/38/ee/38ee7aaa-abbb-4c60-b959-4b1c5c8c6989/axgpay.jpg"
                />
                <Stack direction="column" spacing="20px">
                    <Stack direction="column" spacing="6px">
                    <Typography
                        sx={{
                        fontFamily: "Gilroy",
                        fontStyle: "normal",
                        fontWeight: "700",
                        fontSize: "24px",
                        lineHeight: "29px",
                        }}
                    >
                        Team Member
                    </Typography>
                    <Typography
                        sx={{
                        fontFamily: "Gilroy",
                        fontStyle: "normal",
                        fontWeight: "600",
                        fontSize: "16px",
                        lineHeight: "19px",
                        color: "#6E8094",
                        }}
                    >
                        Project Lead
                    </Typography>
                    </Stack>
                    <Stack>
                    <AddressBar
                        ethName={"member.eth"}
                        address={"0x0000000000000000000000000000000000000000"}
                    />
                    </Stack>
                </Stack>
                </Stack>

                <Button
                sx={{ height: "40px", width: "160px" }}
                justifySelf="end"
                variant="contained"
                >
                Award
                </Button>
            </Stack>
    )
}