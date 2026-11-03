# Native Wallet Verification v6

Wallet verification is split into two independent checks:

1. Public Proof API check.
2. Direct EVM RPC check.

The wallet must require:
- expected HTTPS proof endpoint
- expected APZ Chain ID
- expected DocumentAnchor contract
- matching document SHA-256
- successful `verifyDocument(bytes32)` call

A successful web response alone is not cryptographic proof.

The native verifier in this scaffold intentionally does not hard-code a fake
function selector. The production implementation must generate the selector
from the exact deployed ABI, or use a trusted ABI library.
