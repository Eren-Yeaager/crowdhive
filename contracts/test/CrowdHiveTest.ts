import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("CrowdHive", function () {
  let crowdHive: any, owner: any, addr1: any, addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CrowdHiveFactory = await ethers.getContractFactory("CrowdHive");
    crowdHive = await CrowdHiveFactory.deploy();
    await crowdHive.deployed();
  });

  it("Should create a new campaign", async function () {
    await crowdHive.createCampaign("Test Campaign", ethers.parseEther("1"));
    const campaign = await crowdHive.campaigns(0);
    expect(campaign.title).to.equal("Test Campaign");
    expect(campaign.goal).to.equal(ethers.parseEther("1"));
    expect(campaign.amountCollected).to.equal(0);
  });

  it("Should get all campaigns", async function () {
    await crowdHive.createCampaign("Campaign 1", ethers.parseEther("1"));
    await crowdHive.createCampaign("Campaign 2", ethers.parseEther("2"));
    const allCampaigns = await crowdHive.getAllCampaigns();
    expect(allCampaigns.length).to.equal(2);
  });

  it("Should allow users to contribute to a campaign", async function () {
    await crowdHive.createCampaign("Test Campaign", ethers.parseEther("1"));
    await crowdHive
      .connect(addr1)
      .contribute(0, { value: ethers.parseEther("0.5") });
    const campaign = await crowdHive.campaigns(0);
    expect(campaign.amountCollected).to.equal(ethers.parseEther("0.5"));
  });

  it("Should prevent non-owners from withdrawing funds", async function () {
    await crowdHive.createCampaign("Test Campaign", ethers.parseEther("1"));
    await crowdHive
      .connect(addr1)
      .contribute(0, { value: ethers.parseEther("0.5") });
    await expect(crowdHive.connect(addr1).withdrawFunds(0)).to.be.revertedWith(
      "Only owner can withdraw"
    );
  });

  it("Should allow campaign owners to withdraw funds", async function () {
    await crowdHive.createCampaign("Test Campaign", ethers.parseEther("1"));
    await crowdHive
      .connect(addr1)
      .contribute(0, { value: ethers.parseEther("0.5") });

    const initialBalance = await ethers.provider.getBalance(owner.address);
    const tx = await crowdHive.withdrawFunds(0);
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.effectiveGasPrice;
    const finalBalance = await ethers.provider.getBalance(owner.address);

    expect(finalBalance).to.equal(
      initialBalance.add(ethers.parseEther("0.5")).sub(gasUsed)
    );
  });

  it("Should revert if non-existent campaign is contributed to", async function () {
    await expect(
      crowdHive.contribute(99, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Campaign doesn't exist");
  });

  it("Should revert if withdrawal is attempted with no funds", async function () {
    await crowdHive.createCampaign("Test Campaign", ethers.parseEther("1"));
    await expect(crowdHive.withdrawFunds(0)).to.be.revertedWith(
      "No funds to withdraw"
    );
  });
});
