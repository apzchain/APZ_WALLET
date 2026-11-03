import express from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { contentHash } from '../lib/hash.js';
import { notifyAll } from '../notify/index.js';

const router = express.Router();
const languages = new Set(['fa','en','ku']);

router.get('/', async (req,res) => {
  const { language, status } = req.query;
  const clauses=[]; const values=[];
  if (language) { clauses.push(`language=$${values.length+1}`); values.push(language); }
  if (status) { clauses.push(`status=$${values.length+1}`); values.push(status); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const result = await query(
    `SELECT id,slug,language,title,status,version,content_hash,updated_at
     FROM documents ${where} ORDER BY updated_at DESC`,
    values
  );
  res.json(result.rows);
});

router.get('/:slug/:language', async (req,res) => {
  const result = await query(
    `SELECT * FROM documents WHERE slug=$1 AND language=$2
     ORDER BY version DESC LIMIT 1`,
    [req.params.slug, req.params.language]
  );
  if (!result.rows[0]) return res.status(404).json({error:'document_not_found'});
  res.json(result.rows[0]);
});

router.post('/', requireAuth, async (req,res) => {
  const {slug,title,content,language,status='draft'}=req.body||{};
  if (!slug || !title || !languages.has(language))
    return res.status(400).json({error:'slug_title_and_valid_language_required'});

  const hash=contentHash(content||'');
  const existing=await query(
    'SELECT COALESCE(MAX(version),0) AS version FROM documents WHERE slug=$1 AND language=$2',
    [slug,language]
  );
  const version=Number(existing.rows[0].version)+1;
  const result=await query(
    `INSERT INTO documents(slug,language,title,content,status,version,content_hash,author_id)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [slug,language,title,content||'',status,version,hash,req.user.sub]
  );
  const doc=result.rows[0];
  await query(
    `INSERT INTO audit_logs(document_id,actor_id,action,metadata)
     VALUES($1,$2,$3,$4)`,
    [doc.id,req.user.sub,'created',JSON.stringify({version,hash})]
  );
  res.status(201).json(doc);
});

router.post('/:id/status', requireAuth, async (req,res) => {
  const allowed=new Set(['draft','pending','approved','published','rejected']);
  const {status}=req.body||{};
  if(!allowed.has(status)) return res.status(400).json({error:'invalid_status'});

  const result=await query(
    'UPDATE documents SET status=$1,updated_at=now() WHERE id=$2 RETURNING *',
    [status,req.params.id]
  );
  if(!result.rows[0]) return res.status(404).json({error:'document_not_found'});
  const doc=result.rows[0];

  await query(
    `INSERT INTO audit_logs(document_id,actor_id,action,metadata)
     VALUES($1,$2,$3,$4)`,
    [doc.id,req.user.sub,'status_changed',JSON.stringify({status})]
  );

  if(status==='published') {
    await notifyAll(`APZ Docs published: ${doc.slug} [${doc.language}] v${doc.version}`);
  }

  res.json(doc);
});

export default router;
