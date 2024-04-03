"use client";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  useAccount,
  useDisconnect,
  useBalance,
  useConnect,
  useWalletClient,
  type WalletClient,
} from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { fetchGet, fetchPost } from "@/request";
import { DateTime } from "luxon";
import { ethers, utils, providers } from "ethers";
import {
  buildPaymentTransaction,
  getSignERC20Permit,
} from "blockus-no-custodial-payment";
import { getParticleOptions, ParticleAuthConnector } from "@/particleConnector";
import { usePermit } from "wagmi-permit";

export default function Page() {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const {
    data: walletClient,
    isError,
    isLoading,
  } = useWalletClient({
    chainId: polygon.id,
  });
  const { connect, connectors } = useConnect();

  useEffect(() => {
    connect({
      connector: connectors.find((e) => e.name === "Particle Auth"),
    });
  }, []);

  const EVMbuy = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const particleProvider = await activeConnector?.getProvider();
    const _particleProvider = new ethers.providers.JsonRpcProvider(
      "https://api.particle.network/server/rpc",
      137,
    );
    const signer = provider?.getSigner();
    const buyersAddress = await signer.getAddress();

    // GETS PAYMENT INTENTION FROM BLOCKUS
    // https://api.blockus.net/api-docs/swagger/index.html#/Marketplace%20listings/getPaymentIntent
    const intent = {
      chain: "polygon",
      contractAddress: "0xA65cc7AF14003464A87294E92FaCD304A61059ac",
      functionName: "distributeTokensWithPermit",
      functionSignature:
        "function distributeTokensWithPermit(address,address,(address,uint256)[],uint256,uint256,uint8,bytes32,bytes32)",
      parameters: {
        paymentTokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        fromAddress: "BUYER-ADDRESS-INSERT-HERE",
        transfers: [["0x90b710825db8AAb007B6Bd9F15894e61F8f3c77c", "1000"]],
        totalPrice: "1000",
        deadline:
          "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      },
    };
    intent.parameters.fromAddress = buyersAddress;
    console.log(_particleProvider, provider);
    debugger;

    // Creates permit type data
    const permitTypeData = await getSignERC20Permit(
      buyersAddress,
      intent,
      walletClient,
    );
    debugger;
    permitTypeData.value.deadline = ethers.constants.MaxInt256;

    try {
      // Get permit signature
      const permitSignature = await signer._signTypedData(
        // @ts-ignore
        permitTypeData.domain,
        permitTypeData.types,
        permitTypeData.value,
      );

      // Constructs payment transaction
      const paymentMetaTransaction = await buildPaymentTransaction(
        permitSignature,
        intent,
        signer,
      );
      paymentMetaTransaction.value.chainId = 137;
      paymentMetaTransaction.domain.chainId = 137;
      // @ts-ignore
      delete paymentMetaTransaction.domain.chain;
      debugger;
      // Sign meta transaction for token distribution.
      const distributeTokenSignature = await signer._signTypedData(
        // @ts-ignore
        paymentMetaTransaction.domain,
        paymentMetaTransaction.types,
        paymentMetaTransaction.value,
      );

      // Meta transaction deadline
      const metaTxDeadline = paymentMetaTransaction.value.userDeadline;

      // Execute listing
      const executeBody = {
        paymentWalletChain: "polygon",
        paymentWalletAddress: buyersAddress,
        paymentTxSignature: distributeTokenSignature,
        permitTxSignature: permitSignature,
        metaTransactionDeadline: metaTxDeadline,
      };
      const res = await fetchPost("/api/tradeCenter?endpoint=execute", {
        local: true,
        data: executeBody,
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className="w-[200px] bg-white cursor-pointer h-5 absolute top-[50%] left-[50%]"
      onClick={EVMbuy}
    >
      {" "}
      click me
    </div>
  );
}
