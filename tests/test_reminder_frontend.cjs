const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../frontend/medicine-push.js'),'utf8');
const KEY='medisafe-personal-medicines-v1';
function setup(storage=new Map(),permission='granted') {
  const window=new EventTarget(), document=new EventTarget();
  const submitCapture=[];
  const form={addEventListener(type,handler,capture){if(type==='submit'&&capture)submitCapture.push(handler)}};
  const status={textContent:'',classList:{toggle(){}}};
  document.getElementById=id=>id==='medicine-form'?form:id==='mp-form-status'?status:null;
  document.documentElement={lang:'en'};document.baseURI='https://example.com/my-medicines.html';document.hidden=false;
  let prompts=0,fail=false;
  const Notification={permission,requestPermission(){
    prompts++; Notification.permission='granted'; return Promise.resolve('granted');
  }};
  Object.assign(window,{isSecureContext:true,Notification,PushManager:function(){}});
  const subscription={options:{},toJSON:()=>({endpoint:'https://fcm.googleapis.com/fake'})};
  const registration={pushManager:{getSubscription:async()=>subscription}};
  const calls=[];
  const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
  const context=vm.createContext({window,document,localStorage,Notification,console,URL,crypto:webcrypto,
    Uint8Array,atob,AbortController,setTimeout,clearTimeout,queueMicrotask,Intl,Error,
    navigator:{serviceWorker:{register:async()=>registration,ready:Promise.resolve(registration)}},
    MutationObserver:class{observe(){}},
    validStoredData:v=>Array.isArray(v.medicines)&&Array.isArray(v.logs),
    fetch:async(url,options)=>{
      if (String(url).endsWith('.json')) return {ok:true,json:async()=>({medicines:[]})};
      calls.push({url,method:options.method,body:options.body?JSON.parse(options.body):null});
      if(fail&&options.method==='PUT')throw new Error('offline');
      return {ok:true,json:async()=>url.endsWith('/config')?{publicKey:'AQID'}:{ok:true}};
    }
  });
  vm.runInContext(source,context);
  return {window,document,Notification,status,calls,storage,get prompts(){return prompts},setFail(v){fail=v},
    save(value,fromForm=false){
      if(fromForm)for(const callback of submitCapture)callback();
      localStorage.setItem(KEY,JSON.stringify(value));
      window.dispatchEvent(new Event('medisafe:medicines-updated'));
    }};
}
const settle=async()=>{for(let i=0;i<15;i++)await new Promise(setImmediate)};
(async()=>{
  const saved={medicines:[{id:'one',name:'ပါရာစီတမော',dose:'500 mg',notes:'private',
    startDate:'2026-11-26',endDate:'',times:['11:00']}],logs:[]};
  const h=setup(new Map(),'default'); await settle();
  assert.equal(h.calls.length,0,'blank page must not subscribe');
  assert.equal(h.prompts,0,'page load must never ask permission');
  h.save(saved,true);
  assert.equal(h.prompts,1,'permission is requested synchronously in successful Save gesture');
  await settle();
  assert(h.calls.some(c=>c.url.endsWith('/subscription')));
  assert(h.calls.some(c=>c.method==='PUT'),'Save medicine automatically syncs');
  const med=h.calls.find(c=>c.method==='PUT').body.medicines[0];
  assert.equal(med.nameEn,'Paracetamol');assert.equal(med.nameMy,'ပါရာစီတမော');assert.equal(med.dose,'500 mg');
  assert(!JSON.stringify(h.calls.filter(c=>c.method==='PUT')[0].body).includes('private'));
  saved.medicines[0].times=['11:05'];h.save(saved,true);await settle();
  assert.equal(h.prompts,1,'Save changes must not ask permission again');
  assert.equal(h.calls.filter(c=>c.method==='PUT').at(-1).body.medicines[0].times[0],'11:05');
  saved.logs=[{medicineId:'one',date:'2026-11-26',time:'11:05'}];h.save(saved);await settle();
  assert.equal(h.calls.filter(c=>c.method==='PUT').at(-1).body.logs.length,1,'Mark taken syncs');
  const reload=setup(h.storage);await settle();
  assert(reload.calls.some(c=>c.method==='PUT'),'refresh restores without extra buttons');
  assert.equal(reload.prompts,0);
  reload.setFail(true);reload.save(saved,true);await settle();
  assert(reload.status.textContent.includes('could not be sent'));
  reload.setFail(false);reload.window.dispatchEvent(new Event('online'));await settle();
  assert(reload.status.textContent.includes('saved'));
  reload.save({medicines:[],logs:[]});await settle();
  assert.equal(reload.calls.filter(c=>c.method==='PUT').at(-1).body.medicines.length,0,'delete last record cancels schedule');
  const blocked=setup(new Map(),'denied');blocked.save(saved,true);await settle();
  assert.equal(blocked.prompts,0);assert.equal(blocked.calls.length,0);
  assert(blocked.status.textContent.includes('blocked'));
  const existing=setup(new Map([[KEY,JSON.stringify(saved)]]));await settle();
  assert(existing.calls.some(c=>c.method==='PUT'),'existing records + granted permission auto restore');
  console.log('PASS: bilingual name and dose payload, no notes, automatic Save/changes/taken/refresh, permissions and offline recovery.');
})().catch(e=>{console.error(e);process.exitCode=1});
