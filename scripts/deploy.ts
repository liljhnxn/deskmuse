import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying DeskMuse smart contract to Botchain Testnet...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH/BOHR");

  const DeskMuseFactory = await ethers.getContractFactory("DeskMuse");
  const deskMuse = await DeskMuseFactory.deploy();
  await deskMuse.waitForDeployment();

  const contractAddress = await deskMuse.getAddress();
  console.log("----------------------------------------------------");
  console.log("DeskMuse deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log(`Explorer URL: https://scan.bohr.life/address/${contractAddress}`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
