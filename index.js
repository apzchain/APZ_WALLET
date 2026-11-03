import {useEffect,useState} from 'react';

export default function Home(){
  const [docs,setDocs]=useState([]);
  const api=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001';

  useEffect(()=>{fetch(`${api}/api/docs`).then(r=>r.json()).then(setDocs).catch(()=>setDocs([]));},[]);

  return <main className="container">
    <header><span className="badge">APZ</span><h1>Markdown Documentation Dashboard</h1>
    <p>Multilingual documentation • review • approval • publishing</p></header>
    <section className="grid">
      {docs.map(d=><article className="card" key={d.id}>
        <small>{d.language.toUpperCase()} · v{d.version}</small>
        <h2>{d.title}</h2><p>{d.slug}</p><strong>{d.status}</strong>
      </article>)}
      {!docs.length && <article className="card"><h2>No documents yet</h2><p>Login to the API and create the first document.</p></article>}
    </section>
  </main>
}
