/* Translation safety checks. Run with node dev-checks/flowline-zh-parity.cjs. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
function load(file){const src=fs.readFileSync(path.resolve(__dirname,file),'utf8');const stub={addEventListener(){}};const c={console:{assert:(v,m)=>assert.ok(v,m)},document:{getElementById:()=>stub,addEventListener(){}},window:{matchMedia:()=>({matches:true}),addEventListener(){}},location:{search:''}};vm.createContext(c);const exposed='globalThis.g={SCENARIOS,PTS,STORE_KEY,CONTENT_VERSION,phaseMax,scenMax,freshState,newScenRecord,buildReply,scoreJudgment,tpl,setState(s){S=s;}};';vm.runInContext(src.replace(/titleScreen\(\);\s*\}\)\(\);\s*$/,exposed+'})();'),c);return c.g;}
const en=load('../docs/game.js'),zh=load('../docs/zh/game.js');
assert.equal(zh.CONTENT_VERSION,en.CONTENT_VERSION);assert.notEqual(zh.STORE_KEY,en.STORE_KEY);assert.equal(JSON.stringify(zh.PTS),JSON.stringify(en.PTS));
const semantic=new Set(['id','v','key','ok','type','best','kind','flag','sameAs','explainAs','evidenceHint','attemptSlot','route','expect','tol','needsData','provisional','trap','min']);
function parity(a,b,key='',loc='scenario'){
 assert.equal(typeof b,typeof a,loc+' type');
 if(a===null||typeof a==='number'||typeof a==='boolean')assert.equal(b,a,loc);
 else if(typeof a==='string'){if(semantic.has(key)&&(key!=='ok'||['accept','revise','reject'].includes(a)))assert.equal(b,a,loc);if(!['art','artT','icon'].includes(key))assert.equal(JSON.stringify((b.match(/\d+(?:\.\d+)?/g)||[]).sort()),JSON.stringify((a.match(/\d+(?:\.\d+)?/g)||[]).sort()),loc+' numeric content');}
 else if(Array.isArray(a)){assert.equal(b.length,a.length,loc+' length');a.forEach((x,i)=>parity(x,b[i],key,loc+'['+i+']'));}
 else if(a&&typeof a==='object'){assert.deepEqual(Object.keys(b).sort(),Object.keys(a).sort(),loc+' keys');for(const k of Object.keys(a))parity(a[k],b[k],k,loc+'.'+k);}
}
parity(en.SCENARIOS,zh.SCENARIOS);
let pairs=0,replies=0;
for(let i=0;i<en.SCENARIOS.length;i++){
 const es=en.SCENARIOS[i],zs=zh.SCENARIOS[i];assert.equal(zh.scenMax(zs),85);
 for(let j=0;j<es.C.claims.length;j++)for(let k=0;k<es.C.claims[j].reasons.length;k++)for(const verdict of ['accept','revise','reject']){assert.equal(JSON.stringify(zh.scoreJudgment(zs.C.claims[j],verdict,zs.C.claims[j].reasons[k])),JSON.stringify(en.scoreJudgment(es.C.claims[j],verdict,es.C.claims[j].reasons[k])));pairs++;}
 const state=zh.freshState();state.scens=zh.SCENARIOS.map(()=>zh.newScenRecord());zh.setState(state);const r=state.scens[i];
 for(let e=0;e<zs.A.ests.length;e++){r.attempt={estIdx:e,est:zs.A.ests[e].t,work:zs.A.ests[e].work,methodShort:zs.A.methods[0].short,ok:zs.A.ests[e].ok,provenance:'provided'};for(const route of ['direct','repaired','partial','asis','whole']){const result=zh.buildReply(zs.C,route,'中文测试请求');assert.ok(Object.isFrozen(result.reply.claims));result.reply.claims.forEach(c=>assert.ok(result.reply.text.includes(c.t),'reply must contain its actual judged claim'));replies++;}}
 r.attempt=null;r.status.A='given';
 for(const opt of [...zs.C.prompts,...zs.C.parts]){if(typeof opt.t==='string'){const t=zh.tpl(opt.t);assert.ok(!/(附上我的尝试|我的尝试（附上）|评析我的设定)/.test(t),'AI-delegated work must not become a learner attempt');}}
}
console.log(`PASS Chinese normalization, data/score parity, ${pairs} verdict-reason comparisons and ${replies} immutable replies; separate saved scores.`);
