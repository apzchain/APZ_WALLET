import {useEffect,useState} from 'react';

export default function Verify(){
 const [data,setData]=useState(null);
 const [err,setErr]=useState('');
 const id=typeof window!=='undefined'?window.location.pathname.split('/').pop():'';
 const api=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001';

 useEffect(()=>{
  if(!id)return;
  fetch(`${api}/api/public-proof/${id}`)
   .then(r=>r.ok?r.json():Promise.reject())
   .then(setData).catch(()=>setErr('Unable to verify proof'));
 },[id]);

 return <main className="container"><div className="card">
  <h1>APZ Verification</h1>
  {err&&<p>{err}</p>}
  {data&&<>
   <h2>{data.verification.valid?'✓ VERIFIED':'✕ NOT VERIFIED'}</h2>
   <p><b>Hash</b></p><code>{data.document.contentHash}</code>
   <p><b>Proof ID</b></p><code>{data.proofId}</code>
   {data.verification.chainEvent&&
    <pre>{JSON.stringify(data.verification.chainEvent,null,2)}</pre>}
  </>}
 </div></main>
}
