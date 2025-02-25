import { atom } from "jotai";
import AquaSwap from "@/abis/AquaSwap.json";
import DeFiEnergy from "@/abis/DeFiEnergy.json";
import NeptuneCoin from "@/abis/NeptuneCoin.json";
import OceanDollar from "@/abis/OceanDollar.json";
import RogerToken from "@/abis/RogerToken.json";
import WaveToken from "@/abis/WaveToken.json";

export const tokenListAtom = atom([
  {
    name: AquaSwap.name,
    symbol: AquaSwap.symbol,
    address: AquaSwap.address,
    decimals: 18,
  },
  {
    name: DeFiEnergy.name,
    symbol: DeFiEnergy.symbol,
    address: DeFiEnergy.address,
    decimals: 18,
  },
  {
    name: NeptuneCoin.name,
    symbol: NeptuneCoin.symbol,
    address: NeptuneCoin.address,
    decimals: 18,
  },
  {
    name: OceanDollar.name,
    symbol: OceanDollar.symbol,
    address: OceanDollar.address,
    decimals: 18,
  },
  {
    name: RogerToken.name,
    symbol: RogerToken.symbol,
    address: RogerToken.address,
    decimals: 18,
  },
  {
    name: WaveToken.name,
    symbol: WaveToken.symbol,
    address: WaveToken.address,
    decimals: 18,
  },
]);

export const tokenDropdownOptionsAtom = atom((get) =>
  get(tokenListAtom).map((token) => ({
    value: token.address,
    // label: token.name + " - " +token.symbol  ,
    label: `(${token.symbol}) - ${token.name}`,
  }))
);
