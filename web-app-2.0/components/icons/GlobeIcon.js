import { Box } from "@mui/material"

export default function GlobeIcon() {
    return (
        <Box
        sx={{ display: { xs: 'none', md: 'block' } }}
        >
            <img src='/images/globe.svg' alt='globe' />
        </Box>
    )
}
