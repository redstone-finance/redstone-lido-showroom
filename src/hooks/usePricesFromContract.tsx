import { useState, Dispatch, SetStateAction } from "react";
import { utils, providers, Contract } from "ethers";
import { WrapperBuilder } from "redstone-evm-connector";
import { emptyPrices } from "../utils";
import { ChainDetails } from "../config/chains";
import { abi } from "../config/LidoPeripheralDetails.json";
import { usePricesData } from "./usePricesData";
import { Prices } from "../types";

export const usePricesFromContract = (
  network: ChainDetails | null,
  signer: providers.JsonRpcSigner | null,
  startMockLoader: () => void,
  setPrices: Dispatch<SetStateAction<Prices>>,
  setIsMockLoading: Dispatch<SetStateAction<boolean>>
) => {
  const [blockNumber, setBlockNumber] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { getPricesTimestamp } = usePricesData();

  const getPricesFromContract = async () => {
    if (network && signer) {
      try {
        startMockLoader();
        setIsLoading(true);
        const contractAddress = network.exampleContractAddress;
        if (contractAddress) {
          const { stDOTPrice, wstDOTPrice, dotPrice } = await fetchPrices(
            contractAddress,
            signer
          );
          setPrices({
            stDOT: utils.formatUnits(stDOTPrice, 8),
            wstDOT: utils.formatUnits(wstDOTPrice, 8),
            dot: utils.formatUnits(dotPrice, 8),
          });
          const blockNumber = await signer.provider.getBlockNumber();
          setBlockNumber(blockNumber);
          const timestamp = await getPricesTimestamp();
          setTimestamp(timestamp);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        handleError();
      }
    } else {
      handleError();
    }
  };

  const fetchPrices = async (
    contractAddress: string,
    signer: providers.JsonRpcSigner
  ) => {
    const contract = new Contract(contractAddress, abi, signer);
    const wrappedContract = WrapperBuilder.wrapLite(contract).usingPriceFeed(
      "redstone",
      {
        asset: "DOT",
      }
    );
    const stDOTPrice = await wrappedContract.stDOTPrice();
    const wstDOTPrice = await wrappedContract.wstDOTPrice();
    const dotPrice = await wrappedContract.getDOTPriceInUSD();
    return {
      stDOTPrice,
      wstDOTPrice,
      dotPrice,
    };
  };

  const handleError = () => {
    setIsLoading(false);
    setPrices(emptyPrices);
    setIsMockLoading(false);
    setErrorMessage(
      "There was problem with fetching data from smart contract. Please try again or contact RedStone team"
    );
  };

  return {
    blockNumber,
    timestamp,
    isLoading,
    errorMessage,
    setErrorMessage,
    getPricesFromContract,
  };
};
