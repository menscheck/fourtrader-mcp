import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define configuration schema
const ConfigSchema = z.object({
    // Server configuration
    SERVER_NAME: z.string().default('fourtrader-mcp'),
    SERVER_VERSION: z.string().default('1.0.0'),

    // BNB Chain configuration
    WALLET_ADDRESS: z.string(),
    WALLET_PRIVATE_KEY: z.string().optional(),
    BNB_RPC_ENDPOINT: z.string().default('https://bsc-dataseed.binance.org/'),
    
    // Four.meme configuration
    FOURMEME_CONTRACT_ADDRESS: z.string().default('0x5c952063c7fc8610FFDB798152D69F0B9550762b'),

    // Bitquery configuration
    BITQUERY_API_KEY: z.string().optional(),
    BITQUERY_API_ENDPOINT: z.string().default('https://streaming.bitquery.io/graphql'),
});

// Parse and validate configuration
const parseConfig = () => {
    const result = ConfigSchema.safeParse(process.env);

    if (!result.success) {
        console.error('Invalid configuration:', result.error.format());
        return ConfigSchema.parse({
            WALLET_ADDRESS: 'DUMMY_ADDRESS', // This will trigger an error later
        });
    }

    return result.data;
};

// Export configuration
export const config = parseConfig();
