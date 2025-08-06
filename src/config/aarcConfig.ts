import {
    FKConfig,
    ThemeName,
    TransactionSuccessData,
    TransactionErrorData,
    SourceConnectorName,
    DefaultMode,
} from "@aarc-dev/fundkit-web-sdk"
import { INJECTIVE_ADDRESS, SupportedChainId } from "../constants"

export const aarcConfig: FKConfig = {
    appName: "Injective x Aarc",
    userId: "0x",
    dappId: "Injective demo",
    defaultMode: DefaultMode.CARD,
    module: {
        exchange: {
            enabled: true,
        },
        onRamp: {
            enabled: true,
            onRampConfig: {},
            quoteRefreshTime: 10 * 60, // 10 minutes
        },
        bridgeAndSwap: {
            enabled: true,
            fetchOnlyDestinationBalance: false,
            routeType: "Value",
            connectors: [SourceConnectorName.ETHEREUM],
        },
    },
    destination: {
        contract: {
            contractAddress: INJECTIVE_ADDRESS[SupportedChainId.ETHEREUM],
            contractName: "Injective Deposit",
            contractPayload: "0x", // This will be updated dynamically
            contractGasLimit: "300000", // Standard gas limit, can be adjusted if needed
            contractLogoURI: "https://explorer.injective.network/favicon.png",
        },
        tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        walletAddress: INJECTIVE_ADDRESS[SupportedChainId.ETHEREUM],
        chainId: 1, // Base chain ID
    },
    appearance: {
        roundness: 12,
        theme: ThemeName.DARK,
        backgroundColor: "#0F172A",
        dark: {
            backgroundColor: "#0F172A",
        },
    },
    apiKeys: {
        aarcSDK: import.meta.env.VITE_AARC_API_KEY,
    },
    events: {
        onTransactionSuccess: (data: TransactionSuccessData) => {
            console.log("Transaction successful:", data)
        },
        onTransactionError: (data: TransactionErrorData) => {
            console.error("Transaction failed:", data)
        },
        onWidgetClose: () => {
            console.log("Widget closed")
        },
        onWidgetOpen: () => {
            console.log("Widget opened")
        },
    },
    origin: window.location.origin,
}
