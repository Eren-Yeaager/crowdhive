import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { CrowdFunding } from "../typechain-types";

describe("CrowdFunding Contract", function () {
  let crowdfunding: CrowdFunding;
  let owner: Signer, user1: Signer, user2: Signer;
  let campaignId = 0;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
    crowdfunding = (await CrowdFunding.deploy()) as CrowdFunding;
    await crowdfunding.waitForDeployment();
  });

  describe("Campaign Creation", function () {
    it("Should create a campaign successfully", async function () {
      const goal = ethers.parseEther("5");
      const duration = 86400; // 1 day in seconds

      await crowdfunding.createCampaign(
        "Save the Planet",
        "A campaign for climate action",
        goal,
        duration
      );

      const campaign = await crowdfunding.campaigns(campaignId);
      expect(campaign.title).to.equal("Save the Planet");
      expect(campaign.goal).to.equal(goal);
    });

    it("Should not allow campaign creation with invalid goal", async function () {
      await expect(
        crowdfunding.createCampaign("Invalid", "No goal", 0, 86400)
      ).to.be.revertedWith("Goal must be valid");
    });

    it("Should not allow campaign creation with invalid duration", async function () {
      await expect(
        crowdfunding.createCampaign(
          "Invalid",
          "No duration",
          ethers.parseEther("5"),
          0
        )
      ).to.be.revertedWith("Duration must be valid");
    });
  });

  describe("Contributions", function () {
    beforeEach(async function () {
      await crowdfunding.createCampaign(
        "Education Fund",
        "Scholarships for students",
        ethers.parseEther("10"),
        86400
      );
    });

    it("Should allow a user to contribute", async function () {
      await crowdfunding
        .connect(user1)
        .contribute(0, { value: ethers.parseEther("2") });
      const campaign = await crowdfunding.campaigns(0);
      expect(campaign.amountCollected).to.equal(ethers.parseEther("2"));
    });

    it("Should prevent contributions of zero ETH", async function () {
      await expect(
        crowdfunding
          .connect(user2)
          .contribute(0, { value: ethers.parseEther("0") })
      ).to.be.revertedWith("Contribution must be valid");
    });

    it("Should prevent contributions after campaign deadline", async function () {
      await ethers.provider.send("evm_increaseTime", [90000]); // Fast-forward beyond deadline
      await ethers.provider.send("evm_mine", []); // Mine the next block

      await expect(
        crowdfunding
          .connect(user2)
          .contribute(0, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Campaign has eneded");
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      await crowdfunding.createCampaign(
        "Medical Fund",
        "Emergency support",
        ethers.parseEther("3"),
        86400
      );
      await crowdfunding
        .connect(user1)
        .contribute(0, { value: ethers.parseEther("3") });
    });

    it("Should allow the creator to withdraw funds", async function () {
      const initialBalance = await ethers.provider.getBalance(
        await owner.getAddress()
      );

      await expect(
        crowdfunding.connect(owner).withdrawFunds(0)
      ).to.changeEtherBalances(
        [crowdfunding, owner],
        [ethers.parseEther("-3"), ethers.parseEther("3")]
      );

      const finalBalance = await ethers.provider.getBalance(
        await owner.getAddress()
      );
      expect(finalBalance).to.be.above(initialBalance);
    });

    it("Should prevent non-creators from withdrawing funds", async function () {
      await expect(
        crowdfunding.connect(user2).withdrawFunds(0)
      ).to.be.revertedWith("Only creator can withdraw");
    });

    it("Should prevent withdrawal when there are no funds", async function () {
      await crowdfunding.connect(owner).withdrawFunds(0);
      await expect(
        crowdfunding.connect(owner).withdrawFunds(0)
      ).to.be.revertedWith("No funds available");
    });
  });
});
