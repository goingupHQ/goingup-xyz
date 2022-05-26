import React, { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';
import Link from 'next/link';
import { Avatar, LinearProgress, Typography, Box } from '@mui/material';
import Identicon from './Identicon';

export default function ProfileLink(props) {
    const { profile, hideReputationScore, onClick } = props;
    const app = useContext(AppContext);
    return (
        <>
            <Link href={`/profile/${profile.address}`}>
                <a style={{ textAlign: 'center' }} onClick={onClick}>
                    {profile.profilePhoto && (
                        <Avatar
                            src={profile.profilePhoto}
                            variant="rounded"
                            sx={{ height: 64, width: 64, margin: 'auto' }}
                        />
                    )}
                    {!profile.profilePhoto && (
                        <Identicon address={profile.address} size={64} />
                    )}
                    <Typography variant="h5">{profile.name}</Typography>
                    <Typography variant="body1">
                        {
                            app.occupations.find(
                                (o) => o.id == profile.occupation
                            )?.text
                        }
                    </Typography>
                </a>
            </Link>
            {!hideReputationScore &&
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1">
                    Reputation Score {Math.round(100 *
                        (profile.reputationScore / app.maxReputationScore))}%
                </Typography>
                <LinearProgress
                    variant="determinate"
                    color="primary"
                    value={
                        100 *
                        (profile.reputationScore / app.maxReputationScore)
                    }
                    sx={{ height: 20 }}
                />
            </Box>
            }
        </>
    );
}
