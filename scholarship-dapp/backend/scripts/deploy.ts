import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ScholarshipFund contract...");

  const ScholarshipFund = await ethers.getContractFactory("ScholarshipFund");
  const scholarshipFund = await ScholarshipFund.deploy();

  await scholarshipFund.waitForDeployment();

  const address = await scholarshipFund.getAddress();
  console.log(`ScholarshipFund deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
