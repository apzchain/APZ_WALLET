package org.apz.wallet.proof

import org.json.JSONObject
import java.io.File

class ProofCache(private val file: File) {
    fun save(proof: ApzProof) {
        val root=JSONObject()
            .put("schema",proof.schema)
            .put("valid",proof.valid)
            .put("documentHash",proof.document.contentHash)
            .put("slug",proof.document.slug)
            .put("language",proof.document.language)
            .put("version",proof.document.version)
        proof.chain?.let {
            root.put("txHash",it.txHash)
            root.put("blockNumber",it.blockNumber)
            root.put("contractAddress",it.contractAddress)
            root.put("anchorId",it.anchorId)
        }
        file.writeText(root.toString())
    }

    fun load(): JSONObject? =
        if(file.exists()) JSONObject(file.readText()) else null
}
