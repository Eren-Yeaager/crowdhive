"use client";
import useCrowdfunding from "../hooks/useCrowdFunding";
import CampaignCard from "../components/CampaignCard";
const Projects = () => {
  const { campaigns, isProcessing, isWithdrawing, error } = useCrowdfunding();

  if (isProcessing) {
    return <p>Loading Campaigns</p>;
  }
  console.log(campaigns);
  return (
    <div>
      <h1>All Campaigns</h1>
      <div className="grid grid-cols-3 gap-4">
        {campaigns?.map((campaign, index) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};
export default Projects;
