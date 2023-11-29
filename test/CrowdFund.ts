const { 
    loadFixture,
    time,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
import { ethers } from "hardhat";

// how to get msg.sender and thier balance
describe("CrowdFund Contract", function() {
    async function deployCrowdFundFixture() {
        const title = "Razer";
        const description = "Help create new gaming stuff";
        // plus one seconds accounts for time to deploy
        const ONE_MONTH_IN_SECS = 60 * 60 * 24 * 30 + 1; 
        const lockTime = (await time.latest()) + ONE_MONTH_IN_SECS;
        const CrowdFund = await ethers.deployContract("crowdFund", [title, description]);
        //const company = await ethers.getAddress;


        return {CrowdFund, title, description, lockTime, 
            //company
        };
    }   

    describe("Constructor args", function() {
        it("should set the locktime equal to the current time + a month", async function() {
            const { CrowdFund, lockTime } = await loadFixture (
                deployCrowdFundFixture
            );

            expect(await CrowdFund.deadline()).to.equal(lockTime);
        });

        it("Should set the right owner", async function () {
            const { CrowdFund, company } = await loadFixture(deployCrowdFundFixture);

            expect(await CrowdFund.company()).to.equal(company);
        });

        it("Should set the right title", async function () {
            const { CrowdFund, title } = await loadFixture(deployCrowdFundFixture);

            expect(await CrowdFund.title()).to.equal(title);
        });

        it("Should set the right description", async function () {
            const { CrowdFund, description } = await loadFixture(deployCrowdFundFixture);

            expect(await CrowdFund.description()).to.equal(description);
        });

    });

    describe("Contribute Function", function() {

        it("Should not allow to make a contribution with no ether", async function() {
            const { CrowdFund } = await loadFixture(deployCrowdFundFixture);

            await expect(CrowdFund.makeContribution()).to.be.revertedWith(
                "Cannot Contribute Negative Ether"
            );
        });

        it("Should not allow to contribute past the deadline", async function () {
            const { CrowdFund, lockTime } = await loadFixture(deployCrowdFundFixture);

            await time.increaseTo(lockTime);

            await expect(CrowdFund.makeContribution({ value: 1 })).to.be.revertedWith(
                "Funding has ended"
            );
        });
    }); 

})
