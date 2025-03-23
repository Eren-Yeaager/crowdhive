"use client";

import { useWriteContract, useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contracts";
import { formatEther, parseEther } from "viem";
import { useState } from "react";

interface Campaign {
  id: number;
  creator: string;
  title: string;
  goal: bigint;
  amountCollected: bigint;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const { address: userAddress } = useAccount();
  const { writeContract } = useWriteContract();
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const isCreator =
    userAddress?.toLowerCase() === campaign.creator.toLowerCase();
  const goalEth = formatEther(campaign.goal);
  const amountCollectedEth = formatEther(campaign.amountCollected);

  // 🔹 Handle Contribution
  const handleContribution = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setIsProcessing(true);

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "contribute",
        args: [BigInt(campaign.id)],
        value: parseEther(amount),
        gas: BigInt(250000),
      });
      alert("Contribution successful! 🎉");
      setAmount("");
    } catch (error) {
      alert("Error contributing: " + (error as any).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 shadow-md rounded-lg border border-gray-700 bg-gray-900">
      <h2 className="text-xl font-bold text-indigo-300">{campaign.title}</h2>
      <p className="text-gray-300">
        <strong>Creator:</strong> {campaign.creator.slice(0, 6)}...
        {campaign.creator.slice(-4)}
      </p>
      <p className="mt-2">
        <strong>Goal:</strong>{" "}
        <span className="text-green-400">{goalEth} ETH</span>
      </p>
      <p>
        <strong>Amount Collected:</strong>{" "}
        <span className="text-blue-400">{amountCollectedEth} ETH</span>
      </p>

      {/* 🔹 Contribution Input & Button */}
      {!isCreator && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Amount in ETH"
            className="p-2 rounded-md text-black w-40 mr-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isProcessing}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:bg-gray-500"
            onClick={handleContribution}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Contribute"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
