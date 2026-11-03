import { ethers } from 'ethers';

let contract;

function getContract(){
  if(contract) return contract;
  const {APZ_RPC_URL,APZ_ANCHOR_CONTRACT,APZ_ANCHOR_PRIVATE_KEY}=process.env;
  if(!APZ_RPC_URL||!APZ_ANCHOR_CONTRACT||!APZ_ANCHOR_PRIVATE_KEY) return null;

  const provider=new ethers.JsonRpcProvider(APZ_RPC_URL);
  const signer=new ethers.Wallet(APZ_ANCHOR_PRIVATE_KEY,provider);
  const abi=[
    "function anchorDocument(bytes32,string,string,uint256) returns (uint256)",
    "function verifyDocument(bytes32) view returns (bool,(bytes32,string,string,uint256,address,uint256))"
  ];
  contract=new ethers.Contract(APZ_ANCHOR_CONTRACT,abi,signer);
  return contract;
}

export async function anchorDocument({hash,slug,language,version}){
  const c=getContract();
  if(!c) return {anchored:false,reason:"chain_not_configured"};
  const tx=await c.anchorDocument(`0x${hash}`,slug,language,version);
  const receipt=await tx.wait();
  return {anchored:true,txHash:tx.hash,blockNumber:Number(receipt.blockNumber)};
}

export async function verifyDocument(hash){
  const c=getContract();
  if(!c) return {verified:false,reason:"chain_not_configured"};
  const [exists,anchor]=await c.verifyDocument(`0x${hash}`);
  return {
    verified:Boolean(exists),
    anchor:exists ? {
      documentHash:anchor[0],
      slug:anchor[1],
      language:anchor[2],
      version:Number(anchor[3]),
      submitter:anchor[4],
      timestamp:Number(anchor[5])
    } : null
  };
}
