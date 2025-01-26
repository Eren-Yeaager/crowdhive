"use client";
import { useAccount } from "wagmi";

export default function createCampaign() {
  const { isConnected, address } = useAccount();

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

  // If the wallet is connected, show the create campaign form
  return (
    <div className="text-white h-screen flex items-center justify-center text-center px-4bg-background text-foreground bg-gradient-to-r from-gray-900 via-indigo-900 to-black">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Create Your Campaign
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Tell the world about your vision and fund your project with the power
          of blockchain technology.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-300"
            >
              Campaign Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Campaign Name"
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
              type="number"
              className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Goal Amount"
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
              rows={4}
              className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Tell your backers why this campaign matters"
            ></textarea>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-500 transition"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
