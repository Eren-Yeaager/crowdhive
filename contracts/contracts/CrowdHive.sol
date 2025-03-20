// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract CrowdHive{
    struct Campaign{
        address creator ;
        string title ;
        uint goal ;
        uint amountCollected;
    }

    uint public campaignCount ;
    mapping(uint => Campaign) public campaigns ;
    mapping(address => uint []) public userCampaigns ;

///@notice Create a new campaign
    function createCampaign(string memory _title , uint _goal) external{

        require(_goal > 0 ,"Goal must be greater than 0") ;
        campaigns[campaignCount] = Campaign({
            creator : msg.sender ,
            title : _title ,
            goal : _goal ,
            amountCollected : 0
        });

        userCampaigns[msg.sender].push(campaignCount) ;
        campaignCount ++ ;
    }


///@notice Get all campaigns created by all users
function getAllCampaigns() external view returns (Campaign[] memory){
    Campaign[] memory allCampaigns = new Campaign[](campaignCount) ;
    for(uint i=0 ;i < campaignCount ; i++){
        allCampaigns[i]=campaigns[i];
    }
    return allCampaigns;
}
///@notice Get campaigns created by current user 
function getMyCampaigns() external view returns (uint[] memory) {
    return userCampaigns[msg.sender] ;
}
///@notice Contribute to a campaign
function contribute(uint _id) external payable {
    require(msg.value > 0 , "Must send some ETH");
    require(_id < campaignCount ,"Campaign doesn't exist");
    campaigns[_id].amountCollected += msg.value ;

}
///@notice Withdraw funds (only campaign owner can withdraw)
function withdrawFunds(uint _id) external {
    Campaign storage campaign = campaigns[_id] ;
    require(msg.sender == campaign.creator ,"Only owner can withdraw");
    require(campaign.amountCollected > 0 ,"No funds to withdraw");

    uint amount =campaign.amountCollected;
    campaign.amountCollected = 0 ;
    (bool success,) = payable(msg.sender).call{value:amount}(""); 
    require(success ,"Withdrawal Failed");
}
}