(() => {
 const $ = id => document.getElementById(id);
 const KEYS = 'apz.wallet.network.v1';
 let provider = null, signer = null, address = null, rpcProvider = null, toastTimer;
 const defaults = { name:'', rpcUrl:'', chainId:'', symbol:'APZ', explorerUrl:'' };
 function toast(msg){ const el=$('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),3200); }
 function log(msg){ const el=$('activity'); if(el.classList.contains('empty')) el.classList.remove('empty'); const row=document.createElement('div'); row.className='info'; row.textContent=new Date().toLocaleTimeString()+' — '+msg; el.prepend(row); }
 function getSettings(){ try{return {...defaults,...JSON.parse(localStorage.getItem(KEYS)||'{}')}}catch{return {...defaults}} }
 function putSettings(s){localStorage.setItem(KEYS,JSON.stringify(s));}
 function fillSettings(){const s=getSettings(); $('networkName').value=s.name; $('rpcUrl').value=s.rpcUrl; $('chainId').value=s.chainId; $('tokenSymbol').value=s.symbol; $('explorerUrl').value=s.explorerUrl; $('symbol').textContent=s.symbol||'APZ';}
 function readSettings(){return {name:$('networkName').value.trim(),rpcUrl:$('rpcUrl').value.trim(),chainId:$('chainId').value.trim(),symbol:$('tokenSymbol').value.trim()||'APZ',explorerUrl:$('explorerUrl').value.trim()};}
 function toggle(id){$(id).classList.toggle('hidden')}
 function validHttpUrl(s){try{const u=new URL(s);return u.protocol==='https:'||u.protocol==='http:'}catch{return false}}
 async function connect(){
  if(!window.ethereum){toast('کیف پول سازگار مانند MetaMask نصب نیست.');return;}
  try{provider=new ethers.BrowserProvider(window.ethereum); const accounts=await provider.send('eth_requestAccounts',[]); if(!accounts.length) throw new Error('حسابی انتخاب نشد'); signer=await provider.getSigner(); address=ethers.getAddress(accounts[0]); $('address').textContent=address; $('connectBtn').textContent='متصل شد'; $('walletChain').textContent=String((await provider.getNetwork()).chainId); toast('کیف پول متصل شد'); log('اتصال کیف پول'); await refresh();}
  catch(e){toast('اتصال انجام نشد: '+(e.shortMessage||e.message||'خطای ناشناخته'));}
 }
 async function refresh(){
  const s=getSettings(); $('symbol').textContent=s.symbol||'APZ';
  try{
   if(!s.rpcUrl){$('networkStatus').textContent='RPC تنظیم نشده';$('rpcStatus').textContent='تنظیم نشده';$('blockNumber').textContent='—'; if(!address)$('balance').innerHTML='— <small>'+(s.symbol||'APZ')+'</small>'; return;}
   if(!validHttpUrl(s.rpcUrl)) throw new Error('آدرس RPC باید URL معتبر http/https باشد.');
   rpcProvider=new ethers.JsonRpcProvider(s.rpcUrl);
   const net=await rpcProvider.getNetwork();
   if(s.chainId && BigInt(s.chainId)!==net.chainId) throw new Error('Chain ID پاسخ RPC با مقدار تنظیم‌شده برابر نیست.');
   const block=await rpcProvider.getBlockNumber(); $('blockNumber').textContent=String(block); $('rpcStatus').textContent='متصل'; $('networkStatus').textContent=(s.name||'شبکه سفارشی')+' · Chain ID '+net.chainId; $('lastCheck').textContent=new Date().toLocaleTimeString();
   if(address){const bal=await rpcProvider.getBalance(address); $('balance').innerHTML=ethers.formatEther(bal)+' <small>'+(s.symbol||'APZ')+'</small>';}
  }catch(e){$('rpcStatus').textContent='خطا';$('networkStatus').textContent='اتصال شبکه ناموفق';$('rpcResult').textContent=e.message; toast('خطای RPC: '+e.message);}
 }
 $('connectBtn').addEventListener('click',connect); $('refreshBtn').addEventListener('click',refresh); $('sendToggle').addEventListener('click',()=>toggle('sendPanel')); $('settingsToggle').addEventListener('click',()=>toggle('settingsPanel'));
 $('receiveBtn').addEventListener('click',()=>{if(!address){toast('ابتدا کیف پول را متصل کنید.');return;} $('address').scrollIntoView({behavior:'smooth',block:'center'}); toast('آدرس عمومی شما در بخش کیف پول نمایش داده شده است.');});
 $('copyAddress').addEventListener('click',async()=>{if(!address)return toast('ابتدا کیف پول را متصل کنید.');try{await navigator.clipboard.writeText(address);toast('آدرس کپی شد.')}catch{toast('کپی خودکار در این محیط پشتیبانی نمی‌شود.')}});
 $('saveSettingsBtn').addEventListener('click',async()=>{const s=readSettings();if(s.rpcUrl&&!validHttpUrl(s.rpcUrl))return toast('URL مربوط به RPC معتبر نیست.');if(s.chainId&&(!/^\d+$/.test(s.chainId)||BigInt(s.chainId)<=0n))return toast('Chain ID باید عدد صحیح مثبت باشد.');putSettings(s);$('symbol').textContent=s.symbol;toast('تنظیمات در دستگاه ذخیره شد.');log('ذخیره تنظیمات شبکه');await refresh();});
 $('testRpcBtn').addEventListener('click',async()=>{const s=readSettings();if(!s.rpcUrl||!validHttpUrl(s.rpcUrl))return toast('ابتدا RPC معتبر وارد کنید.');try{const p=new ethers.JsonRpcProvider(s.rpcUrl);const n=await p.getNetwork();const b=await p.getBlockNumber();if(s.chainId&&BigInt(s.chainId)!==n.chainId)throw new Error('Chain ID مغایر است: RPC='+n.chainId);$('rpcResult').textContent='موفق — Chain ID: '+n.chainId+'، بلاک: '+b;toast('اتصال RPC موفق بود.');}catch(e){$('rpcResult').textContent='ناموفق: '+e.message;toast('آزمایش RPC ناموفق بود.');}});
 $('sendBtn').addEventListener('click',async()=>{try{if(!window.ethereum||!signer||!address)throw new Error('ابتدا کیف پول خارجی را متصل کنید.');const to=ethers.getAddress($('toAddress').value.trim());const amount=$('amount').value.trim();if(!amount||!Number.isFinite(Number(amount))||Number(amount)<=0)throw new Error('مقدار باید عددی مثبت باشد.');const s=getSettings();if(!s.rpcUrl||!validHttpUrl(s.rpcUrl))throw new Error('ابتدا RPC معتبر شبکه را در تنظیمات وارد کنید.');if(!s.chainId)throw new Error('برای ایمنی، ابتدا Chain ID رسمی را در تنظیمات وارد کنید.');rpcProvider=new ethers.JsonRpcProvider(s.rpcUrl);const walletNet=await provider.getNetwork();if(walletNet.chainId!==BigInt(s.chainId))throw new Error('کیف پول روی Chain ID پیکربندی‌شده نیست. شبکه را در کیف پول بررسی کنید.');const rpcNet=await rpcProvider.getNetwork();if(rpcNet.chainId!==BigInt(s.chainId))throw new Error('Chain ID RPC با تنظیمات سازگار نیست.');if(!confirm('ارسال '+amount+' '+s.symbol+' به آدرس زیر را در کیف پول بررسی کنید؟\n'+to+'\nبررسی نهایی را در پنجره کیف پول انجام دهید.'))return;const tx=await signer.sendTransaction({to,value:ethers.parseEther(amount)});log('تراکنش ارسال شد: '+tx.hash);toast('تراکنش ارسال شد؛ منتظر تأیید شبکه بمانید.');const item=document.createElement('div');item.className='info';if(s.explorerUrl){const a=document.createElement('a');a.href=s.explorerUrl.replace(/\/$/,'')+'/tx/'+tx.hash;a.target='_blank';a.rel='noopener noreferrer';a.textContent='مشاهده تراکنش در Explorer';item.appendChild(a);}else item.textContent='Hash: '+tx.hash;$('activity').prepend(item);await tx.wait();log('تراکنش تأیید شد: '+tx.hash);toast('تراکنش تأیید شد.');await refresh();}catch(e){toast(e.shortMessage||e.message||'ارسال ناموفق بود.');}});
 if(window.ethereum){window.ethereum.on?.('accountsChanged',()=>location.reload());window.ethereum.on?.('chainChanged',()=>location.reload());}
 fillSettings(); if('serviceWorker' in navigator && location.protocol!=='file:') navigator.serviceWorker.register('./service-worker.js').catch(()=>{}); refresh();
})();
