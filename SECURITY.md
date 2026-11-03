# Security notes

- Never ask users to paste private keys or recovery phrases into support channels.
- No private key is persisted by this application. Transaction signing is delegated to the connected wallet.
- Verify RPC URL and chain ID against official APZ documentation before use.
- A malicious RPC can lie about balances, blocks, and transaction state. Use a trusted endpoint.
- Review dependency integrity, bundle dependencies locally, enable a strict Content Security Policy, and conduct independent testing before production release.
- The current UI is a development starter, not a security-audited wallet.
