import { ethers } from 'ethers';
import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    const isSignatureValid = validateSignature(body.address, 'save-project', body.signature);

    if (isSignatureValid) {
        const db = await getDb();
        const accounts = db.collection('accounts');
        const { mode, project} = body;

        if (mode === 'create') {
            // new project
            project.id = new ObjectId();
            const payload: any = { $push: { projects: project } };
            await accounts.updateOne({ address: body.address }, payload);
        } else if (mode === 'update') {
            // existing project
            const projectId = new ObjectId(project.id);

            await accounts.updateOne({ address: body.address },
                {
                    $set: {
                        'projects.$[element].title': project.title,
                        'projects.$[element].description': project.description,
                        'projects.$[element].completion': project.completion,
                        'projects.$[element].projectUrl': project.projectUrl,
                        'projects.$[element].skills': project.skills
                    }
                },
                {
                    arrayFilters: [{
                        'element.id': projectId
                    }]
                })
        } else if (mode === 'delete') {
            // delete project
            const projectId = new ObjectId(project.id);
            const payload: any = { $pull: { projects: { id: projectId } } };
            await accounts.updateOne({ address: body.address }, payload);
        }

        res.status(200).send('project-saved');
    } else {
        res.status(401).send('invalid-signature');
    }
}
