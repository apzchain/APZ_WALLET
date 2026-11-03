import express from 'express';
import { requireAuth } from '../lib/auth.js';
import { notifyAll } from '../notify/index.js';

const router=express.Router();

router.post('/', requireAuth, async (req,res)=>{
  const {message}=req.body||{};
  if(!message) return res.status(400).json({error:'message_required'});
  res.json(await notifyAll(message));
});

export default router;
