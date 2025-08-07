import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';
import { AarcFundKitModal } from '@aarc-dev/fundkit-web-sdk';
import { useRef } from 'react';
import { AarcEthWalletConnector, wagmiConfig } from '@aarc-xyz/eth-connector';
import { aarcConfig } from './config/aarcConfig';
import DepositModal from './components/InjectiveDepositModal';

const queryClient = new QueryClient();
const iframeUrl = new URLSearchParams(window.location.search).get('iframeUrl') || '';


function App() {
  const aarcModalRef = useRef(new AarcFundKitModal(aarcConfig, iframeUrl?"dev":"prod", iframeUrl?iframeUrl:undefined));

  const aarcModal = aarcModalRef.current;

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <AarcEthWalletConnector aarcWebClient={aarcModal} debugLog={true} >
          <DepositModal aarcModal={aarcModal} />
        </AarcEthWalletConnector>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
