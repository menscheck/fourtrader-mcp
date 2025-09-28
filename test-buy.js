import { FourMemeTrading } from './build/providers/fourMeme.js';
import dotenv from 'dotenv';

dotenv.config();

async function testBuy() {
    try {
        console.log('Initializing FourMemeTrading...');
        
        const trading = new FourMemeTrading(
            process.env.WALLET_ADDRESS,
            process.env.WALLET_PRIVATE_KEY,
            process.env.BNB_RPC_ENDPOINT,
            process.env.FOURMEME_CONTRACT_ADDRESS,
            process.env.BITQUERY_API_KEY
        );

        console.log('Testing buy transaction...');
        console.log('Token:', '0xab50114166ad06793a10f2d1b9617cf906704444');
        console.log('Amount:', '0.0005 BNB');

        const result = await trading.buyToken(
            '0xab50114166ad06793a10f2d1b9617cf906704444',
            0.0005,
            10
        );

        console.log('\nSuccess!');
        console.log('Transaction:', result);
    } catch (error) {
        console.error('\nError:', error.message);
        if (error.transaction) {
            console.log('\nTransaction data:', error.transaction.data);
        }
    }
}

testBuy();
