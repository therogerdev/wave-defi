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
    ["LiquidityPoolFactory", "LiquidityPoolFactory"],
  ];

  let liquidityPoolFactoryAddress: string = "";
  let tokenPairAddress: string = "";

  // First deploy the initial contracts including LiquidityPoolFactory
   for (const [contractName, symbol] of smartContracts) {
    const contractFactory = await ethers.getContractFactory(symbol);
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    console.log(`${contractName} deployed at:`, contract.target);

    if (symbol === "LiquidityPoolFactory") {
      liquidityPoolFactoryAddress = contract.target;
    }

    exportContractMetadata({
      contractName,
      contractAddress: contract.target,
      contractAbi: contract.interface.formatJson(),
    });
  }

   // Deploy a TokenPair manually for reference (LiquidityPoolFactory will create pairs dynamically)
   console.log("Deploying a sample TokenPair...");
   const tokenLiquidityPoolFactory = await ethers.getContractFactory("TokenPair");
   const tokenPair = await tokenLiquidityPoolFactory.deploy();
   await tokenPair.waitForDeployment();
 
   tokenPairAddress = tokenPair.target;
 
   console.log("TokenPair deployed at:", tokenPairAddress);
 
   exportContractMetadata({
     contractName: "TokenPair",
     contractAddress: tokenPairAddress,
     contractAbi: tokenPair.interface.formatJson(),
   });


  // Then deploy AMMRouter with the stored LiquidityPoolFactory address
  const routerFactory = await ethers.getContractFactory("AMMRouter");
  const router = await routerFactory.deploy(liquidityPoolFactoryAddress);
  await router.waitForDeployment();

  console.log("AMMRouter deployed at:", router.target);

  exportContractMetadata({
    contractName: "AMMRouter",
    contractAddress: router.target,
    contractAbi: router.interface.formatJson(),
  });

  console.log("✅ Deployment to localhost completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
