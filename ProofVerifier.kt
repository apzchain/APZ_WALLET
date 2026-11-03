package org.apz.wallet.proof

import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class ProofVerifier(private val apiBase: String) {
    fun verify(documentId: Long): ApzProof {
        val url = URL("$apiBase/api/public-proof/$documentId")
        val c = url.openConnection() as HttpURLConnection
        c.requestMethod = "GET"
        c.connectTimeout = 8000
        c.readTimeout = 8000

        if (c.responseCode !in 200..299)
            error("Proof API returned HTTP ${c.responseCode}")

        val root = JSONObject(c.inputStream.bufferedReader().use { it.readText() })
        val d = root.getJSONObject("document")
        val verification = root.getJSONObject("verification")

        val chain = if (!verification.isNull("chainEvent")) {
            val x = verification.getJSONObject("chainEvent")
            ChainEvent(
                x.getString("anchorId"),
                x.getString("txHash"),
                x.getLong("blockNumber"),
                x.getLong("blockTimestamp"),
                x.getString("contractAddress"),
                x.getString("submitter")
            )
        } else null

        return ApzProof(
            root.getString("schema"),
            ProofDocument(
                d.getLong("id"),
                d.getString("slug"),
                d.getString("title"),
                d.getString("language"),
                d.getInt("version"),
                d.getString("status"),
                d.getString("contentHash")
            ),
            verification.getBoolean("valid"),
            chain
        )
    }
}
