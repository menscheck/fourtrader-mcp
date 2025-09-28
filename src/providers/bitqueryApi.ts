import axios from 'axios';
import { logger } from '../utils/logger.js';

export class BitqueryAPI {
    private apiKey: string;
    private endpoint: string;

    constructor(apiKey: string, endpoint: string = 'https://streaming.bitquery.io/eap') {
        if (!apiKey) {
            throw new Error('Bitquery API key is required');
        }
        this.apiKey = apiKey;
        this.endpoint = endpoint;
    }

    /**
     * Execute a GraphQL query against Bitquery API
     */
    private async query(queryString: string, variables?: Record<string, any>): Promise<any> {
        try {
            const response = await axios.post(
                this.endpoint,
                {
                    query: queryString,
                    variables: variables || {}
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': this.apiKey,
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (response.data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
            }

            return response.data.data;
        } catch (error) {
            logger.error(`Bitquery API error: ${error}`);
            throw error;
        }
    }

    /**
     * Get token metadata for a Four.meme token using Trading.Pairs
     */
    async getTokenMetadata(tokenAddress: string): Promise<any> {
        logger.info(`Getting token metadata for ${tokenAddress} from Bitquery`);

        const query = `
            query GetTokenInfo($tokenAddress: String!) {
                Trading {
                    Pairs(
                        where: {
                            Token: {Address: {is: $tokenAddress}}
                            Market: {Protocol: {is: "fourmeme_v1"}}
                        }
                        limit: {count: 1}
                    ) {
                        Token {
                            Name
                            Symbol
                            Address
                        }
                    }
                }
            }
        `;

        try {
            const result = await this.query(query, { tokenAddress });
            
            if (result.Trading?.Pairs?.[0]) {
                const token = result.Trading.Pairs[0].Token;
                return {
                    address: token.Address,
                    name: token.Name,
                    symbol: token.Symbol,
                    decimals: 18 // Four.meme tokens use 18 decimals by default
                };
            }

            throw new Error('Token not found');
        } catch (error) {
            logger.error(`Failed to get token metadata: ${error}`);
            throw error;
        }
    }

    /**
     * Get current token price and trading data using Trading.Pairs
     */
    async getTokenPrice(tokenAddress: string): Promise<any> {
        logger.info(`Getting token price for ${tokenAddress} from Bitquery`);

        const query = `
            query GetTokenPrice($tokenAddress: String!) {
                Trading {
                    Pairs(
                        where: {
                            Token: {Address: {is: $tokenAddress}}
                            Market: {Protocol: {is: "fourmeme_v1"}}
                        }
                        limit: {count: 1}
                    ) {
                        Token {
                            Name
                            Symbol
                            Address
                        }
                        Price {
                            Average {
                                Mean
                            }
                            Ohlc {
                                Close
                                High
                                Low
                                Open
                            }
                        }
                        Volume {
                            Base
                            Quote
                            Usd
                        }
                        marketcap: calculate(expression: "Price_Ohlc_Close * 1000000000")
                        Market {
                            Protocol
                            Network
                        }
                    }
                }
            }
        `;

        try {
            const result = await this.query(query, { tokenAddress });
            
            if (result.Trading?.Pairs?.[0]) {
                const pair = result.Trading.Pairs[0];
                return {
                    address: tokenAddress,
                    name: pair.Token.Name,
                    symbol: pair.Token.Symbol,
                    usdPrice: pair.Price?.Ohlc?.Close || 0,
                    priceAverage: pair.Price?.Average?.Mean || 0,
                    priceHigh: pair.Price?.Ohlc?.High || 0,
                    priceLow: pair.Price?.Ohlc?.Low || 0,
                    priceOpen: pair.Price?.Ohlc?.Open || 0,
                    volume24h: pair.Volume?.Usd || 0,
                    marketCap: pair.marketcap || 0,
                    lastUpdated: new Date().toISOString()
                };
            }

            return {
                address: tokenAddress,
                usdPrice: null,
                note: 'No recent trades found for this token'
            };
        } catch (error) {
            logger.error(`Failed to get token price: ${error}`);
            throw error;
        }
    }

    /**
     * Get recently created tokens on Four.meme using Trading.Pairs
     */
    async getRecentTokens(limit: number = 50): Promise<any> {
        logger.info(`Getting recent tokens from Four.meme, limit: ${limit}`);

        const query = `
            query GetRecentTokens($limit: Int!) {
                Trading {
                    Pairs(
                        where: {
                            Market: {Protocol: {is: "fourmeme_v1"}}
                            Volume: {Usd: {gt: 0}}
                        }
                        orderBy: {descending: Block_Time}
                        limit: {count: $limit}
                    ) {
                        Token {
                            Name
                            Symbol
                            Address
                        }
                        Price {
                            Ohlc {
                                Close
                            }
                        }
                        Volume {
                            Usd
                        }
                        marketcap: calculate(expression: "Price_Ohlc_Close * 1000000000")
                        Block {
                            Time
                        }
                    }
                }
            }
        `;

        try {
            const result = await this.query(query, { limit });
            
            if (result.Trading?.Pairs) {
                return {
                    tokens: result.Trading.Pairs.map((pair: any) => ({
                        address: pair.Token.Address,
                        name: pair.Token.Name,
                        symbol: pair.Token.Symbol,
                        price: pair.Price?.Ohlc?.Close || 0,
                        volume24h: pair.Volume?.Usd || 0,
                        marketCap: pair.marketcap || 0,
                        lastActivity: pair.Block?.Time
                    })),
                    count: result.Trading.Pairs.length
                };
            }

            return {
                tokens: [],
                count: 0
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
        logger.info(`Getting bonding curve progress for ${tokenAddress}`);

        const query = `
            query GetBondingCurve($tokenAddress: String!) {
                EVM(dataset: archive, network: opbnb) {
                    BalanceUpdates(
                        where: {
                            BalanceUpdate: {
                                Address: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
                            }
                            Currency: {
                                SmartContract: { is: $tokenAddress }
                            }
                        }
                        orderBy: { descending: Block_Time }
                        limit: { count: 1 }
                    ) {
                        BalanceUpdate {
                            Amount
                        }
                    }
                }
            }
        `;

        try {
            const result = await this.query(query, { tokenAddress });
            
            if (result.EVM?.BalanceUpdates?.[0]) {
                const leftTokens = parseFloat(result.EVM.BalanceUpdates[0].BalanceUpdate.Amount);
                // Formula: BondingCurveProgress = 100 - ((leftTokens * 100) / initialRealTokenReserves)
                const initialReserves = 1000000000; // 1 billion tokens
                const progress = 100 - ((leftTokens * 100) / initialReserves);
                
                return {
                    tokenAddress,
                    leftTokens,
                    bondingCurveProgress: Math.max(0, Math.min(100, progress)),
                    isGraduated: progress >= 100
                };
            }

            return {
                tokenAddress,
                bondingCurveProgress: 0,
                note: 'Unable to determine bonding curve progress'
            };
        } catch (error) {
            logger.error(`Failed to get bonding curve progress: ${error}`);
            throw error;
        }
    }

    /**
     * Get latest trades for a token using Trading.Pairs
     */
    async getLatestTrades(tokenAddress: string, limit: number = 20): Promise<any> {
        logger.info(`Getting latest trades for ${tokenAddress}`);

        const query = `
            query GetLatestTrades($tokenAddress: String!, $limit: Int!) {
                Trading {
                    Pairs(
                        where: {
                            Token: {Address: {is: $tokenAddress}}
                            Market: {Protocol: {is: "fourmeme_v1"}}
                            Interval: {Time: {Duration: {eq: 1}}}
                        }
                        orderBy: {descending: Block_Time}
                        limit: {count: $limit}
                    ) {
                        Token {
                            Name
                            Symbol
                            Address
                        }
                        Price {
                            Ohlc {
                                Close
                                High
                                Low
                                Open
                            }
                        }
                        Volume {
                            Base
                            Quote
                            Usd
                        }
                        Block {
                            Time
                            Timestamp
                        }
                    }
                }
            }
        `;

        try {
            const result = await this.query(query, { tokenAddress, limit });
            
            if (result.Trading?.Pairs) {
                return {
                    trades: result.Trading.Pairs.map((pair: any) => ({
                        tokenAddress: pair.Token.Address,
                        tokenName: pair.Token.Name,
                        tokenSymbol: pair.Token.Symbol,
                        price: pair.Price?.Ohlc?.Close || 0,
                        priceHigh: pair.Price?.Ohlc?.High || 0,
                        priceLow: pair.Price?.Ohlc?.Low || 0,
                        volumeUsd: pair.Volume?.Usd || 0,
                        volumeBase: pair.Volume?.Base || 0,
                        volumeQuote: pair.Volume?.Quote || 0,
                        timestamp: pair.Block?.Timestamp,
                        time: pair.Block?.Time
                    })),
                    count: result.Trading.Pairs.length
                };
            }

            return {
                trades: [],
                count: 0
            };
        } catch (error) {
            logger.error(`Failed to get latest trades: ${error}`);
            throw error;
        }
    }

    /**
     * Monitor liquidity events for a token
     */
    async getLiquidityEvents(tokenAddress: string): Promise<any> {
        logger.info(`Getting liquidity events for ${tokenAddress}`);

        const query = `
            query GetLiquidityEvents($tokenAddress: String!) {
                EVM(dataset: archive, network: opbnb) {
                    Events(
                        where: {
                            Log: {
                                Signature: { Name: { is: "LiquidityAdded" } }
                            }
                            Transaction: {
                                To: { is: "0x5c952063c7fc8610ffdb798152d69f0b9550762b" }
                            }
                        }
                        orderBy: { descending: Block_Time }
                        limit: { count: 10 }
                    ) {
                        Arguments {
                            Name
                            Value {
                                ... on EVM_ABI_Address_Value_Arg {
                                    address
                                }
                                ... on EVM_ABI_Integer_Value_Arg {
                                    integer
                                }
                            }
                        }
                        Transaction {
                            Hash
                        }
                        Block {
                            Time
                        }
                    }
                }
            }
        `;

        try {
            const result = await this.query(query, { tokenAddress });
            return result;
        } catch (error) {
            logger.error(`Failed to get liquidity events: ${error}`);
            throw error;
        }
    }
}
