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
    }

    function contribute (uint _id)external payable{
        
    }
}