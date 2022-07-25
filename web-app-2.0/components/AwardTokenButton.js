import { Button } from '@mui/material';
import { useState } from 'react';

export default function AwardTokenButton() {
    const [active, setActive] = useState(true);
    function handleClick() {
        setActive(!active);
    }
    return (
        <Button
            variant="contained"
            color="primary"
            sx={{
                ':hover': {
                    backgroundColor: 'hoverPrimary.main',
                },
            }}
            onClick={handleClick}
        >
            Award Token
        </Button>
    );
}
