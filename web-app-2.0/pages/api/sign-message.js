import {ethers} from 'ethers';

export default function handler(request, response) {
    const { message, signature } = request.query;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    res.send({ recoveredAddress });
}
