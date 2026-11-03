import {useState} from 'react';

export default function Anchors(){
  const [id,setId]=useState('');
  const [token,setToken]=useState('');
  const [result,setResult]=useState(null);
  const api=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001';

  async function anchor(){
    const r=await fetch(`${api}/api/anchors/${id}`,{
      method:'POST',headers:{Authorization:`Bearer ${token}`}
    });
    setResult(await r.json());
  }

  return <main className="container">
    <h1>APZ Chain Anchor</h1>
    <div className="card">
      <input placeholder="JWT token" value={token} onChange={e=>setToken(e.target.value)}/>
      <input placeholder="Document ID" value={id} onChange={e=>setId(e.target.value)}/>
      <button onClick={anchor}>Anchor document hash</button>
      {result && <pre>{JSON.stringify(result,null,2)}</pre>}
    </div>
  </main>
}
