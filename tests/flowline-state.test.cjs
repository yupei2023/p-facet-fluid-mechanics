/* Dependency-free regression checks. Run: node dev-checks/flowline-state.test.cjs */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const filename = path.join(__dirname, '../docs/game.js');
const source = fs.readFileSync(filename, 'utf8');
const stub = {addEventListener(){}};
const context = {
  console: {assert(value, message){assert.ok(value, message);}},
  document: {getElementById(){return stub;}, addEventListener(){}},
  window: {matchMedia(){return {matches:true};}, addEventListener(){}},
  location: {search:''},
};
vm.createContext(context);
const exposed = `globalThis.checks = {SCENARIOS, PTS, phaseMax, scenMax, buildReply, newScenRecord,
  freshState, tpl, creditFor, integrationCredit, judgmentStats, dimensionsFor, scoreJudgment, planFields,
  setState(state){S=state;}};`;
assert.ok(/titleScreen\(\);\s*\}\)\(\);\s*$/.test(source), 'startup anchor');
vm.runInContext(source.replace(/titleScreen\(\);\s*\}\)\(\);\s*$/, exposed+'\n})();'), context);
const g = context.checks;
let checks = 0;
function check(name, fn){fn(); checks++; console.log('PASS '+name);}
function fixture(index){
  const state = g.freshState();
  state.scen = index;
  state.scens = g.SCENARIOS.map(()=>g.newScenRecord());
  const r = state.scens[index];
  const sc = g.SCENARIOS[index];
  const i = sc.A.ests.findIndex(x=>x.ok);
  r.attempt = {id:'a1',estIdx:i,est:sc.A.ests[i].t,work:sc.A.ests[i].work,ok:true,methodOk:true,provenance:'provided'};
  r.attempts.push(r.attempt);
  g.setState(state);
  return {state,r,sc};
}
const ALL = g.SCENARIOS.map((_,i)=>i);
/* One scenario, two claims in E: P 8 + F 12 + A 16 + C 15 + E 20 + T 14. */
check('the game is one scenario with a declared maximum of 85',()=>{
  assert.equal(g.SCENARIOS.length, 1);
  assert.equal(JSON.stringify(g.SCENARIOS.map(g.scenMax)), '[85]');
  assert.equal(g.SCENARIOS[0].C.claims.length, 2);
  assert.equal(g.SCENARIOS[0].C.wholeClaims.length, 2);
  assert.equal(g.phaseMax(g.SCENARIOS[0],'E'), 20);
});
check('every claim carries exactly three reasons',()=>{
  const sc = g.SCENARIOS[0];
  sc.C.claims.concat(sc.C.wholeClaims).forEach(c=>assert.equal(c.reasons.length, 3, c.id));
});
check('one of the two judged claims is the planted free-jet error',()=>{
  const sc = g.SCENARIOS[0];
  for(const list of [sc.C.claims, sc.C.wholeClaims]){
    const planted = list.filter(c=>c.type!=='ok');
    assert.equal(planted.length, 1);
    assert.equal(planted[0].type, 'assumption');
    assert.equal(planted[0].best, 'reject');
    assert.ok(/free jet at atmospheric pressure/.test(planted[0].t), planted[0].id);
  }
});
check('the wrong reply reproduces its own printed product for 488 L/s',()=>{
  const sc = g.SCENARIOS[0];
  const texts = [sc.C.claims[1].t, sc.C.wholeClaims[1].t, sc.C.whole, sc.outside.A];
  texts.forEach(t=>{
    if(!/488 L\/s/.test(t)) return;
    assert.ok(/0\.01767 × 27\.6 = 0\.488/.test(t), 'printed factors must reproduce 0.488: '+t.slice(0,60));
  });
  assert.ok(Math.abs(0.01767*27.6 - 0.488) < 0.0005);
});
check('direct and repaired requests share one bounded credit',()=>{
  for(const i of ALL){
    const {r}=fixture(i); r.promptFinal='bnd';
    assert.equal(g.creditFor('C'),15); r.repaired=true;
    assert.equal(g.creditFor('C'),15);
    r.promptFinal='leaky'; r.partial=true; assert.equal(g.creditFor('C'),8);
  }
});
check('every reply route judges its actual immutable text',()=>{
  for(const i of ALL) for(const route of ['direct','repaired','partial','asis','whole']){
    const {r,sc}=fixture(i);
    for(let e=0;e<sc.A.ests.length;e++){
      r.attempt.estIdx=e; r.attempt.est=sc.A.ests[e].t;
      const before=JSON.stringify(sc);
      const result=g.buildReply(sc.C,route,'A test request');
      assert.ok(Object.isFrozen(result.reply.claims));
      result.reply.claims.forEach(c=>{
        assert.ok(result.reply.text.includes(c.t), sc.id+' '+route+' missing '+c.id);
        assert.ok(Object.isFrozen(c.reasons[0]));
      });
      assert.equal(JSON.stringify(sc),before);
      assert.ok(result.reply.claims.filter(c=>!c.unsolicited).length*10<=g.phaseMax(sc,'E'));
    }
  }
});
check('a wrong estimate is critiqued in the sound claim\'s slot, and the planted count holds',()=>{
  const {r,sc}=fixture(0);
  for(let e=0;e<sc.A.ests.length;e++){
    r.attempt.estIdx=e; r.attempt.est=sc.A.ests[e].t; r.attempt.ok=!!sc.A.ests[e].ok;
    const claims=g.buildReply(sc.C,'direct','A test request').reply.claims;
    assert.equal(claims.length, 2);
    assert.equal(claims.filter(c=>c.type!=='ok').length, 1);
    if(!sc.A.ests[e].ok) assert.ok(claims[0].t.includes(sc.A.ests[e].t), 'the critique must quote the recorded estimate');
  }
});
check('a sound reason paired with the wrong verdict is not a demonstrated check',()=>{
  const {r,sc}=fixture(0); const c=sc.C.claims[1];
  const reason=c.reasons.find(x=>x.kind==='valid_evidence');
  const grade=g.scoreJudgment(c,'accept',reason);
  assert.equal(grade.pairOK,false);
  r.judgments=[{pass:1,claimId:c.id,claimType:c.type,reasonKind:reason.kind,credited:grade.pairOK,canonical:grade.vOK}];
  assert.equal(g.judgmentStats(r).valid,0);
  assert.equal(g.judgmentStats(r).mismatched,1);
  assert.equal(g.dimensionsFor(r,sc).find(x=>x.id==='checks').state,'no');
});
check('evidence can support either reject or revise for the uninvited recommendation',()=>{
  const {r,sc}=fixture(0);
  const uninv=g.buildReply(sc.C,'asis','A leaky request').reply.claims.find(c=>c.unsolicited);
  assert.ok(uninv, 'a leaky route must append the uninvited recommendation');
  const held=uninv.reasons.find(x=>x.flag==='unsupported');
  assert.equal(JSON.stringify(held.ok),JSON.stringify(['reject','revise']));
  const scope=uninv.reasons.find(x=>x.flag==='outside_scope');
  assert.equal(JSON.stringify(scope.ok),JSON.stringify(['reject']));
  assert.equal(g.creditFor('E'),0, 'the uninvited recommendation is never point-scored');
});
check('a recommendation that is provisional or short of data never certifies final constraints',()=>{
  const {r,sc}=fixture(0);
  r.tInteg.first={idx:0,ok:true,text:'a provisional pick',provisional:true};
  assert.equal(g.dimensionsFor(r,sc).find(x=>x.id==='constraints').state,'partial');
  r.tInteg.first={idx:0,ok:true,text:'data requested first',needsData:true};
  assert.equal(g.dimensionsFor(r,sc).find(x=>x.id==='constraints').state,'na');
  const wrong=sc.T.opts.findIndex(x=>!x.ok);
  r.tInteg.first={idx:wrong,ok:false,text:sc.T.opts[wrong].t};
  assert.equal(g.dimensionsFor(r,sc).find(x=>x.id==='constraints').state,'no');
});
check('the transfer twist keeps the over-correction as its trap',()=>{
  const sc=g.SCENARIOS[0];
  const trap=sc.T.opts.find(x=>x.trap);
  assert.ok(trap && !trap.ok);
  assert.ok(/will not use it at the butt/.test(trap.t));
  assert.equal(sc.T.opts.filter(x=>x.ok).length,1);
});
check('typing after an example records an entry without claiming independent production',()=>{
  const {r,sc}=fixture(0); r.attempt.provenance='learner';r.attempt.work='my steps';
  const d=g.dimensionsFor(r,sc).find(x=>x.id==='attempt');
  assert.equal(d.state,'yes');
  assert.match(d.text,/independent derivation not assessed/);
});
check('first-pass and repaired judgments cannot farm E points',()=>{
  const {r,sc}=fixture(0);
  const id=sc.C.claims[0].id;
  r.judgments=[{claimId:id,pass:1,pts:1},{claimId:id,pass:2,pts:10},{claimId:id,pass:2,pts:10}];
  assert.equal(g.creditFor('E'),6);
  r.judgments.push({claimId:id,pass:1,pts:10});
  assert.equal(g.creditFor('E'),10);
});
check('unsuccessful T repair keeps initial credit and still earns transfer credit',()=>{
  const {r}=fixture(0);r.tInteg={first:{ok:false},repaired:{ok:false}};
  assert.equal(g.creditFor('T'),3);
  r.tTransfer={v:'best'}; assert.equal(g.creditFor('T'),9);
  r.tInteg.repaired.ok=true; assert.equal(g.creditFor('T'),12);
});
/* The three blocking defects the review panel found, each pinned so it cannot come back. */
check('typing before the full example still records scaffolded unassessed work',()=>{
  const {r,sc}=fixture(0);
  r.attempt.provenance='learner'; r.attempt.work='my steps'; r.attempt.beforeWorkedExample=true; r.attempt.scaffolded=true; r.attempt.textAssessment='not assessed';
  assert.equal(g.dimensionsFor(r,sc).find(x=>x.id==='attempt').state,'yes');
});
check('all practice checkpoints can be met without claiming independent mastery',()=>{
  const {r,sc}=fixture(0);
  r.attempt.provenance='learner'; r.attempt.work='my steps'; r.attempt.beforeWorkedExample=true; r.attempt.scaffolded=true; r.attempt.textAssessment='not assessed';
  r.promptFinal='bnd';
  const claims=sc.C.claims;
  r.eClaims=claims.map(c=>({id:c.id,type:c.type,best:c.best,unsolicited:false}));
  r.judgments=claims.map(c=>({claimId:c.id,pass:1,verdict:c.best,reasonKind:'valid_evidence',credited:true,canonical:true,claimType:c.type,pts:10}));
  const okT=sc.T.opts.findIndex(o=>o.ok && !o.needsData && !o.provisional);
  assert.ok(okT>=0,'the scenario needs a fully sound T option');
  r.tInteg={first:{idx:okT,ok:true,text:sc.T.opts[okT].t},repaired:null};
  const dims=g.dimensionsFor(r,sc);
  const inPlay=dims.filter(d=>d.state!=='na');
  assert.ok(inPlay.length>0);
  /* join, not deepEqual: arrays built inside the vm realm have that realm's Array.prototype. */
  assert.equal(inPlay.filter(d=>d.state!=='yes').map(d=>d.id+'='+d.state).join(', '), '',
    'a clean run must leave no dimension short of "yes"; the Chief rank gate requires it');
});
check('the debrief and the results screen count dimensions over the same denominator',()=>{
  const {r,sc}=fixture(0);
  r.promptFinal='bnd';
  const dims=g.dimensionsFor(r,sc);
  /* debriefScreen and resultsScreen both drop "not applicable" rows before counting; if one of them
     ever divides by dims.length again, the same run reports two different totals. */
  const shown=dims.filter(d=>d.state!=='na');
  assert.ok(shown.length<=dims.length);
  assert.equal(shown.filter(d=>d.state==='na').length, 0);
  const src=source;
  assert.ok(/dimsShown\s*=\s*dimsAll\.filter/.test(src), 'resultsScreen must build dimsShown by dropping na rows');
  assert.ok(!/\/\s*'\+dimsAll\.length\+'\s*dimensions/.test(src), 'the results tile must not divide by dimsAll.length');
});
check('no learner-facing surface prints an internal claim id',()=>{
  assert.ok(source.includes('function claimTag('), 'claimTag must exist');
  /* Every place that renders a bracketed claim id must route it through claimTag first. */
  const chips = source.split("'['+").slice(1).map(x=>x.slice(0, x.indexOf("+']'")));
  const raw = chips.filter(x=>x.includes('claimId') && !x.includes('claimTag('));
  assert.equal(raw.join(' | '), '', 'raw claim id rendered to the learner');
  assert.ok(chips.some(x=>x.includes('claimTag(')), 'expected at least one tagged claim-id chip');
});
check('three-field transfer accepts non-English text without a semantic mastery claim',()=>{
  assert.equal(g.planFields('下次作业','先画图检查单位','请AI检查假设，结论由我来写'),null);
  assert.ok(g.planFields('','',''));
});

