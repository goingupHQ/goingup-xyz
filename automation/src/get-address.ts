import { ethers } from "ethers";

const pk = '280e31ae8a87efac3fafa8d4e56dfae6fbf518d3989639e0d9d006b223402642';

const wallet = new ethers.Wallet(pk);
console.log(wallet);