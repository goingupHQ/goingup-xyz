import Head from 'next/head';
import { Box, Grid } from '@mui/material';
import { AppContext } from '../../contexts/app-context';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OrganizationsContext } from '../../contexts/organizations-context';
import OrganizationPage from '../../components/pages/organizations/organization-page';
import JobsOpening from '../../components/pages/organizations/jobs-opening';
import OrganizationMembers from '../../components/pages/organizations/organization-members';
import OrganizationPartnerships from '../../components/pages/organizations/organization-partnerships';
import OrganizationProjects from '../../components/pages/organizations/organization-projects';
import OrganizationTokens from '../../components/pages/organizations/organization-tokens';

export default function Organization() {
    const app = useContext(AppContext);
    const org = useContext(OrganizationsContext);
    const router = useRouter();
    const [account, setAccount] = useState(null);
    const { code } = router.query;

    useEffect(() => {
        // do some
        if (code) {
            setAccount(
                org.orgs.find((org) => org.code === code)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    return (
        <>
            {account && (
                <>
                    <Head>
                        <title>GoingUP: Organizations</title>
                        <link rel='icon' href='/favicon.ico' />
                    </Head>
                    <Box>
                        <OrganizationPage />
                        <OrganizationProjects account={account} />
                        <OrganizationTokens account={account} />
                        {/* <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <OrganizationMembers />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <OrganizationPartnerships />
                            </Grid>
                        </Grid> */}
                        <JobsOpening account={account} />
                    </Box>
                </>
            )}
        </>
    );
}