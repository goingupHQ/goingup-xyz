import { Box } from "@mui/material"

export default function MessageIcon() {
    return (
        <Box
            sx={{ display: { xs: 'none', md: 'block' } }}
        >
            <img src='/images/message.svg' alt='message' />
        </Box>
    )
}
