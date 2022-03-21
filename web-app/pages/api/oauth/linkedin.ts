import { getDb } from '../_get-db-client';

export default async function handler(req, res) {
    const { code, state } = req.query;
    const parsed = JSON.parse(state);

    const db = await getDb();
    const authRequest = await db.collection('oauth-requests').findOne({ uuid: parsed.auth, address: parsed.address });

    if (authRequest) {
        const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
        const redirectUri =  `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/linkedin`;

        const tokenUrl = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&redirect_uri=${redirectUri}`;

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST'
        });

        const result = await tokenResponse.json();
        console.log(result);

        if (result.access_token) {
            const userUrl = `https://api.linkedin.com/v2/me`;
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
                    linkedIn: `${user.localizedFirstName} ${user.localizedLastName}`,
                    linkedInUser: user
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
