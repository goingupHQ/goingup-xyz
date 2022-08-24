import { createContext, useContext, useEffect, useState } from "react";
import { WalletContext } from "./wallet-context";
import artifact from "../artifacts/GoingUpProjects.json";
import moment from "moment";
import { useSigner, useContract, useContractEvent } from "wagmi";
import { createProjectData } from "../components/validation-tools/validateProjectData";
import { BigNumber } from "ethers";

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const wallet = useContext(WalletContext);

  const { data: signer } = useSigner();
  // polygon mumbai testnet
  const contractAddress = "0xe0b5f0c73754347E1d2E3c84382970D7A70d666B";
  const contractNetwork = 80001;
  const networkParams = {
    chainId: "0x13881",
    chainName: "Polygon Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  };

  // polygon mainnet
  // const contractAddress = 'NOT_YET_DEPLOYED';
  // const contractNetwork = 137;
  // const networkParams = {
  //     chainId: '0x89',
  //     chainName: 'Matic Mainnet',
  //     nativeCurrency: {
  //         name: 'MATIC',
  //         symbol: 'MATIC',
  //         decimals: 18,
  //     },
  //     rpcUrls: ['https://polygon-rpc.com/'],
  //     blockExplorerUrls: ['https://polygonscan.com/'],
  // };

  async function switchToCorrectNetwork() {
    if (wallet.walletType === "walletconnect") {
      throw new Error(
        "WalletConnect does not support adding networks. Please add the network manually."
      );
    } else {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkParams.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [networkParams],
          });
        }
      }
    }
  }

  useEffect(() => {
    setIsCorrectNetwork(wallet.network == contractNetwork);
  }, [wallet]);

  const [isCorrectNetwork, setIsCorrectNetwork] = useState(
    wallet.network == contractNetwork
  );

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: artifact.abi,
    signerOrProvider: signer,
  });

  const getProjects = async () => {
    const projects = await contract.filters.Create("0x68D99e952cF3D4faAa6411C1953979F54552A8F7", null);
    console.log(projects);

    // return [];
  };

  const createProject = async (form) => {
    // console.log(form);
    getProjects();

    // const createPrice = await contract.price();
    // const startedUnix = started ? moment(started).unix() : 0;
    // const endedUnix = ended ? moment(ended).unix() : 0;

    const data = await createProjectData(form);
    console.log(data);

    // const tx = await contract.create(data, { value: createPrice });

    // return tx;
  };

  const value = {
    networkParams,
    isCorrectNetwork,
    switchToCorrectNetwork,
    getProjects,
    createProject,
    getProjects,
  };
  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
