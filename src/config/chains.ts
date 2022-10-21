import { utils } from "ethers";
import MoonbeamLogo from "../assets/chains/moonbeam.png";

export type Chains = { [chainId in number]: ChainDetails };

export interface ChainDetails {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  label: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
  exampleContractAddress: string;
  contractExplorerUrl: string;
  logo?: any;
}

export const chains: Chains = {
  [1284]: {
    chainId: utils.hexValue(1284),
    rpcUrls: ["https://rpc.api.moonbeam.network"],
    chainName: "Moonbeam",
    label: "Connect to Moonbeam",
    nativeCurrency: {
      name: "GLMR",
      symbol: "GLMR",
      decimals: 18,
    },
    blockExplorerUrls: ["https://moonscan.io"],
    exampleContractAddress: "0xaCf97fb2f2c336c45b799DAB925ad10ADC70fCAC",
    contractExplorerUrl:
      "https://moonscan.io/address/0xaCf97fb2f2c336c45b799DAB925ad10ADC70fCAC",
    logo: MoonbeamLogo,
  },
};
