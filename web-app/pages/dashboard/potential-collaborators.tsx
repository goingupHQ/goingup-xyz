import { WalletContext } from '@/contexts/WalletContext';
import { Card, CardContent, CardHeader, Stack, styled, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'

const CardContentWrapper = styled(CardContent)(
    () => `
        position: relative;
  `
);

export default function PotentialCollaborators(props) {
    const wallet = useContext(WalletContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!wallet.address) return;
        fetch(`/api/get-potential-collaborators?address=${wallet.address}`)
            .then(async response => {
                const result = await response.json();
                console.log(result);
                setData(result);
            });
    }, [wallet.address]);

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: { xs: '2rem', md: '3rem' }
                }}
            >
                <CardHeader
                    sx={{
                        px: 3,
                        pt: 3,
                        alignItems: 'flex-start'
                    }}
                    title={
                        <>
                            <Typography variant="h3">
                                Potential Collaborators
                            </Typography>
                            <Typography variant="subtitle1">
                                Based on your interest you could
                                collaborate with them
                            </Typography>
                        </>
                    }
                />
                <CardContentWrapper
                    sx={{
                        px: 3,
                        pt: 0
                    }}
                >

                </CardContentWrapper>
            </Card>
        </>
    )
}
