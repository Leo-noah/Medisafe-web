const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../frontend/login.js'),'utf8');
class Element extends EventTarget {
  hidden=false;disabled=false;textContent='';className='';dataset={};attributes={};
  setAttribute(k,v){this.attributes[k]=v}
}
function setup({configured=true,initialUser=null,popupError=null}={}) {
  const ids=['entry-screen','account-screen','google-button','google-label','signout-button','retry-button','status','account-name','account-email','account-avatar'];
  const el=Object.fromEntries(ids.map(id=>[id,new Element()]));
  const langs=['en','my'].map(language=>Object.assign(new Element(),{dataset:{language}}));
  const document={documentElement:{lang:'en'},title:'',getElementById:id=>el[id],
    querySelectorAll:selector=>selector==='[data-language]'?langs:[]};
  const stored=new Map([['medisafe-language','en'],['medisafe-personal-medicines-v1','keep records']]);
  const calls=[],navigations=[];
  let callback;
  const maliciousName='<img src=x onerror=alert(1)>';
  const sdk={
    getApps:()=>[],initializeApp:config=>({config}),getAuth:()=>({}),browserLocalPersistence:'LOCAL',
    setPersistence:async(auth,kind)=>calls.push(['persistence',kind]),
    GoogleAuthProvider:class{setCustomParameters(p){calls.push(['provider',p])}},
    onAuthStateChanged:(auth,handler)=>{
      callback=handler;queueMicrotask(()=>handler(initialUser));return()=>{};
    },
    signInWithPopup:async()=>{
      calls.push(['popup']);if(popupError)throw {code:popupError};
      const user={displayName:maliciousName,email:'test@example.com'};callback(user);return{user};
    },
    signOut:async()=>{calls.push(['signout']);callback(null)}
  };
  let code=source;
  if(!configured) code=code.replace(/apiKey:\s*"[^"]+"/, 'apiKey: "YOUR_FIREBASE_API_KEY"');
  if(configured) {
    code=code.replaceAll('YOUR_FIREBASE_API_KEY','test-api-key')
      .replaceAll('YOUR_PROJECT_ID','test-project').replaceAll('YOUR_FIREBASE_APP_ID','test-app');
    const start=code.indexOf('  async function loadSDK() {');
    const end=code.indexOf('  async function initialize()',start);
    code=code.slice(0,start)+'  async function loadSDK() { return window.mockSDK; }\n\n'+code.slice(end);
  }
  const window={mockSDK:sdk,location:{assign:url=>navigations.push(url)}};
  const context=vm.createContext({window,document,localStorage:{getItem:k=>stored.get(k)??null,setItem:(k,v)=>stored.set(k,v)},
    console:{error(){}},setTimeout,clearTimeout,queueMicrotask,Error});
  vm.runInContext(code,context);
  return{el,langs,calls,navigations,stored,maliciousName,click:id=>el[id].dispatchEvent(new Event('click'))};
}
const settle=async()=>{for(let i=0;i<10;i++)await new Promise(setImmediate)};
(async()=>{
  const missing=setup({configured:false});await settle();
  assert(missing.el['google-button'].disabled);assert(missing.el.status.textContent.includes('not been configured'));
  assert.equal(missing.navigations.length,0,'never simulate login with no configuration');
  const h=setup();await settle();
  assert(!h.el['google-button'].disabled);assert(h.el['account-screen'].hidden);
  assert(h.calls.some(c=>c[0]==='persistence'&&c[1]==='LOCAL'));
  h.click('google-button');await settle();
  assert.deepEqual(h.navigations,['./my-medicines.html']);
  assert.equal(h.el['account-name'].textContent,h.maliciousName,'untrusted profile uses textContent');
  h.click('signout-button');await settle();
  assert(h.el['account-screen'].hidden);assert(!h.el['entry-screen'].hidden);
  assert.equal(h.stored.get('medisafe-personal-medicines-v1'),'keep records');
  const restored=setup({initialUser:{displayName:'Noah',email:'n@example.com'}});await settle();
  assert(!restored.el['account-screen'].hidden);assert.equal(restored.navigations.length,0,'existing session shows account/logout');
  restored.langs[1].dispatchEvent(new Event('click'));
  assert.equal(restored.stored.get('medisafe-language'),'my');
  const closed=setup({popupError:'auth/popup-closed-by-user'});await settle();closed.click('google-button');await settle();
  assert.equal(closed.navigations.length,0);assert(closed.el.status.textContent.includes('cancelled'));assert(!closed.el['google-button'].disabled);
  const domain=setup({popupError:'auth/unauthorized-domain'});await settle();domain.click('google-button');await settle();
  assert(domain.el.status.textContent.includes('address'));assert.equal(domain.navigations.length,0);
  const html=fs.readFileSync(path.join(__dirname,'../frontend/login.html'),'utf8');
  assert(!html.includes('identifier-form')&&!html.includes('otp-form')&&!html.includes('123456'));
  for(const id of ['google-button','google-label','signout-button','retry-button','entry-screen','account-screen','account-name','account-email','account-avatar','status'])
    assert.equal(html.split(`id="${id}"`).length-1,1,'unique '+id);
  console.log('PASS: setup guard, persistent auth initialization, Google success, cancellation, domain errors, existing-session account view, safe profile text, bilingual UI and non-destructive sign-out. OAuth calls mocked; real Firebase setup still required.');
})().catch(error=>{console.error(error);process.exitCode=1});
