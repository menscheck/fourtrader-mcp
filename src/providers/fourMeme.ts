import { ethers } from 'ethers';
import { BitqueryAPI } from './bitqueryApi.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

// Token schemas
export const TokenInfoSchema = z.object({
    address: z.string(),
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    price: z.number().optional(),
    volume24h: z.number().optional(),
    marketCap: z.number().optional(),
});

export type TokenInfo = z.infer<typeof TokenInfoSchema>;

// Transaction schemas
export const TransactionSchema = z.object({
    hash: z.string(),
    timestamp: z.number(),
    tokenAddress: z.string(),
    amount: z.number(),
    type: z.enum(['buy', 'sell']),
    price: z.number(),
    status: z.enum(['pending', 'confirmed', 'failed']),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// Four.meme smart contract ABI - CORRETTO CON swapV2ExactIn
const FOURMEME_ABI = [
    'function swapV2ExactIn(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin, address poolAddress) payable',
    'function sell(address token, uint256 tokenAmount, uint256 minBnbOut)',
    'function getTokenInfo(address token) view returns (tuple(string name, string symbol, uint8 decimals, uint256 totalSupply))',
];

// Four.meme API provider
export class FourMemeAPI {
    private contractAddress: string;
    private bitqueryApi: BitqueryAPI | null = null;

    constructor(contractAddress: string = '0x5c952063c7fc8610FFDB798152D69F0B9550762b', bitqueryApiKey?: string) {
        this.contractAddress = contractAddress;

        // Initialize Bitquery API if API key is provided
        if (bitqueryApiKey) {
            try {
                this.bitqueryApi = new BitqueryAPI(bitqueryApiKey);
                logger.info('Bitquery API initialized successfully in FourMemeAPI');
            } catch (error) {
                logger.warn(`Failed to initialize Bitquery API: ${error}`);
            }
        }
    }

    /**
     * Get token information from Bitquery
     */
    async getTokenInfo(tokenAddress: string): Promise<any> {
        try {
            logger.info(`Getting token info for ${tokenAddress}`);

            if (this.bitqueryApi) {
                try {
                    return await this.bitqueryApi.getTokenMetadata(tokenAddress);
                } catch (error) {
                    logger.warn(`Failed to get token info from Bitquery: ${error}`);
                }
            }

            // Fallback
            return {
                address: tokenAddress,
                name: 'Unknown Token',
                symbol: 'UNKNOWN',
                decimals: 18,
                note: 'Limited token info. Add Bitquery API key for full data.'
            };
        } catch (error) {
            logger.error(`Failed to get token info: ${error}`);
            throw error;
        }
    }

    /**
     * Get token price from Bitquery
     */
    async getTokenPrice(tokenAddress: string): Promise<any> {
        try {
            logger.info(`Getting token price for ${tokenAddress}`);

            if (this.bitqueryApi) {
                try {
                    return await this.bitqueryApi.getTokenPrice(tokenAddress);
                } catch (error) {
                    logger.warn(`Failed to get token price from Bitquery: ${error}`);
                }
            }

            return {
                address: tokenAddress,
                usdPrice: null,
                bnbPrice: null,
                note: 'Price info not available. Add Bitquery API key.'
            };
        } catch (error) {
            logger.error(`Failed to get token price: ${error}`);
            throw error;
        }
    }

    /**
     * Get recent tokens launched on Four.meme
     */
    async getRecentTokens(limit: number = 50): Promise<any> {
        try {
            if (this.bitqueryApi) {
                return await this.bitqueryApi.getRecentTokens(limit);
            }

            return {
                result: [],
                note: 'Bitquery API required for recent tokens data'
            };
        } catch (error) {
            logger.error(`Failed to get recent tokens: ${error}`);
            throw error;
        }
    }

    /**
     * Get bonding curve progress for a token
     */
    async getBondingCurveProgress(tokenAddress: string): Promise<any> {
        try {
            if (this.bitqueryApi) {
                return await this.bitqueryApi.getBondingCurveProgress(tokenAddress);
            }

            return {
                tokenAddress,
                bondingCurveProgress: null,
                note: 'Bitquery API required for bonding curve data'
            };
        } catch (error) {
            logger.error(`Failed to get bonding curve progress: ${error}`);
            throw error;
        }
    }

    /**
     * Get latest trades for a token
     */
    async getLatestTrades(tokenAddress: string, limit: number = 20): Promise<any> {
        try {
            if (this.bitqueryApi) {
                return await this.bitqueryApi.getLatestTrades(tokenAddress, limit);
            }

            return {
                result: [],
                note: 'Bitquery API required for trade history'
            };
        } catch (error) {
            logger.error(`Failed to get latest trades: ${error}`);
            throw error;
        }
    }
}

// Four.meme Trading provider
export class FourMemeTrading {
    private api: FourMemeAPI;
    private bitqueryApi: BitqueryAPI | null = null;
    private walletAddress: string;
    private walletPrivateKey?: string;
    private rpcEndpoint: string;
    private provider: ethers.JsonRpcProvider;
    private contract: ethers.Contract;
    private wallet?: ethers.Wallet;
    private contractInterface: ethers.Interface;

    constructor(
        walletAddress: string,
        walletPrivateKey?: string,
        rpcEndpoint: string = 'https://bsc-dataseed.binance.org/',
        contractAddress: string = '0x5c952063c7fc8610FFDB798152D69F0B9550762b',
        bitqueryApiKey?: string
    ) {
        if (!walletAddress) {
            throw new Error('Wallet address is required for trading');
        }

        this.walletAddress = walletAddress;
        this.walletPrivateKey = walletPrivateKey;
        this.rpcEndpoint = rpcEndpoint;

        // Create provider
        this.provider = new ethers.JsonRpcProvider(this.rpcEndpoint);

        // Create interface for encoding
        this.contractInterface = new ethers.Interface(FOURMEME_ABI);

        // Create contract instance
        this.contract = new ethers.Contract(
            contractAddress,
            FOURMEME_ABI,
            this.provider
        );

        // Initialize wallet if private key provided
        if (this.walletPrivateKey) {
            this.wallet = new ethers.Wallet(this.walletPrivateKey, this.provider);
        }

        // Initialize API
        this.api = new FourMemeAPI(contractAddress, bitqueryApiKey);

        // Initialize Bitquery
        if (bitqueryApiKey) {
            try {
                this.bitqueryApi = new BitqueryAPI(bitqueryApiKey);
                logger.info('Bitquery API initialized in FourMemeTrading');
            } catch (error) {
                logger.warn(`Failed to initialize Bitquery: ${error}`);
            }
        }
    }

    private validateWallet(): void {
        if (!this.wallet || !this.walletPrivateKey) {
            throw new Error('Wallet private key not configured. Trading unavailable.');
        }
    }

    /**
     * Get token information
     */
    async getTokenInfo(tokenAddress: string): Promise<any> {
        return this.api.getTokenInfo(tokenAddress);
    }

    /**
     * Get token price
     */
    async getTokenPrice(tokenAddress: string): Promise<any> {
        return this.api.getTokenPrice(tokenAddress);
    }

    /**
     * Get recent tokens
     */
    async getRecentTokens(limit: number = 50): Promise<any> {
        return this.api.getRecentTokens(limit);
    }

    /**
     * Get bonding curve progress
     */
    async getBondingCurveProgress(tokenAddress: string): Promise<any> {
        return this.api.getBondingCurveProgress(tokenAddress);
    }

    /**
     * Get latest trades
     */
    async getLatestTrades(tokenAddress: string, limit: number = 20): Promise<any> {
        return this.api.getLatestTrades(tokenAddress, limit);
    }

    /**
     * Buy a token on Four.meme using swapV2ExactIn
     */
    async buyToken(
        tokenAddress: string,
        bnbAmount: number,
        slippage: number = 1.0,
        gasLimit?: number
    ): Promise<any> {
        try {
            this.validateWallet();

            logger.info(`Buying token ${tokenAddress} for ${bnbAmount} BNB with ${slippage}% slippage`);

            // Get token price info to calculate pool address and min output
            const priceInfo = await this.getTokenPrice(tokenAddress);
            
            // Calculate minimum tokens out with slippage
            const minTokensOut = 0;
            
            // Pool address - this needs to be obtained dynamically
            const poolAddress = '0x126fe8248678550e87c725b9f716d75ff2017d64';
            
            // tokenIn = address(0) means native BNB
            const tokenIn = '0x0000000000000000000000000000000000000000';
            
            const amountIn = ethers.parseEther(bnbAmount.toString());
            
            console.log('DEBUG - Parameters:');
            console.log('  tokenIn:', tokenIn);
            console.log('  tokenOut:', tokenAddress);
            console.log('  amountIn:', amountIn.toString());
            console.log('  minTokensOut:', minTokensOut);
            console.log('  poolAddress:', poolAddress);
            
            // Encode the function call with swapV2ExactIn
            const data = this.contractInterface.encodeFunctionData('swapV2ExactIn', [
                tokenIn,
                tokenAddress,
                amountIn,
                minTokensOut,
                poolAddress
            ]);

            console.log('DEBUG - Encoded data:', data);
            console.log('DEBUG - Data length:', data.length);
            console.log('DEBUG - Contract target:', this.contract.target);

            // Send transaction
            const tx = await this.wallet!.sendTransaction({
                to: this.contract.target as string,
                data: data,
                value: amountIn,
                gasLimit: gasLimit || 500000
            });

            logger.info(`Transaction sent: ${tx.hash}`);

            // Wait for confirmation
            const receipt = await tx.wait();

            return {
                success: true,
                transactionId: tx.hash,
                tokenAddress,
                amountBnb: bnbAmount,
                status: receipt?.status === 1 ? 'confirmed' : 'failed',
                blockNumber: receipt?.blockNumber,
                explorerUrl: `https://bscscan.com/tx/${tx.hash}`
            };
        } catch (error) {
            logger.error(`Failed to buy token: ${error}`);
            throw new Error(`Failed to buy token: ${error}`);
        }
    }

    /**
     * Sell a token on Four.meme
     */
    async sellToken(
        tokenAddress: string,
        tokenAmount: string,
        slippage: number = 1.0,
        gasLimit?: number
    ): Promise<any> {
        try {
            this.validateWallet();

            logger.info(`Selling ${tokenAmount} of token ${tokenAddress} with ${slippage}% slippage`);

            // Parse token amount
            const amount = ethers.parseUnits(tokenAmount, 18);
            
            // Calculate minimum BNB to receive (accounting for slippage)
            const minBnbOut = 0;

            // Encode the function call manually
            const data = this.contractInterface.encodeFunctionData('sell', [
                tokenAddress,
                amount,
                minBnbOut
            ]);

            // Send transaction
            const tx = await this.wallet!.sendTransaction({
                to: this.contract.target as string,
                data: data,
                gasLimit: gasLimit || 500000
            });

            logger.info(`Transaction sent: ${tx.hash}`);

            // Wait for confirmation
            const receipt = await tx.wait();

            return {
                success: true,
                transactionId: tx.hash,
                tokenAddress,
                amount: tokenAmount,
                status: receipt?.status === 1 ? 'confirmed' : 'failed',
                blockNumber: receipt?.blockNumber,
                explorerUrl: `https://bscscan.com/tx/${tx.hash}`
            };
        } catch (error) {
            logger.error(`Failed to sell token: ${error}`);
            throw new Error(`Failed to sell token: ${error}`);
        }
    }

    /**
     * Get BNB balance
     */
    async getBnbBalance(): Promise<string> {
        try {
            const balance = await this.provider.getBalance(this.walletAddress);
            return ethers.formatEther(balance);
        } catch (error) {
            logger.error(`Failed to get BNB balance: ${error}`);
            throw error;
        }
    }

    /**
     * Get token balance
     */
    async getTokenBalance(tokenAddress: string): Promise<string> {
        try {
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ['function balanceOf(address) view returns (uint256)'],
                this.provider
            );
            
            const balance = await tokenContract.balanceOf(this.walletAddress);
            return ethers.formatUnits(balance, 18);
        } catch (error) {
            logger.error(`Failed to get token balance: ${error}`);
            throw error;
        }
    }
}