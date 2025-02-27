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
  contractAbi: string;
  contractSymbol: string; 
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
    abi: JSON.parse(contractAbi),
  };

  const frontendPath = path.join(
    __dirname,
    "..",
    "client",
    "src",
    "abis"
  );



  if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendPath, `${contractName}.json`),
    JSON.stringify(metadata, null, 2)
  );

  // if LiquidityPoolFactory is deployed, then export the LiquidityPoolFactory address
  if (contractName === "PairFactory") {
    const liquidityPoolFactoryMetadata = {
      name: "PairFactory",
      address: contractAddress,
      abi: JSON.parse(contractAbi),
    };
    fs.writeFileSync(
      path.join(frontendPath, "liquidityPoolFactory-address.json"),
      JSON.stringify({ address: liquidityPoolFactoryMetadata.address }, null, 2)
    );
  }

  // console.log(
  //   `✅ The contract ${contractName} has been created on the /frontend/src/contracts`
  // );
}
