/* eslint-disable */
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>

                <title>GoingUP</title>
                <meta name="description" content="GoingUP Membership NFTs" />
                <link rel="icon" href="/favicon.png" />
                <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
