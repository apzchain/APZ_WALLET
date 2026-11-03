package org.apz.wallet.proof

import java.security.MessageDigest

object DocumentAnchorAbi {
    // Function selector = first 4 bytes of keccak256("verifyDocument(bytes32)").
    // Keccak implementation should be supplied by the app's audited crypto dependency.
    const val VERIFY_DOCUMENT_SIGNATURE = "verifyDocument(bytes32)"

    fun normalizeHash(hash:String):String =
        hash.removePrefix("0x").lowercase().padStart(64,'0')

    fun sha256Hex(bytes:ByteArray):String =
        MessageDigest.getInstance("SHA-256").digest(bytes)
            .joinToString("") { "%02x".format(it) }
}
