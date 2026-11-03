import express from 'express';

const router=express.Router();

router.get('/',(req,res)=>{
  res.json({
    schema:'apz-chain-config-v1',
    chainId:process.env.APZ_CHAIN_ID||'',
    rpcUrl:process.env.APZ_PUBLIC_RPC_URL||'',
    anchorContract:process.env.APZ_ANCHOR_CONTRACT||'',
    proofApi:process.env.APZ_PUBLIC_PROOF_API||'/api/public-proof'
  });
});

export default router;
