import { Box } from "@mui/material"

export default function SettingsIcon() {
    return (
        <Box
            sx={{ display: { xs: 'none', md: 'block' } }}
        >
            <img src='/images/settings.svg' alt='settings' />
        </Box>
    )
}
