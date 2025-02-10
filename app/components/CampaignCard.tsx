"use client";

import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contracts";
import { formatEther, parseEther } from "viem";
import { useState } from "react";

interface CampaignCardProps {
  campaignId: bigint;
  userAddress?: `0x${string}`;
}

export function CampaignCard({ campaignId, userAddress }: CampaignCardProps) {
  const { data, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getCampaign",
    args: [campaignId],
  });

  const { writeContract } = useWriteContract();
  const [amount, setAmount] = useState<string>("");
  const [isContributing, setIsContributing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  if (isLoading)
    return (
      <div className="text-center mt-2 text-gray-400">
        Loading campaign {campaignId.toString()}...
      </div>
    );
  if (isError || !data)
    return (
      <div className="text-center text-red-400">
        Error loading campaign {campaignId.toString()}
      </div>
    );

  const [
    creator,
    title,
    description,
    goalWei,
    deadline,
    amountCollectedWei,
    withdrawn,
  ] = data as [string, string, string, bigint, bigint, bigint, boolean];

  const isCreator = userAddress === creator;

  const goalEth = formatEther(goalWei);
  const amountCollectedEth = formatEther(amountCollectedWei);
  const deadlineDate = new Date(Number(deadline) * 1000).toLocaleString();

  // 🔹 Contribute to Campaign
  const contributeToCampaign = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount to contribute.");
      return;
    }
    setIsContributing(true);

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "contribute",
        args: [campaignId],
        value: parseEther(amount),
        gas: BigInt(250000),
      });
      alert("Contribution successful! 🎉");
      setAmount("");
    } catch (error) {
      alert("Error contributing: " + (error as any).message);
    } finally {
      setIsContributing(false);
    }
  };

  // 🔹 Withdraw Funds (Only for Creator)
  const withdrawFunds = async () => {
    if (!isCreator) {
      alert("Only the campaign creator can withdraw funds.");
      return;
    }
    setIsWithdrawing(true);

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "withdrawFunds",
        args: [campaignId],
        gas: BigInt(250000),
      });
      alert("Funds withdrawn successfully! 💰");
    } catch (error) {
      alert("Error withdrawing funds: " + (error as any).message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div
      className={`p-6 shadow-md rounded-lg border border-gray-700 ${
        isCreator ? "bg-gray-800" : "bg-gray-850"
      }`}
    >
      <h2 className="text-xl font-bold text-indigo-300">{title}</h2>
      <p className="text-gray-300">{description}</p>
      <p className="mt-2">
        <strong>Goal:</strong>{" "}
        <span className="text-green-400">{goalEth} ETH</span>
      </p>
      <p>
        <strong>Deadline:</strong> {deadlineDate}
      </p>
      <p>
        <strong>Amount Collected:</strong>{" "}
        <span className="text-blue-400">{amountCollectedEth} ETH</span>
      </p>
      <p>
        <strong>Withdrawn:</strong>{" "}
        <span className={withdrawn ? "text-red-500" : "text-green-400"}>
          {withdrawn ? "Yes" : "No"}
        </span>
      </p>

      {/* 🔹 Contribute Input & Button (Visible for non-owners) */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Amount in ETH"
          className="p-2 rounded-md text-black w-40 mr-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isContributing}
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:bg-gray-500"
          onClick={contributeToCampaign}
          disabled={isContributing}
        >
          {isContributing ? "Processing..." : "Contribute"}
        </button>
      </div>

      {/* 🔹 Withdraw Button (Visible only for creator) */}
      {isCreator && !withdrawn && (
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:bg-gray-500"
          onClick={withdrawFunds}
          disabled={isWithdrawing}
        >
          {isWithdrawing ? "Processing..." : "Withdraw Funds"}
        </button>
      )}
    </div>
  );
}