/* ---- Site-level invariants. The game is one of three files a learner meets, and the review panel found
   the copy drifting out from under the build faster than the build drifts. These read the shipped files. ---- */
function docFile(name){ return fs.readFileSync(path.join(__dirname, '../docs/'+name), 'utf8'); }
var PAGES = ['index.html', 'game.html', 'takeaway.html'];
var NUMBER_WORD = {one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
                   eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,twenty:20};
/* Every "N min" and every "about <word> minutes" the learner can read, wherever it is written. */
function durationsIn(text){
  var out = [], m;
  var digits = /(\d+)\s*min(?:ute)?s?\b/g;
  while((m = digits.exec(text))) out.push(Number(m[1]));
  var words = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty)\s+minutes?\b/gi;
  while((m = words.exec(text))) out.push(NUMBER_WORD[m[1].toLowerCase()]);
  return out;
}
check('every page quotes the same play time, in digits and in words',()=>{
  var seen = {};
  ['index.html','game.html'].forEach(function(f){ seen[f] = durationsIn(docFile(f)); });
  seen['game.js'] = durationsIn(source);
  var all = [];
  Object.keys(seen).forEach(function(f){
    assert.ok(seen[f].length > 0, f+' no longer quotes a play time; the other files still do');
    all = all.concat(seen[f]);
  });
  var distinct = all.filter(function(v, i, a){ return a.indexOf(v) === i; });
  assert.equal(distinct.length, 1,
    'the site quotes more than one play time — ' + JSON.stringify(seen) +
    ' — so a learner is told two different things. Six places carry it: two in index.html body, ' +
    'the index.html and game.html meta descriptions, the scenario level line and the start button.');
});
check('brand, attribution and the frame-free video hold on every page',()=>{
  PAGES.forEach(function(f){
    var t = docFile(f), title = (t.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    assert.ok(/P-FACET for Simple Fluid Mechanics/.test(title), f+' title must carry the site name: '+title);
    assert.ok(t.replace(/&amp;/g, '&').indexOf('The P-FACET Model © Yupei Duan & Danielle Oprean, University of Missouri.') >= 0,
      f+' is missing the attribution');
    assert.ok(!/<iframe/i.test(t), f+' has an iframe; the publishing host blocks frames, so the video is a poster link');
  });
  var home = docFile('index.html');
  assert.ok(home.indexOf('https://youtu.be/TLA_h0yHC8c') >= 0, 'the home page must link the explainer video');
  assert.ok(home.indexOf('Music: Deliberate Thought by Kevin MacLeod (incompetech.com), CC BY 4.0') >= 0,
    'the music credit must stay with the video');
  ['Problem-Centered Challenge','Frame','Analogize & Attempt','Consult & Construct','Evaluate & Explain','Transform & Transfer']
    .forEach(function(name){ assert.ok(source.indexOf(name) >= 0, 'phase name changed: '+name); });
});
check('a content bump retires every earlier saved best',()=>{
  var v = Number((source.match(/var CONTENT_VERSION = (\d+)/) || [])[1]);
  assert.ok(v >= 1, 'CONTENT_VERSION must be a number');
  var old = (source.match(/var OLD_STORE_KEYS = \[([^\]]*)\]/) || [])[1] || '';
  for(var i = 1; i < v; i++) assert.ok(old.indexOf("'flowline-best-v"+i+"'") >= 0,
    'flowline-best-v'+i+' is neither the live key nor listed as retired, so a stale best could be read back');
  assert.ok(old.indexOf("'flowline-best-v"+v+"'") < 0, 'the live key must not be in the retired list');
});
check('contradictory typed work does not change selected-route critique or become assessed',()=>{
  for (const selected of ['350 kPa','320 kPa']) {
    const {r,sc}=fixture(0);
    const idx=sc.A.ests.findIndex(e=>e.t===selected);
    Object.assign(r.attempt,{estIdx:idx,est:selected,ok:sc.A.ests[idx].ok,provenance:'learner',work:'V₂ = 4 m/s; p₂ = 374 kPa',scaffolded:true,textAssessment:'not assessed'});
    const reply=g.buildReply(sc.C,'direct','Critique the selected example').reply;
    assert.match(reply.claims[0].t,/supplied/i);
    assert.ok(reply.claims[0].t.includes(selected));
    assert.ok(!reply.claims[0].t.includes('Your continuity step is right'));
    assert.match(g.dimensionsFor(r,sc).find(d=>d.id==='attempt').text,/not assessed/);
    assert.equal(r.attempt.work,'V₂ = 4 m/s; p₂ = 374 kPa');
  }
});
check('pressure comparison requires the supplied floor and handles equality honestly',()=>{
  const f=g.SCENARIOS[0].evidence.find(e=>e.id==='resid').action.run;
  assert.equal(f([350,140]).ok,true);
  assert.equal(f([350,10]).ok,false);
  assert.equal(f([348,140]).ok,false);
  const equal=f([140,140]);
  assert.equal(equal.ok,false); // pressure calculation is wrong, even though the comparison is equal
  assert.ok(!/BELOW|below the entered floor/.test(equal.text));
});
check('atmospheric boundary and pitot teaching distinguish static from stagnation pressure',()=>{
  const sc=g.SCENARIOS[0];
  const jet=sc.evidence.find(e=>e.id==='jet');
  assert.match(jet.body,/can happen to equal atmospheric/);
  assert.match(jet.cond,/stagnation pressure/);
  assert.match(sc.T.opts.find(o=>o.ok).t,/static pressure.*stagnation pressure/);
});
check('residual feedback does not reveal the expected pressure',()=>{
  const f=g.SCENARIOS[0].evidence.find(e=>e.id==='resid').action.run;
  for(const p of [350,348,0]) assert.ok(!f([p,140]).text.includes('350'));
});
check('AI-owned attempts are identified honestly in prompts and assembled parts',()=>{
  const {r,sc}=fixture(0); r.attempt=null; r.attempts=[]; r.status.A='given';
  for(const p of sc.C.prompts.concat(sc.C.parts)) {
    const text=g.tpl(p.t);
    assert.ok(!/My attempt|my setup|my flow-test calc/.test(text),text);
  }
  const record=g.buildReply(sc.C,'direct',g.tpl(sc.C.prompts.find(p=>p.kind==='bnd').t));
  assert.match(record.request,/I have not recorded my own attempt/);
  assert.match(record.reply.text,/no learner attempt is recorded/);
});
check('attempt checkpoint distinguishes recorded writing from an adopted example and shows exposure',()=>{
  const {r,sc}=fixture(0);
  assert.equal(g.dimensionsFor(r,sc).find(d=>d.id==='attempt').state,'no');
  r.attempt.provenance='learner';r.attempt.work='My calculation';
  for(const viewed of [true,false]){
    r.attempt.beforeWorkedExample=!viewed;
    const d=g.dimensionsFor(r,sc).find(d=>d.id==='attempt');
    assert.equal(d.state,'yes');
    assert.ok(d.text.includes(viewed?'after hints and the full worked example':'after hints, before the full worked example'));
    assert.match(d.text,/not assessed/);
  }
});
console.log(`\n${checks} regression checks passed.`);
