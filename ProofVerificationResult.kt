package org.apz.wallet.proof

data class ProofVerificationResult(
    val publicApiValid: Boolean,
    val nativeRpcValid: Boolean,
    val hashMatch: Boolean,
    val chainIdMatch: Boolean,
    val contractMatch: Boolean,
    val finalValid: Boolean,
    val reason: String
)
