import { useState, useEffect, useCallback } from "react";
import { ethers, Contract, Signer, BrowserProvider, parseEther } from "ethers";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  getContract,
} from "../constants/contracts";

import { formatUnits } from "viem";
interface Campaign {
  id: number;
  title: string;
  goal: bigint;
  amountCollected: bigint;
  creator: string;
}

interface UseCrowdfundingResult {
  account: string | null;
  campaigns: Campaign[];
  campaignCount: number;
  createCampaign: (title: string, goal: string) => void;
  contribute: (id: number, amount: string) => Promise<void>;
  withdrawFunds: (id: number) => Promise<void>;
  isProcessing: boolean;
  isWithdrawing: boolean;
  error: string | null;
}

const useCrowdfunding = (): UseCrowdfundingResult => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignCount, setCampaignCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet & initialize contract
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          const accounts = await web3Provider.send("eth_requestAccounts", []);
          const signer = await web3Provider.getSigner();
          setAccount(accounts[0]);

          const contractInstance = getContract(signer);
          setContract(contractInstance);
        } catch (err) {
          setError("Error connecting to Ethereum: " + (err as any).message);
        }
      } else {
        setError("Ethereum provider not available. Use MetaMask.");
      }
    };

    connectWallet();
  }, []);

  // Fetch campaigns from contract
  const fetchCampaigns = useCallback(async () => {
    if (!contract) return;

    try {
      setError(null);

      // ✅ Fetch campaign count
      const count = await contract.campaignCount();
      setCampaignCount(Number(count));

      // ✅ Fetch all campaigns in a single call
      const campaignsData = await contract.getAllCampaigns();

      const campaignList: Campaign[] = campaignsData.map(
        (campaign: any, index: number) => ({
          id: index,
          title: campaign.title,
          goal: BigInt(campaign.goal),
          amountCollected: BigInt(campaign.amountCollected),
          creator: campaign.creator,
        })
      );

      setCampaigns(campaignList);
    } catch (err) {
      setError("Error fetching campaigns: " + (err as any).message);
    }
  }, [contract]);

  useEffect(() => {
    fetchCampaigns();
  }, [contract]);

  // Create campaign
  const createCampaign = useCallback(
    async (title: string, goal: string) => {
      if (!contract) return;

      try {
        setError(null);
        setIsProcessing(true);

        const tx = await contract.createCampaign(
          title,
          ethers.parseEther(goal)
        );
        await tx.wait();

        fetchCampaigns();
      } catch (err) {
        setError("Error creating campaign: " + (err as any).message);
      } finally {
        setIsProcessing(false);
      }
    },
    [contract, fetchCampaigns]
  );

  // Contribute to campaign
  const contribute = useCallback(
    async (id: number, amount: string) => {
      if (!contract) return;

      try {
        setIsProcessing(true);
        const tx = await contract.contribute(BigInt(id), {
          value: ethers.parseEther(amount),
        });
        await tx.wait();

        fetchCampaigns();
      } catch (err) {
        setError("Error contributing: " + (err as any).message);
      } finally {
        setIsProcessing(false);
      }
    },
    [contract, fetchCampaigns]
  );

  // Withdraw funds
  const withdrawFunds = useCallback(
    async (id: number) => {
      if (!contract || !account) return;

      try {
        setIsWithdrawing(true);
        const tx = await contract.withdrawFunds(BigInt(id));
        await tx.wait();

        fetchCampaigns();
      } catch (err) {
        setError("Error withdrawing funds: " + (err as any).message);
      } finally {
        setIsWithdrawing(false);
      }
    },
    [contract, account, fetchCampaigns]
  );

  return {
    account,
    campaigns,
    campaignCount,
    createCampaign,
    contribute,
    withdrawFunds,
    isProcessing,
    isWithdrawing,
    error,
  };
};

export default useCrowdfunding;
