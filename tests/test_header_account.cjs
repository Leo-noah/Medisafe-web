const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

class Element extends EventTarget {
  constructor(tag = 'div') {
    super(); this.tag = tag; this.children = []; this.attributes = {};
    this.style = {}; this.className = ''; this.textContent = ''; this.hidden = false;
    this.classList = {
      contains: name => this.className.split(' ').includes(name),
      toggle: (name, value) => {
        const names = new Set(this.className.split(' ').filter(Boolean));
        if (value) names.add(name); else names.delete(name);
        this.className = [...names].join(' ');
      }
    };
  }
  append(...children) { for (const child of children) { child.parent = this; this.children.push(child); } }
  after(child) { this.parent.append(child); }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  remove() { this.parent.children = this.parent.children.filter(child => child !== this); }
  setAttribute(key, value) { this.attributes[key] = value; }
  removeAttribute(key) { delete this.attributes[key]; }
  contains(target) { return target === this || this.children.some(child => child.contains(target)); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const matches = child => selector === 'span' ? child.tag === 'span' :
      selector === '[data-nav-label]' ? 'data-nav-label' in child.attributes : false;
    return this.children.flatMap(child => [...(matches(child) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  closest() { return null; }
  focus() {}
  showModal() { this.open = true; }
  close() { this.open = false; this.dispatchEvent(new Event('close')); }
  click() { if (!this.disabled) this.dispatchEvent(new Event('click')); }
}
const body = new Element('body');
const signIn = new Element('a');
signIn.className = 'header-signin'; signIn.href = 'https://example.com/login.html';
const signInLabel = new Element('span'); signInLabel.textContent = 'Sign in';
signIn.append(signInLabel); body.append(signIn);
const document = new EventTarget();
Object.assign(document, {
  readyState: 'complete', documentElement: {lang: 'en'}, body,
  baseURI: 'https://example.com/my-medicines.html',
  createElement: tag => new Element(tag),
  querySelector: selector => selector === '.site-header .header-signin' ? signIn : null,
  querySelectorAll: selector => selector === '.site-header a[href]' ? [signIn] : []
});
const profile = {displayName: 'Noah', email: 'n@example.com', photoURL: ''};
const session = new Map([['medisafe-header-profile-v1', JSON.stringify(profile)]]);
const local = new Map([['medisafe-personal-medicines-v1', 'keep medicines']]);
const storage = map => ({getItem: key => map.get(key) ?? null, setItem: (key,value) => map.set(key,value), removeItem: key => map.delete(key)});
let listener;
let signouts = 0;
const auth = {authStateReady: async () => {}};
const mockAppSDK = {getApps: () => [], initializeApp: () => ({})};
const mockAuthSDK = {
  getAuth: () => auth,
  onAuthStateChanged: (_, callback) => { listener = callback; queueMicrotask(() => callback(profile)); },
  signOut: async () => { signouts++; listener(null); }
};
const window = new EventTarget();
window.location = {href: document.baseURI};
const context = vm.createContext({window,document,Element,Node:{TEXT_NODE:3},URL,
  sessionStorage: storage(session),localStorage: storage(local),
  MutationObserver: class {observe(){} disconnect(){}},
  setTimeout,clearTimeout,queueMicrotask,console,mockAppSDK,mockAuthSDK
});
let source = fs.readFileSync(__dirname + '/../frontend/top-navigation.js','utf8');
source = source.replace(/import\(\s*"https:\/\/www\.gstatic\.com\/firebasejs\/13\.4\.0\/firebase-app\.js"\s*\)/g,'Promise.resolve(mockAppSDK)')
  .replace(/import\(\s*"https:\/\/www\.gstatic\.com\/firebasejs\/13\.4\.0\/firebase-auth\.js"\s*\)/g,'Promise.resolve(mockAuthSDK)');
vm.runInContext(source, context);
const walk = node => [node, ...node.children.flatMap(walk)];
const find = className => walk(body).find(node => node.classList.contains(className));
assert.equal(find('header-account-name').textContent,'Noah','cached name renders synchronously');
assert.equal(signIn.style.display,'none');
const settle = async () => { for (let i=0;i<8;i++) await new Promise(setImmediate); };
(async () => {
  await settle();
  find('header-account').click();
  assert.equal(find('header-account-panel').hidden,false);
  find('header-account-logout').click();
  const dialog = walk(body).find(node => node.tag === 'dialog');
  assert(dialog?.open, 'logout must show an on-page confirmation');
  assert.equal(signouts,0);
  dialog.children.at(-1).children[0].click();
  await settle();
  assert.equal(signouts,0,'Cancel must preserve session');
  find('header-account').click();
  find('header-account-logout').click();
  walk(body).find(node => node.tag === 'dialog').children.at(-1).children[1].click();
  await settle();
  assert.equal(signouts,1);
  assert.equal(session.has('medisafe-header-profile-v1'),false);
  assert.equal(find('header-account-wrap').hidden,true);
  assert.equal(signIn.style.visibility,'visible');
  assert.equal(local.get('medisafe-personal-medicines-v1'),'keep medicines');
  console.log('PASS: instant cached profile, account menu, visible confirmation, Cancel, confirmed sign-out, cache clear, Sign in restored, medicines preserved. Firebase mocked.');
})().catch(error => {console.error(error);process.exitCode=1;});
