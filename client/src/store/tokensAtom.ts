import AMMRouter from "@/abis/AMMRouter.json";
import AquaSwap from "@/abis/AquaSwap.json";
import DeFiEnergy from "@/abis/DeFiEnergy.json";
import NeptuneCoin from "@/abis/NeptuneCoin.json";
import OceanDollar from "@/abis/OceanDollar.json";
import RogerToken from "@/abis/RogerToken.json";
import WaveToken from "@/abis/WaveToken.json";
import { get } from "http";
import { atom } from "jotai";

export const tokenListAtom = atom([
  {
    name: AquaSwap.name,
    symbol: AquaSwap.symbol,
    address: AquaSwap.address,
    abi: AquaSwap.abi,
    decimals: 18,
  },
  {
    name: DeFiEnergy.name,
    symbol: DeFiEnergy.symbol,
    address: DeFiEnergy.address,
    abi: DeFiEnergy.abi,
    decimals: 18,
  },
  {
    name: NeptuneCoin.name,
    symbol: NeptuneCoin.symbol,
    address: NeptuneCoin.address,
    abi: NeptuneCoin.abi,
    decimals: 18,
  },
  {
    name: OceanDollar.name,
    symbol: OceanDollar.symbol,
    address: OceanDollar.address,
    abi: OceanDollar.abi,
    decimals: 18,
  },
  {
    name: RogerToken.name,
    symbol: RogerToken.symbol,
    address: RogerToken.address,
    abi: RogerToken.abi,
    decimals: 18,
  },
  {
    name: WaveToken.name,
    symbol: WaveToken.symbol,
    address: WaveToken.address,
    abi: WaveToken.abi,
    decimals: 18,
  },
  {
    name: AMMRouter.name,
    address: AMMRouter.address,
    abi: AMMRouter.abi,
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
