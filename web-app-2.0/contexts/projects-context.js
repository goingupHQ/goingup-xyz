import { createContext, useContext, useEffect, useState } from "react";
import { WalletContext } from "./wallet-context";
import artifact from "../artifacts/GoingUpProjects.json";
import { useSigner, useContract, useProvider, useAccount } from "wagmi";
import { createProjectData, updateProjectData } from "../components/validation-tools/validateProjectData";

export const ProjectsContext = createContext();
export const mumbaiAddress = "0xe0b5f0c73754347E1d2E3c84382970D7A70d666B";

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

  const account = useAccount();
  const getProjects = async () => {
    // this api endpoint just returns project ids owned by the user address
    const response = await fetch(`/api/projects/account/${account.address}`);
    const projectIds = await response.json();
    const projects = [];

    // for each project id, get the project data
    for (const projectId of projectIds) {
      const project = await contract?.projects(projectId); // does not work with wagmi
      projects.push(project);
    }

    return projects;
  };

  const getProject = async (id) => {
     const project = await contract?.projects(id);
    return project;
  };

  const createProject = async (form) => {
    const contractValue = await contract.price();
    const { name, description, started, ended, tags, primaryUrl, isPrivate } =
      await createProjectData(form);
    const tx = await contract.create(
      name,
      description,
      started,
      ended,
      tags,
      primaryUrl,
      isPrivate,
      { value: contractValue }
    );
    return tx;
  };

  const updateProject = async (form, oldForm, id) => {
    const contractValue = await contract.price();
    const { name, description, started, ended, tags, primaryUrl, isPrivate } =
      await updateProjectData(form, oldForm);
    const tx = await contract.update(
      id,
      name,
      description,
      started,
      ended,
      primaryUrl,
      tags,
      isPrivate,
      { value: contractValue }
    );
    return tx;
  };

  const value = {
    networkParams,
    isCorrectNetwork,
    switchToCorrectNetwork,
    getProjects,
    createProject,
    getProjects,
    getProject,
    updateProject
  };
  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
