"use client";

import { useReadContract, useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contracts";
import { CampaignCard } from "../components/CampaignCard";

export default function ProjectPage() {
  const { address: userAddress } = useAccount();

  const {
    data: campaignCount,
    isLoading,
    isError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getCampaignCount",
  });

  if (isLoading)
    return <div className="text-center mt-10 text-white">Loading...</div>;
  if (isError || !campaignCount)
    return (
      <div className="text-center text-red-400">Error loading campaigns.</div>
    );

  const totalCampaigns = Number(campaignCount);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900 text-white shadow-lg rounded-xl mt-10 border border-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">
        Crowdfunding Campaigns
      </h1>

      {totalCampaigns === 0 ? (
        <div className="text-center text-gray-400">No campaigns found.</div>
      ) : (
        <div className="space-y-6">
          {Array.from({ length: totalCampaigns }, (_, i) => (
            <CampaignCard
              key={i}
              campaignId={BigInt(i)}
              userAddress={userAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
