import { useState, useEffect, useCallback } from "react";
import { ethers, Contract, Signer, Provider } from "ethers";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  getContract,
} from "../constants/contracts";

interface Campaign {
  title: string;
  description: string;
  goal: ethers.BigNumberish;
  amountCollected: ethers.BigNumberish;
  creator: string;
  deadline: number;
}

interface UseCrowdfundingResult {
  account: string | null;
  campaigns: Campaign[];
  campaignCount: number;
  createCampaign: (
    title: string,
    description: string,
    goal: string,
    duration: string
  ) => void;
  contribute: (id: number, amount: string) => void;
  withdrawFunds: (id: number) => void;
}

const useCrowdfunding = (): UseCrowdfundingResult => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignCount, setCampaignCount] = useState<number>(0);

  useEffect(() => {
    const checkEthereum = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.JsonRpcProvider(window.ethereum);
          setProvider(web3Provider);

          const accounts = await web3Provider.send("eth_requestAccounts", []);
          const signer = await web3Provider.getSigner();
          setAccount(accounts[0]);

          const contractInstance = await getContract(signer);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error connecting to Ethereum", error);
        }
      } else {
        console.error(
          "Ethereum provider not available. Make sure you're using MetaMask or another wallet."
        );
      }
    };

    checkEthereum();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (contract) {
        try {
          const count = await contract.campaignCount();
          setCampaignCount(count.toNumber());

          const campaignList: Campaign[] = [];
          for (let i = 0; i < count.toNumber(); i++) {
            const campaign = await contract.campaigns(i);
            campaignList.push({
              title: campaign.title,
              description: campaign.description,
              goal: campaign.goal,
              amountCollected: campaign.amountCollected,
              creator: campaign.creator,
              deadline: campaign.deadline.toNumber(),
            });
          }
          setCampaigns(campaignList);
        } catch (error) {
          console.error("Error fetching campaigns", error);
        }
      }
    };

    fetchCampaigns();
  }, [contract]);

  const createCampaign = useCallback(
    async (
      title: string,
      description: string,
      goal: string,
      duration: string
    ) => {
      if (contract) {
        try {
          const tx = await contract.createCampaign(
            title,
            description,
            ethers.parseEther(goal),
            parseInt(duration)
          );
          await tx.wait();
          console.log("Campaign created successfully!");
        } catch (error) {
          console.error("Error creating campaign", error);
        }
      }
    },
    [contract]
  );

  const contribute = useCallback(
    async (id: number, amount: string) => {
      if (contract && account) {
        try {
          const tx = await contract.contribute(id, {
            value: ethers.parseEther(amount),
          });
          await tx.wait(); // Wait for the transaction to be mined
          console.log("Contribution successful!");
        } catch (error) {
          console.error("Error contributing", error);
        }
      }
    },
    [contract, account]
  );

  const withdrawFunds = useCallback(
    async (id: number) => {
      if (contract) {
        try {
          const tx = await contract.withdrawFunds(id);
          await tx.wait(); // Wait for the transaction to be mined
          console.log("Funds withdrawn successfully!");
        } catch (error) {
          console.error("Error withdrawing funds", error);
        }
      }
    },
    [contract]
  );

  return {
    account,
    campaigns,
    campaignCount,
    createCampaign,
    contribute,
    withdrawFunds,
  };
};

export default useCrowdfunding;
