import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import net from 'node:net';
const organization = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sites = [
 {repo:'website',name:'Cosmik',port:4191},
 {repo:'website-tectra',name:'Tectra',port:4192},
 {repo:'website-hplx',name:'HPLX',port:4193},
];
const env = {...process.env, COSMIK_URL:'http://127.0.0.1:4191/', TECTRA_URL:'http://127.0.0.1:4192/', HPLX_URL:'http://127.0.0.1:4193/'};
delete env.SITE_URL; delete env.SOCIAL_PREVIEW;
const available = port => new Promise((resolve,reject)=>{const socket=net.createServer();socket.once('error',reject);socket.listen(port,'127.0.0.1',()=>socket.close(resolve));});
for(const site of sites){
 site.cwd=path.join(organization,site.repo);
 if(!existsSync(path.join(site.cwd,'scripts/build.mjs'))) throw new Error(`Missing sibling checkout: ${site.repo}`);
 try{await available(site.port);}catch{throw new Error(`Port ${site.port} is already in use. Stop the existing preview before starting the review.`);}
}
for(const site of sites){
 await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['scripts/build.mjs'],{cwd:site.cwd,env,stdio:'inherit'});
  child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(new Error(`${site.name} build failed`)));
 });
}
const children=[];
let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;for(const child of children)child.kill('SIGTERM');process.exitCode=code;}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
for(const site of sites){
 const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:site.cwd,env:{...env,PORT:String(site.port)},stdio:'inherit'});
 children.push(child);child.once('error',error=>{console.error(error.message);stop(1);});child.once('exit',code=>{if(!stopping)stop(code??1);});
}
console.log('\nLocal marketing review (not published):');
for(const site of sites)console.log(`${site.name}: http://127.0.0.1:${site.port}/`);
console.log('Ctrl+C stops all three previews.');
