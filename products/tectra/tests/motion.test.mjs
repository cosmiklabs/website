import test from 'node:test';
import assert from 'node:assert/strict';
import {initMotion} from '../assets/motion.mjs';
function fixture({reduced=false, observer=true, broken=false}={}) {
  class Element {
    constructor(parent=null) {this.parent=parent;this.attributes=new Map();this.listeners={};this.hidden=true;}
    setAttribute(k,v){this.attributes.set(k,v);}
    getAttribute(k){return this.attributes.get(k)??null;}
    removeAttribute(k){this.attributes.delete(k);}
    closest(selector){if(selector==='.motion-control')return label; return this.reveal?this:this.parent?.closest(selector);}
    querySelectorAll(){return items.filter(item=>item.parent===this);}
    addEventListener(name,fn){this.listeners[name]=fn;}
  }
  const root=new Element(), label=new Element(root), control=new Element(label);
  const items=Array.from({length:4},()=>{const item=new Element(root);item.reveal=true;return item;});
  const media={matches:reduced,addEventListener(name,fn){this.change=fn;}};
  let intersection,mutation;
  const win={
    matchMedia:()=>media,location:{hash:''},listeners:{},
    getComputedStyle(item){
      let current=item, mode='system';
      while(current){if(current.getAttribute('data-motion')){mode=current.getAttribute('data-motion');break;}current=current.parent;}
      return {getPropertyValue:()=>mode==='reduce'||mode==='system'&&media.matches?'0ms':'140ms'};
    },
    addEventListener(name,fn){this.listeners[name]=fn;},
    MutationObserver:class{constructor(fn){mutation=fn;}observe(){}}
  };
  if(observer)win.IntersectionObserver=class {
    constructor(fn){intersection=fn;}
    observe(){if(broken)throw Error('Observer failed');}
    unobserve(){} disconnect(){}
  };
  const doc={documentElement:root,querySelector:()=>control,querySelectorAll:()=>items,
    listeners:{},addEventListener(name,fn){this.listeners[name]=fn;},getElementById:id=>id==='section'?items[0]:null};
  return {root,items,control,label,doc,win,media,
    start:()=>initMotion(win,doc),pending:item=>item.attributes.has('data-reveal-pending'),
    choose(mode){control.value=mode;control.listeners.change();},
    os(value){media.matches=value;media.change();},
    mutate:()=>mutation(), intersect:item=>intersection([{target:item,isIntersecting:true}])};
}
test('System observes live OS reduction and reveals pending content',()=>{
 const f=fixture();f.start();assert.ok(f.items.every(f.pending));f.os(true);assert.ok(f.items.every(item=>!f.pending(item)));f.os(false);assert.ok(f.items.every(item=>!f.pending(item)),'revealed items never hide again');
});
test('explicit Full wins over OS Reduce, Reduce is static, and control is accessible',()=>{
 const f=fixture({reduced:true});f.root.setAttribute('data-motion','full');f.start();assert.equal(f.control.value,'full');assert.equal(f.label.hidden,false);assert.ok(f.items.every(f.pending));f.os(true);assert.ok(f.items.every(f.pending));f.choose('reduce');assert.equal(f.root.getAttribute('data-motion'),'reduce');assert.ok(f.items.every(item=>!f.pending(item)));
});
test('nearest scope wins, including System within Full and Full within Reduce',()=>{
 const f=fixture({reduced:true});f.root.setAttribute('data-motion','full');
 f.items[0].setAttribute('data-motion','system');f.items[1].setAttribute('data-motion','reduce');f.start();
 assert.equal(f.pending(f.items[0]),false);assert.equal(f.pending(f.items[1]),false);assert.equal(f.pending(f.items[2]),true);
 f.root.setAttribute('data-motion','reduce');f.items[2].setAttribute('data-motion','full');f.mutate();
 assert.equal(f.pending(f.items[2]),true);assert.equal(f.pending(f.items[3]),false);
});
test('missing or failing observer leaves every section visible',()=>{
 for(const options of [{observer:false},{broken:true}]){const f=fixture(options);f.start();assert.ok(f.items.every(item=>!f.pending(item)));}
});
test('intersection, focus and anchor navigation reveal destinations permanently',()=>{
 const f=fixture();f.start();f.intersect(f.items[1]);assert.equal(f.pending(f.items[1]),false);
 f.doc.listeners.focusin({target:f.items[2]});assert.equal(f.pending(f.items[2]),false);
 f.win.location.hash='#section';f.win.listeners.hashchange();assert.equal(f.pending(f.items[0]),false);
 f.choose('full');assert.equal(f.pending(f.items[0]),false);
});
test('invalid preference cannot set a motion scope',()=>{
 const f=fixture();f.start();f.choose('invalid');assert.equal(f.root.getAttribute('data-motion'),null);
});
