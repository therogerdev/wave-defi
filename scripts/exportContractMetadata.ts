const fs = require("fs");
const path = require("path");

/**
 * @typedef {Object} ContractMetadata
 * @property {string} contractName - The name of the deployed contract.
 * @property {string} contractAddress - The blockchain address where the contract is deployed.
 * @property {string[]} contractAbi - The Application Binary Interface (ABI) of the contract.
 */

type ContractMetadata = {
  contractName: string;
  contractAddress: string;
  contractAbi: string;
};

export function exportContractMetadata({
  contractName,
  contractAddress,
  contractAbi,
}: ContractMetadata): void {
  const metadata = {
    name: contractName,
    address: contractAddress,
    abi: JSON.parse(contractAbi),
  };

  const frontendPath = path.join(
    __dirname,
    "..",
    "client",
    "src",
    "abis"
  );

  // console.log("Metadata directory:", metadata);

  if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendPath, `${contractName}.json`),
    JSON.stringify(metadata, null, 2)
  );

  // if PAIRFACTORY is deployed, then export the PAIRFACTORY address
  if (contractName === "PairFactory") {
    const pairFactoryMetadata = {
      name: "PairFactory",
      address: contractAddress,
      abi: JSON.parse(contractAbi),
    };
    fs.writeFileSync(
      path.join(frontendPath, "PairFactory-address.json"),
      JSON.stringify({ address: pairFactoryMetadata.address }, null, 2)
    );
  }

  // console.log(
  //   `✅ The contract ${contractName} has been created on the /frontend/src/contracts`
  // );
}
