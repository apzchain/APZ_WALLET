import {useState} from 'react';

export default function Approvals(){
  const [token,setToken]=useState('');
  const [message,setMessage]=useState('');
  const api=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001';

  async function login(e){
    e.preventDefault();
    const form=new FormData(e.currentTarget);
    const r=await fetch(`${api}/api/auth/login`,{
      method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({email:form.get('email'),password:form.get('password')})
    });
    const data=await r.json();
    if(data.token){setToken(data.token);setMessage('Authenticated');}
    else setMessage(data.error||'Login failed');
  }

  return <main className="container">
    <h1>APZ Approval Center</h1>
    {!token ? <form className="card" onSubmit={login}>
      <input name="email" placeholder="Email" defaultValue="admin@apz.local"/>
      <input name="password" type="password" placeholder="Password"/>
      <button>Login</button><p>{message}</p>
    </form> : <div className="card"><h2>Ready</h2><p>{message}. Use the REST API to review and publish documents.</p></div>}
  </main>
}
