const { ethers } = require("hardhat");
const { exportContractMetadata } = require("./exportContractMetadata");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const smartContracts = [
    ["RogerToken", "RGR"],
    ["WaveToken", "WAVE"],
    ["OceanDollar", "ODOL"],
    ["DeFiEnergy", "DFE"],
    ["NeptuneCoin", "NPT"],
    ["AquaSwap", "AQSWP"],
    ["LiquidityPoolFactory", "LiquidityPoolFactory"],
  ];

  let liquidityPoolFactoryAddress = "";
  let tokenPairAddress = "";

  for (const [contractName, symbol] of smartContracts) {
    const contractFactory = await ethers.getContractFactory(contractName); // Use contract name, not symbol
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    console.log(`${contractName} deployed at:`, contract.target);

    if (contractName === "LiquidityPoolFactory") {
      liquidityPoolFactoryAddress = contract.target;
    }

    exportContractMetadata({
      contractName,
      contractAddress: contract.target,
      contractAbi: contract.interface.formatJson(),
      contractSymbol: symbol, // Correctly pass the symbol here
    });
  }

  console.log("✅ Deployment completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});