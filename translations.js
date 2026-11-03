import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';

const router=express.Router();

router.get('/:slug', async (req,res)=>{
  const result=await query(
    `SELECT language,title,status,version,content_hash,updated_at
     FROM documents WHERE slug=$1 ORDER BY language,version DESC`,
    [req.params.slug]
  );
  res.json(result.rows);
});

router.get('/:slug/diff', requireAuth, async (req,res)=>{
  const {language='fa',from=1,to} = req.query;
  const versions=await query(
    `SELECT version,content FROM documents
     WHERE slug=$1 AND language=$2 AND version IN ($3,$4)
     ORDER BY version`,
    [req.params.slug,language,from,to]
  );
  res.json({slug:req.params.slug,language,versions:versions.rows});
});

export default router;
