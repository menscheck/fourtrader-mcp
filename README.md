# FourTrader MCP Server - BNB Chain (Four.meme)

MCP (Model Context Protocol) server for trading Four.meme tokens on BNB Smart Chain. Enables AI assistants to interact with Four.meme through a standardized protocol.

## 🌟 Features

- **Four.meme Trading**: Buy and sell tokens on the Four.meme platform
- **Real-time Data**: Access prices, trades, and bonding curves via Bitquery API
- **Wallet Management**: Check BNB and token balances
- **Claude Integration**: Use directly with Claude for Desktop

## 📋 Prerequisites

- Node.js (v18+)
- TypeScript
- BNB wallet with private key
- Bitquery API key (for token data)
- Claude for Desktop (optional, for integration)

## 🚀 Installation

### 1. Clone/Create Project

\`\`\`bash
mkdir fourtrader-mcp
cd fourtrader-mcp
\`\`\`

### 2. Create Structure

\`\`\`
fourtrader-mcp/
├── src/
│   ├── server.ts
│   ├── providers/
│   │   ├── fourMeme.ts
│   │   └── bitqueryApi.ts
│   └── utils/
│       ├── config.ts
│       └── logger.ts
├── .env
├── package.json
├── tsconfig.json
└── mcp-startup.js
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Configure Environment

Copy \`.env.example\` to \`.env\` and fill in:

\`\`\`env
# Server Configuration
SERVER_NAME=fourtrader-mcp
SERVER_VERSION=1.0.0

# BNB Chain Configuration
WALLET_ADDRESS=0xYourWalletAddress
WALLET_PRIVATE_KEY=your_private_key_here
BNB_RPC_ENDPOINT=https://bsc-dataseed.binance.org/

# Four.meme Configuration
FOURMEME_CONTRACT_ADDRESS=0x5c952063c7fc8610FFDB798152D69F0B9550762b

# Bitquery API Configuration
BITQUERY_API_KEY=your_bitquery_key_here
BITQUERY_API_ENDPOINT=https://streaming.bitquery.io/graphql
\`\`\`

**⚠️ IMPORTANT:** 
- Get Bitquery API key from: https://bitquery.io/
- Never share your private key!

### 5. Build Project

\`\`\`bash
npm run build
\`\`\`

### 6. Start Server

\`\`\`bash
npm start
\`\`\`

## 🔧 Claude Desktop Configuration

To use the server with Claude for Desktop:

### 1. Find Configuration File

- **macOS**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`
- **Windows**: \`%APPDATA%\\Claude\\claude_desktop_config.json\`

### 2. Add Server

\`\`\`json
{
  "mcpServers": {
    "fourtrader": {
      "command": "node",
      "args": [
        "/full/path/to/fourtrader-mcp/mcp-startup.js"
      ],
      "cwd": "/full/path/to/fourtrader-mcp"
    }
  }
}
\`\`\`

**Replace \`/full/path/to/\` with your actual path!**

Example paths:
- macOS: \`/Users/username/Desktop/fourtrader-mcp\`
- Windows: \`C:\\\\Users\\\\username\\\\Desktop\\\\fourtrader-mcp\`

### 3. Restart Claude Desktop

Close completely and reopen Claude Desktop.

### 4. Verify Connection

Open Claude Desktop → Click settings icon (bottom left) → You should see "fourtrader" in the connected servers list.

## 🛠️ Available Tools

| Tool | Description | Parameters |
|------|-------------|-----------|
| \`get_token_info\` | Get detailed token information | \`address\` (string) |
| \`get_token_price\` | Get current token price | \`address\` (string) |
| \`get_recent_tokens\` | Get recent tokens on Four.meme | \`limit\` (number, optional) |
| \`get_bonding_curve_progress\` | Get bonding curve progress | \`address\` (string) |
| \`get_latest_trades\` | Get latest trades for a token | \`address\` (string), \`limit\` (number) |
| \`buy_token\` | Buy a token | \`address\`, \`bnbAmount\`, \`slippage\`, \`gasLimit\` |
| \`sell_token\` | Sell a token | \`address\`, \`tokenAmount\`, \`slippage\`, \`gasLimit\` |
| \`get_bnb_balance\` | Get wallet BNB balance | none |
| \`get_token_balance\` | Get balance of specific token | \`address\` (string) |

## 💬 Usage Examples with Claude

Once connected, you can ask Claude:

- "Show me recent tokens on Four.meme"
- "What's the price of token 0x..."
- "Buy 0.1 BNB of this token: 0x..."
- "What's my BNB balance?"
- "Show me the bonding curve progress for token 0x..."

## 🧪 Testing with MCP Inspector

To test the server before using with Claude:

\`\`\`bash
npx @modelcontextprotocol/inspector node build/server.js
\`\`\`

Open http://127.0.0.1:6274 in your browser and test the tools.

## 📚 Bitquery API

The project uses Bitquery to access Four.meme on-chain data:

- **Documentation**: https://docs.bitquery.io/docs/blockchain/BSC/four-meme-api/
- **Dashboard**: https://bitquery.io/
- **GraphQL Playground**: https://graphql.bitquery.io/

### Supported Queries

- Token metadata
- Real-time prices
- Trade history
- Bonding curve progress
- Liquidity events
- Newly created tokens

## 🔐 Security

⚠️ **WARNING**:

1. **Private Key**: Never share or commit to Git
2. **API Keys**: Keep your API keys secure
3. **Testnet**: Always test on testnet first (BSC Testnet)
4. **Amounts**: Start with small amounts for testing
5. **.env**: Add \`.env\` to \`.gitignore\`

\`\`\`bash
echo ".env" >> .gitignore
\`\`\`

## 🐛 Troubleshooting

### Server not connecting to Claude

1. Verify the path in \`claude_desktop_config.json\` is correct
2. Check logs: 
   - macOS: \`~/Library/Logs/Claude/mcp*.log\`
   - Windows: \`%APPDATA%\\Claude\\logs\\mcp*.log\`
3. Restart Claude Desktop completely

### "Bitquery API" errors

- Verify your API key is valid
- Check rate limits: https://bitquery.io/pricing
- Some data may not be available for all tokens

### "Insufficient funds" errors

- Ensure you have enough BNB in wallet
- Consider gas fees (approximately 0.001-0.005 BNB per transaction)

### Transaction failed

- Increase \`gasLimit\` in parameters
- Check that token exists and is tradeable
- Verify \`slippage\` (try increasing to 5-10% for volatile tokens)

## 📝 Important Notes

1. **Four.meme has no public REST API**: We use Bitquery to access on-chain data
2. **Smart Contract**: Four.meme address: \`0x5c952063c7fc8610FFDB798152D69F0B9550762b\`
3. **BNB Chain**: Always use BNB Smart Chain (BSC), not BNB Beacon Chain
4. **Gas Fees**: Transactions cost gas in BNB (typically 0.001-0.005 BNB)

## 🔄 Differences vs Solana Project

| Aspect | Solana (PumpFun) | BNB (Four.meme) |
|---------|------------------|-----------------|
| Blockchain | Solana | BNB Smart Chain |
| Library | @solana/web3.js | ethers.js |
| Data API | Moralis | Bitquery |
| Native Token | SOL | BNB |
| Gas Fees | ~0.00001 SOL | ~0.001-0.005 BNB |

## 🤝 Support

- **Bitquery Docs**: https://docs.bitquery.io/
- **Four.meme**: https://four.meme/
- **BNB Chain**: https://docs.bnbchain.org/
- **MCP Protocol**: https://modelcontextprotocol.io/

## 📄 License

MIT

## ⚠️ Disclaimer

This software is provided "as is". Cryptocurrency trading involves risks. Use at your own risk.
