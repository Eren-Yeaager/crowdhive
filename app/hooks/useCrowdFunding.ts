// import { useState, useEffect, useCallback } from "react";
// import { ethers, Contract, Signer, BrowserProvider } from "ethers";
// import {
//   CONTRACT_ADDRESS,
//   CONTRACT_ABI,
//   getContract,
// } from "../constants/contracts";

// interface Campaign {
//   id: number;
//   title: string;
//   description: string;
//   goal: string;
//   amountCollected: string;
//   creator: string;
//   deadline: number;
// }

// interface UseCrowdfundingResult {
//   account: string | null;
//   campaigns: Campaign[];
//   campaignCount: number;
//   createCampaign: (
//     title: string,
//     description: string,
//     goal: string,
//     duration: string
//   ) => void;
//   contribute: (id: number, amount: string) => void;
//   withdrawFunds: (id: number) => void;
// }

// const useCrowdfunding = (): UseCrowdfundingResult => {
//   const [provider, setProvider] = useState<BrowserProvider | null>(null);
//   const [contract, setContract] = useState<Contract | null>(null);
//   const [account, setAccount] = useState<string | null>(null);
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [campaignCount, setCampaignCount] = useState<number>(0);

//   useEffect(() => {
//     const connectWallet = async () => {
//       if (window.ethereum) {
//         try {
//           const web3Provider = new ethers.BrowserProvider(window.ethereum);
//           setProvider(web3Provider);

//           const accounts = await web3Provider.send("eth_requestAccounts", []);
//           const signer = await web3Provider.getSigner();
//           setAccount(accounts[0]);

//           const contractInstance = getContract(signer);
//           setContract(contractInstance);
//         } catch (error) {
//           console.error("Error connecting to Ethereum:", error);
//         }
//       } else {
//         console.error("Ethereum provider not available. Use MetaMask.");
//       }
//     };

//     connectWallet();
//   }, []);

//   const fetchCampaigns = useCallback(async () => {
//     if (!contract) return;

//     try {
//       const count = await contract.getCampaignCount();
//       setCampaignCount(Number(count));

//       const campaignList: Campaign[] = [];
//       for (let i = 0; i < count; i++) {
//         const campaign = await contract.getCampaign(BigInt(i));
//         campaignList.push({
//           id: i,
//           title: campaign[1], // title
//           description: campaign[2], // description
//           goal: ethers.formatEther(campaign[3]), // goal (BigNumber)
//           amountCollected: ethers.formatEther(campaign[5]), // amount collected (BigNumber)
//           creator: campaign[0], // creator address
//           deadline: Number(campaign[4]) * 1000, // Convert to milliseconds
//         });
//       }
//       setCampaigns(campaignList);
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//     }
//   }, [contract]);

//   useEffect(() => {
//     fetchCampaigns();
//   }, [contract]);

//   const createCampaign = useCallback(
//     async (
//       title: string,
//       description: string,
//       goal: string,
//       duration: string
//     ) => {
//       if (!contract) return;
//       try {
//         const tx = await contract.createCampaign(
//           title,
//           description,
//           ethers.parseEther(goal),
//           parseInt(duration)
//         );
//         await tx.wait();
//         console.log("Campaign created successfully!");
//         fetchCampaigns();
//       } catch (error) {
//         console.error("Error creating campaign:", error);
//       }
//     },
//     [contract, fetchCampaigns]
//   );

//   const contribute = useCallback(
//     async (id: number, amount: string) => {
//       if (!contract) return;
//       try {
//         const tx = await contract.contribute(BigInt(id), {
//           value: ethers.parseEther(amount),
//         });
//         await tx.wait();
//         console.log(`Contributed ${amount} ETH to campaign ${id}`);
//         fetchCampaigns();
//       } catch (error) {
//         console.error("Error contributing:", error);
//       }
//     },
//     [contract, fetchCampaigns]
//   );

//   const withdrawFunds = useCallback(
//     async (id: number) => {
//       if (!contract || !account) return;

//       try {
//         const campaign = await contract.getCampaign(BigInt(id));
//         const creator = campaign[0];

//         if (creator.toLowerCase() !== account.toLowerCase()) {
//           console.error("Only the campaign creator can withdraw funds.");
//           return;
//         }

//         const tx = await contract.withdrawFunds(BigInt(id));
//         await tx.wait();
//         console.log("Funds withdrawn successfully!");
//         fetchCampaigns();
//       } catch (error) {
//         console.error("Error withdrawing funds:", error);
//       }
//     },
//     [contract, account, fetchCampaigns]
//   );

//   return {
//     account,
//     campaigns,
//     campaignCount,
//     createCampaign,
//     contribute,
//     withdrawFunds,
//   };
// };

// export default useCrowdfunding;

import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contracts";

export const useFetchCampaigns = () => {
  const {
    data: campaigns,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAllCampaigns",
  });

  return { campaigns, isLoading, error };
};
