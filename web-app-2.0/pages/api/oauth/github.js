import { getDb } from '../_get-db-client';

export default async function handler(req, res) {
    const { code, state } = req.query;
    const parsed = JSON.parse(state);

    const db = await getDb();
    const authRequest = await db.collection('oauth-requests').findOne({ uuid: parsed.auth, address: parsed.address });

    if (authRequest) {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        const tokenUrl = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST'
        });

        const rawResult = await tokenResponse.text();
        // @ts-ignore
        const result = Object.fromEntries(new URLSearchParams(rawResult));

        if (result.access_token) {
            const userUrl = `https://api.github.com/user`;
            const userResponse = await fetch(userUrl, {
                headers: {
                    'Authorization': `token ${result.access_token}`
                }
            });

            const user = await userResponse.json(); console.log('github user', user);

            await db.collection('accounts').updateOne({
                address: parsed.address
            }, {
                $set: {
                    github: user.login,
                    githubUser: user
                },
                $inc: {
                    reputationScore: 10
                }
            })

            res.redirect(302, `/profile/${parsed.address}`);
        } else {
            res.status(400).send('auth-code-invalid');
        }
    } else {
        res.status(400).send('auth-request-invalid');
    }
}
