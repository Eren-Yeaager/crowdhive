"use client";
import { useAccount, useReadContract } from "wagmi";
import { useRouter } from "next/navigation";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contracts";

export const wagmiContractConfig = {
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
};

export default function ProjectPage() {
  const { data } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getCampaignCount",
    //args: [BigInt(1)],
  });
  console.log(data);
  return (
    <div>
      <h1> Projects</h1>
    </div>
  );
}
