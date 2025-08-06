import {
    FKConfig,
    ThemeName,
    TransactionSuccessData,
    TransactionErrorData,
    SourceConnectorName,
    DefaultFlow,
  } from "@aarc-dev/fundkit-web-sdk";
  
  export const cexConfig: FKConfig = {
    appName: "Injective x Aarc",
    userId: "0x",
    dappId: "Injective CEX demo",
    //@ts-expect-error - defaultFlow is not supported in the SDK
    defaultFlow: DefaultFlow.DEPOSIT_FIRST,
    module: {
      exchange: {
        enabled: true,
      },
      onRamp: {
        enabled: false,
        onRampConfig: {},
      },
      bridgeAndSwap: {
        enabled: false,
        fetchOnlyDestinationBalance: false,
        routeType: "Value",
        connectors: [SourceConnectorName.ETHEREUM],
      },
    },
    destination: {},
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
        console.log("Transaction successful:", data);
      },
      onTransactionError: (data: TransactionErrorData) => {
        console.error("Transaction failed:", data);
      },
      onWidgetClose: () => {
        console.log("Widget closed");
      },
      onWidgetOpen: () => {
        console.log("Widget opened");
      },
    },
    origin: window.location.origin,
  
  }; 