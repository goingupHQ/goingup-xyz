import { getDb } from '../_get-db-client';

export default async function handler(req, res) {
    const { code, state } = req.query;
    const parsed = JSON.parse(state);

    const db = await getDb();
    const authRequest = await db
        .collection('oauth-requests')
        .findOne({ uuid: parsed.auth, address: parsed.address });

    if (authRequest) {
        const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        const redirectUri = encodeURIComponent(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/discord`
        );

        const tokenUrl = `https://discord.com/api/oauth2/token`;

        const formBody = [
            `grant_type=authorization_code`,
            `client_id=${clientId}`,
            `client_secret=${clientSecret}`,
            `code=${code}`,
            `redirect_uri=${redirectUri}`
        ];

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody.join('&')
        });

        const result = await tokenResponse.json();

        if (result.access_token) {
            const userUrl = `https://discord.com/api/users/@me`;
            const userResponse = await fetch(userUrl, {
                headers: {
                    'Authorization': `Bearer ${result.access_token}`
                }
            });

            const user = await userResponse.json();

            await db.collection('accounts').updateOne({
                address: parsed.address
            }, {
                $set: {
                    discord: user.username,
                    discordUser: user
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
