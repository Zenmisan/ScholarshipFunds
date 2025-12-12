import { expect } from "chai";
import { ethers } from "hardhat";
import { ScholarshipFund } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ScholarshipFund", function () {
  let scholarshipFund: ScholarshipFund;
  let owner: HardhatEthersSigner;
  let student1: HardhatEthersSigner;
  let student2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, student1, student2] = await ethers.getSigners();
    const ScholarshipFundFactory = await ethers.getContractFactory("ScholarshipFund");
    scholarshipFund = await ScholarshipFundFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await scholarshipFund.owner()).to.equal(owner.address);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to add a student", async function () {
      await scholarshipFund.addStudent("Alice", student1.address, ethers.parseEther("1"));
      const student = await scholarshipFund.students(student1.address);
      expect(student.name).to.equal("Alice");
      expect(student.amount).to.equal(ethers.parseEther("1"));
      expect(student.isRegistered).to.be.true;
    });

    it("Should allow bulk adding students", async function () {
      await scholarshipFund.bulkAddStudents(
        ["Alice", "Bob"],
        [student1.address, student2.address],
        [ethers.parseEther("1"), ethers.parseEther("0.5")]
      );
      
      const s1 = await scholarshipFund.students(student1.address);
      const s2 = await scholarshipFund.students(student2.address);
      
      expect(s1.name).to.equal("Alice");
      expect(s2.name).to.equal("Bob");
      expect(s2.amount).to.equal(ethers.parseEther("0.5"));
    });

    it("Should not allow non-owner to add a student", async function () {
      await expect(
        scholarshipFund.connect(student1).addStudent("Bob", student2.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(scholarshipFund, "OwnableUnauthorizedAccount");
    });

    it("Should deposit funds", async function () {
      await scholarshipFund.depositFunds({ value: ethers.parseEther("10") });
      expect(await ethers.provider.getBalance(await scholarshipFund.getAddress())).to.equal(ethers.parseEther("10"));
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause", async function () {
      await scholarshipFund.pause();
      expect(await scholarshipFund.paused()).to.be.true;
      await scholarshipFund.unpause();
      expect(await scholarshipFund.paused()).to.be.false;
    });

    it("Should prevent claiming when paused", async function () {
        await scholarshipFund.addStudent("Alice", student1.address, ethers.parseEther("1"));
        await scholarshipFund.depositFunds({ value: ethers.parseEther("2") });
        
        await scholarshipFund.pause();
        await expect(scholarshipFund.connect(student1).claimScholarship())
            .to.be.revertedWithCustomError(scholarshipFund, "EnforcedPause");
            
        await scholarshipFund.unpause();
        await expect(scholarshipFund.connect(student1).claimScholarship())
            .to.changeEtherBalances(
                [student1, scholarshipFund],
                [ethers.parseEther("1"), -ethers.parseEther("1")]
            );
    });
  });

  describe("Claiming", function () {
    it("Should allow registered student to claim", async function () {
      // 1. Add student
      await scholarshipFund.addStudent("Alice", student1.address, ethers.parseEther("1"));
      
      // 2. Fund contract
      await scholarshipFund.depositFunds({ value: ethers.parseEther("2") });

      // 3. Claim
      await expect(scholarshipFund.connect(student1).claimScholarship())
        .to.changeEtherBalances(
          [student1, scholarshipFund],
          [ethers.parseEther("1"), -ethers.parseEther("1")]
        );

      const student = await scholarshipFund.students(student1.address);
      expect(student.hasClaimed).to.be.true;
    });

    it("Should fail if student is not registered", async function () {
      await expect(scholarshipFund.connect(student1).claimScholarship())
        .to.be.revertedWith("Not registered for scholarship");
    });

    it("Should fail if already claimed", async function () {
        await scholarshipFund.addStudent("Alice", student1.address, ethers.parseEther("1"));
        await scholarshipFund.depositFunds({ value: ethers.parseEther("2") });
        await scholarshipFund.connect(student1).claimScholarship();
        
        await expect(scholarshipFund.connect(student1).claimScholarship())
            .to.be.revertedWith("Scholarship already claimed");
    });
  });
});