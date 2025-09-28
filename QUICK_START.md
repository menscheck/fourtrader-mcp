# 🚀 Quick Start Guide - FourTrader MCP

## Step 1: Initial Setup

\`\`\`bash
# Create project folder
mkdir fourtrader-mcp
cd fourtrader-mcp

# Initialize npm
npm init -y

# Create folder structure
mkdir -p src/providers src/utils

# Install dependencies
npm install @modelcontextprotocol/sdk ethers axios dotenv winston zod
npm install --save-dev typescript @types/node
\`\`\`

## Step 2: Create Files

### 1. Copy content from provided files:

Copy all files with the correct names and locations:

**Root folder (\`fourtrader-mcp/\`):**
- \`package.json\`
- \`tsconfig.json\`
- \`mcp-startup.js\`
- \`.env\`
- \`.gitignore\`
- \`README.md\`
- \`QUICK_START.md\`

**Source folder (\`fourtrader-mcp/src/\`):**
- \`server.ts\`

**Providers folder (\`fourtrader-mcp/src/providers/\`):**
- \`bitqueryApi.ts\`
- \`fourMeme.ts\`

**Utils folder (\`fourtrader-mcp/src/utils/\`):**
- \`config.ts\`
- \`logger.ts\`

### 2. Configure .env file

Edit \`.env\` with your real data:

\`\`\`env
WALLET_ADDRESS=0xYourWalletAddress
WALLET_PRIVATE_KEY=your_private_key
BITQUERY_API_KEY=your_bitquery_key
\`\`\`

**⚠️ Keep the rest as is!**

## Step 3: Get Bitquery API Key

1. Go to: https://bitquery.io/
2. Sign up (free plan available!)
3. Navigate to: https://account.bitquery.io/user/api_v1/api_keys
4. Copy your API key
5. Paste it in the \`.env\` file

## Step 4: Build and Test

\`\`\`bash
# Compile the project
npm run build

# Start the server
npm start
\`\`\`

**If you see:** \`"FourTrader MCP Server for BNB Chain started successfully"\` → **Success!** ✅

## Step 5: Integrate with Claude Desktop

### macOS:

\`\`\`bash
# Open configuration file
nano ~/Library/Application\\ Support/Claude/claude_desktop_config.json
\`\`\`

### Windows:

\`\`\`bash
# Open configuration file
notepad %APPDATA%\\Claude\\claude_desktop_config.json
\`\`\`

### Add this configuration:

\`\`\`json
{
  "mcpServers": {
    "fourtrader": {
      "command": "node",
      "args": [
        "/FULL/PATH/TO/fourtrader-mcp/mcp-startup.js"
      ],
      "cwd": "/FULL/PATH/TO/fourtrader-mcp"
    }
  }
}
\`\`\`

**⚠️ CRITICAL:** Replace \`/FULL/PATH/TO/\` with your actual folder path!

**To find your path:**

\`\`\`bash
# On macOS/Linux:
cd ~/Desktop/fourtrader-mcp
pwd

# On Windows (Command Prompt):
cd Desktop\\fourtrader-mcp
cd
\`\`\`

**Example paths:**
- macOS: \`/Users/yourusername/Desktop/fourtrader-mcp\`
- Windows: \`C:\\\\Users\\\\yourusername\\\\Desktop\\\\fourtrader-mcp\`

## Step 6: Restart Claude

1. **Completely close** Claude Desktop (not just minimize)
2. Reopen Claude Desktop
3. Click the ⚙️ settings icon (bottom left corner)
4. Look for "fourtrader" in the connected servers list

**If you see "fourtrader"** → **You're ready to go!** 🎉

## 🧪 Quick Tests with Claude

Try asking Claude these commands:

\`\`\`
"Show me recent tokens on Four.meme"

"What's my BNB balance?"

"Give me information about token 0x..."

"What's the current price of token 0x..."

"Show me the bonding curve progress for token 0x..."
\`\`\`

## 🔍 Quick Debugging

### Problem: Server won't start

\`\`\`bash
# Check for build errors
npm run build

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Node.js version (must be 18+)
node --version
\`\`\`

### Problem: Claude doesn't see the server

\`\`\`bash
# Verify Claude logs
# macOS:
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows:
# Navigate to: %APPDATA%\\Claude\\logs\\
# Open the latest mcp-*.log file
\`\`\`

**Common issues:**
- Wrong path in \`claude_desktop_config.json\`
- Forgot to restart Claude Desktop completely
- Server didn't build successfully

### Problem: Bitquery API errors

1. Verify API key is correct in \`.env\` file
2. Check your Bitquery account limits
3. Test API directly at: https://graphql.bitquery.io/

### Problem: "Cannot find module" errors

\`\`\`bash
# Make sure you're in the project folder
cd ~/Desktop/fourtrader-mcp

# Rebuild
npm run build
\`\`\`

## 📝 Useful Commands

\`\`\`bash
# Build the project
npm run build

# Start the server
npm start

# Clean build folder and rebuild
npm run clean
npm run rebuild

# Test with MCP Inspector (visual testing tool)
npx @modelcontextprotocol/inspector node build/server.js
\`\`\`

## ⚡ Pro Tips

1. **Start small**: Test with tiny amounts (0.01 BNB) first
2. **Use testnet**: Switch to BSC Testnet for risk-free testing
   - Change \`BNB_RPC_ENDPOINT\` in \`.env\` to testnet RPC
3. **Monitor gas**: Always keep extra BNB for gas fees (0.001-0.005 BNB)
4. **Backup keys**: Save your private key in a secure password manager
5. **Never commit secrets**: Double-check \`.env\` is in \`.gitignore\`

\`\`\`bash
# Add these to .gitignore if not already there
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
echo "build/" >> .gitignore
\`\`\`

## 🎯 Next Steps

Once everything is working:

1. ✅ **Test thoroughly**: Execute small test transactions
2. ✅ **Explore tools**: Try all available commands
3. ✅ **Monitor performance**: Check Bitquery dashboard for API usage
4. ✅ **Customize**: Modify code to fit your specific needs
5. ✅ **Stay updated**: Check for updates to dependencies

## 🆘 Need Help?

### Documentation:
- **Bitquery Docs**: https://docs.bitquery.io/
- **Four.meme**: https://four.meme/
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Ethers.js**: https://docs.ethers.org/

### Common Resources:
- **BNB Chain Docs**: https://docs.bnbchain.org/
- **BSC Testnet Faucet**: https://testnet.bnbchain.org/faucet-smart
- **BSCScan Explorer**: https://bscscan.com/

### Troubleshooting Checklist:
- [ ] Node.js version 18 or higher installed
- [ ] All dependencies installed (\`npm install\`)
- [ ] Project built successfully (\`npm run build\`)
- [ ] \`.env\` file exists with correct values
- [ ] Wallet has sufficient BNB for gas
- [ ] Bitquery API key is valid
- [ ] Claude Desktop fully restarted
- [ ] Correct path in \`claude_desktop_config.json\`

---

**Happy trading! 🚀📈**

*Remember: Cryptocurrency trading is risky. Only invest what you can afford to lose. This tool is for educational purposes. Always do your own research.*
