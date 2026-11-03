# APZ Wallet Verification Engine 2.0

The verification pipeline is intentionally layered:

1. QR/deep-link parsing.
2. HTTPS Proof API retrieval.
3. Local document SHA-256 calculation.
4. Proof hash comparison.
5. APZ Chain RPC/contract verification.
6. Chain ID and contract policy checks.
7. Local proof cache.

Final status must only be `VERIFIED` when all required policy checks pass.

## Offline mode

Offline cache is informational only. A cached proof must be marked as
`cached` and must not be presented as a fresh chain confirmation.
