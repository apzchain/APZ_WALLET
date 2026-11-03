# APZ Proof of Publication v1

Proof payload contains:

- schema: `apz-proof-v1`
- document ID / slug / title
- language and version
- publication status
- SHA-256 content hash
- chain verification status
- Anchor ID
- transaction hash
- block number and timestamp
- contract address
- submitter
- deterministic `proofId`

The proof is intended to be public and contains no private keys or credentials.

## Verification URL

`/proof/:documentId`

## QR

`/qr/:documentId`

The QR points to the verification page, not directly to a wallet or signing flow.
