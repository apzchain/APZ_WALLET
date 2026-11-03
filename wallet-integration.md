# APZ Wallet Integration

APZ Wallet can verify a public Proof without possessing a signing key.

## Deep link

`https://<proof-host>/proof/<documentId>`

## Export endpoint

`GET /api/proof-export/<documentId>.json`

The response is designed for native wallet clients.

A production wallet should additionally validate:
1. HTTPS certificate.
2. Expected APZ Chain ID.
3. Expected DocumentAnchor contract address.
4. SHA-256 content hash.
5. On-chain event/contract response.

Never treat a UI status alone as cryptographic proof.
