import { Box } from "@mui/material"

export default function SearchIcon() {
    return (
        <Box
            sx={{
                display: {
                    xs: 'none',
                    md: 'block',
                    marginLeft: '141px',
                    marginRight: '141px',
                },
            }}
        >
            <img src='/images/search.svg' alt='search' />
        </Box>
    )
}
