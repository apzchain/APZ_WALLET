package org.apz.wallet.proof

object ProofShare {
    fun verificationUrl(baseUrl: String, documentId: Long): String =
        "$baseUrl/proof/$documentId"

    fun qrUrl(baseUrl: String, documentId: Long): String =
        "$baseUrl/qr/$documentId"
}
