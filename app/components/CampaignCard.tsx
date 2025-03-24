"use client";

import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useState } from "react";
import useCrowdfunding from "../hooks/useCrowdFunding";
import { formatUnits } from "viem";
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
  const { account, contribute, withdrawFunds, isProcessing, isWithdrawing } =
    useCrowdfunding();
  const [amount, setAmount] = useState<string>("");

  const isCreator = account?.toLowerCase() === campaign.creator.toLowerCase();
  const goalEth = formatUnits(campaign.goal, 18);
  const amountCollectedEth = formatUnits(campaign.amountCollected, 18);

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
            onClick={() => contribute(campaign.id, amount)}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Contribute"}
          </button>
        </div>
      )}

      {isCreator && (
        <button
          className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:bg-gray-500"
          onClick={() => withdrawFunds(campaign.id)}
          disabled={isWithdrawing || campaign.amountCollected === BigInt(0)}
        >
          {isWithdrawing ? "Withdrawing..." : "Withdraw Funds"}
        </button>
      )}
    </div>
  );
};

export default CampaignCard;
