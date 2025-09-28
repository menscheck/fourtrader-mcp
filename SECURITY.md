# Security Policy

## 🔐 Security Best Practices

### Private Keys
- **NEVER** commit private keys to Git
- **NEVER** share private keys with anyone
- Store keys in `.env` file (already in `.gitignore`)
- Use hardware wallets for large amounts
- Create separate wallets for testing vs production

### API Keys
- Keep Bitquery API keys private
- Regenerate keys if accidentally exposed
- Monitor API usage on Bitquery dashboard
- Use environment variables, never hardcode

### Wallet Security
- Always test with small amounts first
- Use testnet for development
- Keep extra BNB for gas fees
- Double-check addresses before transactions
- Review transaction details before confirming

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. **DO NOT** disclose publicly until fixed
3. Email the maintainers privately
4. Provide detailed information

## ⚠️ Known Risks

### Smart Contract Risks
- Four.meme smart contract is not audited by us
- Tokens on Four.meme may be scams or rug pulls
- Always DYOR (Do Your Own Research)
- Never invest more than you can afford to lose

### Trading Risks
- High volatility in memecoin markets
- Possible slippage on trades
- Gas fees can be unpredictable

## 🛡️ Security Checklist

- [ ] Private keys stored securely (not in code)
- [ ] `.env` file is in `.gitignore`
- [ ] API keys are not hardcoded
- [ ] Tested on testnet first
- [ ] Error handling implemented
- [ ] Transaction limits in place

## ⚖️ Disclaimer

This software is provided "as is" without warranty. Users are responsible for securing their private keys and understanding trading risks.

**USE AT YOUR OWN RISK**
