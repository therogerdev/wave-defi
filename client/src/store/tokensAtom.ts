import AMMRouter from "@/abis/AMMRouter.json";
import AquaSwap from "@/abis/AquaSwap.json";
import DeFiEnergy from "@/abis/DeFiEnergy.json";
import NeptuneCoin from "@/abis/NeptuneCoin.json";
import OceanDollar from "@/abis/OceanDollar.json";
import RogerToken from "@/abis/RogerToken.json";
import WaveToken from "@/abis/WaveToken.json";
import { atom } from "jotai";
import { Abi } from "viem";

interface TokenMap {
  name: string;
  symbol: string;
  address: `0x${string}`;
  abi: Abi;
  decimals: number;
}

export const tokenListAtom = atom<TokenMap[]>([
  {
    name: AquaSwap.name,
    symbol: AquaSwap.symbol,
    address: AquaSwap.address as `0x${string}`,
    abi: AquaSwap.abi as Abi,
    decimals: 18,
  },
  {
    name: DeFiEnergy.name,
    symbol: DeFiEnergy.symbol,
    address: DeFiEnergy.address as `0x${string}`,
    abi: DeFiEnergy.abi as Abi,
    decimals: 18,
  },
  {
    name: NeptuneCoin.name,
    symbol: NeptuneCoin.symbol,
    address: NeptuneCoin.address as `0x${string}`,
    abi: NeptuneCoin.abi as Abi,
    decimals: 18,
  },
  {
    name: OceanDollar.name,
    symbol: OceanDollar.symbol,
    address: OceanDollar.address as `0x${string}`,
    abi: OceanDollar.abi as Abi,
    decimals: 18,
  },
  {
    name: RogerToken.name,
    symbol: RogerToken.symbol,
    address: RogerToken.address as `0x${string}`,
    abi: RogerToken.abi as Abi,
    decimals: 18,
  },
  {
    name: WaveToken.name,
    symbol: WaveToken.symbol,
    address: WaveToken.address as `0x${string}`,
    abi: WaveToken.abi as Abi,
    decimals: 18,
  },
]);

export const tokenDropdownOptionsAtom = atom((get) =>
  get(tokenListAtom).map((token) => ({
    value: token.address,
    label: `(${token.symbol}) - ${token.name}`,
  }))
);

export const tokenMapAtom = atom((get) =>
  Object.fromEntries(get(tokenListAtom).map((token) => [token.address, token]))
);
