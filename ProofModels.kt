package org.apz.wallet.proof

data class ProofDocument(
    val id: Long,
    val slug: String,
    val title: String,
    val language: String,
    val version: Int,
    val status: String,
    val contentHash: String
)

data class ChainEvent(
    val anchorId: String,
    val txHash: String,
    val blockNumber: Long,
    val blockTimestamp: Long,
    val contractAddress: String,
    val submitter: String
)

data class ApzProof(
    val schema: String,
    val document: ProofDocument,
    val valid: Boolean,
    val chain: ChainEvent?
)
