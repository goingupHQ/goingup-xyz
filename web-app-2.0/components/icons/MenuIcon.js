import { Box } from "@mui/material"

export default function MenuIcon() {
    return (
        <Box
            sx={{ display: { md: 'none', xs: 'block' } }}
        >
            <img src='/images/menu.svg' alt='menu' />
        </Box>
    )
}
