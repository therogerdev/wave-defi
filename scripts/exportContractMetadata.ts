const fs = require("fs");
const path = require("path");

/**
 * @typedef {Object} ContractMetadata
 * @property {string} contractName - The name of the deployed contract.
 * @property {string} contractAddress - The blockchain address where the contract is deployed.
 * @property {string[]} contractAbi - The Application Binary Interface (ABI) of the contract.
 * @property {string} contractSymbol - The symbol of the contract.
 */

type ContractMetadata = {
  contractName: string;
  contractAddress: string;
  contractAbi?: string;
  contractSymbol?: string;
};

export function exportContractMetadata({
  contractName,
  contractAddress,
  contractAbi,
  contractSymbol,
}: ContractMetadata): void {
  const metadata = {
    name: contractName,
    address: contractAddress,
    symbol: contractSymbol,
    abi: contractAbi ? JSON.parse(contractAbi) : null,
  };

  const frontendPath = path.join(__dirname, "..", "client", "src", "abis");

  if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendPath, `${contractName}.json`),
    JSON.stringify(metadata, null, 2)
  );

  // If LiquidityPoolFactory is deployed, store its address
  if (contractName === "LiquidityPoolFactory") {
    fs.writeFileSync(
      path.join(frontendPath, "liquidityPoolFactory-address.json"),
      JSON.stringify({ address: contractAddress }, null, 2)
    );
  }

  console.log(`✅ The contract ${contractName} has been exported to /client/src/abis`);
}

/**
 * Copies TokenPair.json from Hardhat artifacts to the frontend `abis/` directory.
 */
export function exportTokenPairAbi() {
  const hardhatArtifactsPath = path.join(__dirname, "..", "artifacts", "contracts", "TokenPair.sol", "TokenPair.json");
  const frontendPath = path.join(__dirname, "..", "client", "src", "abis", "TokenPair.json");

  if (fs.existsSync(hardhatArtifactsPath)) {
    fs.copyFileSync(hardhatArtifactsPath, frontendPath);
    console.log("✅ TokenPair.json copied to /client/src/abis/");
  } else {
    console.warn("⚠️ TokenPair.json not found in Hardhat artifacts!");
  }
}