// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract CrowdFunding{
    struct Campaign{
        address creator;
        string title;
        string description;
        uint goal;
        uint deadline;
        uint amountCollected;
        bool withdrawn;
    }
    event ContributionReceived(uint id, address indexed contributor, uint amount);

    mapping(uint=>Campaign)public campaigns;
    mapping(uint=>mapping(address=>uint)) public contributons;
    uint public campaignCount;
    
    function createCampaign(string memory _title ,string memory _description ,uint _goal ,uint _duration) external{

        require(_goal >0 ,"Goal must be valid");
        require(_duration >0 ,"Duration must be valid");
        
        uint deadline=block.timestamp + _duration ;
        campaigns[campaignCount]=Campaign({
            creator : msg.sender,
            title : _title,
            description : _description,
            goal : _goal ,
            deadline : deadline ,
            amountCollected : 0 ,
            withdrawn :false 
        });
        campaignCount++ ; 
    }

    function contribute (uint _id ) external payable{
      Campaign storage campaign= campaigns[_id];
      require(block.timestamp < campaign.deadline ,"Campaign has eneded");
      require(msg.value > 0 ,"Contribution must be valid");
      campaign.amountCollected += msg.value ;
      contributons[_id][msg.sender]+= msg.value ;

      emit ContributionReceived(_id, msg.sender, msg.value);
    }

    function withdrawFunds(uint _id) external {
    Campaign storage campaign = campaigns[_id];
    require(msg.sender == campaign.creator, "Only creator can withdraw");
    require(campaign.amountCollected > 0, "No funds available");
    uint amount = campaign.amountCollected;
    campaign.amountCollected = 0; 
    (bool success, ) = payable(campaign.creator).call{value: amount}("");
    require(success, "Transfer failed");
}

    function getCampaign(uint _id) external view returns (
        address creator,
        string memory title,
        string memory description,
        uint goal,
        uint deadline,
        uint amountCollected,
        bool withdrawn
    ) {
        Campaign storage campaign = campaigns[_id];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.goal,
            campaign.deadline,
            campaign.amountCollected,
            campaign.withdrawn
        );
    }

    
    function getCampaignCount() external view returns (uint) {
        return campaignCount;
    }


}