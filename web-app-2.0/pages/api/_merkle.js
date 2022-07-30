const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const computeRoot = (addressList) => {
    const leafNodes = addressList.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getRoot();
    return rootHash;
}

const getProof = (address, addressList) => {
    const leafNodes = addressList.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const proof = merkleTree.getHexProof(keccak256(address));
    return proof;
}

module.exports = { computeRoot, getProof };