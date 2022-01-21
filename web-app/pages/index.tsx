import Head from 'next/head';

import TopNavigationLayout from 'src/layouts/TopNavigationLayout';
// import { Authenticated } from 'src/components/Authenticated';

import DashboardCryptoContent from 'src/content/DashboardPages/crypto';

function MainApp() {
    return (
        <>
            <Head>
                <title>Going Up</title>
            </Head>
            <DashboardCryptoContent />
        </>
    );
}

MainApp.getLayout = (page) => <TopNavigationLayout>{page}</TopNavigationLayout>;

export default MainApp;
