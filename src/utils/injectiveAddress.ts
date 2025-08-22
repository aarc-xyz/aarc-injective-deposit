import { Address, getInjectiveAddress } from '@injectivelabs/sdk-ts';

/**
 * Converts an Ethereum address to a proper Injective address.
 *
 * IMPORTANT: This is a one-way conversion and cannot be reversed without
 * access to the private key. It derives the Injective address from the
 * Ethereum public key, which is standard for many Cosmos-based chains.
 *
 * @param ethAddress - The Ethereum address to convert
 * @returns The corresponding Injective address
 */
export const convertToInjectiveAddress = (ethAddress: string): string => {
    try {
        const address = getInjectiveAddress(ethAddress);
        return address;
    } catch (error) {
        console.error('Error converting Ethereum address to Injective address:', error);
        return '';
    }
};

/**
 * Validates if an address is a proper Injective address
 * @param address - The address to validate
 * @returns True if the address is a valid Injective address
 */
export const isValidInjectiveAddress = (address: string): boolean => {
    try {
        Address.fromBech32(address);
        return true;
    } catch {
        return false;
    }
};

/**
 * Gets the Ethereum address from an Injective address
 * @param injAddress - The Injective address
 * @returns The corresponding Ethereum address
 */
export const getEthereumAddressFromInjective = (injAddress: string): string => {
    try {
        const address = Address.fromBech32(injAddress);
        return address.toHex();
    } catch (error) {
        console.error('Error converting Injective address to Ethereum address:', error);
        return '';
    }
};

/**
 * Converts an Injective address to bytes32 format for smart contract calls
 * This function first converts the Injective address to its Ethereum equivalent,
 * then formats it as a bytes32 value with proper padding
 * @param injAddress - The Injective address to convert
 * @returns The bytes32 formatted address string
 */
export const convertInjectiveAddressToBytes32 = (injAddress: string): string => {
    try {
        // First convert Injective address to Ethereum address
        const ethAddress = getEthereumAddressFromInjective(injAddress);
        if (!ethAddress) {
            throw new Error('Failed to convert Injective address to Ethereum address');
        }
        
        // Remove the 0x prefix and pad with zeros to make it 64 characters (32 bytes)
        const addressWithoutPrefix = ethAddress.slice(2);
        const paddedAddress = addressWithoutPrefix.padStart(64, '0');
        
        return `0x${paddedAddress}`;
    } catch (error) {
        console.error('Error converting Injective address to bytes32:', error);
        return '';
    }
}; 