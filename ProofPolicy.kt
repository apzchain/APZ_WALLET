package org.apz.wallet.proof

data class ProofPolicy(
    val expectedChainId: String,
    val expectedContract: String,
    val requireHttps: Boolean = true
) {
    fun validateUrl(url: String): Boolean {
        return !requireHttps || url.startsWith("https://", ignoreCase = true)
    }

    fun validateContract(contract: String): Boolean =
        contract.equals(expectedContract, ignoreCase = true)
}
