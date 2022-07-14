import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Box, Button, Card, CardContent, CardHeader, Stack } from '@mui/material'
import { AppContext } from '../contexts/app-context';
import { useContext } from 'react';

export default function Home() {
    const app = useContext(AppContext);

    return (
        <div className={styles.container}>
            <Head>
                <title>GoingUP</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box>
                <Card>
                    <CardContent>
                        <Stack direction="column" spacing={4}>
                            <h1>Hello</h1>
                            <Button variant="contained" color="primary" onClick={() => {
                                if (app.mode === 'dark') {
                                    app.setLightMode();
                                } else {
                                    app.setDarkMode();
                                }
                            }}>Toggle Mode</Button>
                            <Button variant="contained" color="secondary">Secondary Button</Button>
                        </Stack>
                    </CardContent>
                </Card>

            </Box>
        </div>
    );
}
