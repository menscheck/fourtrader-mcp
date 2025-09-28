import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { FourMemeTrading } from './providers/fourMeme.js';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';

async function main() {
    let server: McpServer | undefined;
    let transport: StdioServerTransport | undefined;

    try {
        logger.info('Starting FourTrader MCP Server for BNB Chain');

        // Create MCP server
        server = new McpServer({
            name: config.SERVER_NAME || "fourtrader-mcp",
            version: config.SERVER_VERSION || "1.0.0",
        });

        // Initialize providers
        logger.info('Initializing Four.meme provider...');

        let fourMemeTrading: FourMemeTrading | null = null;
        try {
            fourMemeTrading = new FourMemeTrading(
                config.WALLET_ADDRESS,
                config.WALLET_PRIVATE_KEY,
                config.BNB_RPC_ENDPOINT,
                config.FOURMEME_CONTRACT_ADDRESS,
                config.BITQUERY_API_KEY
            );
            logger.info('Four.meme trading module initialized successfully');
        } catch (err: unknown) {
            console.error(`Failed to initialize FourMemeTrading: ${err instanceof Error ? err.message : String(err)}`);
            if (err instanceof Error && err.stack) {
                console.error(err.stack);
            }
        }

        // Register tools
        logger.info('Registering tools...');

        if (fourMemeTrading) {
            try {
                // Get token info
                server.tool(
                    "get_token_info",
                    { address: z.string() },
                    async (params) => {
                        try {
                            const token = await fourMemeTrading!.getTokenInfo(params.address);
                            return {
                                content: [{ type: "text", text: JSON.stringify(token, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                // Get token price
                server.tool(
                    "get_token_price",
                    { address: z.string() },
                    async (params) => {
                        try {
                            const price = await fourMemeTrading!.getTokenPrice(params.address);
                            return {
                                content: [{ type: "text", text: JSON.stringify(price, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                // Get recent tokens
                server.tool(
                    "get_recent_tokens",
                    { limit: z.number().optional() },
                    async (params) => {
                        try {
                            const tokens = await fourMemeTrading!.getRecentTokens(params.limit ?? 50);
                            return {
                                content: [{ type: "text", text: JSON.stringify(tokens, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                // Get bonding curve progress
                server.tool(
                    "get_bonding_curve_progress",
                    { address: z.string() },
                    async (params) => {
                        try {
                            const progress = await fourMemeTrading!.getBondingCurveProgress(params.address);
                            return {
                                content: [{ type: "text", text: JSON.stringify(progress, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                // Get latest trades
                server.tool(
                    "get_latest_trades",
                    {
                        address: z.string(),
                        limit: z.number().optional()
                    },
                    async (params) => {
                        try {
                            const trades = await fourMemeTrading!.getLatestTrades(params.address, params.limit ?? 20);
                            return {
                                content: [{ type: "text", text: JSON.stringify(trades, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                // Buy token
                server.tool(
                    "buy_token",
                    {
                        address: z.string(),
                        bnbAmount: z.number(),
                        slippage: z.number().optional(),
                        gasLimit: z.number().optional()
                    },
                    async (params) => {
                        try {
                            const transaction = await fourMemeTrading!.buyToken(
                                params.address,
                                params.bnbAmount,
                                params.slippage ?? 1.0,
                                params.gasLimit
                            );
                            return {
                                content: [{ type: "text", text: `Transaction initiated: ${JSON.stringify(transaction, null, 2)}` }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                // Sell token
                server.tool(
                    "sell_token",
                    {
                        address: z.string(),
                        tokenAmount: z.string(),
                        slippage: z.number().optional(),
                        gasLimit: z.number().optional()
                    },
                    async (params) => {
                        try {
                            const transaction = await fourMemeTrading!.sellToken(
                                params.address,
                                params.tokenAmount,
                                params.slippage ?? 1.0,
                                params.gasLimit
                            );
                            return {
                                content: [{ type: "text", text: `Transaction initiated: ${JSON.stringify(transaction, null, 2)}` }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                // Get BNB balance
                server.tool(
                    "get_bnb_balance",
                    {},
                    async () => {
                        try {
                            const balance = await fourMemeTrading!.getBnbBalance();
                            return {
                                content: [{ type: "text", text: `BNB Balance: ${balance} BNB` }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                // Get token balance
                server.tool(
                    "get_token_balance",
                    { address: z.string() },
                    async (params) => {
                        try {
                            const balance = await fourMemeTrading!.getTokenBalance(params.address);
                            return {
                                content: [{ type: "text", text: `Token Balance: ${balance}` }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                logger.info('Added Four.meme tools successfully');
            } catch (err: unknown) {
                console.error(`Failed to add Four.meme tools: ${err instanceof Error ? err.message : String(err)}`);
                if (err instanceof Error && err.stack) {
                    console.error(err.stack);
                }
            }
        }

        // Connect to transport
        logger.info('Connecting to transport...');
        transport = new StdioServerTransport();
        await server.connect(transport);
        logger.info('MCP connection established');

        logger.info('FourTrader MCP Server for BNB Chain started successfully');

        // Graceful shutdown
        process.on('SIGINT', async () => {
            logger.info('Shutting down server...');
            if (server) await server.close();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            logger.info('Shutting down server...');
            if (server) await server.close();
            process.exit(0);
        });

    } catch (error: unknown) {
        console.error(`Error starting server: ${error instanceof Error ? error.message : String(error)}`);
        if (error instanceof Error && error.stack) {
            console.error(error.stack);
        }

        if (server) {
            try {
                await server.close();
            } catch (closeError: unknown) {
                console.error(`Error closing server: ${closeError instanceof Error ? closeError.message : String(closeError)}`);
            }
        }

        process.exit(1);
    }
}

// Start server
main();
