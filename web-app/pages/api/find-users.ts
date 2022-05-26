import { getDb } from './_get-db-client';

export default async function handler(req, res) {
    const { occupation, open_to, primary_goals, ideal_collab, count } = req.query;
    const openToArray = open_to ? open_to.split(',').map(i => parseInt(i)) : null;
    const primaryGoalsArray = primary_goals ? primary_goals.split(',').map(i => parseInt(i)) : null;
    const idealCollabArray = ideal_collab ? ideal_collab.split(',').map(i => parseInt(i)) : null;

    const db = await getDb();
    const accounts = await db.collection('accounts');

    const query: any = {};
    if (occupation) query.occupation = parseInt(occupation);
    if (openToArray) query.openTo = { $in: openToArray };
    if (primaryGoalsArray) query.projectGoals = { $in: primaryGoalsArray };
    if (idealCollabArray) query.idealCollab = { $in: idealCollabArray };

    query.mock = { $exists: false };

    const queryResults = await accounts.aggregate([
        {$match: query},
        {$sample: {size: parseInt(count) || 6}}
    ]).toArray();

    res.json(queryResults);
}
