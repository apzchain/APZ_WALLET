package org.apz.wallet.proof

data class VerificationInput(
    val localDocumentBytes: ByteArray,
    val expectedContentHash: String,
    val proof: ApzProof
)

class VerificationEngine {
    fun verify(input: VerificationInput): ProofVerificationResult {
        val localHash="0x"+DocumentAnchorAbi.sha256Hex(input.localDocumentBytes)
        val hashMatch=localHash.equals(input.expectedContentHash,true)
        val proofHashMatch=localHash.equals(input.proof.document.contentHash,true)

        if(!hashMatch || !proofHashMatch) {
            return ProofVerificationResult(
                publicApiValid=input.proof.valid,
                nativeRpcValid=false,
                hashMatch=false,
                chainIdMatch=false,
                contractMatch=false,
                finalValid=false,
                reason="local_document_hash_mismatch"
            )
        }

        val chain=input.proof.chain
        val chainPresent=chain!=null
        return ProofVerificationResult(
            publicApiValid=input.proof.valid,
            nativeRpcValid=chainPresent,
            hashMatch=true,
            chainIdMatch=chainPresent,
            contractMatch=chainPresent,
            finalValid=input.proof.valid && chainPresent,
            reason=if(input.proof.valid && chainPresent) "verified" else "proof_not_anchored"
        )
    }
}
