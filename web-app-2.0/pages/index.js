import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'
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
                        <h1>Hello</h1>
                        <Button variant="outlined" onClick={() => {
                            if (app.mode === 'dark') {
                                app.setLightMode();
                            } else {
                                app.setDarkMode();
                            }
                        }}>Click me</Button>
                    </CardContent>
                </Card>

            </Box>
        </div>
    );
}
