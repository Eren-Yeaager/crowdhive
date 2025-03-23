// "use client";
// import * as React from "react";
// import { useAccount, useWriteContract } from "wagmi";
// import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contracts"; // Your ABI and contract address
// import { ethers } from "ethers";

// export default function CreateCampaign() {
//   const { isConnected } = useAccount();
//   const { data: hash, writeContract } = useWriteContract();

//   // Handle form submission
//   async function submit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);

//     const title = formData.get("title") as string;
//     const goal = formData.get("goal") as string;
//     const description = formData.get("description") as string;
//     const duration = formData.get("duration") as string;

//     writeContract({
//       address: CONTRACT_ADDRESS,
//       abi: CONTRACT_ABI,
//       functionName: "createCampaign",
//       args: [title, description, ethers.parseEther(goal), BigInt(duration)],
//     });
//   }

//   if (!isConnected) {
//     return (
//       <div className="text-white h-screen flex items-center justify-center text-center px-4 bg-background text-foreground bg-gradient-to-r from-gray-900 via-indigo-900 to-black">
//         <div className="max-w-xl mx-auto">
//           <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//             Please Connect Your Wallet to Start a Campaign
//           </h1>
//           <p className="mt-4 text-lg md:text-xl text-gray-300">
//             In order to launch a campaign, you need to connect your Web3 wallet.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Render the form if wallet is connected
//   return (
//     <div className="text-white h-screen flex items-center justify-center text-center px-4 bg-background text-foreground bg-gradient-to-r from-gray-900 via-indigo-900 to-black">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//           Create Your Campaign
//         </h1>
//         <p className="mt-4 text-lg md:text-xl text-gray-300">
//           Tell the world about your vision and fund your project with the power
//           of blockchain technology.
//         </p>

//         <form
//           onSubmit={submit}
//           className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg"
//         >
//           <div>
//             <label
//               htmlFor="title"
//               className="block text-lg font-medium text-gray-300"
//             >
//               Campaign Title
//             </label>
//             <input
//               id="title"
//               name="title"
//               type="text"
//               className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Campaign Title"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="goal"
//               className="block text-lg font-medium text-gray-300"
//             >
//               Funding Goal (ETH)
//             </label>
//             <input
//               id="goal"
//               name="goal"
//               type="number"
//               className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Goal Amount"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="description"
//               className="block text-lg font-medium text-gray-300"
//             >
//               Campaign Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               rows={4}
//               className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Tell your backers why this campaign matters"
//               required
//             ></textarea>
//           </div>

//           <div>
//             <label
//               htmlFor="duration"
//               className="block text-lg font-medium text-gray-300"
//             >
//               Duration (in hours)
//             </label>
//             <input
//               id="duration"
//               name="duration"
//               type="number"
//               className="mt-2 p-3 w-full rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Campaign Duration"
//               required
//             />
//           </div>

//           <div className="mt-6 flex justify-center">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-500 transition"
//             >
//               Create Campaign
//             </button>
//           </div>

//           {hash && (
//             <div className="mt-4 text-green-500">Transaction Hash: {hash}</div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants/contracts";
import { parseEther } from "viem";

const CreateCampaign = () => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { data: hash, writeContract } = useWriteContract();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !goal || isNaN(Number(goal)) || Number(goal) <= 0) {
      alert("Please enter a valid title and goal amount.");
      return;
    }

    setIsCreating(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createCampaign",
        args: [title, parseEther(goal)], // Convert goal to ETH
      });
      alert("Campaign created successfully! 🎉");
      setTitle("");
      setGoal("");
    } catch (error) {
      alert("Error: " + (error as any).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 border border-gray-700 rounded-lg shadow-md bg-gray-900 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-indigo-400">Create a Campaign</h1>
      <form onSubmit={handleCreate} className="mt-4">
        <input
          type="text"
          placeholder="Campaign Title"
          className="w-full p-2 mb-2 rounded-md text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isCreating}
          required
        />
        <input
          type="text"
          placeholder="Goal (ETH)"
          className="w-full p-2 mb-2 rounded-md text-black"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          disabled={isCreating}
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:bg-gray-500"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Campaign"}
        </button>
      </form>

      {/* Transaction Hash Display */}
      {hash && (
        <div className="mt-3 text-sm text-gray-400">
          Transaction Hash: <span className="break-all">{hash}</span>
        </div>
      )}
    </div>
  );
};

export default CreateCampaign;
