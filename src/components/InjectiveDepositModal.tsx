import { useRef, useState, useEffect } from 'react';
import { AarcFundKitModal } from '@aarc-dev/fundkit-web-sdk';
import { INJECTIVE_ADDRESS, SupportedChainId, TOKENS } from '../constants';
import { Navbar } from './Navbar';
import { TokenConfig } from '../types';
import { cexConfig } from '../config/cexConfig';
import { isValidInjectiveAddress, convertInjectiveAddressToBytes32 } from '../utils/injectiveAddress';

const iframeUrl = new URLSearchParams(window.location.search).get('iframeUrl') || '';

export const InjectiveDepositModal = ({ aarcModal }: { aarcModal: AarcFundKitModal }) => {
    const [amount, setAmount] = useState('20');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedToken, setSelectedToken] = useState<TokenConfig>(TOKENS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [destinationAddress, setDestinationAddress] = useState('');
    const [isWithdrawMode, setIsWithdrawMode] = useState(false);
    const [isAddressValid, setIsAddressValid] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const cexAarcModalRef = useRef(new AarcFundKitModal(cexConfig, iframeUrl?"dev":"prod", iframeUrl?iframeUrl:undefined));

    const cexModal = cexAarcModalRef.current;
    console.log(iframeUrl)

    // Validate Injective address when it changes
    useEffect(() => {
        if (destinationAddress) {
            const isValid = isValidInjectiveAddress(destinationAddress);
            setIsAddressValid(isValid);
        } else {
            setIsAddressValid(false);
        }
    }, [destinationAddress]);

    // Handle clicking outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);



    const handleDeposit = async () => {
        if (!destinationAddress || !isAddressValid) return;

        try {
            setIsProcessing(true);

            // Convert Injective address to bytes32 format
            const bytes32Address = convertInjectiveAddressToBytes32(destinationAddress);
            if (!bytes32Address) {
                throw new Error('Failed to convert Injective address to bytes32 format');
            }

            // Update modal with amount and token information
            aarcModal.updateRequestedAmount(Number(amount));
            aarcModal.updateDestinationToken(selectedToken.address);

            if(selectedToken.symbol === 'INJ'){
                //@ts-expect-error - only INJ is supported for now
                aarcModal.updateModules({
                    exchange: {
                        enabled: false
                    }
                })
            }

            aarcModal.updateDestinationContract({
                contractAddress: INJECTIVE_ADDRESS[SupportedChainId.ETHEREUM],
                calldataABI: JSON.stringify([
                    {
                        "inputs": [
                            { "internalType": "address", "name": "_tokenContract", "type": "address" },
                            { "internalType": "bytes32", "name": "_destination", "type": "bytes32" },
                            { "internalType": "uint256", "name": "_amount", "type": "uint256" },
                            { "internalType": "string", "name": "_data", "type": "string" }
                        ],
                        "name": "sendToInjective",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ]),
                calldataParams: `${selectedToken.address},${bytes32Address},AARC,`,
                contractName: "Injective Deposit",
                contractGasLimit: "800000",
                contractLogoURI: "https://explorer.injective.network/favicon.png",
                //@ts-expect-error - contractSecondaryLogoURI is not a valid property
                contractSecondaryLogoURI: "https://explorer.injective.network/favicon.png",
            });

            aarcModal.openModal();
            setAmount('');
            setIsProcessing(false);
        } catch (error) {
            console.error("Error preparing deposit:", error);
            setIsProcessing(false);
            aarcModal.close();
        }
    };

    const handleBinanceWithdraw = async () => {
        if(!destinationAddress || !isAddressValid) return;

        try{
            cexModal.updateDestinationWalletAddress(destinationAddress);
            console.log(destinationAddress)
            cexModal.openModal();
        }catch(error){
            console.error("Error withdrawing INJ from Binance:", error);
        }
    };

    return (
        <div className="min-h-screen bg-injective-page-bg grid-background">
            <Navbar />
            <main className="mt-24 gradient-border flex items-center justify-center mx-auto max-w-md shadow-injective">
                <div className="flex flex-col items-center w-[440px] bg-injective-item-bg rounded-[24px] p-8 pb-[22px] gap-3">
                    <div className="w-full relative">
                        <h3 className="text-[14px] font-semibold text-injective-white mb-4">Get INJ Instantly with Card or CEX</h3>
                       
                    </div>

                    {/* Toggle Switch */}
                    <div className="w-full flex items-center justify-center bg-injective-item-dark-bg rounded-2xl p-1">
                        <button
                            onClick={() => setIsWithdrawMode(false)}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                                !isWithdrawMode 
                                    ? 'bg-injective-purple text-injective-white' 
                                    : 'text-injective-gray hover:text-injective-purple'
                            }`}
                        >
                            Buy with Card
                        </button>
                        <button
                            onClick={() => setIsWithdrawMode(true)}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                                isWithdrawMode 
                                    ? 'bg-injective-purple text-injective-white' 
                                    : 'text-injective-gray hover:text-injective-purple'
                            }`}
                        >
                            Deposit from CEX
                        </button>
                    </div>

                    {/* Injective Address Input (Always visible) */}
                    <div className="w-full">
                        <div className="flex items-center p-3 bg-injective-item-dark-bg border border-injective-border rounded-2xl">
                            <div className="flex items-center gap-3 flex-1">
                                <input
                                    type="text"
                                    value={destinationAddress}
                                    onChange={(e) => setDestinationAddress(e.target.value)}
                                    className="w-full bg-transparent text-[18px] font-semibold text-injective-white outline-none placeholder:text-injective-gray"
                                    placeholder="Enter Injective address (inj1...)"
                                />
                                <div className="relative group">
                                    <img 
                                        src="/info-icon.svg" 
                                        alt="Info" 
                                        className="w-4 h-4 cursor-pointer" 
                                    />
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-injective-item-bg border border-injective-border rounded-lg text-xs text-injective-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                                        Enter the Injective address where you will receive the tokens
                                    </div>
                                </div>
                            </div>
                        </div>
                        {destinationAddress && !isAddressValid && (
                            <p className="text-red-400 text-xs mt-1 ml-1">Invalid Injective address format. Expected format: inj1...</p>
                        )}
                    </div>

                    {!isWithdrawMode ? (
                        // Deposit Section
                        <>
                            {/* Token Selection Dropdown */}
                            <div className="w-full relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center p-3 bg-injective-item-dark-bg border border-injective-border rounded-2xl cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <img src={selectedToken.logo} alt={selectedToken.symbol} className="w-6 h-6" />
                                        <span className="text-[18px] font-semibold text-injective-white">{selectedToken.symbol}</span>
                                    </div>
                                    <div className="pointer-events-none">
                                        <svg 
                                            width="12" 
                                            height="8" 
                                            viewBox="0 0 12 8" 
                                            fill="none" 
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                                        >
                                            <path d="M1 1L6 6L11 1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </button>

                                {/* Dropdown Options */}
                                {isDropdownOpen && (
                                    <div className="absolute w-full mt-2 py-2 bg-injective-item-bg border border-injective-border rounded-2xl z-10 shadow-lg">
                                        {TOKENS.map(token => (
                                            <button
                                                key={token.symbol}
                                                onClick={() => {
                                                    setSelectedToken(token);
                                                    setAmount(token.quickAmounts[0]);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-injective-item-dark-bg transition-colors"
                                            >
                                                <img src={token.logo} alt={token.symbol} className="w-6 h-6" />
                                                <span className="text-[18px] font-semibold text-injective-white">{token.symbol}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Deposit Info */}
                            <div className="w-full flex gap-x-2 items-start p-4 bg-injective-item-dark-bg/30 border border-injective-purple/20 rounded-2xl">
                                <img src="/info-icon.svg" alt="Info" className="w-4 h-4 mt-[2px]" />
                                <div className="text-xs text-injective-white leading-5">
                                    <p className="font-bold mb-1">After your deposit is completed:</p>
                                    <p>Check your deposit balance on{' '}
                                        <a 
                                            href="https://explorer.injective.network/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-injective-purple hover:underline"
                                        >
                                            Injective Explorer
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={handleDeposit}
                                disabled={isProcessing || !destinationAddress || !isAddressValid}
                                className="w-full h-11 mt-2 bg-injective-purple hover:opacity-90 text-injective-white font-semibold rounded-2xl border border-[rgba(76,61,255,0.05)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : 'Continue'}
                            </button>
                        </>
                    ) : (
                        // Withdraw Section
                        <>
                            {/* INJ Token Display (Fixed) */}
                            <div className="w-full flex items-center p-3 bg-injective-item-dark-bg border border-injective-border rounded-2xl">
                                <div className="flex items-center gap-3 flex-1">
                                    <img src="/inj-icon.svg" alt="INJ" className="w-6 h-6" />
                                    <span className="text-[18px] font-semibold text-injective-white">INJ</span>
                                </div>
                            </div>

                            {/* Withdraw Button */}
                            <button
                                onClick={handleBinanceWithdraw}
                                disabled={isProcessing || !destinationAddress || !isAddressValid}
                                className="w-full h-11 mt-2 bg-injective-purple hover:opacity-90 text-injective-white font-semibold rounded-2xl border border-[rgba(76,61,255,0.05)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </>
                    )}

                    {/* Powered by Footer */}
                    <div className="flex flex-col items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-injective-gray">Powered by</span>
                            <img src="/aarc-logo-small.svg" alt="Aarc" />
                        </div>
                        <p className="text-[10px] text-injective-gray/70">
                            By using this service, you agree to Aarc <span className="underline cursor-pointer">terms</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InjectiveDepositModal;