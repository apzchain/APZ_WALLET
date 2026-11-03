import express from 'express';
import { query } from '../lib/db.js';

const router=express.Router();

router.get('/:id',async(req,res,next)=>{
  try{
    const d=await query('SELECT id,slug,language,version,content_hash,status FROM documents WHERE id=$1',[req.params.id]);
    const doc=d.rows[0];
    if(!doc) return res.status(404).json({error:'document_not_found'});

    const r=await query(
      `SELECT anchor_id,document_hash,slug,language,version,submitter,tx_hash,
              block_number,block_timestamp,contract_address,indexed_at
       FROM chain_events
       WHERE document_hash=$1 AND slug=$2 AND language=$3 AND version=$4
       ORDER BY block_number DESC LIMIT 1`,
      [doc.content_hash,doc.slug,doc.language,doc.version]
    );

    const event=r.rows[0]||null;
    res.json({
      valid:Boolean(event && event.document_hash.toLowerCase()===doc.content_hash.toLowerCase()),
      document:{
        id:doc.id,slug:doc.slug,language:doc.language,version:doc.version,
        status:doc.status,contentHash:doc.content_hash
      },
      chain:event ? {
        anchorId:event.anchor_id,
        txHash:event.tx_hash,
        blockNumber:Number(event.block_number),
        blockTimestamp:Number(event.block_timestamp),
        contractAddress:event.contract_address,
        submitter:event.submitter,
        indexedAt:event.indexed_at
      }:null
    });
  }catch(err){next(err)}
});

export default router;
