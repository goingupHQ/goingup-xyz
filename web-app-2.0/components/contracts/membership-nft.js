import { ethers } from "ethers";

const getMembershipNFTContract = (providerOrSigner) => {
    const contract = new ethers.Contract(
        '0x9337051505436D20FDCf7E2CE5a733b49d1042bc',
        [
            'function setWhitelistRoot(bytes32)'
        ],
        providerOrSigner
    );

    return contract;
};

export default getMembershipNFTContract;