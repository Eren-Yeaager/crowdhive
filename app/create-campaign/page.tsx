"use client";
import * as React from "react";
import { useAccount, useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contracts"; // Your ABI and contract address
import { ethers } from "ethers";

export default function CreateCampaign() {
  const { isConnected } = useAccount();
  const { data: hash, writeContract } = useWriteContract();

  // Handle form submission
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const title = formData.get("title") as string;
    const goal = formData.get("goal") as string;
    const description = formData.get("description") as string;
    const duration = formData.get("duration") as string;

    // Calling the contract's createCampaign function
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "createCampaign",
      args: [
        title,
        description,
        ethers.parseEther(goal), // Parse the goal as ethers for ETH handling
        parseInt(duration), // Parse duration to integer
      ],
    });
  }

  if (!isConnected) {
    return (
      <div className="text-white h-screen flex items-center justify-center text-center px-4 bg-background text-foreground bg-gradient-to-r from-gray-900 via-indigo-900 to-black">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Please Connect Your Wallet to Start a Campaign
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            In order to launch a campaign, you need to connect your Web3 wallet.
          </p>
        </div>
      </div>
    );
  }

  // Render the form if wallet is connected
  return (
    <div className="text-white h-screen flex items-center justify-center text-center px-4 bg-background text-foreground bg-gradient-to-r from-gray-900 via-indigo-900 to-black">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Create Your Campaign
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Tell the world about your vision and fund your project with the power
          of blockchain technology.
        </p>

        <form
          onSubmit={submit}
          className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-300"
            >
              Campaign Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Campaign Title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="goal"
              className="block text-lg font-medium text-gray-300"
            >
              Funding Goal ($)
            </label>
            <input
              id="goal"
              name="goal"
              type="number"
              className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Goal Amount"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-300"
            >
              Campaign Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Tell your backers why this campaign matters"
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-lg font-medium text-gray-300"
            >
              Duration (in days)
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Campaign Duration"
              required
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-500 transition"
            >
              Create Campaign
            </button>
          </div>

          {hash && (
            <div className="mt-4 text-green-500">Transaction Hash: {hash}</div>
          )}
        </form>
      </div>
    </div>
  );
}
