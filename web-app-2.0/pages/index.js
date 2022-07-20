import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Button, Card, CardContent, Stack, Typography, TextField } from '@mui/material';
import { AppContext } from '../contexts/app-context';
import { useContext } from 'react';
import AwardTokenButton from '../components/AwardTokenButton';
import FollowButton from '../components/FollowButton';
import ViewAllProjectsButton from '../components/ViewAllProjectsButton';
import ViewProfileButton from '../components/ViewProfileButton';

export default function Home() {
    const app = useContext(AppContext);

    return (
        <div className={styles.container}>
            <Head>
                <title>GoingUP</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Stack direction="column" spacing={3} marginY={5}>
                <Card>
                    <CardContent>
                        <h1>Hello</h1>{' '}
                        <Stack direction="row" spacing={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    if (app.mode === 'dark') {
                                        app.setLightMode();
                                    } else {
                                        app.setDarkMode();
                                    }
                                }}
                            >
                                Toggle Mode
                            </Button>
                            <Button variant="contained" color="secondary">
                                Secondary Button
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <h1>Buttons</h1>
                        <Stack direction="row" spacing={4}>
                            <AwardTokenButton />
                            <FollowButton />
                            <ViewAllProjectsButton />
                            <ViewProfileButton />
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <h1>Forms</h1>
                        <Stack direction="row" spacing={4}>
                        <TextField sx={{ height: '52px', width: '390px' }} InputLabelProps={{ shrink: false }} id="outlined-basic" placeholder='Unfilled' variant="outlined" />
                        <TextField sx={{ height: '52px', width: '390px' }} InputLabelProps={{ shrink: false }} id="outlined-basic" placeholder="Filled" variant="outlined" />
                        <TextField sx={{ height: '52px', width: '390px' }} id="outlined-basic" label="" variant="outlined" helperText="Input the text" error />
                        </Stack>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Stack direction="column" spacing={4}>
                            <h1>Typography</h1>
                            <Typography variant="h1">Heading 1 32pt</Typography>
                            <Typography variant="h2">Heading 2 24pt</Typography>
                            <Typography variant="h3">Heading 3 18pt</Typography>
                            <Typography variant="sh1">Subheading 1 16pt</Typography>
                            <Typography variant="sh2">Subheading 2 14pt</Typography>
                            <Typography variant="sh3">Subheading 3 12pt</Typography>
                            <Typography variant="p">Paragraph 16pt</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </div>
    );
}
