package org.apz.wallet.proof

data class ProofQrPayload(
    val url:String,
    val documentId:Long?
)

object ProofQrPayloadParser {
    fun parse(raw:String):ProofQrPayload {
        val clean=raw.trim()
        val id=Regex("/proof/(\\d+)(?:$|[/?#])").find(clean)?.groupValues?.get(1)?.toLongOrNull()
        return ProofQrPayload(clean,id)
    }
}
