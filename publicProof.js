import express from 'express';
import crypto from 'node:crypto';
import { query } from '../lib/db.js';

const router=express.Router();

router.get('/:id',async(req,res,next)=>{
  try{
    const d=await query(
      'SELECT id,slug,language,title,version,status,content_hash,updated_at FROM documents WHERE id=$1',
      [req.params.id]
    );
    const doc=d.rows[0];
    if(!doc) return res.status(404).json({error:'document_not_found'});

    const r=await query(
      `SELECT anchor_id,document_hash,tx_hash,block_number,block_timestamp,
              contract_address,submitter
       FROM chain_events
       WHERE document_hash=$1 AND slug=$2 AND language=$3 AND version=$4
       ORDER BY block_number DESC LIMIT 1`,
      [doc.content_hash,doc.slug,doc.language,doc.version]
    );
    const chainEvent=r.rows[0]||null;
    const valid=Boolean(chainEvent &&
      chainEvent.document_hash.toLowerCase()===doc.content_hash.toLowerCase());

    const payload={
      schema:"apz-proof-v1",
      document:{
        id:doc.id,slug:doc.slug,title:doc.title,language:doc.language,
        version:doc.version,status:doc.status,contentHash:doc.content_hash
      },
      verification:{
        valid,
        chainEvent:chainEvent?{
          anchorId:String(chainEvent.anchor_id),
          txHash:chainEvent.tx_hash,
          blockNumber:Number(chainEvent.block_number),
          blockTimestamp:Number(chainEvent.block_timestamp),
          contractAddress:chainEvent.contract_address,
          submitter:chainEvent.submitter
        }:null
      }
    };

    const canonical=JSON.stringify(payload);
    const proofId=crypto.createHash('sha256').update(canonical).digest('hex');
    res.json({...payload,proofId});
  }catch(err){next(err)}
});

export default router;
