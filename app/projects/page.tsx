"use client";
import useCrowdfunding from "../hooks/useCrowdFunding";
import CampaignCard from "../components/CampaignCard";
const Projects = () => {
  const { campaigns, isProcessing, isWithdrawing, error } = useCrowdfunding();

  if (isProcessing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-300">Loading Campaigns...</p>
      </div>
    );
  }
  console.log(campaigns);
  return (
    <div className="min-h-screen py-10 px-6">
      <h1 className="text-3xl font-bold text-indigo-400 text-center mb-8">
        All Campaigns
      </h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {campaigns?.length > 0 ? (
          campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            No campaigns available.
          </p>
        )}
      </div>
    </div>
  );
};
export default Projects;
