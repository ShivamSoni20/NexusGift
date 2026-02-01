"use client";

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // Unified RPC endpoint from environment variables
    const endpoint = useMemo(() => {
        const customEndpoint = process.env.NEXT_PUBLIC_SHADOWWIRE_ENDPOINT ||
            process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;

        const rpc = customEndpoint || clusterApiUrl(network);
        console.log('[WALLET] Using RPC Endpoint:', rpc);
        return rpc;
    }, [network]);

    const wallets = useMemo(() => [], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={false}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
 
 
 
