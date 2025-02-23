// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers } = require("hardhat");
const { exportContractMetadata } = require("./exportContractMetadata");

async function main() {
  const signers = await ethers.getSigners();

  if (!signers.length) {
    throw new Error("No signers found! Make sure Hardhat is running.");
  }

  // const deployer = signers[0];
  // console.log("Deployer Address:", deployer.address);

  const [deployer] = await ethers.getSigners();
  const smartContracts = [
    ["RogerToken", "RogerToken"],
    ["WaveToken", "WaveToken"],
    ["OceanDollar", "OceanDollar"],
    ["DeFiEnergy", "DeFiEnergy"],
    ["NeptuneCoin", "NeptuneCoin"],
    ["AquaSwap", "AquaSwap"],
    ["PairFactory", "PairFactory"],
  ];

  let pairFactoryAddress: string = "";

  // First deploy the initial contracts including PairFactory
  for (const [contractName, symbol] of smartContracts) {
    let contractFactory = await ethers.getContractFactory(symbol);
    let contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    console.log(`${contractName} Contract Address:`, contract.target);

    if (symbol === "PairFactory") {
      pairFactoryAddress = contract.target;
    }

    exportContractMetadata({
      contractName,
      contractAddress: contract.target,
      contractAbi: contract.interface.formatJson(),
    });
  }

  // Then deploy AMMRouter with the stored PairFactory address
  const routerFactory = await ethers.getContractFactory("AMMRouter");
  const router = await routerFactory.deploy(pairFactoryAddress);
  await router.waitForDeployment();

  console.log("AMM Router Contract Address:", router.target);

  exportContractMetadata({
    contractName: "AMMRouter",
    contractAddress: router.target,
    contractAbi: router.interface.formatJson(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
