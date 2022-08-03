export default async function handler(req, res) {
    const { tweetid, address } = req.query;
    const token = process.env.TWITTER_TOKEN;

    const endpointURL = `https://api.twitter.com/2/tweets?ids=${tweetid}&expansions=author_id&user.fields=username,name,id,profile_image_url`;
    const params = {
        ids: tweetid,
        'tweet.fields': 'lang,author_id',
        'user.fields': 'created_at'
    };

    // @ts-ignore
    const response = await fetch(endpointURL, {
        headers: {
            'User-Agent': 'v2TweetLookupJS',
            authorization: `Bearer ${token}`
        }
    });

    const status = response.status;
    const result = await response.json();

    if (status === 200) {
        if (result.data[0].text.indexOf('#GoingUP') === -1) {
            res.status(400).send('no-hastag');
            return;
        }

        const regex = /0x[a-fA-F0-9]{40}/;
        const matches = result.data[0].text.match(regex);

        if (matches.length === 0) {
            res.status(400).send('no-address');
            return;
        }

        if (matches[0] !== address) {
            res.status(400).send('address-mismatch');
            return;
        }

        res.json({ data: result, matches });
    } else {
        res.status(400, 'invalid-tweetid');
    }
}
