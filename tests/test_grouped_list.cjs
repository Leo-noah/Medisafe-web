const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.textContent = ''; this.attributes = {}; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this.attributes[key] = value; }
}
const elements = new Map();
const clicked = [];
const a = {id:'a',name:'ပါရာစီတမော',dose:'500 mg',startDate:'2026-11-26',endDate:'2026-11-30',times:['12:18'],notes:''};
const b = {...a,id:'b',name:'Ibuprofen'};
const context = vm.createContext({
  Map, Set, Intl, console, language:'en', state:{medicines:[a,b],logs:[{medicineId:'a',date:'2026-11-26',time:'12:18',takenAt:'original'}]},
  list:new Element('list'),
  document:{createElement:tag=>new Element(tag),getElementById:id=>{
    if(!elements.has(id)) elements.set(id,new Element(id));
    return elements.get(id);
  }},
  formatDate:value=>value, t:key=>key,
  activeToday:medicine=>medicine.startDate<='2026-11-26' && (!medicine.endDate || medicine.endDate>='2026-11-26'),
  takenToday:(id,time)=>context.state.logs.some(log=>log.medicineId===id && log.time===time && log.date==='2026-11-26'),
  persist:next=>{context.state=next;return true;}, showStatus:()=>{},
  todayKey:()=> '2026-11-26', renderProgress:()=>{},
  editMedicine:()=>{}, deleteMedicine:()=>{},
  toggleTaken:(medicine,time)=>clicked.push([medicine.id,time]),
  makeButton:(text,handler,className)=>{
    const button = new Element('button');
    Object.assign(button,{textContent:text,handler,className});
    return button;
  },
  fetch:()=>new Promise(()=>{})
});
const source=fs.readFileSync(__dirname+'/../frontend/my-medicines.js','utf8');
vm.runInContext(source.slice(source.indexOf('const medicineDisplayNames'),source.indexOf('function renderLanguage()')),context);
function walk(element) { return [element,...element.children.flatMap(walk)]; }
function byClass(name) { return walk(context.list).filter(e=>e.className?.split(' ').includes(name)); }
context.renderList();
assert.equal(context.list.children.length,1);
assert.equal(byClass('grouped-shared-dates').length,1);
assert.equal(byClass('grouped-time').length,1);
assert.equal(walk(context.list).filter(e=>e.tag==='h3')[0].textContent,'Paracetamol');
assert.equal(byClass('card-dose')[0].textContent,'500 mg');
const buttons = byClass('taken-button');
assert.equal(buttons[0].attributes['aria-pressed'],'true');
assert.equal(buttons[1].attributes['aria-pressed'],'false');
buttons[1].handler();
assert.deepEqual(clicked,[['b','12:18']]);
byClass('group-mark-taken')[0].handler();
assert.equal(context.state.logs.length,2);
assert.equal(context.state.logs[0].takenAt,'original');
assert.equal(context.state.logs[1].medicineId,'b');
assert.equal(byClass('group-mark-taken')[0].disabled,true);
context.markGroupTaken('12:18');
assert.equal(context.state.logs.length,2);
context.language='my'; context.renderList();
assert.equal(walk(context.list).filter(e=>e.tag==='h3')[1].textContent,'အိုင်ဗျူပရိုဖန်');
b.endDate='2026-12-01'; context.renderList();
assert.equal(byClass('grouped-shared-dates').length,0);
assert.equal(byClass('card-dates').length,2);
a.times=['12:18','18:00']; context.renderList();
assert.equal(context.list.children.length,2);
assert.equal(elements.get('medicine-count').textContent,'၂');
assert.equal(a.name,'ပါရာစီတမော');
context.state.medicines.push({...b,id:'future',startDate:'2026-12-01'});
context.markGroupTaken('18:00');
assert.equal(context.state.logs.at(-1).medicineId,'a');
assert.equal(context.state.logs.some(log=>log.medicineId==='future'),false);
const before = context.state.logs;
context.persist=()=>false;
context.state.logs=[];
context.markGroupTaken('12:18');
assert.equal(context.state.logs.length,0);
context.state.medicines=[]; context.renderList();
assert.equal(context.list.children.length,0);
assert.equal(elements.get('empty-state').hidden,false);
console.log('PASS: bilingual names, separate dose, grouped dates/times, individual actions, mark-all preserves taken logs, no duplicates, excludes future schedules, only selected time, disabled completed group, storage failure.');
