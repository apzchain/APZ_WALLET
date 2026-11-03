package org.apz.wallet.proof

import android.app.Activity
import android.os.Bundle
import android.widget.TextView

class ProofActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val path = intent?.data?.path ?: ""
        val id = path.substringAfterLast('/').toLongOrNull()

        val view = TextView(this).apply {
            textSize = 18f
            setPadding(32, 48, 32, 48)
            text = if (id == null) {
                "APZ Proof: invalid document ID"
            } else {
                "APZ Proof #$id\n\nVerification can be started from the wallet UI."
            }
        }
        setContentView(view)
    }
}
