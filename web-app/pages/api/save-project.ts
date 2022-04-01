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
        const project = body.project;

        if (project.id === 0) {
            // new project
            project.id = new ObjectId();
            const payload: any = { $push: { projects: project } };
            await accounts.updateOne({ address: body.address }, payload);
        } else {
            // existing project
            const projectId = new ObjectId(project.id);
            console.log('update project', project);

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
        }

        res.status(200).send('project-saved');
    } else {
        res.status(401).send('invalid-signature');
    }
}
