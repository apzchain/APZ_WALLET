package org.apz.wallet.proof

import android.net.Uri

object ProofDeepLink {
    fun documentId(uri: Uri): Long? {
        val segments=uri.pathSegments ?: return null
        if(segments.size<2) return null
        if(segments[segments.size-2]!="proof") return null
        return segments.last().toLongOrNull()
    }
}
