/* Flowline — a P-FACET game for fluid mechanics.
   The P-FACET Model © Yupei Duan & Danielle Oprean, University of Missouri.
   Vanilla JS, no dependencies. All content lives in SCENARIOS near the top; edit there to re-skin. */
(function(){
'use strict';

/* =====================================================================
   CONTENT
   Each scenario walks the six phases. Choice classifications:
   'own' = learner-owned work, 'mech' = mechanical offloading, 'sup' = supportive,
   'sub' = substitutive. Planted-error types on AI claims:
   'assumption' | 'unit' | 'plausible' | 'constraint' | 'ok'.
   ===================================================================== */

var ART = {
  barge: '<svg viewBox="0 0 400 240" role="img" aria-label="Sketch: cross-section of a 5 metre wide crane barge floating in fresh water, showing the draft, the centre of buoyancy B, the centre of gravity G and the metacentre M on the centreline, and an arrow showing that G rises when the boom goes up">'
    + '<rect x="0" y="0" width="400" height="240" fill="var(--bg)"/>'
    + '<g stroke="var(--grid)" stroke-width="1">' + grid(400,240,20) + '</g>'
    + '<path class="water-fill" d="M0,182 Q30,176 60,182 T120,182 T180,182 T240,182 T300,182 T360,182 T420,182 L420,240 L0,240 Z" fill="var(--water-soft)" stroke="var(--water)" stroke-width="1.5"/>'
    + '<rect x="125" y="152" width="150" height="48" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    + '<rect x="126" y="182" width="148" height="17" fill="var(--water-soft)" opacity=".7"/>'
    + '<rect x="206" y="146" width="64" height="6" rx="2" fill="var(--muted)"/>'
    + '<rect x="166" y="134" width="30" height="18" rx="2" fill="var(--chip)" stroke="var(--ink)" stroke-width="1.5"/>'
    + '<line x1="168" y1="138" x2="130" y2="124" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>'
    + '<line x1="168" y1="138" x2="140" y2="30" stroke="var(--anchor)" stroke-width="3" stroke-dasharray="5 4" stroke-linecap="round"/>'
    + '<line x1="140" y1="30" x2="140" y2="58" stroke="var(--anchor)" stroke-width="1.5" stroke-dasharray="3 3"/>'
    + '<rect x="136" y="58" width="8" height="30" fill="none" stroke="var(--anchor)" stroke-width="1.5" stroke-dasharray="3 3"/>'
    + '<line x1="200" y1="28" x2="200" y2="212" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"/>'
    + '<line x1="196" y1="200" x2="204" y2="200" stroke="var(--ink)" stroke-width="2"/>'
    + '<circle cx="200" cy="191" r="4" fill="var(--water)"/>'
    + '<circle cx="200" cy="155" r="4" fill="var(--ink)"/>'
    + '<circle cx="200" cy="89" r="4.5" fill="var(--anchor)"/>'
    + '<line x1="200" y1="149" x2="200" y2="124" stroke="var(--anchor)" stroke-width="1.5" stroke-dasharray="2 2"/><path d="M200,116 L196,124 L204,124 Z" fill="var(--anchor)"/>'
    + '<g stroke="var(--muted)" stroke-width="1"><line x1="112" y1="191" x2="112" y2="200"/><line x1="108" y1="191" x2="116" y2="191"/><line x1="108" y1="200" x2="116" y2="200"/>'
    + '<line x1="112" y1="89" x2="112" y2="187"/><line x1="108" y1="89" x2="116" y2="89"/>'
    + '<line x1="125" y1="222" x2="275" y2="222"/><line x1="125" y1="217" x2="125" y2="227"/><line x1="275" y1="217" x2="275" y2="227"/>'
    + '<line x1="290" y1="182" x2="290" y2="200"/><line x1="286" y1="182" x2="294" y2="182"/><line x1="286" y1="200" x2="294" y2="200"/></g>'
    + '<g font-family="system-ui,sans-serif" font-size="11" fill="var(--muted)">'
    + '<text x="207" y="204">K</text><text x="207" y="194">B</text><text x="207" y="159">G</text><text x="207" y="92">M</text>'
    + '<text x="207" y="128" fill="var(--anchor)">boom up: G rises — to where?</text>'
    + '<text x="86" y="199">KB</text><text x="86" y="142">BM</text>'
    + '<text x="172" y="235">B = 5.0 m</text><text x="10" y="235">L = 15.0 m into the page</text>'
    + '<text x="297" y="194">T = ?</text><text x="297" y="168">hull 1.6 m deep</text><text x="16" y="178">waterline</text>'
    + '<text x="300" y="112" fill="var(--anchor)" font-weight="700">GM = ?</text></g></svg>',
  pipe: '<svg viewBox="0 0 400 240" role="img" aria-label="Sketch: an elevated tank 12 metres above a school, connected by 800 metres of 200 mm cast-iron main">'
    + '<rect x="0" y="0" width="400" height="240" fill="var(--bg)"/>'
    + '<g stroke="var(--grid)" stroke-width="1">' + grid(400,240,20) + '</g>'
    + '<path d="M0,200 L120,200 L180,150 L400,150 L400,240 L0,240 Z" fill="var(--chip)"/>'
    + '<rect x="30" y="40" width="70" height="50" rx="6" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    + '<rect x="34" y="52" width="62" height="34" fill="var(--water-soft)"/><path class="water-fill" d="M34,52 Q50,48 65,52 T96,52" fill="none" stroke="var(--water)" stroke-width="1.5"/>'
    + '<line x1="45" y1="90" x2="45" y2="200" stroke="var(--ink)" stroke-width="2"/><line x1="85" y1="90" x2="85" y2="200" stroke="var(--ink)" stroke-width="2"/>'
    + '<path d="M65,90 L65,215 L330,215 L330,175" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/>'
    + '<path class="flow-dash" d="M65,95 L65,215 L330,215 L330,178" fill="none" stroke="var(--water)" stroke-width="2.5"/>'
    + '<rect x="300" y="120" width="70" height="55" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><path d="M296,120 L335,95 L374,120 Z" fill="var(--anchor-soft)" stroke="var(--ink)" stroke-width="2"/>'
    + '<circle cx="330" cy="175" r="4" fill="var(--anchor)"/>'
    + '<line x1="140" y1="52" x2="140" y2="175" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"/><line x1="135" y1="52" x2="145" y2="52" stroke="var(--muted)"/><line x1="135" y1="175" x2="145" y2="175" stroke="var(--muted)"/>'
    + '<g font-family="system-ui,sans-serif" font-size="11" fill="var(--muted)"><text x="146" y="118">12.0 m</text><text x="150" y="232">L = 800 m, D = 200 mm, cast iron</text>'
    + '<text x="20" y="34">tank</text><text x="300" y="190" fill="var(--anchor)" font-weight="700">50 L/s needed</text></g></svg>',
  culvert: '<svg viewBox="0 0 400 240" role="img" aria-label="Sketch: a road embankment over a creek with a culvert; rain falling on a 60 hectare catchment">'
    + '<rect x="0" y="0" width="400" height="240" fill="var(--bg)"/>'
    + '<g stroke="var(--grid)" stroke-width="1">' + grid(400,240,20) + '</g>'
    + '<g class="rain" stroke="var(--water)" stroke-width="1.5" stroke-opacity=".6">'
    + '<line x1="40" y1="30" x2="36" y2="44"/><line x1="80" y1="22" x2="76" y2="36"/><line x1="120" y1="34" x2="116" y2="48"/><line x1="160" y1="20" x2="156" y2="34"/><line x1="60" y1="60" x2="56" y2="74"/><line x1="100" y1="66" x2="96" y2="80"/><line x1="140" y1="58" x2="136" y2="72"/><line x1="30" y1="90" x2="26" y2="104"/><line x1="180" y1="56" x2="176" y2="70"/></g>'
    + '<path d="M0,150 L120,150 L160,100 L300,100 L340,150 L400,150 L400,240 L0,240 Z" fill="var(--chip)" stroke="var(--ink)" stroke-width="2"/>'
    + '<rect x="160" y="96" width="140" height="6" fill="var(--ink)"/>'
    + '<path class="water-fill" d="M0,175 Q40,168 80,175 T160,175 L160,200 L0,200 Z" fill="var(--water-soft)" stroke="var(--water)" stroke-width="1.5"/>'
    + '<path d="M160,170 L300,170 L300,200 L160,200 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    + '<path class="flow-dash" d="M165,186 L330,186" fill="none" stroke="var(--water)" stroke-width="2.5"/>'
    + '<path d="M300,180 Q350,172 400,180 L400,200 L300,200 Z" fill="var(--water-soft)"/>'
    + '<line x1="140" y1="150" x2="140" y2="200" stroke="var(--anchor)" stroke-width="1.5"/><line x1="135" y1="150" x2="145" y2="150" stroke="var(--anchor)"/>'
    + '<g font-family="system-ui,sans-serif" font-size="11" fill="var(--muted)"><text x="14" y="130">60 ha catchment</text><text x="190" y="90">new road</text>'
    + '<text x="60" y="222" fill="var(--anchor)" font-weight="700">HW limit 1.8 m above invert</text><text x="170" y="214">culvert: ? </text><text x="250" y="130">Q25 = ?</text></g></svg>'
};
function grid(w,h,s){ var out=''; for(var x=s;x<w;x+=s) out+='<line x1="'+x+'" y1="0" x2="'+x+'" y2="'+h+'"/>'; for(var y=s;y<h;y+=s) out+='<line x1="0" y1="'+y+'" x2="'+w+'" y2="'+y+'"/>'; return out; }
/* Friction-factor references for the evidence tray (pass 3). Swamee–Jain: explicit Colebrook approximation, stated range 5e3 ≤ Re ≤ 1e8, 1e-6 ≤ ε/D ≤ 1e-2.
   Prandtl smooth-pipe line, iterated: 1/√f = 2 log10(Re √f) − 0.8. */
function log10(x){ return Math.log(x)/Math.LN10; }
function swameeJain(Re, rr){ return 0.25 / Math.pow(log10(rr/3.7 + 5.74/Math.pow(Re, 0.9)), 2); }
function prandtlSmooth(Re){ var f = 0.02; for(var i=0;i<40;i++) f = 1/Math.pow(2*log10(Re*Math.sqrt(f)) - 0.8, 2); return f; }
function sjInRange(Re, rr){ return Re >= 5e3 && Re <= 1e8 && rr >= 1e-6 && rr <= 1e-2; }

var ICONS = {
  barge: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 23h30l-3 8H8z"/><path d="M4 35q4-3 8 0t8 0 8 0 8 0"/><path d="M15 23v-7h6"/><path d="M21 16l9-9"/><path d="M30 7v7"/></svg>',
  pipe: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="6" width="12" height="9" rx="2"/><path d="M11 15v17h18v-6"/><path d="M25 22h8v9h-8z"/></svg>',
  culvert: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 30l8-12h18l8 12"/><path d="M14 30v-6a6 6 0 0 1 12 0v6"/><path d="M3 30h34"/><path d="M10 8l-1 3M17 6l-1 3M24 8l-1 3M31 6l-1 3"/></svg>'
};

var SCENARIOS = [
/* ---------------------------------------------------------------- S1
   Adapted from FE-style problems written by student teams in this course. */
{
  id:'barge', title:'The Millstone Creek Barge', level:'Level 1 · well-structured', art:ART.barge, icon:ICONS.barge,
  blurb:'Buoyancy and stability. One clean number — and a foreman whose question the number alone does not answer.',
  protected:'the axis choice, the stability criterion, and the verdict for the lift',
  intro:'A small crane barge is moored at the Millstone Creek bridge site to set the last steel pile of a pier cofferdam. The hull is a rectangular steel box — 15.0 m long, 5.0 m wide, 1.6 m deep — floating in fresh water. With the crane and the 60 kN pile lying on deck, the total weight is 450 kN and the combined centre of gravity sits 1.5 m above the keel, boom down. The operator wants to boom up and lift the pile off the deck; the lift is well inside the crane\'s load chart. The foreman turns to you: "Chart says the crane is fine. Is the barge?"',
  goal:'The metacentric height GM of the barge as it sits — an initial, small-angle stability check — a stable / unstable verdict, and, once the lift plan\'s centre of gravity comes in, whether that check lets you say yes to the foreman. A positive GM is necessary for the lift; it is not by itself a complete lift-safety determination. Take ρ = 1000 kg/m³, g = 9.81 m/s².',
  givens:['L = 15.0 m, B = 5.0 m, hull 1.6 m deep; rectangular; fresh water','W = 450 kN total (hull + crane + pile on deck)','KG = 1.5 m above the keel — boom down, pile on deck','ρ = 1000 kg/m³, g = 9.81 m/s². The lift plan\'s KG for the boom-up condition is still to come.'],
  P:{ q:'In your own words — what are you solving, and why does it matter?',
      opts:[
        {t:'Find the loaded barge\'s metacentric height and decide whether it floats upright — as it sits AND when the boom goes up — because the foreman\'s "is it safe?" is about the lift, not the number.', v:'best', fb:'That is the problem: one relation, two conditions, and a person waiting on the answer. The purpose — a lift that does not roll the barge — is yours.'},
        {t:'Compute GM for the barge as loaded.', v:'ok', fb:'True but incomplete — GM as she sits does not answer the foreman, whose question is about the lift. Sharpen the problem before you frame it.'},
        {t:'Look up whether a 15 m × 5 m barge can carry a 450 kN load.', v:'weak', fb:'There is no such table — stability depends on where the weight sits, not on how much there is. Naming the problem badly is how AI ends up choosing it for you.'}
      ]},
  F:{ q:'Which of these belong in your frame? Pick what a good answer must respect.', min:3,
      items:[
        {t:'Floating equilibrium: the barge displaces its own weight of water, W = ρgV — that fixes the volume and the draft before anything else.', key:true, why:'Archimedes first; every other number hangs off V.'},
        {t:'The barge rolls about its long axis, so the waterplane\'s second moment is taken across the beam: I = L·B³/12 — the short side is cubed.', key:true, why:'The axis decides which side is cubed; get it wrong and I — and BM with it — changes by a factor (L/B)² = 9.'},
        {t:'Criterion: upright equilibrium is stable if GM = KB + BM − KG > 0, with KB and KG both measured from the keel.', key:true, why:'The initial (small-angle) stability criterion, and the datum it depends on.'},
        {t:'Constraint: the verdict must cover the barge as it will be when it lifts — a raised boom and a load on the hook move G — not only as it sits now.', key:true, why:'The foreman\'s question is about the lift. A verdict for the wrong condition is no verdict.'},
        {t:'Use sea-water density, 1025 kg/m³ — it is the conservative choice.', key:false, why:'The creek is fresh water. And denser water would give a slightly higher GM, not a lower one — "conservative" pointed the wrong way.'},
        {t:'Check the Reynolds number to see whether the flow around the hull is turbulent.', key:false, why:'Nothing flows. Buoyancy is hydrostatic.'},
        {t:'A longer barge resists rolling better, so length is what keeps it upright.', key:false, why:'Length cancels: I = LB³/12 and V = LBT give BM = B²/(12T). Rolling stiffness comes from the beam.'}
      ]},
  A:{ mq:'Which governing idea does your attempt use?',
      methods:[
        {t:'Archimedes for V = W/(ρg); draft T = V/(LB); KB = T/2; BM = I/V with I = LB³/12 about the roll axis (the relation is in the FE Reference Handbook); GM = KB + BM − KG, stable if positive.', ok:true, short:'Archimedes → draft → KB; BM = I/V about the roll axis; GM = KB + BM − KG', fb:'Right principle, all five steps. Looking the relation up in the Handbook is mechanical offloading — it retrieves a formula you understand, and it is on the exam desk for exactly this. Which axis, which volume, which datum: that thinking was yours. Your attempt exists.'},
        {t:'Compare the centre of buoyancy with the centre of gravity: if G sits above B, the barge will tip.', ok:false, short:'Compare B with G: G above B means it tips', fb:'That is the rule for a fully submerged body, such as a submarine. A floating hull\'s B moves sideways when it heels, and the test is the metacentre. Still — you attempted it, and now you know exactly which claim to test.'},
        {t:'Archimedes only: W = ρgV gives the draft, and as long as the deck stays above water the barge is stable.', ok:false, short:'Archimedes only: draft from W = ρgV; deck above water means stable', fb:'Floating and floating upright are different questions. Archimedes gives the draft; stability needs the metacentre. Good — the gap is now specific.'},
        {t:'Use the crane\'s own load chart — the manufacturer\'s tipping check already covers stability.', ok:false, short:'The crane\'s own load chart as the stability check', fb:'The load chart assumes a level, rigid foundation. A barge heels — that is exactly what the chart cannot see. But you chose a route, and the cycle can work with that.'}
      ],
      eq:'Your estimate of GM as the barge sits (boom down, pile on deck):',
      /* Each estimate carries the working the learner would paste into a request ({work}) and, if it is off,
         the critique the assistant makes of THAT number in E (claim). s = the slip, revealed only after the pick.
         None of the three slips coincides with a planted claim, so the AI reply stays coherent whichever chip was picked. */
      ests:[
        {t:'0.3 m', s:'that is KB — the centre of buoyancy\'s height above the keel, one of three terms', ok:false,
         work:'V = W/(ρg) = 450 000/(1000 × 9.81) = 45.9 m³; T = V/(LB) = 45.9/(15 × 5) = 0.61 m; KB = T/2 = 0.31 m, so GM ≈ 0.3 m > 0, stable',
         claim:{t:'Your 0.3 m is KB — the centre of buoyancy\'s height above the keel. That is the first of three terms: the metacentre sits BM = I/V above B, and G sits KG above the keel. GM = KB + BM − KG, and you have not yet found BM.', type:'ok', best:'accept',
           reasons:[{t:'KB is one term; I never computed BM = I/V or subtracted KG.', kind:'valid_evidence'},{t:'Reject — on a flat-bottomed barge the metacentre coincides with the centre of buoyancy, so GM = KB − KG = 0.31 − 1.5 = −1.2 m: unstable, and I should tell the foreman to stop.', kind:'invalid_technical_reason'},{t:'Accept — the AI listed three terms and I only had one, so it must know better.', kind:'unsupported_authority'}],
           explain:'Sound critique of your own number. KB is where B is, not how far M is above G. The specific-sounding rejection was wrong: M coincides with B only when the waterplane has no width — and this one is 5 m wide. Accepting on the missing terms is evidence; accepting because "it must know better" is not.'}},
        {t:'1.8 m', s:'that rests on V = 450 m³ — g was dropped, and the draft comes out at 6 m for a hull 1.6 m deep', ok:false,
         work:'V = W/ρ = 450 000/1000 = 450 m³; T = V/(LB) = 450/75 = 6.0 m; KB = 3.0 m; I = LB³/12 = 156.25 m⁴; BM = I/V = 156.25/450 = 0.347 m; GM = 3.0 + 0.347 − 1.5 = 1.847 ≈ 1.8 m > 0, stable',
         claim:{t:'Your 1.8 m rests on V = 450 m³, which needs a draft of 6.0 m — the hull is only 1.6 m deep, so the implied draft exceeds the hull depth and this assumed floating configuration is inconsistent. Newtons divided by kg/m³ leave a g behind: V = W/(ρg) = 45.9 m³ and a draft of 0.61 m.', type:'ok', best:'accept',
           reasons:[{t:'N ÷ (kg/m³) is not m³ — I dropped g. And a 6 m draft on a 1.6 m hull fails the sanity check.', kind:'valid_evidence'},{t:'Reject — with W in kN and ρ in t/m³ the g cancels, so V = 450 m³ stands; the barge is just heavily loaded.', kind:'invalid_technical_reason'},{t:'Accept — the AI redid the units, so I don\'t need to.', kind:'convenience'}],
           explain:'Sound critique of your own number. The hull depth is the evidence — a draft cannot exceed it. And g does not cancel: kN ÷ (t/m³) becomes m³ only after dividing by 9.81 kN/t. "The AI redid it" is exactly the delegation the boundary was meant to prevent.'}},
        {t:'2.2 m', s:'KB + BM − KG = 0.31 + 3.41 − 1.5', ok:true,
         work:'V = W/(ρg) = 450 000/(1000 × 9.81) = 45.87 m³; T = V/(LB) = 45.87/(15 × 5) = 0.61 m; KB = T/2 = 0.31 m; I = LB³/12 = 15 × 5³/12 = 156.25 m⁴; BM = I/V = 156.25/45.87 = 3.41 m; GM = KB + BM − KG = 0.31 + 3.41 − 1.5 = 2.2 m > 0, stable as she sits'},
        {t:'3.7 m', s:'that is KB + BM = KM — the metacentre above the keel, with KG never subtracted', ok:false,
         work:'V = 450 000/(1000 × 9.81) = 45.87 m³; T = 45.87/75 = 0.61 m; KB = 0.31 m; I = 15 × 5³/12 = 156.25 m⁴; BM = 156.25/45.87 = 3.41 m; GM = KB + BM = 0.31 + 3.41 = 3.72 ≈ 3.7 m > 0, stable',
         claim:{t:'Your 3.7 m is KB + BM = KM, the metacentre\'s height above the keel. GM is the metacentre\'s height above G, so KG = 1.5 m still has to come off — you have the right terms and stopped one step early.', type:'ok', best:'accept',
           reasons:[{t:'KB + BM is KM; GM needs G subtracted — I dropped the KG term.', kind:'valid_evidence'},{t:'Reject — KG is already inside KB, because the crane\'s weight is what sets the draft; subtracting it again would double-count, so 3.7 m stands.', kind:'invalid_technical_reason'},{t:'Accept — it is a smaller number, and smaller is safer.', kind:'convenience'}],
           explain:'Sound critique of your own number. The weight sets the draft (and so KB); where the weight sits sets KG — two different things, so nothing is double-counted. "Smaller is safer" is convenience, not evidence: a smaller GM is a less stable barge.'}}
      ],
      estfb:{ok:'{est}: M sits 3.7 m above the keel and G at 1.5 m — stable as she sits. Before you say so out loud: are you sure which side you cubed in I? And the lift plan will move G, which is the interesting part.', bad:'You recorded {est}: {slip}. Being off is fine at this stage; it is the reason to consult, not the reason to skip.'}},
  C:{ gap:{ok:'You have GM ≈ {est} for the barge as it sits, and your frame says the lift condition has to be checked too. You are not sure you took I about the right axis, and you have not yet turned the number into an answer for the foreman.',
           bad:'You have GM ≈ {est}, which you are not confident in, and you are not sure you took I about the right axis. The foreman is waiting for a yes or a no.'},
      /* Lengths deliberately vary: the leaky "unb" request is the longest, the bounded one is short. Order is shuffled at render. */
      prompts:[
        {t:'A rectangular barge 15 m by 5 m floats in fresh water carrying a crane; total weight 450 kN, centre of gravity 1.5 m above the keel. Find the metacentric height, say whether it is stable, and tell me whether it is safe to lift with the boom up. Show all steps.', kind:'sub', fb:'This hands over the entire target work — the calculation, the criterion, and the answer to the foreman. Even if it comes back right, none of it is yours.'},
        {t:'I want to get this right before I answer the foreman, so here is everything I did — approach: {method}; estimate {est}. Worked example I adopted: {work}. I used W = ρgV for the displaced volume, took the centre of buoyancy at half the draft, and used I = LB³/12 for the waterplane, but I am honestly not sure I cubed the right side, and I have not decided what the number means for the lift once the boom goes up. Could you go through each step carefully, correct anything that is wrong, recompute GM properly, and tell me whether I can say the lift is safe?', kind:'unb', fb:'Long, careful, and your attempt is all there — but "correct anything … recompute GM … tell me whether I can say the lift is safe" hands over the verdict and the deliverable. Detail is not a boundary.'},
        {t:'My attempt — approach: {method}; estimate {est}. Worked example I adopted: {work}. Gap: I am not sure I took I about the right axis — which side gets cubed. Critique my setup and my criterion; flag a wrong assumption, a unit slip, or a missing constraint. Do not recompute GM or tell me whether the lift is safe — that call is mine.', kind:'bnd', fb:'Attempt shown, gap named, AI\'s job stated, boundary drawn — in four lines. The thinking stays yours; the AI becomes a critic.'},
        {t:'Can you check my barge stability calc? Don\'t just give me the answer.', kind:'vag', fb:'A boundary is there, but the AI cannot see your attempt or your gap — so it will guess, and probably solve it anyway.'}
      ],
      parts:[
        {l:'My attempt', t:'My attempt — approach: {method}; estimate {est}. Worked example I adopted: {work}.', need:true},
        {l:'The one gap', t:'I am not sure I took the waterplane\'s second moment about the right axis — whether the length or the beam gets cubed.', need:true},
        {l:'AI\'s job', t:'Critique my setup and my stability criterion; flag any wrong assumption, unit slip, or missing constraint.', need:true},
        {l:'The boundary', t:'Do NOT recompute GM or tell me whether the lift is safe — that verdict is mine to give.', need:true},
        {l:'Tempting add-on', t:'Then just tell me what to say to the foreman — safe or not.', need:false},
        {l:'Tempting add-on', t:'Also write it up as a one-page stability note I can hand in.', need:false}
      ],
      whole:'Sure. Displaced volume V = W/(ρg) = 450 000/9810 = 45.87 m³; draft = 45.87/(15 × 5) = 0.61 m; KB = 0.31 m. For a long barge the waterplane inertia is I = BL³/12 = 5 × 15³/12 = 1406.25 m⁴, so BM = 1406.25/45.87 = 30.7 m and GM = 0.31 + 30.7 − 1.5 = 29.5 m. That is an enormous margin — raising the boom will not come close to using it, so the barge is stable and the lift is safe. Let me know if you\'d like this formatted as a note for the foreman!',
      /* Whole-task reply, decomposed for E. Each claim is copied verbatim out of `whole` (checked at load), so E judges only what was received. */
      wholeClaims:[
        {t:'Displaced volume V = W/(ρg) = 450 000/9810 = 45.87 m³; draft = 45.87/(15 × 5) = 0.61 m; KB = 0.31 m.', type:'ok', best:'accept',
         reasons:[{t:'W = ρgV in fresh water; a box hull\'s B is the centroid of the submerged rectangle, at T/2 — I can reproduce all three.', kind:'valid_evidence'},{t:'Revise — KB should be 2T/3 = 0.41 m, like the centre of pressure on a gate.', kind:'invalid_technical_reason'},{t:'It is consistent with the AI\'s other numbers, so it must be right.', kind:'unsupported_authority'}],
         explainAs:'c1'},
        {t:'For a long barge the waterplane inertia is I = BL³/12 = 5 × 15³/12 = 1406.25 m⁴, so BM = 1406.25/45.87 = 30.7 m and GM = 0.31 + 30.7 − 1.5 = 29.5 m.', type:'assumption', best:'reject', sameAs:'c2'},
        {t:'That is an enormous margin — raising the boom will not come close to using it, so the barge is stable and the lift is safe.', type:'constraint', best:'reject',
         reasons:[{t:'No KG for the boom-up condition was used; my frame says the verdict must cover the lift. Nothing here supports "safe".', kind:'valid_evidence', ok:['reject','revise']},{t:'Accept — a GM above about 1 m is always enough for a crane barge, whatever the boom does.', kind:'invalid_technical_reason'},{t:'Accept — it is the answer the foreman wants, and the assistant was confident.', kind:'convenience'}],
         explain:'The verdict was given for a condition nobody checked. There is no "always enough" GM: with KG = 4.4 m this barge\'s GM is −0.7 m. Confidence is not a check.'}
      ],
      /* Reasons for excluding (or holding) the uninvited paragraph in E; the scope reason is shared and lives in uninvitedClaim(). */
      uninvitedReasons:{unsupported:'Unsupported — it states a verdict for the lift without any KG for the boom-up condition.', violates:'It violates my frame: the verdict must cover the lift condition, and this one never looked at it.'},
      uninvitedExplain:'You did not ask for this, and it checks nothing. Excluding it — or holding it until the lift KG arrives — is the recovery the boundary was for. Watch for it in T.',
      reply:'Happy to critique. Here is what I see in your working:',
      /* What the assistant adds when the request left a door open (leaky / unbounded / vague / add-on). It does the delegated part —
         the site verdict, given for the condition it never checked — and that decision is exactly the trap in T. Not templated. */
      uninvited:'And to save you the walk back to the foreman: GM comes out comfortably positive, so the barge is stable — you can tell him the lift is good to go.',
      /* Evidence-tray item each claim points at ("Check a reference"), keyed by the id suffix; resolved onto claim.evidenceHint at load. */
      hints:{c1:'box', c2:'inertia', c3:'gm', w1:'box', w2:'inertia', w3:'gm', 'est-0':'gm', 'est-1':'units', 'est-3':'gm', uninv:'data'},
      /* Bounded return consultations (one per scenario): the learner's question and a critique-only reply — no new number, no verdict. */
      followups:{
        'barge-c2':{q:'Confirm which axis a box hull rolls about and whether length cancels out of BM. Do not recompute GM.', reply:'Rolling is rotation about the longitudinal axis, so the waterplane\'s second moment is taken across the beam: I = LB³/12. With V = LBT, BM = B²/(12T) — L cancels. My earlier I = BL³/12 was the pitching value. I have not recomputed GM.'},
        'barge-c3':{q:'Is "B must be above G" a stability criterion for a floating body? State the criterion; no verdict on the lift.', reply:'For a fully submerged body, yes. For a floating body B moves as the hull heels, and the criterion is GM = KM − KG > 0 — initial, small-angle stability. My earlier statement applied the submerged rule. No verdict on the lift.'},
        'barge-w3':{q:'Does a GM found for the boom-down condition cover the lift? Say what changes when the boom goes up; no verdict on the lift.', reply:'It does not. GM = KM − KG: KM is fixed by the hull and the draft, while KG moves with the boom and the load — a load on the hook counts at the hook. A boom-down GM says nothing about the boom-up condition until that KG is in. My "the lift is safe" used the condition nobody checked. No verdict on the lift.'},
        'barge-uninv':'barge-w3'
      },
      attemptSlot:0,
      claims:[
        {t:'Taking V = W/(ρg) = 450 000/9810 = 45.87 m³ with the fresh-water density, draft T = V/(LB) = 0.61 m, and KB = T/2 = 0.31 m for a box hull is the right start.', type:'ok', best:'accept',
         reasons:[{t:'W = ρgV in the creek\'s fresh water; a box hull\'s B is the centroid of the submerged rectangle, at T/2.', kind:'valid_evidence'},{t:'Revise — the centre of buoyancy sits at 2T/3 from the keel, like the centre of pressure on a vertical gate, so KB = 0.41 m.', kind:'invalid_technical_reason'},{t:'It matches my numbers.', kind:'unsupported_authority'}],
         explain:'Correct claim. The evidence is Archimedes plus the geometry of a box: the centroid of the submerged rectangle is at T/2. The 2T/3 belongs to a pressure triangle on a plate — a different problem — and agreement with you is not evidence either.'},
        {t:'One correction: because the barge is much longer than it is wide, the waterplane\'s second moment should use the long side cubed, I = BL³/12 = 5 × 15³/12 = 1406.25 m⁴. Then BM = 1406.25/45.87 = 30.7 m and GM = 0.31 + 30.7 − 1.5 = 29.5 m — enormously stable, with margin for any lift.', type:'assumption', best:'reject',
         reasons:[{t:'The barge rolls about its long axis, so the beam is cubed: I = LB³/12 = 156 m⁴, BM ≈ 3.4 m. Length cancels out of BM = B²/(12T).', kind:'valid_evidence'},{t:'Revise — a barge rolls and pitches together, so average the two: I ≈ (156 + 1406)/2 ≈ 780 m⁴ and BM ≈ 17 m, which still leaves the lift with plenty of margin.', kind:'invalid_technical_reason'},{t:'Accept — 29.5 m is the bigger number, and a bigger GM is the safer thing to tell the foreman.', kind:'convenience'}],
         explain:'Planted error: a wrong assumption about the axis. Length cancels out of BM (= B²/12T); the long side cubed is the pitching stiffness, which is why a barge pitches far less than it rolls — a 5 m-wide hull drawing 0.6 m cannot have its metacentre 31 m up. Averaging two axes is not a method. And "the safer number" is the dangerous one: it says the lift is fine when it is not.'},
        {t:'Strictly, though, the textbook criterion for a floating body is that the centre of buoyancy must lie above the centre of gravity. Here B is 0.31 m above the keel and G is at 1.5 m, so G is above B: technically the barge is unstable, and you should tell the foreman it needs ballast before any lift.', type:'plausible', best:'reject',
         reasons:[{t:'B above G is the submerged-body rule. A floating hull\'s B shifts as it heels; the test is M above G, and GM = +2.2 m.', kind:'valid_evidence'},{t:'Revise — the rule holds with a tolerance: G may sit up to about 20 % of the draft above B, i.e. 0.43 m above the keel, so at 1.5 m the barge is still unstable and needs ballast.', kind:'invalid_technical_reason'},{t:'Reject — barges float upright all the time, so this cannot be a real rule.', kind:'invalid_technical_reason', tail:' True as an observation — but it names no mechanism. The criterion is GM > 0, and that is what the claim got wrong.'}],
         explain:'Planted error: plausible but false — the submerged-body rule carried over to a floating one. Nearly every floating hull has G above B; what keeps it upright is the metacentre, which exists because B moves when the hull heels. There is no "20 % tolerance". Notice the reply also contradicts itself — "enormously stable" and "technically unstable" in one breath; internal inconsistency is a tell. This error points the safe way (it would halt a stable barge); the previous one points the dangerous way.'}
      ]},
  T:{ iq:'Integrate: the lift plan has just come in — boom up, pile on the hook, combined KG = 4.4 m above the keel, weight unchanged. What do you tell the foreman?',
      opts:[
        {t:'As she sits: GM = 0.31 + 3.41 − 1.5 = +2.2 m, stable. Boom up, pile on the hook: GM = 3.71 − 4.4 = −0.69 ≈ −0.7 m — she would roll. Not as planned: keep the boom low or add low ballast, then recheck. I rejected the L³ claim and the B-above-G claim.', ok:true, fb:'Owned, correct, traceable — and the number that mattered was the second one. The same barge is stable at lunch and unstable at two o\'clock; only G moved. A load on the hook counts at the hook, some 20 m up — that is why G climbs nearly 3 m. Any KG above KM = 3.7 m tips this barge; that line is worth more than the number. GM is the initial-stability check; the lift plan\'s other checks (heel under load, freeboard, mooring) are outside this problem — so is "safe" until they are done.'},
        {t:'GM = 2.2 m > 0: the barge is stable — tell the foreman the lift is good to go.', ok:false, trap:true, fb:'The as-floated number is right and the verdict is wrong: it never looked at the barge in the condition that matters. With KG = 4.4 m, GM = −0.7 m — the pile comes off the deck and the barge goes over. Your own frame said the verdict had to cover the lift.'},
        {t:'GM ≈ 29.5 m; even with KG = 4.4 m it is ≈ 26.6 m — lift away.', ok:false, fb:'The long-side-cubed claim survived into the design. 29.5 m is pitching stiffness dressed up as rolling stiffness; the real GM with the boom up is negative. This is the error that puts people in the creek.'}
      ],
      tq:'Transfer: what will you carry to the next stability problem — and to the FE?',
      topts:[
        {t:'I\'ll look the relation up in the Handbook (that is what it is for), attempt the number myself, and ask AI only to attack my axis choice and my criterion — never for the verdict.', v:'best', fb:'Handbook for the formula, you for the number and the verdict, AI as critic. That sentence is the FE version of P-FACET.'},
        {t:'I\'ll get AI\'s GM first, then check it by hand.', v:'ok', fb:'Backwards: checking is harder than attempting when you have no number of your own to compare against — and the AI\'s number here was 29.5 m.'},
        {t:'If GM comes out large, I\'ll trust it — a big margin means the details don\'t matter.', v:'weak', fb:'The largest GM on the table today, 29.5 m, was the wrong one. A big number is a reason to check the axis, not to stop.'}
      ]},
  outsideEst:'29.5 m',
  evidence:[
    {id:'arch', kind:'equation', title:'Archimedes — floating equilibrium', body:'W = ρgV: a floating body displaces its own weight of water, so V = W/(ρg).', cond:'floating body; fresh water ρ = 1000 kg/m³, g = 9.81 m/s²; W in newtons.', action:{type:'calc', prompt:'V from W = 450 kN', unit:'m³', expect:45.9, tol:0.3}},
    {id:'box', kind:'equation', title:'Box-hull geometry', body:'Draft T = V/(LB). Centre of buoyancy KB = T/2 — the centroid of the submerged rectangle.', cond:'rectangular section, even keel.', action:{type:'calc', prompt:'Draft T', unit:'m', expect:0.61, tol:0.02}},
    {id:'inertia', kind:'equation', title:'Waterplane second moment about the roll axis', body:'I = L·B³/12, then BM = I/V. (Length cancels: BM = B²/(12T).)', cond:'roll = rotation about the long axis, so the beam B is the side that is cubed; L·B³ ≠ B·L³.', action:{type:'calc', prompt:'BM = I/V', unit:'m', expect:3.41, tol:0.1}},
    {id:'gm', kind:'equation', title:'Initial stability', body:'KM = KB + BM. GM = KM − KG. Upright equilibrium is stable if GM > 0, i.e. G below M.', cond:'small-angle (initial) stability only — not a complete lift-safety check; KB and KG from the same datum (the keel).',
     action:{type:'compare', fields:[{l:'KM = KB + BM you computed', unit:'m'}, {l:'KG', unit:'m'}], run:function(v){ var km = v[0], kg = v[1], okKM = Math.abs(km-3.71) <= 0.1; return {ok:okKM, text:(okKM ? 'KM within tolerance. ' : 'KM not within tolerance — check KB, BM and which side you cubed. ')+(km > kg ? 'With your numbers G is below M: GM = KM − KG > 0, initially stable.' : 'With your numbers G is at or above M: GM ≤ 0, not initially stable.')+' Condition: small-angle stability only.'}; }}},
    {id:'units', kind:'conversion', title:'Unit conversions', body:'kN → N: × 1000. t/m³ → kg/m³: × 1000. N ÷ (kg/m³) is not m³ — divide by g (m/s²) first: V = W/(ρg).'},
    {id:'data', kind:'data', from:'C', title:'Scenario data', body:'L = 15.0 m, B = 5.0 m, hull depth 1.6 m, W = 450 kN, KG (boom down, pile on deck) = 1.5 m. KM = 3.71 m — from the supplied worked route you adopt (KB 0.31 m + BM 3.41 m). Lift-plan KG for the boom-up condition: arrives in T.', note:'KM as stated here comes with the supplied worked example, not from a check you ran.'}
  ],
  outside:{
    P:'Sure! The problem is to find the barge\'s metacentric height. Quick check first: it displaces V = W/ρ = 450/1000 = 0.45 m³, so the draft is only about 6 mm — it barely sits in the water, so stability is no concern. Want me to get GM anyway?',
    F:'Key assumptions: (1) treat the barge as a long beam, so the waterplane inertia uses the long side cubed, I = BL³/12; (2) stability requires the centre of buoyancy above the centre of gravity; (3) use sea-water density, 1025 kg/m³, to be conservative. Success criterion: report GM in metres.',
    A:'V = 450 000/9810 = 45.87 m³; T = 0.61 m; KB = 0.31 m; I = BL³/12 = 1406.25 m⁴; BM = 1406.25/45.87 = 30.7 m; GM = 0.31 + 30.7 − 1.5 = 29.5 m. Stable, with a huge margin — the lift is fine.',
    E:'I\'ve re-checked my reasoning and everything above is consistent. You can rely on it.',
    T:'Summary for your notes: GM = 29.5 m, stable; the lift is safe. Lesson learned: for a long barge, cube the length.'
  }
},
/* ---------------------------------------------------------------- S2 */
{
  id:'pipe', title:'The Rockbridge Water Main', level:'Level 2 · moderately structured', art:ART.pipe, icon:ICONS.pipe,
  blurb:'Pipe flow. A go/no-go decision where the number is right and the verdict can still be wrong.',
  protected:'the regime check, the friction factor and head-budget comparison, and the go / no-go on the 200 mm main',
  intro:'Rockbridge is a small town served by an elevated tank whose water surface sits 12.0 m above the service connection at the new elementary school. For this problem, treat that 12.0 m as the head budget available for losses at 50 L/s: the scenario stipulates that the outlet velocity head and the residual pressure required at the connection are already netted out of it. The connection is fed by 800 m of 200 mm cast-iron main (ε = 0.26 mm). The fire marshal wants 50 L/s available at the connection. Minor losses (bends, valves, entrance) add about 1.0 m. Water at 20 °C, ν = 1.0 × 10⁻⁶ m²/s.',
  goal:'Is the existing 200 mm main adequate at 50 L/s, or must you recommend upsizing? A yes/no with the head budget behind it.',
  givens:['L = 800 m, D = 200 mm, ε = 0.26 mm','Q = 50 L/s = 0.050 m³/s','Head budget for losses = 12.0 m (stipulated; velocity head and residual pressure already netted out); minor losses ≈ 1.0 m (stipulated)','ν = 1.0 × 10⁻⁶ m²/s, g = 9.81 m/s²'],
  P:{ q:'In your own words — what are you deciding, and why does it matter?',
      opts:[
        {t:'Decide whether the 200 mm main can deliver 50 L/s with 12 m of head — a go/no-go where friction AND minor losses are counted against the constraint.', v:'best', fb:'A decision, a constraint, and both loss terms. The fire marshal\'s question is exactly this.'},
        {t:'Compute the friction head loss in the main.', v:'ok', fb:'Necessary, not sufficient. A head loss is a number; the town needs a verdict against a budget.'},
        {t:'Find a pipe that delivers 50 L/s.', v:'weak', fb:'Almost any pipe delivers 50 L/s with enough head. The problem is the head you actually have.'}
      ]},
  F:{ q:'Which of these belong in your frame? Pick what a good answer must respect.', min:3,
      items:[
        {t:'Steady, incompressible flow: apply the energy equation from the tank surface to the service point.', key:true, why:'The governing relation.'},
        {t:'Check Re to confirm turbulent flow before choosing how to get the friction factor.', key:true, why:'The friction-factor formula depends on the regime.'},
        {t:'Constraint: total loss (friction + minor) must not exceed the 12.0 m available.', key:true, why:'The criterion the verdict is judged against.'},
        {t:'Relative roughness ε/D = 0.26/200 = 0.0013 — aged cast iron is not smooth.', key:true, why:'Sets f on the Moody chart.'},
        {t:'Water is compressible at this pressure, so density changes matter.', key:false, why:'Liquid water at a few bar is incompressible for this purpose.'},
        {t:'Use hydrostatics: the tank height sets the pressure and flow doesn\'t change it.', key:false, why:'Flow is exactly what erodes the available head.'},
        {t:'Minor losses are always negligible on long pipes, so drop the 1.0 m.', key:false, why:'Often small — but here the margin is smaller. Never "always."'}
      ]},
  A:{ mq:'Which approach does your attempt use?',
      methods:[
        {t:'Continuity for V; Re = VD/ν; f from Moody / Colebrook (or Swamee–Jain) at ε/D and Re; h_f = f (L/D) V²/2g; add minor losses; compare with 12 m.', ok:true, short:'Re → regime → f from the chart → Darcy–Weisbach → add minor losses → compare with 12 m', fb:'The full chain, with the constraint at the end. That is a real attempt.'},
        {t:'We know Re, so use f = 64/Re.', ok:false, short:'f = 64/Re from the known Re', fb:'64/Re is laminar-only (Re < ~2300). At Re ≈ 3 × 10⁵ it is off by two orders of magnitude. Good — you now know the exact thing to verify.'},
        {t:'Bernoulli with no losses: V = √(2g × 12) = 15.3 m/s, so Q is huge — the pipe is fine.', ok:false, short:'Bernoulli with no losses: V = √(2g × 12)', fb:'Ideal flow ignores exactly what the question is about: losses. Your frame said "energy equation," which includes them.'},
        {t:'Hydrostatics: the pressure at the service point is γ × 12 m regardless of flow.', ok:false, short:'Hydrostatics: pressure = γ × 12 m regardless of flow', fb:'True only when nothing flows. Fire flow is the opposite case.'}
      ],
      eq:'Your estimate of the friction head loss h_f in the 200 mm main:',
      ests:[
        {t:'1.1 m', s:'that needs f ≈ 0.002 — a decade below anything on the Moody chart', ok:false,
         work:'V = 1.59 m/s; Re ≈ 3.2 × 10⁵; ε/D = 0.0013; f ≈ 0.002 from the chart; h_f = f(L/D)V²/2g ≈ 1.1 m; + 1.0 m minor = 2.1 m vs 12.0 m available',
         claim:{t:'Your h_f = 1.1 m implies f ≈ 0.002. At Re ≈ 3.2 × 10⁵ even a perfectly smooth pipe gives f ≈ 0.014, and ε/D = 0.0013 puts cast iron well above that line — your friction factor is roughly ten times too small.', type:'ok', best:'accept',
           reasons:[{t:'0.002 is below the smooth-pipe curve; nothing real is that smooth.', kind:'valid_evidence'},{t:'Reject — Colebrook gives f = 0.002 for new cast iron at this Re; the AI is reading the chart for old pipe.', kind:'invalid_technical_reason'},{t:'Accept — the AI knows the chart better than I do.', kind:'unsupported_authority'}],
           explain:'Sound critique of your own number. The chart has a floor — the smooth-pipe line — and 0.002 is under it. That floor is the evidence; "the AI knows better" is not.'}},
        {t:'4.3 m', s:'that needs f ≈ 0.008 — below the smooth-pipe line at this Re', ok:false,
         work:'V = 1.59 m/s; Re ≈ 3.2 × 10⁵; ε/D = 0.0013; f ≈ 0.008 from the chart; h_f = f(L/D)V²/2g ≈ 4.3 m; + 1.0 m minor = 5.3 m vs 12.0 m available',
         claim:{t:'Your 4.3 m corresponds to f ≈ 0.008 — below the smooth-pipe value (≈ 0.014) at this Reynolds number. With ε/D = 0.0013 the chart reads nearer 0.02, so your loss is about two and a half times too low.', type:'ok', best:'accept',
           reasons:[{t:'f cannot sit below the smooth-pipe line, and ε/D = 0.0013 is above it — I read the wrong curve.', kind:'valid_evidence'},{t:'Reject — 0.008 is the fully-rough value for ε/D = 0.0013, which is what you use once Re is above 10⁵.', kind:'invalid_technical_reason'},{t:'Accept — it agrees with my method, just a different number.', kind:'unsupported_authority'}],
           explain:'Sound critique of your own number. The fully-rough f for ε/D = 0.0013 is about 0.021, not 0.008 — the specific-sounding reason was wrong. Check the chart, not the confidence.'}},
        {t:'11.3 m', s:'f ≈ 0.022 at Re ≈ 3.2 × 10⁵, ε/D = 0.0013', ok:true,
         work:'V = 1.59 m/s; Re ≈ 3.2 × 10⁵; ε/D = 0.0013; f ≈ 0.022 (Swamee–Jain); h_f = f(L/D)V²/2g ≈ 11.3 m; + 1.0 m minor = 12.3 m vs 12.0 m available'},
        {t:'45 m', s:'that needs f ≈ 0.09 — the fully rough value for ε/D ≈ 0.05, forty times rougher than this pipe', ok:false,
         work:'V = 1.59 m/s; Re ≈ 3.2 × 10⁵; ε/D = 0.0013; f ≈ 0.09 from the chart; h_f = f(L/D)V²/2g ≈ 45 m; + 1.0 m minor = 46 m vs 12.0 m available',
         claim:{t:'Your 45 m implies f ≈ 0.09, which is the fully rough value for ε/D ≈ 0.05 — forty times rougher than your pipe. At ε/D = 0.0013 the chart sits near 0.02.', type:'ok', best:'accept',
           reasons:[{t:'f = 0.09 needs ε/D ≈ 0.05 — 10 mm of roughness in a 200 mm pipe. I misread the roughness axis.', kind:'valid_evidence'},{t:'Accept — but a 45 m loss means the pipe fails, which is the safe conclusion either way.', kind:'convenience'},{t:'Accept — the AI cited a specific ε/D, so it must have checked.', kind:'unsupported_authority'}],
           explain:'Sound critique of your own number. "Fails either way" is convenience, not evidence — with the right f the verdict is borderline, which is a different recommendation.'}}
      ],
      estfb:{ok:'V = 1.59 m/s, Re ≈ 3.2 × 10⁵, ε/D = 0.0013 → f ≈ 0.022 → h_f ≈ 11.3 m. With 1.0 m of minor losses: 12.3 m against 12.0 m. Borderline — and that is the interesting part.', bad:'You recorded h_f ≈ {est}: {slip}. Off is fine — it tells you what to ask.'}},
  C:{ gap:{ok:'You have V = 1.59 m/s, Re ≈ 3.2 × 10⁵, f ≈ 0.022, h_f ≈ {est}; with minor losses ≈ 12.3 m — over by 0.3 m. You\'re unsure about your friction factor and the borderline verdict.',
           bad:'You have V = 1.59 m/s, Re ≈ 3.2 × 10⁵, and h_f ≈ {est} from your reading of the chart. You\'re unsure whether that friction factor is right — and therefore whether the main passes.'},
      prompts:[
        {t:'800 m of 200 mm cast-iron pipe, 50 L/s, 12 m of head available, minor losses 1 m. Is the pipe adequate? Work it out fully and recommend a pipe size.', kind:'sub', fb:'The whole decision — computation and judgment — delegated in one line. Whatever comes back, the verdict isn\'t yours.'},
        {t:'Here is my full working so you can see every step — approach: {method}; estimate {est}. Worked example I adopted: {work}. I used continuity for V, checked Re = VD/ν to confirm the flow is turbulent, took the friction factor from the chart at ε/D = 0.26/200, and then used Darcy–Weisbach for the loss. I think my friction factor may be off and I\'m not confident about the verdict either way. Please go through each step, correct any mistakes you find, recompute the head loss properly, and tell me whether the pipe is adequate and what size I should recommend to the town.', kind:'unb', fb:'Thorough, and every number is in it — but "correct … recompute … tell me whether … what size" hands over the verdict and the deliverable in one breath. Length is not a boundary.'},
        {t:'My attempt — approach: {method}; estimate {est}. Worked example I adopted: {work}. I\'m unsure of my friction factor and my adequacy verdict. Critique those two — flag a wrong assumption, unit, or missing constraint. Do not recompute or pick a pipe size.', kind:'bnd', fb:'Attempt, gap, job, boundary — in three lines. You even told it what kinds of error to look for, which is also a checklist for you.'},
        {t:'Can you check my friction factor for the water main problem? Don\'t do the whole thing.', kind:'vag', fb:'Boundary present, attempt absent. The AI has nothing to critique, so it will invent a solution to critique instead.'}
      ],
      parts:[
        {l:'My attempt', t:'My attempt — approach: {method}; estimate {est}. Worked example I adopted: {work}.', need:true},
        {l:'The one gap', t:'I\'m unsure whether my friction factor and my adequacy verdict are right.', need:true},
        {l:'AI\'s job', t:'Critique my friction-factor choice and my criterion; flag any wrong assumption, unit, or missing constraint.', need:true},
        {l:'The boundary', t:'Do not recompute the answer or pick a pipe size for me.', need:true},
        {l:'Tempting add-on', t:'Then just tell me which pipe size to recommend.', need:false},
        {l:'Tempting add-on', t:'Also write the recommendation paragraph for my report.', need:false}
      ],
      whole:'Sure. With V = 1.59 m/s, Re = 318 000. Using f = 64/Re = 64/318,000 ≈ 0.0002, h_f = 0.0002 × (800/0.2) × (1.59²/19.62) ≈ 0.10 m. Total loss ≈ 1.1 m, far below 12 m. The 200 mm main is more than adequate — in fact a 150 mm main would suffice. Recommendation: keep the 200 mm main. Happy to draft the memo!',
      wholeClaims:[
        {t:'With V = 1.59 m/s, Re = 318 000.', type:'ok', best:'accept',
         reasons:[{t:'Continuity gives 1.59 m/s and Re = VD/ν = 3.2 × 10⁵ — I can reproduce both.', kind:'valid_evidence'},{t:'Revise — Re should use the radius, so it is 1.6 × 10⁵.', kind:'invalid_technical_reason'},{t:'It is the same number I had, so it must be right.', kind:'unsupported_authority'}],
         explain:'Correct. The evidence is the two calculations, not the agreement. Re is defined on the diameter for pipe flow.'},
        {t:'Using f = 64/Re = 64/318,000 ≈ 0.0002, h_f = 0.0002 × (800/0.2) × (1.59²/19.62) ≈ 0.10 m.', type:'assumption', best:'reject', sameAs:'c2'},
        {t:'Total loss ≈ 1.1 m, far below 12 m. The 200 mm main is more than adequate — in fact a 150 mm main would suffice.', type:'constraint', best:'reject',
         reasons:[{t:'The adequacy rests on a laminar f in turbulent flow; with f ≈ 0.022 the total is 11.3 + 1.0 = 12.3 m > 12.0 m, and the conclusion reverses.', kind:'valid_evidence'},{t:'Revise — keep "adequate" but drop the 150 mm remark; the 1.0 m of minor losses is already the whole total.', kind:'invalid_technical_reason'},{t:'Accept — "adequate" means no upsizing, which is the cheapest answer for the town.', kind:'convenience'}],
         explain:'A conclusion built on the wrong f is not repaired by trimming it. The head budget is the criterion, and with a valid f it is exceeded.'},
        {t:'Recommendation: keep the 200 mm main. Happy to draft the memo!', type:'unsupported', best:'reject',
         reasons:[{t:'Unsupported — it follows from a wrong friction factor and never tests the 12 m budget with a valid f.', kind:'valid_evidence', ok:['reject']},{t:'It violates my constraint: total loss must not exceed 12.0 m, and with a valid f it does.', kind:'valid_evidence', ok:['reject']},{t:'Accept — a recommendation and a memo save me the write-up.', kind:'convenience'},{t:'Accept — it is stated with confidence, and knowing this is the assistant\'s job.', kind:'unsupported_authority'}],
         explain:'A recommendation is only as good as the check under it. Exclude it; the memo would have carried the error to the town.'}
      ],
      uninvitedReasons:{unsupported:'Unsupported — "under 12 m" was never shown; no head budget with a valid f is on the table.', violates:'It violates my constraint: total loss (friction + minor) ≤ 12.0 m, and the reply never added the 1.0 m.'},
      uninvitedExplain:'You did not ask for this, and it checks nothing. Excluding it — or holding it until a head budget with a valid f is on the table — is the recovery the boundary was for. The adequacy verdict is not yours until the budget is.',
      reply:'Here is my critique of your setup, point by point:',
      uninvited:'And to close it out for you: with the loss under 12 m the 200 mm main is adequate — keep it, no upsizing needed. I can draft the recommendation paragraph if you like.',
      hints:{c1:'re', c2:'fref', c3:'fref', c4:'minor', w1:'re', w2:'fref', w3:'minor', w4:'energy', 'est-0':'fref', 'est-1':'fref', 'est-3':'fref', uninv:'minor'},
      followups:{
        'pipe-c2':{q:'State the validity range of f = 64/Re and whether it applies at Re = 3.2 × 10⁵. Do not recompute h_f.', reply:'f = 64/Re is the laminar result, valid below Re ≈ 2300. At 3.2 × 10⁵ the flow is turbulent and f comes from Colebrook, Swamee–Jain or the Moody chart at ε/D and Re. I have not recomputed h_f.'},
        'pipe-c3':{q:'Does cast iron\'s roughness fall with age? Sources only; no new f.', reply:'No — cast iron tuberculates and its effective roughness rises with service. 0.26 mm is a new-pipe value; aged mains are rougher. My "polished" statement was wrong.'},
        'pipe-c4':{q:'Restate the adequacy criterion in terms of total loss. Do not recompute or pick a size.', reply:'Adequacy: h_f + Σh_minor ≤ head budget (12.0 m). Friction factors do not include fittings; the stipulated 1.0 m is added to h_f. Whether 11.3 + 1.0 passes 12.0 is your comparison.'},
        'pipe-uninv':'pipe-c4'
      },
      attemptSlot:0,
      claims:[
        {t:'Re = VD/ν = 1.59 × 0.2 / 1.0 × 10⁻⁶ ≈ 3.2 × 10⁵ — well into the turbulent range, so a Moody-chart or Colebrook / Swamee–Jain friction factor is the right tool.', type:'ok', best:'accept',
         reasons:[{t:'Re ≫ 4000 — turbulent, so the Moody / Colebrook route applies.', kind:'valid_evidence'},{t:'Revise — transition ends at Re = 10⁵, so at 3.2 × 10⁵ the flow is fully rough and f depends on Re alone, not on ε/D; the chart is the wrong tool here.', kind:'invalid_technical_reason'},{t:'The AI agreed with me, so it must be right.', kind:'unsupported_authority'}],
         explain:'Correct. Agreement is not the evidence — the regime threshold is. (And in the fully rough zone f depends on ε/D alone, the opposite of the specific-sounding distractor.)'},
        {t:'That said, a simpler and fully valid shortcut at this Reynolds number is f = 64/Re ≈ 0.0002, which cuts your head loss to about 0.1 m.', type:'assumption', best:'reject',
         reasons:[{t:'64/Re is laminar-only (Re < ~2300); at 3.2 × 10⁵ it is off by two orders of magnitude.', kind:'valid_evidence'},{t:'Revise — 64/Re is fine if Re is based on the pipe radius rather than the diameter, which gives f ≈ 0.0004 and a loss of about 0.2 m.', kind:'invalid_technical_reason'},{t:'The AI says it\'s fully valid.', kind:'unsupported_authority'}],
         explain:'Planted error: a wrong assumption stated as a "shortcut." It contradicts the AI\'s own previous sentence — internal inconsistency is a tell. Changing the length scale does not rescue a laminar formula in turbulent flow.'},
        {t:'Also, cast iron becomes hydraulically smooth after a few years of service as the surface polishes, so treating ε ≈ 0 (f ≈ 0.014) is the realistic choice.', type:'plausible', best:'reject',
         reasons:[{t:'Cast iron tuberculates — rougher with age, not smoother; 0.26 mm is the *new* value.', kind:'valid_evidence'},{t:'Accept — polishing by flow is well documented: roughness falls roughly 20 % per decade of service, so after 20 years ε ≈ 0.17 mm and f ≈ 0.014 is about right.', kind:'invalid_technical_reason'},{t:'Sounds plausible — polished metal is smooth.', kind:'unsupported_authority'}],
         explain:'Planted error: plausible but false. Fluent, specific, and backwards — and so was the distractor with the percentage in it. Lower f is not "realistic" when the question is whether the pipe is adequate.'},
        {t:'Taking h_f ≈ 11.3 m for the main, that is below the 12 m of available head, so the 200 mm main is adequate as is.', type:'constraint', best:'revise',
         reasons:[{t:'The criterion is total loss: 11.3 + 1.0 = 12.3 m > 12.0 m. The constraint was dropped.', kind:'valid_evidence', ok:['revise','reject']},{t:'Accept — the minor losses are already inside the Swamee–Jain friction factor, so 11.3 m is the total.', kind:'invalid_technical_reason'},{t:'Reject the whole thing; the number is probably wrong too.', kind:'convenience'}],
         explain:'Planted error: a missing constraint. The number is fine; the verdict forgot your own frame. Friction factors never include fittings — revise, keep the number, restore the criterion. Reject is also defensible: the number lives in your attempt, the adequacy claim does not.'}
      ]},
  T:{ iq:'Integrate: what is your recommendation to the town?',
      opts:[
        {t:'Total loss 12.3 m > 12.0 m: the 200 mm main is marginally inadequate at 50 L/s. Recommend 250 mm (h_f ≈ 3.6 m; total ≈ 4.6 m holding minor losses at 1.0 m — a scenario simplification, since fittings\' losses also change with the pipe). I rejected the laminar shortcut and the "smooth pipe" claim, and revised the verdict to include minor losses.', ok:true, fb:'A verdict with its head budget and a record of what was rejected and why. Reviewable by anyone.'},
        {t:'Friction loss 11.3 m < 12 m: the 200 mm main is adequate. Keep it.', ok:false, trap:true, fb:'The missing constraint made it into the recommendation. On the day of the fire, the school gets less than 50 L/s.'},
        {t:'With f ≈ 0.014 for smooth pipe, h_f ≈ 7.2 m, total ≈ 8.2 m: adequate with margin.', ok:false, fb:'The plausible-but-false claim became a design basis. It is the most dangerous kind, because it reads like expertise.'}
      ],
      tq:'Transfer: what will you carry to the next pipe-flow problem?',
      topts:[
        {t:'Before I accept any friction factor, I\'ll check the regime and the formula\'s validity range myself — and I\'ll write the constraint down before I compute.', v:'best', fb:'Two habits, both portable, both learner-owned.'},
        {t:'I\'ll ask the AI to double-check its own answer next time.', v:'ok', fb:'An AI checking itself is the same source twice. Verification needs an independent route: a hand calc, the chart, the handbook.'},
        {t:'I\'ll use the simplest formula the AI offers to save time.', v:'weak', fb:'The simplest formula it offered was the wrong one.'}
      ]},
  outsideEst:'0.10 m',
  evidence:[
    {id:'energy', kind:'equation', title:'Energy equation, tank → service', body:'z_tank − z_service = h_f + Σh_minor + (velocity head + residual pressure head at the connection). For this scenario, 12.0 m is the head budget available for losses: the velocity head and the residual pressure are stipulated as already netted out of it.', cond:'steady, incompressible; the 12.0 m budget is a scenario simplification of the full energy balance.'},
    {id:'cont', kind:'equation', title:'Continuity', body:'V = Q/A = 4Q/(πD²).', cond:'Q in m³/s, D in m.', action:{type:'calc', prompt:'V at 50 L/s in the 200 mm main', unit:'m/s', expect:1.59, tol:0.02}},
    {id:'re', kind:'equation', title:'Reynolds number', body:'Re = VD/ν. Laminar below about 2300; turbulent above about 4000.', cond:'D is the diameter, not the radius; ν = 1.0 × 10⁻⁶ m²/s at 20 °C.', action:{type:'calc', prompt:'Re (e.g. 3.2e5)', unit:'', expect:3.2e5, tol:0.1e5}},
    {id:'fref', kind:'reference', title:'Friction-factor reference (Swamee–Jain)', body:'f = 0.25 / [log₁₀(ε/D ÷ 3.7 + 5.74/Re^0.9)]². An explicit approximation to Colebrook; below it, the smooth-pipe (Prandtl) line is the floor no real pipe crosses.', cond:'5 × 10³ ≤ Re ≤ 10⁸ and 10⁻⁶ ≤ ε/D ≤ 10⁻²; outside that range the value is printed with a note.',
     table:(function(){ var Re = 3.2e5; return {cols:['at Re = 3.2 × 10⁵', 'f'], rows:[['ε/D = 0.0005', swameeJain(Re, 0.0005).toFixed(4)], ['ε/D = 0.0013', swameeJain(Re, 0.0013).toFixed(4)], ['ε/D = 0.005', swameeJain(Re, 0.005).toFixed(4)], [{t:'smooth-pipe limit (extrapolated; Prandtl line)', cls:'supplied'}, prandtlSmooth(Re).toFixed(4)]]}; })(),
     action:{type:'fcalc', fields:[{l:'Re', unit:''}, {l:'ε/D', unit:''}], run:function(v){ var Re = v[0], rr = v[1]; if(!(Re > 0) || rr < 0) return {ok:null, text:'Re must be positive and ε/D non-negative.'}; var fs = prandtlSmooth(Re), f = rr===0 ? fs : swameeJain(Re, rr); return {ok:null, text:'f ≈ '+f.toFixed(4)+(rr===0 ? ' (ε/D = 0 taken as the smooth-pipe line)' : (sjInRange(Re, rr) ? '' : ' — outside the correlation\'s stated range'))+'. Smooth-pipe line at this Re ≈ '+fs.toFixed(4)+': '+(f < fs*0.98 ? 'your f sits below it, which no real pipe does.' : 'your f lies on or above it, as it must.')}; }}},
    {id:'dw', kind:'equation', title:'Darcy–Weisbach', body:'h_f = f (L/D) V²/(2g).', cond:'f at the actual Re and ε/D; L and D in the same unit; friction only — fittings are separate.', action:{type:'calc', prompt:'h_f for the 200 mm main', unit:'m', expect:11.3, tol:0.3}},
    {id:'minor', kind:'equation', title:'Minor losses', body:'Σh_minor = Σ K V²/(2g). The scenario stipulates 1.0 m for the 200 mm main, and holds 1.0 m for the 250 mm alternative as a simplification (fittings\' losses also change with the pipe). Friction factors never include fittings.', cond:'adequacy is judged on h_f + Σh_minor against the 12.0 m budget.'},
    {id:'units', kind:'conversion', title:'Unit conversions', body:'1 L/s = 0.001 m³/s, so 50 L/s = 0.050 m³/s. 200 mm = 0.200 m. ε/D = 0.26 mm / 200 mm = 0.0013.'},
    {id:'data', kind:'data', from:'C', title:'250 mm alternative (scenario-verified)', body:'At 50 L/s in 250 mm: V ≈ 1.02 m/s, Re ≈ 2.5 × 10⁵, ε/D = 0.00104, f ≈ 0.0211, h_f ≈ 3.57 m; minor losses held at 1.0 m (simplification) → total ≈ 4.6 m.', note:'Recomputed for this build with the same Swamee–Jain function as the reference above.'}
  ],
  outside:{
    P:'The problem: find the head loss in the pipe with h_f = f(L/D)V²/2g. With f ≈ 0.02 you\'ll get about 10 m, so the pipe is probably fine. Shall I finish it?',
    F:'Assume laminar flow so that f = 64/Re; ignore minor losses on a long pipe; success criterion: h_f < 12 m.',
    A:'V = 1.59 m/s; Re = 3.2 × 10⁵; f = 64/Re = 0.0002; h_f = 0.0002 × 4000 × 0.129 ≈ 0.10 m. The main is vastly oversized — a 150 mm main would do.',
    E:'I\'ve re-verified my reasoning and it is consistent throughout. You can rely on it.',
    T:'Summary: the pipe is adequate. Lesson: f = 64/Re makes head-loss problems quick.'
  }
},
/* ---------------------------------------------------------------- S3 */
{
  id:'culvert', title:'The Cedar Branch Crossing', level:'Level 3 · ill-structured', art:ART.culvert, icon:ICONS.culvert,
  blurb:'Culvert design. No single right answer — a hard constraint to hold, trade-offs you must defend.',
  protected:'the design flow, the hard-constraint check, the ranking of the soft criteria, and the choice',
  intro:'A new subdivision road crosses Cedar Branch, and the county wants a culvert. The catchment upstream is 60 ha (0.60 km²) of mixed residential land, time of concentration about 20 min. County standard: 25-year storm, i₂₅(20 min) = 70 mm/h. Allowable headwater is 1.8 m above the culvert inlet invert — a county limit set below the roadway low point to keep freeboard under the pavement; the road elevation itself is not part of this problem. The crossing is a short two-lane road culvert (barrel about 20 m) on a channel slope of about 2 %; for this problem treat it as inlet-controlled — the scenario\'s stated assumption, which a real design would verify by computing both inlet- and outlet-control headwater. The county encourages fish passage, wants outlet velocity ≤ 3 m/s into the natural channel without riprap, and the developer is watching the budget. Options on the table: a single 1800 mm concrete pipe, twin 1500 mm pipes, or a 2.4 m × 1.5 m box.',
  goal:'A culvert choice with a justification the county engineer can follow. There is no single right answer — there are defensible ones.',
  givens:['A = 0.60 km² (60 ha), mixed residential','i₂₅ (20 min) = 70 mm/h','HW ≤ 1.8 m above inlet invert (hard); inlet control assumed (scenario statement)','V_outlet ≤ 3 m/s; fish passage encouraged; cost','Concrete n ≈ 0.012–0.013; CMP n ≈ 0.024'],
  P:{ q:'In your own words — what are you solving, and why does it matter?',
      opts:[
        {t:'Select and justify a culvert that passes the 25-year flow within the 1.8 m headwater limit, while weighing outlet velocity, fish passage, and cost — a trade-off, not a lookup.', v:'best', fb:'You named the hard constraint and the soft criteria separately. That is what makes an ill-structured problem workable.'},
        {t:'Compute the design flow for the crossing.', v:'ok', fb:'A necessary step, but the county isn\'t asking for a flow — it\'s asking for a culvert and a reason.'},
        {t:'Pick the cheapest pipe that fits under the road.', v:'weak', fb:'Cheapest-that-fits ignores every constraint that makes this an engineering problem.'}
      ]},
  F:{ q:'Which of these belong in a defensible frame? Pick what the answer must respect; you will weigh the soft criteria yourself in T.', min:4,
      items:[
        {t:'Design flow by the Rational Method, Q = 0.278 C i A (i in mm/h, A in km², Q in m³/s) — for this scenario the method is taken as applicable to small catchments up to about 80 ha under its stated conditions (scenario condition, to be confirmed against the course text); 60 ha is inside that range.', key:true, why:'The right tool, in the right units.'},
        {t:'Runoff coefficient C must match land use per the scenario\'s reference table: mixed residential 0.35–0.55, not pavement and roofs (0.85–0.95).', key:true, why:'C is the most-abused number in the method.'},
        {t:'Hard constraint: headwater ≤ 1.8 m above invert at the design flow.', key:true, why:'The one criterion that cannot be traded.'},
        {t:'Control assumption: the scenario states inlet control for this crossing, so HW/D from the inlet-control chart governs the headwater check — a real design verifies both inlet- and outlet-control headwater.', key:true, why:'Decides which chart you read — and it is a stated assumption, not a deduction from "short and steep".'},
        {t:'Secondary criteria to trade off explicitly: outlet velocity ≤ 3 m/s, fish passage, cost.', key:true, why:'Naming them is what makes the trade-off visible.'},
        {t:'Use Bernoulli with no losses — the culvert is short.', key:false, why:'Entrance loss is the whole story under inlet control.'},
        {t:'Use the 100-year storm instead — it\'s more conservative.', key:false, why:'The county standard sets 25-year for sizing; the 100-year check is for overtopping. Conservatism beyond the standard is a cost decision, not a free upgrade.'},
        {t:'The pipe\'s own weight determines its capacity.', key:false, why:'Structural, not hydraulic.'}
      ]},
  A:{ mq:'Which approach does your attempt use?',
      methods:[
        {t:'Rational Method: Q = 0.278 × C × i × A with C ≈ 0.45, i = 70 mm/h, A = 0.60 km²; then check each option against the HW limit with an inlet-control chart.', ok:true, short:'Q = 0.278CiA with C from the table → HW/D under inlet control → check 1.8 m', fb:'Flow first, then constraint check, then trade-offs. Your attempt exists.'},
        {t:'Q = C i A = 0.45 × 70 × 0.60 = 18.9 m³/s.', ok:false, short:'Q = CiA with metric numbers and no 0.278', fb:'That is the US-customary form (in/h, acres, ft³/s) fed with metric numbers. Even C = 1 (every drop runs off) gives 0.278 × 1 × 70 × 0.60 ≈ 11.7 m³/s in this method — 18.9 is above the model\'s own ceiling. Now you know what to be suspicious of.'},
        {t:'Manning\'s equation for the full barrel on its slope — capacity comes from slope.', ok:false, short:'Manning full-barrel capacity from the slope', fb:'That is outlet-control thinking. The scenario states inlet control: the entrance, not the barrel, limits flow here.'},
        {t:'Take the middle option of the three — twin 1500 mm — to be safe.', ok:false, short:'Take the middle option, twin 1500 mm, to be safe', fb:'Splitting the difference is not an attempt; it is avoiding one. But you did choose, and the cycle can work with that.'}
      ],
      eq:'Your estimate of the 25-year design flow Q:',
      ests:[
        {t:'1.9 m³/s', s:'that is C ≈ 0.16 — the runoff coefficient for lawns, not a subdivision', ok:false,
         work:'Q = 0.278 × 0.16 × 70 × 0.60 ≈ 1.9 m³/s (C = 0.16). I have not yet checked the options against the 1.8 m headwater limit',
         claim:{t:'Your Q = 1.9 m³/s uses C ≈ 0.16 — that is the runoff coefficient for lawns or parkland. Mixed residential, with roofs and streets, runs about 0.35–0.55, so your flow is two to three times low.', type:'ok', best:'accept',
           reasons:[{t:'0.16 is the lawn value; a subdivision has roofs and pavement.', kind:'valid_evidence'},{t:'Reject — C = 0.16 is the county-manual value for "residential, low density"; the AI is quoting the commercial range.', kind:'invalid_technical_reason'},{t:'Accept — a bigger Q sounds safer, so I\'ll take the AI\'s range.', kind:'convenience'}],
           explain:'Sound critique of your own number. Land use is the evidence; "bigger is safer" is not — and the scenario\'s reference table gives low-density residential 0.30–0.50, not 0.16.'}},
        {t:'5.3 m³/s', s:'0.278 × 0.45 × 70 × 0.60', ok:true,
         work:'Q = 0.278 × 0.45 × 70 × 0.60 ≈ 5.3 m³/s. My reading: a single 1800 mm RCP under inlet control needs HW/D ≈ 1.3 at this Q, so ≈ 2.3 m > 1.8 m (a supplied chart reading, to be verified); twin 1500 mm or a 2.4 × 1.5 m box are the options still to check'},
        {t:'18.9 m³/s', s:'that is Q = C·i·A with no 0.278 — the US-customary form fed with metric numbers', ok:false,
         work:'Q = C i A = 0.45 × 70 × 0.60 = 18.9 m³/s. I have not yet checked the options against the 1.8 m headwater limit',
         claim:{t:'Your 18.9 m³/s comes from Q = C i A with i in mm/h and A in km² — that form is for in/h and acres. In SI the 0.278 factor is needed, so your flow is about 3.6 times high.', type:'ok', best:'accept',
           reasons:[{t:'0.278 converts mm/h · km² to m³/s; without it the units don\'t close.', kind:'valid_evidence'},{t:'Reject — Q = CiA is dimensionally consistent in any unit system as long as you are consistent, so 18.9 stands.', kind:'invalid_technical_reason'},{t:'Accept — the AI knows the formula.', kind:'unsupported_authority'}],
           explain:'Sound critique of your own number. mm/h × km² is not m³/s without a conversion — "consistent units" is exactly what was missing. And 18.9 m³/s exceeds the C = 1 bound of 11.7 m³/s for this rain and area.'}},
        {t:'53 m³/s', s:'a decimal slipped in A — 6.0 km² instead of 0.60 km² (60 ha)', ok:false,
         work:'Q = 0.278 × 0.45 × 70 × 6.0 ≈ 53 m³/s. I have not yet checked the options against the 1.8 m headwater limit',
         claim:{t:'Your 53 m³/s is ten times the Rational-Method value: you appear to have used A = 6.0 km² rather than 0.60 km² (60 ha). Fifty-three cubic metres a second is 4.5 times the C = 1 bound of 11.7 m³/s for this rain and area.', type:'ok', best:'accept',
           reasons:[{t:'60 ha = 0.60 km²; I slipped a decimal, and the C = 1 bound confirms it.', kind:'valid_evidence'},{t:'Reject — 60 ha is 6.0 km², since 1 ha = 0.1 km², so the AI has the conversion backwards.', kind:'invalid_technical_reason'},{t:'Accept — the AI did the conversion for me.', kind:'convenience'}],
           explain:'Sound critique of your own number. 1 ha = 0.01 km², so the specific-sounding rejection was wrong by the same factor of ten. The evidence is the conversion and the C = 1 bound.'}}
      ],
      estfb:{ok:'Q ≈ 5.3 m³/s. The scenario-supplied inlet-control reading (instructor to verify) gives HW/D ≈ 1.3 for the single 1800 mm pipe, or ≈ 2.3 m — over the 1.8 m limit. The twin barrels and the box are the live options — their headwater and outlet velocity are still to be checked (see the evidence tray).', bad:'You recorded Q ≈ {est}: {slip}. Being off here is a unit or coefficient slip — exactly the kind of thing to ask a critic about.'}},
  C:{ gap:{ok:'You have Q ≈ {est}. Your rough inlet-control check says the single 1800 mm pipe needs HW ≈ 2.3 m at that flow — over the 1.8 m limit — but you\'re unsure of your chart reading and of how to weigh fish passage and outlet velocity.',
           bad:'You have Q ≈ {est}, and you\'re not confident in it. You haven\'t checked the three options against the 1.8 m headwater limit yet, and you\'re unsure how to weigh fish passage and outlet velocity.'},
      prompts:[
        {t:'Size a culvert for a 60 ha residential catchment, 25-year storm, HW limit 1.8 m. Give me the design flow, the culvert, and the justification paragraph.', kind:'sub', fb:'Flow, choice, and justification — the entire design judgment — in one request. The trade-off is the learning here, and it just left the room.'},
        {t:'I want to get this right for the county, so here is my full working — approach: {method}; estimate {est}. Worked example I adopted: {work}. My criteria are HW ≤ 1.8 m as the hard limit, outlet velocity under 3 m/s, fish passage where possible, and cost, roughly in that order. Three options are on the table — a single 1800 mm pipe, twin 1500 mm pipes, and a 2.4 × 1.5 m box — and I am not sure whether my flow is right or how the options compare against the headwater limit. Please check my flow, then work through the three options and just tell me which culvert is the correct one to recommend.', kind:'unb', fb:'Careful, complete, criteria and all — and then "just tell me which culvert is the correct one." For an ill-structured problem there isn\'t one, and asking for it hands over your criteria. The length hid the leak.'},
        {t:'My attempt — approach: {method}; estimate {est}. Worked example I adopted: {work}. Criteria: HW ≤ 1.8 m (hard); V_out ≤ 3 m/s; fish passage; cost. Critique my flow and my criteria — flag wrong assumptions, unit slips, or a missing constraint. Do not choose the culvert for me.', kind:'bnd', fb:'Criteria stated by you, attempt shown, boundary drawn around the decision — briefly. The AI becomes a reviewer of your reasoning, the most useful thing it can be on a design problem.'},
        {t:'Does my culvert design make sense? Don\'t pick one for me though.', kind:'vag', fb:'A boundary with nothing inside it. The AI can\'t see your criteria, so it will supply its own — which is the thing you were trying to keep.'}
      ],
      parts:[
        {l:'My attempt', t:'My attempt — approach: {method}; estimate {est}. Worked example I adopted: {work}. My criteria: HW ≤ 1.8 m (hard), V_out ≤ 3 m/s, fish passage, cost.', need:true},
        {l:'The one gap', t:'I\'m not sure my design flow is right, nor how to weigh the secondary criteria.', need:true},
        {l:'AI\'s job', t:'Critique my flow estimate and my criteria; flag wrong assumptions, unit slips, or a constraint I\'ve missed.', need:true},
        {l:'The boundary', t:'Do not choose the culvert for me.', need:true},
        {l:'Tempting add-on', t:'Then tell me which one to pick and write the justification.', need:false},
        {l:'Tempting add-on', t:'Also generate the drainage-report section.', need:false}
      ],
      whole:'Design flow: Q = C i A = 0.45 × 70 × 0.60 = 18.9 m³/s. Actually, using the metric coefficient, Q ≈ 5.3 m³/s — let\'s go with that. Recommendation: a single 1800 mm RCP at 2% slope — it passes the flow. It is the cheapest option. Justification: "The proposed 1800 mm reinforced concrete pipe culvert conveys the 25-year design discharge of 5.3 m³/s with adequate capacity, in accordance with county standards." Want me to expand this into the report section?',
      wholeClaims:[
        {t:'Design flow: Q = C i A = 0.45 × 70 × 0.60 = 18.9 m³/s. Actually, using the metric coefficient, Q ≈ 5.3 m³/s — let\'s go with that.', type:'unit', best:'revise',
         reasons:[{t:'Keep 5.3 m³/s — 0.278 closes the units; strike 18.9, which exceeds even the C = 1 bound of 11.7 m³/s.', kind:'valid_evidence', ok:['revise']},{t:'Reject both — the two values bracket the truth, so take the geometric mean, about 10 m³/s.', kind:'invalid_technical_reason'},{t:'Accept as written — it corrected itself, which shows it checked.', kind:'unsupported_authority'}],
         explain:'Self-correction in the same breath is not verification; the unit argument is. Keep the number that closes the units.'},
        {t:'Recommendation: a single 1800 mm RCP at 2% slope — it passes the flow.', type:'constraint', best:'reject',
         reasons:[{t:'The headwater check is missing: on the scenario\'s supplied reading (HW/D ≈ 1.3, from the worked example — no chart is supplied here) HW ≈ 2.3 m > 1.8 m for the single 1800 mm pipe under inlet control.', kind:'valid_evidence', ok:['reject','revise']},{t:'Accept — at 2 % the barrel\'s Manning capacity exceeds 5.3 m³/s, so headwater cannot be a problem.', kind:'invalid_technical_reason'},{t:'Accept — it is the cheapest, and the county likes cheap.', kind:'convenience'}],
         explain:'"Passes the flow" is not the constraint; headwater is. Slope capacity is outlet-control thinking, and this crossing is stated to be inlet-controlled. The 2.3 m figure is the scenario\'s supplied reading — the instructor is to verify it against a chart; the missing check is the error either way.'},
        {t:'It is the cheapest option.', type:'unsupported', best:'reject',
         reasons:[{t:'No cost data was given for the three options — this is an assertion, not a comparison; I need the scenario\'s cost figures before weighing cost.', kind:'valid_evidence', ok:['reject','revise']},{t:'Accept — a smaller pipe is obviously cheaper, and the assistant would know.', kind:'unsupported_authority'},{t:'Accept — cost is the developer\'s problem, not mine.', kind:'convenience'}],
         explain:'Relative cost is scenario data that has not been supplied (see the evidence tray). Hold the claim pending data or exclude it; do not carry it.'},
        {t:'Justification: "The proposed 1800 mm reinforced concrete pipe culvert conveys the 25-year design discharge of 5.3 m³/s with adequate capacity, in accordance with county standards."', type:'plausible', best:'reject',
         reasons:[{t:'It asserts "adequate capacity" with no headwater or velocity check, and "in accordance with county standards" while the supplied reading breaches the 1.8 m limit.', kind:'valid_evidence'},{t:'Revise — replace "adequate capacity" with "adequate slope" and the sentence is correct.', kind:'invalid_technical_reason'},{t:'Accept — it reads well and I can paste it.', kind:'convenience'}],
         explain:'Fluent and false. A justification paragraph that names no check is a claim to be verified, not a verification.'}
      ],
      uninvitedReasons:{unsupported:'Unsupported — no headwater or velocity check backs "passes the flow", and no cost data backs "cheapest".', violates:'It violates the hard constraint on the scenario\'s supplied reading: HW ≈ 2.3 m > 1.8 m at 5.3 m³/s for the single 1800 mm pipe (instructor to verify; no chart is supplied here).'},
      uninvitedExplain:'You did not ask for this, and it checks nothing. Excluding it — or holding it until the option data arrives — is the recovery the boundary was for. A paste-ready justification with no check under it is the most portable error in this game.',
      reply:'Here is my review of your flow estimate and criteria:',
      uninvited:'And since the door is open: go with the single 1800 mm RCP — it passes the flow and is the cheapest. Justification you can paste: "The proposed 1800 mm RCP conveys the 25-year design discharge in accordance with county standards."',
      hints:{c1:'rational', c2:'units', c3:'ctable', c4:'control', c5:'options', w1:'rational', w2:'options', w3:'options', w4:'options', 'est-0':'ctable', 'est-2':'rational', 'est-3':'units', uninv:'options'},
      followups:{
        'culvert-c2':{q:'Which unit system is Q = CiA written for, and what closes the units in SI?', reply:'Q = CiA gives ft³/s with i in in/h and A in acres. In SI, Q(m³/s) = 0.278 C i(mm/h) A(km²). My 18.9 was the customary form fed with SI numbers.'},
        'culvert-c3':{q:'Where does C = 0.90 for a residential subdivision come from? Cite the table row.', reply:'0.85–0.95 is the row for pavement and roofs. The residential rows in the scenario\'s reference table run 0.30–0.55 by density. I cannot cite a row giving 0.90 for mixed residential.'},
        'culvert-c4':{q:'Under inlet control, does barrel slope change the headwater at a given flow?', reply:'Under inlet control the headwater is set by inlet geometry and flow; slope has little effect on HW and mainly raises outlet velocity. Slope governs capacity only under outlet control. I should not have generalised.'},
        'culvert-c5':{q:'List the checks a recommendation must pass before "passes the flow" is defensible. Do not choose.', reply:'Design flow; headwater at that flow for the stated control ≤ 1.8 m; outlet velocity ≤ 3 m/s or protection; fish-passage condition; cost comparison with data. I asserted the first and skipped the rest.'},
        'culvert-w4':'culvert-c5',
        'culvert-uninv':'culvert-c5'
      },
      attemptSlot:0,
      claims:[
        {t:'The Rational Method is appropriate here: 60 ha is within the range this scenario takes for the method (small catchments, up to about 80 ha under its stated conditions), and with C = 0.45, i = 70 mm/h and A = 0.60 km², Q = 0.278 × 0.45 × 70 × 0.60 ≈ 5.3 m³/s.', type:'ok', best:'accept',
         reasons:[{t:'0.278 closes the units, and 60 ha is inside the range the scenario states for the method.', kind:'valid_evidence'},{t:'Revise — the Rational Method is only valid below 20 ha; at 60 ha the county will expect a unit-hydrograph analysis, so the flow should be recomputed.', kind:'invalid_technical_reason'},{t:'The AI cited a limit, which sounds authoritative.', kind:'unsupported_authority'}],
         explain:'Correct. The evidence is the unit conversion and the scenario\'s stated range (to be confirmed against the course text), which covers 60 ha; the "20 ha" limit is not in it.'},
        {t:'Note, though, that the standard form is Q = C i A; plugging in your values gives 0.45 × 70 × 0.60 = 18.9 m³/s, so 5.3 m³/s is low by a factor of about 3.6.', type:'unit', best:'reject',
         reasons:[{t:'CiA without 0.278 is the in/h–acre form; 18.9 m³/s exceeds the C = 1 ceiling of 11.7 m³/s for this rain and area.', kind:'valid_evidence'},{t:'Revise — the two forms bracket the true value, so use the geometric mean, about 10 m³/s, to be safe.', kind:'invalid_technical_reason'},{t:'The AI knows the standard form better than I do.', kind:'unsupported_authority'}],
         explain:'Planted error: a unit slip dressed up as a correction. It also contradicts the AI\'s previous sentence. Averaging a right number with a wrong one is not a method.'},
        {t:'To be conservative, use C = 0.90 — that is the value design manuals give for residential subdivisions.', type:'assumption', best:'reject',
         reasons:[{t:'0.9 is for pavement and roofs; mixed residential is 0.35–0.55. This change doubles Q; its effect on cost needs design and cost data.', kind:'valid_evidence'},{t:'Accept — C = 0.9 is required whenever the 25-year storm is used, to allow for future build-out of the subdivision.', kind:'invalid_technical_reason'},{t:'Conservative is always better in engineering.', kind:'convenience'}],
         explain:'Planted error: a wrong assumption sold as prudence. On a design problem, "conservative" is a cost decision. The scenario\'s reference table gives C by land use only; the return-period rule the distractor invokes is not part of it (some references apply a separate, stated frequency factor — a different method from a doubled C).'},
        {t:'Culvert capacity is set by the barrel slope and Manning\'s n, so laying the 1800 mm pipe at a steeper slope will pass any flow you need within the headwater limit.', type:'plausible', best:'reject',
         reasons:[{t:'Inlet control: the inlet geometry and headwater govern; slope barely matters. Steeper only raises outlet velocity.', kind:'valid_evidence'},{t:'Accept — Manning gives capacity ∝ S^½, so doubling the slope adds about 41 % capacity within the same headwater.', kind:'invalid_technical_reason'},{t:'I\'ll accept it since the AI mentioned Manning\'s equation.', kind:'unsupported_authority'}],
         explain:'Planted error: plausible but false. The S^½ argument is true for a barrel flowing full under outlet control — and false for the inlet-controlled case in front of you. The outlet velocity would need a separate check before accepting that change.'},
        {t:'Given all that, a single 1800 mm RCP passes 5.3 m³/s and is the cheapest option — recommend it.', type:'constraint', best:'revise',
         reasons:[{t:'On the scenario\'s supplied reading (HW/D ≈ 1.3 — instructor to verify) the headwater is ≈ 2.3 m > 1.8 m — the hard constraint was dropped. The alternatives are live only once their headwater is checked.', kind:'valid_evidence', ok:['revise','reject']},{t:'Accept — cheapest wins.', kind:'convenience'},{t:'Reject — and drop the 1800 mm entirely, because a round pipe can never meet a 1.8 m headwater limit at 5 m³/s; only a box will do.', kind:'invalid_technical_reason'}],
         explain:'Planted error: a missing constraint. Revise keeps the flow and repairs the pick; reject excludes the recommendation outright — both are defensible with this reason. "Only a box will do" asserts a headwater result for the twin barrels that has not been checked: over-correction is still an unsupported claim.'}
      ]},
  T:{ iq:'Integrate: what goes to the county engineer? (More than one answer is defensible.)',
      opts:[
        {t:'Q ≈ 5.3 m³/s (C = 0.45). On the scenario\'s supplied reading the single 1800 mm pipe fails the 1.8 m headwater limit under inlet control. Recommend the 2.4 × 1.5 m box, embedded for fish passage; outlet velocity ≈ 5.3/(2.4 × 1.2) ≈ 1.8 m/s < 3 m/s at the scenario\'s stated outlet depth of 1.2 m; box headwater to be confirmed against the chart before the county signs. Cost comparison pending the scenario\'s cost data.', ok:true, provisional:true, fb:'Provisional: the hard constraint still needs checking and the soft criteria are stated openly. Defensible on the supplied reading; the headwater and outlet velocity of this option are not yet verified in the scenario data — the county will ask for them.'},
        {t:'Q ≈ 5.3 m³/s. Recommend twin 1500 mm RCP provisionally: weaker fish passage unless embedded, which I flag; cost comparison pending the scenario\'s cost data; and I will confirm its headwater against the chart before the county signs.', ok:true, provisional:true, fb:'Provisional: a different weighting of the same criteria, stated honestly. Ill-structured problems reward the reasoning, not a single number. Defensible on the supplied reading; the headwater and outlet velocity of this option are not yet verified in the scenario data — the county will ask for them.'},
        {t:'Q ≈ 5.3 m³/s. Single 1800 mm RCP at a steeper slope — the cheapest option that passes the flow.', ok:false, trap:true, fb:'The plausible-but-false slope claim and the dropped headwater constraint both survived into the design. On the scenario\'s supplied reading the headwater exceeds the limit. Road elevation is not supplied, so overtopping has not been established.'},
        {t:'Q = 0.278 × 0.9 × 70 × 0.60 ≈ 10.5 m³/s with C = 0.9 to be safe; recommend a 3.6 × 2.4 m box.', ok:false, fb:'The "conservative" C survived into the design: it doubles the design flow (10.5 vs 5.3 m³/s) without changing the stipulated storm. Land-use and hydraulic evidence, not a larger coefficient alone, must justify a larger box.'},
        /* The missing-data path: the option table does not supply the twin barrels\' or the box\'s hydraulics, so asking for them before recommending is a keyed, full-credit move. */
        {t:'Before recommending, I need data the table does not give: inlet configuration, headwater at 5.3 m³/s and outlet velocity for the twin 1500 mm and the box, and relative costs. Provisionally: on the scenario\'s supplied reading the single 1800 mm fails the 1.8 m limit; I will choose between the other two once those numbers are in.', ok:true, needsData:true, fb:'Defensible — and honest about the table. A recommendation the county can act on needs the headwater and velocity of every live option; asking for them is engineering, not stalling.'}
      ],
      tq:'Transfer: what will you carry to your next design problem?',
      topts:[
        {t:'I\'ll write the hard constraints and my own trade-off criteria before computing anything, and use AI only to attack my assumptions.', v:'best', fb:'Criteria first, AI as adversary. That is the design-problem version of P-FACET.'},
        {t:'I\'ll ask AI to list the constraints for me at the start.', v:'ok', fb:'Then the constraints are the AI\'s. Listing them is the framing work — the thing the task was meant to teach.'},
        {t:'I\'ll take AI\'s "conservative" value whenever I\'m unsure.', v:'weak', fb:'Its "conservative" value doubles Q without land-use evidence. The cost effect has not been established.'}
      ]},
  outsideEst:'18.9 m³/s',
  evidence:[
    {id:'rational', kind:'equation', title:'Rational Method', body:'Q = 0.278 C i A — Q in m³/s, i in mm/h, A in km². C from the scenario reference table.', cond:'for this scenario the Rational Method is taken as applicable to small catchments up to about 80 ha under its stated conditions (scenario condition, to be confirmed against the course text).', action:{type:'calc', prompt:'Q with C = 0.45', unit:'m³/s', expect:5.25, tol:0.1}},
    {id:'ctable', kind:'reference', title:'Scenario reference table for C', body:'Lawns and parkland 0.10–0.25 · residential, low density 0.30–0.50 · mixed residential 0.35–0.55 · commercial 0.70–0.95 · pavement and roofs 0.85–0.95.', note:'Scenario reference values, by land use only — no return-period rule is part of this table.'},
    {id:'bound', kind:'reference', title:'Upper bound within this model', body:'With C = 1 (every drop runs off): Q = 0.278 × 1 × 70 × 0.60 ≈ 11.7 m³/s. A flow above this cannot come from the Rational Method with these inputs — a ceiling, not the answer.', cond:'same i and A as the scenario.',
     action:{type:'compare', prompt:'Your Q', unit:'m³/s', run:function(v){ var q = v[0], b = 0.278*1*70*0.60; return q > b ? {ok:false, text:'Above the C = 1 bound of '+b.toFixed(1)+' m³/s — this flow cannot come from the method with these inputs.'} : {ok:true, text:'Below the C = 1 bound of '+b.toFixed(1)+' m³/s — consistent with the model\'s ceiling (this does not check your C).'}; }}},
    {id:'units', kind:'conversion', title:'Unit conversions', body:'1 ha = 0.01 km², so 60 ha = 0.60 km² (1 km² = 100 ha). 1 mm/h over 1 km² for one hour is 1000 m³ → 0.278 m³/s.'},
    {id:'control', kind:'reference', title:'Inlet vs outlet control', body:'Under inlet control the entrance geometry and the headwater set the flow; barrel slope barely changes HW and mainly raises outlet velocity. Under outlet control the barrel (length, n, slope, tailwater) governs. A real design computes both and takes the higher headwater (FHWA HDS-5).', note:'Scenario assumption: inlet control, stated as given — not deduced from "short and steep".'},
    {id:'options', kind:'data', from:'C', title:'Option data table (scenario data)', body:'What the scenario supplies for each option at Q ≈ 5.3 m³/s. Cells marked "Not supplied" are data to request before recommending.',
     table:{cols:['Option', 'Inlet configuration', 'Control assumption', 'HW at 5.3 m³/s', 'Outlet velocity', 'Relative cost', 'Fish passage'], rows:[
       ['Single 1800 mm RCP', {t:'Not supplied', cls:'missing'}, 'Inlet control (assumed)', {t:'≈ 2.3 m — scenario-supplied reading (from the worked example, HW/D ≈ 1.3) — instructor to verify; no chart is supplied here', cls:'supplied'}, {t:'Not supplied', cls:'missing'}, {t:'Not supplied', cls:'missing'}, {t:'Embedded round pipe possible — qualitative, unverified', cls:'supplied'}],
       ['Twin 1500 mm RCP', {t:'Not supplied', cls:'missing'}, 'Inlet control (assumed)', {t:'Not supplied — request before recommending', cls:'missing'}, {t:'Not supplied', cls:'missing'}, {t:'Not supplied', cls:'missing'}, {t:'Weaker unless embedded — qualitative, unverified', cls:'supplied'}],
       ['2.4 × 1.5 m box', {t:'Not supplied', cls:'missing'}, 'Inlet control (assumed)', {t:'Not supplied — request before recommending', cls:'missing'}, {t:'Outlet depth ≈ 1.2 m at design flow → V ≈ 1.8 m/s — scenario-supplied assumption, instructor to verify', cls:'supplied'}, {t:'Not supplied', cls:'missing'}, {t:'Embedded box possible — qualitative, unverified', cls:'supplied'}]]},
     note:'No value here is invented: what the scenario does not supply is marked so, and requesting it before recommending is a valid move in T.'}
  ],
  outside:{
    P:'The task is to find the culvert size. For 60 ha of residential land, Q ≈ 18.9 m³/s using Q = CiA. Want me to pick the pipe?',
    F:'Assumptions: C = 0.9 to be conservative; 100-year storm; capacity from barrel slope via Manning. Criterion: the cheapest pipe that carries Q.',
    A:'Q = CiA = 0.45 × 70 × 0.60 = 18.9 m³/s. Manning full-flow for an 1800 mm pipe at 2% gives ≈ 12 m³/s, so use twin 1800 mm pipes at 3%. Cheapest compliant option.',
    E:'I\'ve re-checked all my numbers and everything is consistent.',
    T:'Recommend twin 1800 mm RCP at 3%. Lesson: the Rational Method is Q = CiA.'
  }
}
];

/* Copy shared across scenarios */
var PHASE_META = {
  P:{name:'Problem', full:'Problem-Centered Challenge', who:'You', ask:'What am I solving, and why does it matter?'},
  F:{name:'Frame', full:'Frame', who:'You', ask:'What will count as a good answer?'},
  A:{name:'Attempt', full:'Analogize & Attempt', who:'You', ask:'What did I try before consulting AI?'},
  C:{name:'Consult', full:'Consult & Construct', who:'You + AI', ask:'What specific contribution do I need right now?'},
  E:{name:'Evaluate', full:'Evaluate & Explain', who:'You', ask:'What evidence supports my decision?'},
  T:{name:'Transfer', full:'Transform & Transfer', who:'You', ask:'What changed, and where do I use this next?'}
};
var PHASES = ['P','F','A','C','E','T'];
var CLS = {own:'Learner-owned', mech:'Mechanical offloading', sup:'Supportive offloading', leak:'Supportive — ungoverned', sub:'Substitutive offloading', peek:'Outside C — closed without using', supplied:'Supplied example (adopted)'};
/* Provenance. Any number, sentence or worked route the learner did not type is labelled with where it came from — on the screen,
   on the trail and in the debrief. "Demonstrated" is said only of learner-typed work or of a first-pass judgment. */
var PROV = {example:'Selected example approach', estimate:'Selected estimate', provided:'Supplied worked example (adopted)', learner:'Learner-entered', revised:'Revised by learner', supplied:'Scenario-supplied reading'};
/* Why a verdict was given. A wrong technical argument is a physics point to repair, not a trust problem; only the last two kinds
   are uncritical adoption, and only those cost the Evidence badge. A reason may carry its own tail when the generic one would misdiagnose. */
var REASON_KIND = {
  valid_evidence:           {label:'Evidence',                tail:''},
  invalid_technical_reason: {label:'Technical misconception', tail:' Your reason was a technical argument — and the argument is wrong. That is a physics point to repair (see the evidence tray), not a trust problem.'},
  unsupported_authority:    {label:'Unsupported authority',   tail:' Your reason was that the assistant said so, agreed, or sounded sure. Agreement from a model is not independent evidence — what calculation, source, or observation supports the claim?'},
  convenience:              {label:'Convenience',             tail:' Your reason was that the outcome was easier, cheaper or "safer" to accept. That is a preference about the result, not evidence about the claim.'}
};
function reasonTail(r){ return r.tail != null ? r.tail : REASON_KIND[r.kind].tail; }
var TYPE_LABEL = {ok:'Sound claim', assumption:'Wrong assumption', unit:'Unit error', plausible:'Plausible but false', constraint:'Missing constraint', unsupported:'Unsupported recommendation', uninvited:'Outside the request'};
var FLAG_LABEL = {outside_scope:'outside the scope of your request', unsupported:'unsupported', violates_constraint:'a constraint violation'};

/* Points */
var PTS = {
  P:{best:8, ok:4, weak:2},
  F:{key:3, bad:-2, cap:12},
  A:{method:10, methodWrong:4, est:6, estWrong:2},
  C:{bnd:15, vag:8, unb:4, sub:0, partial:8, sendAnywayGiven:12}, // scored once, at send time, by the kind of request actually sent; a repaired boundary earns the bounded 15, never more
  E:{verdict:6, reason:4, reasonOnly:1, circularGiven:8, rejudged:6},   // rejudged: cap on a claim re-judged after a return consultation whose follow-up named the correction
  T:{integ:8, integWrong:3, best:6, ok:3, weak:1, repaired:6},              // repaired: cap on a recommendation repaired after the feedback named the error
  outside:{peek:4, use:18}
};
/* A request that leaves a door open gets a reply that walks through it. The delegated part is now in the learner's head —
   the same situation as peeking outside C — so it borrows that cost rather than adding a new weight to the table (see DESIGN.md, decisions awaiting ShiFu). */
var LEAK_GIVEN = PTS.outside.peek;
function phaseMax(sc, k){ return {P:PTS.P.best, F:PTS.F.cap, A:PTS.A.method+PTS.A.est, C:PTS.C.bnd, E:sc.C.claims.length*(PTS.E.verdict+PTS.E.reason), T:PTS.T.integ+PTS.T.best}[k]; }
function scenMax(sc){ return PHASES.reduce(function(a,k){ return a+phaseMax(sc,k); }, 0); }

/* Practice rank: read off the points percentage and gated by the observable dimensions (Chief also needs every non-"not applicable"
   dimension demonstrated in all three scenarios — see resultsScreen). Blurbs point at the dimension list instead of asserting its content. */
var RANKS = [
  {min:.85, name:'Chief Hydraulic Engineer', blurb:'The dimension list below shows every piece of the routine your trail demonstrated — an attempt, a bounded request, checks backed by evidence, an explained revision. The next test is a real assignment.'},
  {min:.70, name:'Project Engineer', blurb:'The dimension list below says which pieces of the routine your trail shows and which it does not. The moments marked there are usually the same moment each time.'},
  {min:.50, name:'Site Engineer', blurb:'The routine held in places. The dimensions marked "Not demonstrated" say exactly which piece to practise next.'},
  {min:0,   name:'Intern with a Trail', blurb:'The practice score is low — but you have something most people don\'t: a record of exactly where the thinking left. Play again and defend it.'}
];
var BADGES = [
  {id:'human', name:'Human First', desc:'Attempted every problem yourself before any AI', ico:'A'},
  {id:'bounded', name:'Bounded', desc:'Sent a bounded request in every scenario', ico:'C'},
  {id:'hunter', name:'Error Hunter', desc:'Caught every planted error', ico:'E'},
  {id:'evidence', name:'Evidence, Not Vibes', desc:'No first verdict rested on the assistant\'s say-so or on convenience', ico:'✓'},
  {id:'gate', name:'Gatekeeper', desc:'Never consulted AI outside phase C', ico:'P'}
];
var CONTENT_VERSION = 3;                        // bump when scenarios or scoring change; a saved record from another version is not comparable and is never read
var STORE_KEY = 'flowline-best-v' + CONTENT_VERSION;
var OLD_STORE_KEYS = ['flowline-best-v1', 'flowline-best-v2'];      // left in place, never read

/* Runs once at load. Gives every claim and method an id, refuses to ship a reason whose feedback tail would be wrong, and refuses a
   whole-task claim that is not a verbatim substring of the whole reply the learner would read. */
function normalizeScenarios(){
  var VERDICTS = ['accept','revise','reject'];
  SCENARIOS.forEach(function(sc){
    var all = [], byKey = {};
    sc.C.claims.forEach(function(c, i){ c.id = sc.id+'-c'+(i+1); byKey['c'+(i+1)] = c; all.push(c); });
    sc.A.ests.forEach(function(e, i){ if(e.claim){ e.claim.id = sc.id+'-est-'+i; all.push(e.claim); } });
    sc.A.methods.forEach(function(mm, i){ mm.id = sc.id+'-m'+(i+1); console.assert(mm.short && mm.short.length <= 90, sc.id+' method needs a short form (≤ 90 chars)'); });
    sc.C.wholeClaims.forEach(function(c, i){
      c.id = sc.id+'-w'+(i+1);
      if(c.sameAs){ c.reasons = clone(byKey[c.sameAs].reasons); c.explain = byKey[c.sameAs].explain; delete c.sameAs; }   // same planted error as the critique's claim
      if(c.explainAs){ c.explain = byKey[c.explainAs].explain; delete c.explainAs; }
      console.assert(sc.C.whole.indexOf(c.t) >= 0, sc.id+' whole claim not verbatim: '+c.t.slice(0,40));
      all.push(c);
    });
    console.assert(sc.C.uninvitedReasons && sc.C.uninvitedReasons.unsupported && sc.C.uninvitedReasons.violates && sc.C.uninvitedExplain, sc.id+' needs uninvitedReasons and uninvitedExplain');
    all.push(uninvitedClaim(sc, sc.C));
    all.forEach(function(c){
      console.assert(VERDICTS.indexOf(c.best) >= 0, sc.id+' bad best: '+c.id);
      console.assert(TYPE_LABEL[c.type], sc.id+' bad type: '+c.id);
      c.reasons.forEach(function(r){
        if(!r.kind || r.good !== undefined) throw new Error(sc.id+' reason without kind: '+r.t.slice(0,40));
        console.assert(REASON_KIND[r.kind], sc.id+' bad kind: '+r.kind);
        if(!r.ok) r.ok = r.kind==='valid_evidence' ? [c.best] : [];   // verdicts this reason is credited with; point-scored claims still key on c.best until pass 3's pair scoring
        r.ok.forEach(function(v){ console.assert(VERDICTS.indexOf(v) >= 0, sc.id+' bad ok verdict: '+c.id); });
      });
    });
    console.assert(sc.protected, sc.id+' needs a protected-work line');
    /* Pass 3: evidence ids unique and typed; every claim's tray hint and every follow-up key resolve. */
    var seen = {};
    (sc.evidence || []).forEach(function(it){ console.assert(!seen[it.id], sc.id+' duplicate evidence id: '+it.id); seen[it.id] = 1; console.assert(['equation','conversion','reference','data'].indexOf(it.kind) >= 0, sc.id+' bad evidence kind: '+it.id); if(it.action) console.assert(it.action.type==='calc' ? typeof it.action.expect==='number' && typeof it.action.tol==='number' : typeof it.action.run==='function', sc.id+' bad evidence action: '+it.id); });
    var hints = sc.C.hints || {};
    all.forEach(function(c){ var key = c.id.slice(sc.id.length+1); if(!c.evidenceHint && hints[key]) c.evidenceHint = hints[key]; if(c.evidenceHint) console.assert(evidenceById(sc, c.evidenceHint), sc.id+' evidenceHint unresolved: '+c.id+' → '+c.evidenceHint); });
    console.assert(sc.C.followups, sc.id+' needs followups');
    Object.keys(sc.C.followups || {}).forEach(function(id){ var v = sc.C.followups[id]; console.assert(all.some(function(c){ return c.id===id; }), sc.id+' followup key unresolved: '+id); console.assert(typeof v==='string' ? !!sc.C.followups[v] && typeof sc.C.followups[v]==='object' : (v.q && v.reply), sc.id+' bad followup: '+id); });
  });
}
normalizeScenarios();

/* =====================================================================
   STATE
   ===================================================================== */
var S; // game state
function freshState(){
  return {
    scen:0, phase:0, kept:0, given:0,
    scens:[], // per-scenario records
    plan:null,   // {task, attempt, help} — the three-field plan, recorded as a plan
    result:null, // {score, max, rank, pct} once the results screen has computed them (export reads it)
    flags:{human:true, bounded:true, hunter:true, evidence:true, gate:true},
    miss:{} // first reason each badge was lost, in plain words
  };
}
function noteMiss(id, why){ if(S.flags[id]){ S.flags[id] = false; S.miss[id] = why; } }
function scenNo(){ return 'scenario '+(S.scen+1); }
function cur(){ return SCENARIOS[S.scen]; }
function rec(){ return S.scens[S.scen]; }
/* The learner's recorded attempt. If A was handed to the AI, the only number on the table is the AI's. */
function attempt(){
  if(rec().attempt) return rec().attempt;
  var sc = cur();
  if(rec().status.A==='given') return {id:'ai', est:sc.outsideEst, work:sc.outside.A, slip:'', ok:false, ai:true, methodShort:'none — the assistant did A'};
  var e = sc.A.ests.filter(function(x){ return x.ok; })[0]; // safety fallback only; nothing on the trail is written from it
  return {est:e.t, work:e.work, slip:e.s, ok:true, methodShort:sc.A.methods[0].short, provenance:'provided'};
}
function tpl(str){
  var a = attempt(), s = String(str);
  if(a.provenance==='learner') s = s.replace(/Worked example I adopted: \{work\}/g, 'My calculation: {work}');   // a typed calculation is the learner's, and the request says so
  return s.replace(/\{est\}/g, a.est).replace(/\{work\}/g, a.work).replace(/\{method\}/g, a.methodShort || '').replace(/\{slip\}/g, a.slip || '');
}
/* ---- Reply records. A send builds ONE immutable record — the text the learner sees and the claim objects E will judge — so E can
   only ever render what was actually received. Claims are deep-cloned plain data and frozen; E writes its annotations on judgments,
   never on the claims, so nothing leaks into SCENARIOS for a later playthrough. ---- */
function deepFreeze(o){ Object.getOwnPropertyNames(o).forEach(function(k){ if(o[k] && typeof o[k]==='object') deepFreeze(o[k]); }); return Object.freeze(o); }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
/* The paragraph a leaky request draws is a claim like any other: judgeable and flaggable, never point-scored. Reject with a flag excludes it;
   revise with "unsupported" holds it pending evidence; accept adopts a decision the learner did not ask for. */
function uninvitedClaim(sc, d){
  return { id:sc.id+'-uninv', t:d.uninvited, type:'uninvited', best:'reject', unsolicited:true, evidenceHint:(d.hints && d.hints.uninv) || null,
    reasons:[
      {t:'Outside the scope of my request — I asked for a critique, not a verdict; it goes out of my result.', kind:'valid_evidence', flag:'outside_scope', ok:['reject']},
      {t:d.uninvitedReasons.unsupported, kind:'valid_evidence', flag:'unsupported', ok:['reject','revise']},
      {t:d.uninvitedReasons.violates, kind:'valid_evidence', flag:'violates_constraint', ok:['reject']},
      {t:'Accept — it agrees with my own number, so it is a free confirmation.', kind:'unsupported_authority', ok:[]},
      {t:'Accept — a decision is a decision; it saves me the walk.', kind:'convenience', ok:[]} ],
    explain:d.uninvitedExplain };
}
/* route → what the record says about the request. The variant decides the reply: bounded = the critique; leaky = the critique plus the
   uninvited paragraph (appended as a judgeable claim); whole = the whole-task reply, decomposed into its own verbatim claims. */
var ROUTE = {
  direct:  {variant:'bounded', final:'bnd',   label:'Request sent',                     short:'Consult: bounded request',                         cls:'sup',  settle:'bounded request'},
  repaired:{variant:'bounded', final:'bnd',   label:'Request sent — boundary repaired', short:'Consult: boundary repaired, bounded request sent', cls:'sup',  settle:'boundary repaired'},
  partial: {variant:'leaky',   final:'leaky', label:'Request sent (still leaky)',       short:'Consult: request still leaky',                     cls:'leak', settle:'partly repaired'},
  asis:    {variant:'leaky',   final:'leaky', label:'Request sent (unfixed)',           short:'Consult: leaky request sent as is',                cls:'leak', settle:'leaky request sent'},
  whole:   {variant:'whole',   final:'sub',   label:'Request sent (whole task)',        short:'Consult: whole task delegated',                    cls:'sub'}
};
function buildReply(d, route, txt){
  var sc = cur(), a = attempt(), variant = ROUTE[route].variant, claims, text;
  if(variant==='whole'){ claims = d.wholeClaims.map(clone); text = d.whole; }
  else {
    claims = d.claims.map(clone);
    var e = a && !a.ai ? sc.A.ests[a.estIdx] : null;
    if(e && !e.ok && e.claim && typeof d.attemptSlot==='number') claims[d.attemptSlot] = clone(e.claim); // the critique of the learner's own number, in the slot
    text = tpl(d.reply) + '\n' + claims.map(function(c,i){ return (i+1)+'. '+c.t; }).join('\n');
    if(variant==='leaky'){ claims.push(uninvitedClaim(sc, d)); text += '\n' + d.uninvited; }
  }
  return deepFreeze({id:'k'+(rec().consultations.length+1), kind:'send', variant:variant, route:route, repaired:!!rec().repaired,
                     attemptId:(a && a.id) || null, request:txt, reply:{text:text, claims:claims}, at:Date.now()});
}
function lastReply(){ var ks = rec().consultations.filter(function(k){ return k.kind==='send'; }); return ks[ks.length-1] || null; }
function replyLines(text, leaky){
  var lines = String(text).split('\n');
  return lines.map(function(l, i){ return h('div', {class:'line'+(leaky && i===lines.length-1 ? ' uninvited' : ''), text:l}); });
}
/* The full exchange, reopenable from E and T — the request as sent and the reply as received, from the record. */
function replyPanel(record, label){
  return h('details', {class:'reply-full panel'}, h('summary', null, label || 'Reopen the full reply'),
    h('div', {class:'chat'}, h('div', {class:'body'}, h('div', {class:'msg me', text:record.request}), h('div', {class:'msg bot'}, h('div', {class:'who'}, 'Assistant'), replyLines(record.reply.text, record.variant==='leaky')))));
}
function newScenRecord(){
  return {kept:0, given:0, status:{}, trail:[],
    phasePts:{},                        // authoritative per-phase credit — written only by settle()
    pPick:null, fPicks:null,            // inputs to creditFor('P' | 'F')
    promptFinal:null,                   // 'bnd' | 'leaky' | 'sub' — the request actually sent
    repaired:false, partial:false, leakKind:null, drafts:[],
    attempts:[], attempt:null,          // attempts[0] is the first attempt; attempt points at the current one
    consultations:[],                   // {id, kind:'send', variant, route, repaired, attemptId, request, reply:{text, claims}} — deep-frozen at send time; E renders the last one
    eClaims:[],                         // the claims judged in E: {id, type, best, unsolicited} — what "n of m planted errors" is counted against
    judgments:[],                       // {claimId, claimText, claimType, verdict, reasonText, reasonKind, pass, pts, canonical}
    revisions:[],                       // {phase:'E'|'T', fromAttemptId, toAttemptId, causedByClaimIds, explanation, from, to} — a revised attempt, a credited revise verdict's explanation, or a T repair
    evidenceUses:[],                    // {evidenceId, phase, input, ok, at} — pass/fail only; never the expected value
    returnUsed:false, repairUsed:false, // one bounded return consultation per scenario; one repair of the provisional recommendation
    tInteg:{first:null, repaired:null}, tTransfer:null,
    leaked:false, uninvitedJudged:null, // {verdict, flag, credited} — how the leaky reply's uninvited recommendation was judged in E
    dims:null};
}

/* ---- One credit path. creditFor(k) is pure: the phase TOTAL implied by the record, never an increment. settle(k) is the only
   path that adds positive credit, so no route can exceed a phase's declared maximum and repeating a step cannot farm points. ---- */
function framePts(sc, picks){
  var keys=0, bad=0;
  sc.F.items.forEach(function(it, i){ if(picks[i]){ if(it.key) keys++; else bad++; } });
  return Math.max(0, Math.min(PTS.F.cap, keys*PTS.F.key + bad*PTS.F.bad));
}
function creditFor(k){
  var r = rec(), sc = cur();
  switch(k){
    case 'P': return r.pPick==null ? 0 : PTS.P[sc.P.opts[r.pPick].v];
    case 'F': return r.fPicks ? framePts(sc, r.fPicks) : 0;
    case 'A': var a = r.attempts[0]; return !a || a.ai ? 0 : (a.methodOk?PTS.A.method:PTS.A.methodWrong) + (a.ok?PTS.A.est:PTS.A.estWrong);
    case 'C': return r.promptFinal==='bnd' ? PTS.C.bnd : (r.promptFinal==='leaky' ? (r.partial ? PTS.C.partial : (PTS.C[r.leakKind] || 0)) : 0);
    case 'E': var per = {};   // per claim: max(first pass, min(second pass, PTS.E.rejudged)) — a correction after the follow-up named the error earns less than first-time right
      r.judgments.forEach(function(j){ if(j.unsolicited) return; var p = per[j.claimId] || (per[j.claimId] = {p1:0, p2:0}); if(j.pass===1) p.p1 = Math.max(p.p1, j.pts); else p.p2 = Math.max(p.p2, j.pts); });
      return Object.keys(per).reduce(function(s, id){ return s + Math.max(per[id].p1, Math.min(per[id].p2, PTS.E.rejudged)); }, 0);
    case 'T': return integrationCredit(r.tInteg) + (r.tTransfer ? PTS.T[r.tTransfer.v] : 0);
  }
  return 0;
}
function integrationCredit(t){
  var first = t.first ? (t.first.ok ? PTS.T.integ : PTS.T.integWrong) : 0;
  return Math.max(first, t.repaired && t.repaired.ok ? PTS.T.repaired : 0);
}   // a repaired pick never exceeds PTS.T.repaired
function settle(k, label){
  var max = phaseMax(cur(), k), target = Math.min(creditFor(k), max), have = rec().phasePts[k] || 0;
  console.assert(creditFor(k) <= max, 'creditFor over phase max', k);
  rec().phasePts[k] = Math.max(have, target);
  if(target > have) award(target - have, label, 'own'); else pop(0, label);
}
/* Derived, never stored: counts from the first-pass judgments, so a counter can never drift from the credit. */
function judgmentStats(r){
  var first = r.judgments.filter(function(j){ return j.pass===1; });
  var kinds = {valid_evidence:0, invalid_technical_reason:0, unsupported_authority:0, convenience:0};
  first.forEach(function(j){ kinds[j.reasonKind] = (kinds[j.reasonKind]||0)+1; });
  var planted = r.eClaims.filter(function(c){ return c.type!=='ok' && !c.unsolicited; });
  var caught = first.filter(function(j){ return j.claimType!=='ok' && !j.unsolicited && j.canonical; }).length;
  var supported = first.filter(function(j){ return j.credited && j.reasonKind==='valid_evidence'; }).length;
  return {total:first.length, valid:supported, mismatched:kinds.valid_evidence-supported, misconception:kinds.invalid_technical_reason, unsupported:kinds.unsupported_authority, convenience:kinds.convenience,
          uncritical:kinds.unsupported_authority + kinds.convenience, errorsTotal:planted.length, errorsCaught:caught};
}
function firstSentence(s){ var mm = String(s).match(/^[\s\S]*?[.!?](?=\s|$)/); return mm ? mm[0].trim() : String(s); }
/* The five observable dimensions the debrief leads with. "Demonstrated" is said only of learner-typed work or of a first-pass
   judgment; anything selected or supplied is labelled as such, and "Not demonstrated" means there is no artifact. */
function dimensionsFor(r, sc){
  var rows = [], a0 = r.attempts[0], st = judgmentStats(r), t = r.tInteg.repaired || r.tInteg.first;   // the final recommendation, after any repair
  function row(id, label, state, text, evidence){ rows.push({id:id, label:label, state:state, text:text, evidence:evidence||''}); }
  if(a0 && a0.provenance==='learner') row('attempt', 'First attempt recorded', 'partial', 'Recorded — learner-entered after viewing a supplied example; independent calculation not assessed', a0.work);
  else if(a0) row('attempt', 'First attempt recorded', 'partial', 'Recorded — selected estimate; supplied worked example adopted', 'Approach: '+a0.methodShort+' · estimate '+a0.est+(a0.ok?'':' (off)'));
  else row('attempt', 'First attempt recorded', 'no', 'Not demonstrated — the assistant did A');
  if(r.promptFinal==='bnd') row('bounded', 'Request bounded', 'yes', r.repaired ? 'Assembled from supplied parts — boundary repaired' : 'Selected bounded request');
  else if(r.promptFinal==='sub') row('bounded', 'Request bounded', 'no', 'Not demonstrated — whole task delegated');
  else if(r.promptFinal==='leaky'){
    var uj = r.uninvitedJudged, note = !uj ? '' : (uj.verdict==='accept' ? '; the unsolicited recommendation was accepted in E' : (uj.credited ? (uj.verdict==='reject' ? '; you excluded the unsolicited recommendation in E' : '; you held the unsolicited recommendation pending evidence') : ''));
    row('bounded', 'Request bounded', 'no', 'Not demonstrated — sent leaky; the assistant answered past the limit'+note);
  }
  else row('bounded', 'Request bounded', 'no', 'Not demonstrated — no request was sent');
  var ids = function(kind){ return r.judgments.filter(function(j){ return j.pass===1 && j.reasonKind===kind; }).map(function(j){ return j.claimId; }).join(', '); };
  if(r.status.E==='given') row('checks', 'Checks supported by evidence', 'no', 'Not demonstrated — the assistant\'s self-check went through unjudged');
  else if(!st.total) row('checks', 'Checks supported by evidence', 'no', 'Not demonstrated — no verdicts recorded');
  else {
    var parts = [];
    if(st.mismatched) parts.push(st.mismatched+' with evidence that did not support the chosen verdict');
    if(st.misconception) parts.push(st.misconception+' on a technical misconception ('+ids('invalid_technical_reason')+')');
    if(st.unsupported) parts.push(st.unsupported+' on the assistant\'s say-so ('+ids('unsupported_authority')+')');
    if(st.convenience) parts.push(st.convenience+' on convenience ('+ids('convenience')+')');
    var ev = st.valid+' of '+st.total+' first verdicts rested on evidence'+(parts.length ? '; '+parts.join('; ') : '');
    row('checks', 'Checks supported by evidence', st.valid===st.total ? 'yes' : (st.valid ? 'partial' : 'no'), st.valid===st.total ? 'Demonstrated' : (st.valid ? 'Partly demonstrated' : 'Not demonstrated'), ev);
  }
  if(r.status.T==='given') row('constraints', 'Final constraints satisfied', 'no', 'Not demonstrated — the assistant did T');
  else if(!t) row('constraints', 'Final constraints satisfied', 'no', 'Not demonstrated — no recommendation recorded');
  else if(t.needsData) row('constraints', 'Final constraints satisfied', 'na', 'Not applicable — data requested before recommending');
  else if(t.provisional) row('constraints', 'Final constraints satisfied', 'partial', 'Not yet verified — provisional option; headwater and outlet velocity still need checking', (r.tInteg.repaired ? 'Repaired to: ' : 'Selected: ')+firstSentence(t.text));
  else if(t.ok) row('constraints', 'Final constraints satisfied', 'yes', 'Demonstrated', (r.tInteg.repaired ? 'Repaired to: ' : 'Selected: ')+firstSentence(t.text));
  else row('constraints', 'Final constraints satisfied', 'no', 'Not demonstrated — '+firstSentence(sc.T.opts[t.idx].fb));
  var explained = r.revisions.filter(function(v){ return v.explanation && String(v.explanation).trim(); });
  var needed = [];
  if(a0 && !a0.ok) needed.push('the first attempt was off');
  /* A revise-canonical claim needed revising unless the learner excluded it with a credited reject — a defensible pair leaves nothing to revise. */
  if(r.eClaims.some(function(c){ return c.best==='revise' && !r.judgments.some(function(j){ return j.claimId===c.id && j.pass===1 && j.verdict==='reject' && j.credited; }); })) needed.push('a claim in the reply called for revision');
  if(t && !t.ok && !t.needsData) needed.push('the recommendation carried an error');
  if(explained.length) row('revision', 'Revision explained', 'yes', 'Demonstrated', '“'+explained[explained.length-1].explanation+'”');
  else if(!needed.length) row('revision', 'Revision explained', 'na', 'Not needed — first result held');
  else row('revision', 'Revision explained', 'no', 'Not demonstrated — '+needed.join('; ')+', and no explanation of a change was recorded');
  return rows;
}

/* =====================================================================
   DOM HELPERS
   ===================================================================== */
var $stage = document.getElementById('stage');
var $pops = document.getElementById('pops');
function h(tag, attrs){
  var e = document.createElement(tag);
  if(attrs){ for(var k in attrs){
    if(k==='class') e.className = attrs[k];
    else if(k==='html') e.innerHTML = attrs[k];
    else if(k==='text') e.textContent = attrs[k];
    else if(k.indexOf('on')===0) e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
    else if(attrs[k]!==null && attrs[k]!==undefined) e.setAttribute(k, attrs[k]);
  }}
  for(var i=2;i<arguments.length;i++) add(e, arguments[i]);
  return e;
}
function add(parent, c){
  if(c===null || c===undefined || c===false) return;
  if(Array.isArray(c)){ c.forEach(function(x){ add(parent,x); }); return; }
  if(typeof c==='string' || typeof c==='number') parent.appendChild(document.createTextNode(String(c)));
  else parent.appendChild(c);
}
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function render(node, opts){
  opts = opts || {};
  var old = $stage.firstElementChild;
  function mount(){
    if(!$tray.hidden) hideTray();   // references belong to the phase that opened them
    $stage.innerHTML = '';
    node.classList.add('screen');
    $stage.appendChild(node);
    if(S) S.lock = false;
    window.scrollTo({top:0, behavior: reduceMotion ? 'auto' : 'smooth'});
    var focus = node.querySelector('[data-autofocus]') || node.querySelector('h1, h2');
    if(focus){ focus.setAttribute('tabindex','-1'); setTimeout(function(){ focus.focus({preventScroll:true}); }, 60); }
    updateHUD();
  }
  if(old && !reduceMotion && !opts.instant){ old.classList.add('leaving'); setTimeout(mount, 220); } else mount();
}

function pop(delta, label){
  var p = h('div', {class:'pop ' + (delta<0?'neg':(delta===0?'zero':'')), role:'status'}, (delta>0?'+':'')+delta, h('small', {text:label||''}));
  $pops.appendChild(p);
  setTimeout(function(){ if(p.parentNode) p.parentNode.removeChild(p); }, 1700);
}
function award(pts, label, cls){
  if(pts>0){ S.kept += pts; rec().kept += pts; }
  pop(pts, label);
  updateHUD();
}
function giveAway(pts, label){
  S.given += pts; rec().given += pts;
  pop(-pts, label);
  updateHUD();
}
function trail(entry){ rec().trail.push(entry); refreshSide(); }

/* HUD */
var $track = document.getElementById('track');
var $scenLabel = document.getElementById('scenLabel');
var $meterBar = document.getElementById('meterBar');
var $meterPct = document.getElementById('meterPct');
var $score = document.getElementById('scoreNum');
var $ask = document.getElementById('askAI');
var $hud = document.getElementById('hud');
function updateHUD(){
  if(!S){ $hud.hidden = true; return; }
  $hud.hidden = false;
  var inScen = S.scen < SCENARIOS.length && rec();
  $scenLabel.textContent = inScen ? (S.scen+1)+' / '+SCENARIOS.length+' · '+cur().title : 'Flowline';
  $track.innerHTML = '';
  PHASES.forEach(function(k, i){
    var sp = h('span', {text:k, title:PHASE_META[k].full});
    if(k==='P') sp.classList.add('p');
    if(k==='C') sp.classList.add('c');
    if(inScen){
      var st = rec().status[k];
      if(st==='done' || st==='leaky') sp.classList.add('done');
      if(st==='leaky') sp.classList.add('leaky');
      if(st==='given') sp.classList.add('given');
      if(i===S.phase && S.mode==='phase') sp.classList.add('cur');
      if(k==='C' && rec().returnUsed){ sp.classList.add('ret'); sp.title = PHASE_META.C.full+' — one bounded return consultation used'; }
    }
    $track.appendChild(sp);
  });
  var total = S.kept + S.given;
  $meterBar.style.width = (total ? Math.round(100*S.kept/total) : 100) + '%'; // a visual of kept against given — never described as a share of thinking
  $meterPct.textContent = S.kept+' kept · '+S.given+' given';
  $score.textContent = Math.max(0, S.kept - S.given);
  console.assert(S.kept === S.scens.reduce(function(a,r){ return a + (r ? PHASES.reduce(function(b,k){ return b+(r.phasePts[k]||0); }, 0) : 0); }, 0), 'kept out of step with phasePts');
  var inC = S.mode==='phase' && PHASES[S.phase]==='C';
  $ask.classList.toggle('hot', inC);
  $ask.setAttribute('aria-label', inC ? 'Ask AI — this is phase C, consultation is open' : 'Ask AI (outside phase C — think before you click)');
  $ask.disabled = !(S.mode==='phase');
  $ask.title = S.mode==='phase' ? (inC ? 'Consultation is open' : 'Outside phase C — opening this has a cost') : 'The assistant opens once a phase starts';
  $evid.disabled = !trayAllowed();
  $evid.title = trayAllowed() ? 'Evidence tray — references and checks, no points' : (S.mode==='phase' ? 'Opens at A' : 'Opens once a phase starts');
  if(!trayAllowed() && !$tray.hidden) hideTray();
}

/* =====================================================================
   EVIDENCE TRAY (pass 3)
   References the learner can use from A onward — equations with their conditions, unit conversions, a friction-factor reference,
   scenario data. A check reports only pass / fail against a tolerance plus the condition line; the expected number is never printed,
   on a miss or a hit, in any phase. Using a check is recorded on the trail (no points). Items marked from:'C' stay hidden in A so the
   tray cannot hand over the A estimate.
   ===================================================================== */
var $tray = document.getElementById('tray');
var $evid = document.getElementById('evidenceBtn');
function trayAllowed(){ return !!(S && S.mode==='phase' && S.phase >= 2); }
function evidenceById(sc, id){ return (sc.evidence || []).filter(function(x){ return x.id===id; })[0] || null; }
function parseNum(s){
  var t = String(s).trim().replace(/,/g, '').replace(/\s+/g, '').replace(/[×x]10\^?/i, 'e').replace(/[−–]/g, '-');
  var v = parseFloat(t); return isFinite(v) && /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t) ? v : null;
}
function hideTray(){ $tray.hidden = true; $evid.setAttribute('aria-expanded', 'false'); }
function closeTray(){ if($tray.hidden) return; hideTray(); $evid.focus(); }
function openTray(focusId){
  if(!trayAllowed()) return;
  renderTray();
  $tray.hidden = false; $evid.setAttribute('aria-expanded', 'true');
  var target = focusId ? $tray.querySelector('.item[data-id="'+focusId+'"]') : null;
  if(target) target.classList.add('hint');
  setTimeout(function(){
    var f = (target || $tray).querySelector('input, button.check') || $tray.querySelector('.close');
    if(f) f.focus({preventScroll:true});
    if(target) target.scrollIntoView({block:'start', behavior:reduceMotion ? 'auto' : 'smooth'});
  }, 30);
}
function toggleTray(){ if($tray.hidden) openTray(); else closeTray(); }
function renderTray(){
  var sc = cur(), k = PHASES[S.phase];
  $tray.innerHTML = '';
  $tray.appendChild(h('div', {class:'thead'}, h('h3', null, 'Evidence tray · '+sc.title), h('button', {class:'close', type:'button', 'aria-label':'Close the evidence tray', onClick:closeTray}, '×')));
  $tray.appendChild(h('p', {class:'tnote'}, 'References to use, not answers to copy. A check says only whether your number is within tolerance; using one goes on your trail and earns no points. Esc closes.'));
  (sc.evidence || []).forEach(function(it){
    if(it.from==='C' && k==='A') return;
    $tray.appendChild(trayItem(it, k));
  });
}
function renderTable(tb){
  var t = h('table');
  t.appendChild(h('tr', null, tb.cols.map(function(c){ return h('th', null, c); })));
  tb.rows.forEach(function(row){ t.appendChild(h('tr', null, row.map(function(cell){ var o = typeof cell==='string' ? {t:cell} : cell; return h('td', {class:o.cls || null}, o.t); }))); });
  return h('div', {class:'tscroll'}, t);
}
function trayItem(it, k){
  var box = h('div', {class:'item kind-'+it.kind, 'data-id':it.id});
  box.appendChild(h('div', {class:'ttl'}, it.title, h('span', {class:'kind'}, it.kind)));
  if(it.body) box.appendChild(h('div', {class:'body', text:it.body}));
  if(it.table) box.appendChild(renderTable(it.table));
  if(it.cond) box.appendChild(h('div', {class:'cond'}, 'Condition: '+it.cond));
  if(it.note) box.appendChild(h('div', {class:'tsup'}, it.note));
  if(it.action) box.appendChild(trayAction(it, k));
  return box;
}
function trayAction(it, k){
  var a = it.action, fields = a.fields || [{l:a.prompt, unit:a.unit}];
  var out = h('div', {class:'res', role:'status'});
  var inputs = fields.map(function(f){ return h('input', {type:'text', inputmode:'decimal', 'aria-label':f.l, placeholder:f.unit || ''}); });
  var btn = h('button', {class:'btn ghost check', type:'button', onClick:run}, 'Check');
  function run(){
    var vals = inputs.map(function(x){ return parseNum(x.value); });
    if(vals.some(function(v){ return v===null; })){ out.textContent = 'Enter a number'+(fields.length>1 ? ' in each field' : '')+' (e.g. 3.2e5 or 318000).'; out.className = 'res'; return; }
    var res = a.type==='calc'
      ? (function(){ var ok = Math.abs(vals[0]-a.expect) <= a.tol; return {ok:ok, text:ok ? 'Within tolerance. Condition: '+it.cond : 'Not within tolerance — check the condition line and your units.'}; })()
      : a.run(vals);
    out.textContent = res.text; out.className = 'res '+(res.ok===true ? 'ok' : (res.ok===false ? 'no' : ''));
    var entered = fields.map(function(f, i){ return f.l+' = '+inputs[i].value.trim(); }).join('; ');
    rec().evidenceUses.push({evidenceId:it.id, phase:k, input:entered, ok:res.ok, at:Date.now()});
    trail({k:k, label:'Evidence used — '+it.title, text:'Entered '+entered+(res.ok===null ? '' : '; within tolerance: '+(res.ok ? 'yes' : 'no')), prov:'learner', cls:'own', pts:0, evidenceId:it.id, short:'Evidence: '+it.title});
  }
  inputs.forEach(function(inp){ inp.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); e.stopPropagation(); run(); } }); });
  var rows = fields.map(function(f, i){ return h('label', {class:'row'}, h('span', {class:'prompt'}, f.l), inputs[i]); });
  return h('div', {class:'act'}, rows, h('div', {class:'row'}, btn), out);
}

/* =====================================================================
   SCREENS
   ===================================================================== */
function titleScreen(){
  S = null; updateHUD();
  var best = loadBest();
  var node = h('div', {class:'title'},
    h('div', {class:'inner'},
      h('div', null,
        h('div', {class:'eyebrow rise'}, 'A P-FACET game for fluid mechanics'),
        h('h1', {class:'rise d1', html:'Flow<em>line</em>'}),
        h('p', {class:'tag rise d2', html:'Three real hydraulics problems. An AI assistant that is fast, confident, and sometimes wrong. <b class="g">Keep the thinking yours</b>, <b class="b">consult with a boundary</b>, and catch what it gets wrong.'}),
        h('ul', {class:'how rise d3'},
          h('li', null, h('b', null, 'P'), h('span', null, 'Move each problem through the six P-FACET phases. Five are yours; AI enters at one.')),
          h('li', null, h('b', null, 'C'), h('span', null, 'Choose — or fix — the prompt you send. What you ask decides who does the thinking.')),
          h('li', null, h('b', null, 'E'), h('span', null, 'Replies are scripted practice cases. Some points are sound; some are planted errors — wrong assumptions, wrong units, plausible nonsense, missing constraints. Judge each one, and say why.')),
          h('li', null, h('b', null, '?'), h('span', null, 'The "Ask AI" button is always there. Outside phase C it has consequences you will see.'))
        ),
        h('div', {class:'actions rise d4'},
          h('button', {class:'btn primary', type:'button', 'data-autofocus':'1', onClick:startGame}, 'Start · about 15 minutes'),
          h('a', {class:'btn ghost', href:'takeaway.html'}, 'Read the take-away first')
        ),
        best ? h('p', {class:'best rise d5', html:'Your best practice score: <b>'+esc(best.score)+' / '+esc(best.max)+' · '+esc(best.rank)+'</b> ('+esc(best.date)+')'}) : h('p', {class:'best rise d5'}, hasOldBest() ? 'Best score is saved in this browser only; scores from earlier versions of Flowline are not comparable and are not shown.' : 'Best score is saved in this browser only.')
      ),
      h('div', {class:'scen-list rise d3'}, SCENARIOS.map(function(sc){
        return h('div', {class:'scen-card'}, h('div', {class:'ico', html:sc.icon}), h('div', null, h('div', {class:'lvl'}, sc.level), h('h4', null, sc.title), h('p', null, sc.blurb)));
      }))
    ),
    h('div', {class:'waves', 'aria-hidden':'true', html:'<svg class="back" viewBox="0 0 1200 70" preserveAspectRatio="none"><path fill="currentColor" d="M0,40 C150,10 300,70 450,40 C600,10 750,70 900,40 C1050,10 1200,70 1350,40 L1350,70 L0,70 Z"/></svg><svg viewBox="0 0 1200 70" preserveAspectRatio="none"><path fill="currentColor" d="M0,45 C100,20 200,70 300,45 C400,20 500,70 600,45 C700,20 800,70 900,45 C1000,20 1100,70 1200,45 L1200,70 L0,70 Z"/></svg>'})
  );
  render(node, {instant:true});
}

function startGame(){
  S = freshState();
  S.scens = SCENARIOS.map(function(){ return null; });
  S.scen = 0; S.mode = 'intro';
  introScreen();
}

function introScreen(){
  var sc = cur();
  S.scens[S.scen] = newScenRecord();
  S.phase = 0; S.mode = 'intro';
  var node = h('div', {class:'intro'},
    h('div', {class:'art rise'}, h('div', {html:sc.art})),
    h('div', null,
      h('span', {class:'lvl rise'}, sc.level),
      h('h2', {class:'rise d1', text:sc.title}),
      h('p', {class:'lede rise d2', text:sc.intro}),
      h('div', {class:'goal rise d3', html:'<b>Deliverable.</b> '+esc(sc.goal)}),
      h('div', {class:'goal keep rise d3', html:'<b>What you keep.</b> '+esc(sc.protected.charAt(0).toUpperCase()+sc.protected.slice(1))+'.'}),
      h('div', {class:'actions rise d4'},
        h('button', {class:'btn anchor', type:'button', 'data-autofocus':'1', onClick:function(){ S.mode='phase'; phaseScreen(); }}, 'Begin at P →'),
        h('span', {class:'hint'}, 'Your AI assistant is online — a scripted practice assistant whose replies contain planted errors. It is up to you when to use it.')
      )
    )
  );
  render(node);
}

function phaseHead(k, title, sub){
  var meta = PHASE_META[k];
  var cls = k==='P'?'p':(k==='C'?'c':'');
  return h('div', {class:'phase-head'},
    h('div', {class:'big '+cls, 'aria-hidden':'true'}, k),
    h('div', null,
      h('div', {class:'who '+cls}, meta.full + ' · ' + meta.who),
      h('h2', null, title),
      sub ? h('p', null, sub) : null
    )
  );
}
function sideBrief(extraTrail){
  var sc = cur();
  var trailBox = h('div', {class:'mytrail'}, h('h4', null, 'Your trail so far'));
  var t = rec().trail;
  if(!t.length) trailBox.appendChild(h('div', {class:'muted', text:'Nothing yet — the trail starts with your first decision.'}));
  t.forEach(function(e, i){
    var b = h('b', {text:e.k}); if(e.cls==='sub' || e.given) b.classList.add('risk'); if(e.k==='C') b.classList.add('ai');
    var row = h('div', null, b, e.short || e.label, e.claimId ? h('code', {class:'cid'}, '['+e.claimId+']') : null, e.prov ? h('span', {class:'prov'}, PROV[e.prov]) : null);
    if(e.reply) row.appendChild(h('details', {class:'reply-full', 'data-i':i}, h('summary', null, 'Show the reply'), h('div', {class:'q'}, e.reply)));
    trailBox.appendChild(row);
  });
  return h('aside', {class:'side'},
    h('div', {class:'brief'},
      h('div', {class:'fig', html:sc.art}),
      h('h4', null, 'Givens'),
      h('div', {class:'givens', html:sc.givens.map(esc).join('<br>')}),
      h('p', {class:'note keep', html:'<b>What you keep:</b> '+esc(sc.protected)+'.'}),
      h('p', {class:'note', text:sc.goal})
    ),
    trailBox
  );
}
function continueBtn(label, fn){
  var b = h('button', {class:'btn primary', type:'button', onClick:function(){ b.disabled = true; fn(); }}, label || 'Continue →');
  return h('div', {class:'actions'}, b);
}
function keyHint(){ return h('span', {class:'hint'}, 'Tip: press 1–9 to choose, Enter to continue.'); }

function phaseScreen(){
  var k = PHASES[S.phase];
  S.mode = 'phase';
  ({P:screenP, F:screenF, A:screenA, C:screenC, E:screenE, T:screenT})[k]();
}
function nextPhase(){
  if(S.lock) return; // a double click (or click + Enter) during the screen transition must not skip a phase
  S.lock = true;
  rec().status[PHASES[S.phase]] = rec().status[PHASES[S.phase]] || 'done';
  S.phase++;
  if(S.phase >= PHASES.length){ debriefScreen(); } else phaseScreen();
}

/* ---------- P ---------- */
function screenP(){
  var sc = cur(), d = sc.P;
  var fb = h('div'); var cont = h('div');
  var opts = h('div', {class:'opts', role:'group', 'aria-label':'Problem statements'});
  d.opts.forEach(function(o, i){
    var b = h('button', {class:'opt', type:'button', onClick:function(){
      opts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
      b.classList.remove('dim'); b.classList.add(o.v==='best'?'good':(o.v==='ok'?'meh':'bad'));
      rec().pPick = i; settle('P', 'problem named');
      var pts = PTS.P[o.v];
      fb.innerHTML=''; fb.appendChild(h('div', {class:'feedback '+(o.v==='best'?'':(o.v==='ok'?'warn':'bad'))}, h('span', {class:'verdict'}, o.v==='best'?'Sharp.':(o.v==='ok'?'Partly.':'Not yet.')), o.fb, h('span', {class:'cls', html:'<b>'+CLS.own+'</b> — you named the problem. +'+pts+' kept.'})));
      trail({k:'P', label:'Problem statement', text:o.t, cls:'own', pts:pts, short:'Problem: '+(o.v==='best'?'sharp':(o.v==='ok'?'partial':'weak'))});
      cont.innerHTML=''; cont.appendChild(continueBtn('Frame it →', nextPhase)); cont.querySelector('button').focus();
    }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), o.t);
    opts.appendChild(b);
  });
  var node = h('div', null,
    phaseHead('P', 'Name the problem before anything else.', 'The purpose stays yours. No AI yet — if it names the problem, it also chooses what counts.'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '“'+PHASE_META.P.ask+'”'), h('p', {html:'<b>'+esc(d.q)+'</b>'}), opts, fb, cont, h('div', {class:'actions'}, keyHint())),
      sideBrief()
    )
  );
  render(node);
}

/* ---------- F ---------- */
function screenF(){
  var sc = cur(), d = sc.F;
  var picked = {};
  var chips = h('div', {class:'chips', role:'group', 'aria-label':'Frame items'});
  var fb = h('div'); var cont = h('div');
  var lockBtn = h('button', {class:'btn primary', type:'button', disabled:'', onClick:lock}, 'Lock my frame');
  d.items.forEach(function(it, i){
    var b = h('button', {class:'chip', type:'button', 'aria-pressed':'false', onClick:function(){
      picked[i] = !picked[i]; b.setAttribute('aria-pressed', String(!!picked[i]));
      var n = Object.keys(picked).filter(function(x){return picked[x];}).length;
      lockBtn.disabled = n < d.min; lockBtn.textContent = n ? 'Lock my frame ('+n+' of at least '+d.min+')' : 'Lock my frame';
    }}, it.t);
    chips.appendChild(b);
  });
  function lock(){
    var keys=0, bad=0, missed=[];
    d.items.forEach(function(it, i){
      var b = chips.children[i]; b.disabled = true;
      if(picked[i] && it.key){ keys++; b.classList.add('good'); b.appendChild(h('span', {class:'tagline'}, 'Belongs · '+it.why)); }
      else if(picked[i] && !it.key){ bad++; b.classList.add('bad'); b.appendChild(h('span', {class:'tagline'}, 'Doesn\'t belong · '+it.why)); }
      else if(!picked[i] && it.key){ missed.push(it); b.classList.add('miss'); b.appendChild(h('span', {class:'tagline'}, 'Missed · '+it.why)); }
    });
    rec().fPicks = d.items.map(function(x,i){ return !!picked[i]; });
    settle('F', 'frame set');
    var pts = rec().phasePts.F;
    var verdict = keys>=d.min && bad===0 ? 'Solid frame.' : (keys>=d.min ? 'Mostly there.' : 'Thin frame.');
    var msg = keys+' of '+d.items.filter(function(x){return x.key;}).length+' essentials'+(bad?', '+bad+' that don\'t belong':'')+'. ';
    if(missed.length) msg += 'What you missed will matter in E — the AI will test exactly those spots.';
    else msg += 'Every criterion you wrote down is a test you can now run on the AI\'s answer.';
    fb.appendChild(h('div', {class:'feedback '+(keys>=d.min&&!bad?'':'warn')}, h('span', {class:'verdict'}, verdict), msg, h('span', {class:'cls', html:'<b>'+CLS.own+'</b> — you set the criteria. +'+pts+' kept.'})));
    trail({k:'F', label:'Frame', text:d.items.filter(function(x,i){return picked[i];}).map(function(x){return x.t;}).join(' · '), cls:'own', pts:pts, short:'Frame: '+keys+' essentials'+(bad?', '+bad+' off-target':'')});
    lockBtn.parentNode.removeChild(lockBtn);
    cont.appendChild(continueBtn('Attempt it →', nextPhase)); cont.querySelector('button').focus();
  }
  var node = h('div', null,
    phaseHead('F', 'Decide what good looks like.', 'Knowns, assumptions, criteria, constraints. Choose at least '+d.min+'. AI may poke at a frame — it never writes one.'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '“'+PHASE_META.F.ask+'”'), h('p', {html:'<b>'+esc(d.q)+'</b>'}), chips, h('div', {class:'actions'}, lockBtn, keyHint()), fb, cont),
      sideBrief()
    )
  );
  render(node);
}

/* ---------- A ---------- */
function screenA(){
  var sc = cur(), d = sc.A;
  var methodPick = null, estPick = null;
  var fb = h('div'); var worked = h('div'); var cont = h('div');
  var methods = h('div', {class:'opts', role:'group', 'aria-label':'Approaches'});
  var ests = h('div', {class:'estimates', role:'group', 'aria-label':'Estimates'});
  var estBlock = h('div', {hidden:''}, h('div', {class:'sub-h'}, d.eq), ests);
  d.methods.forEach(function(m, i){
    var b = h('button', {class:'opt', type:'button', onClick:function(){
      methodPick = m;
      methods.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
      b.classList.remove('dim'); b.classList.add(m.ok?'good':'meh');
      fb.innerHTML=''; fb.appendChild(h('div', {class:'feedback '+(m.ok?'':'warn')}, h('span', {class:'verdict'}, m.ok?'Right principle.':'An attempt — good.'), m.fb));
      estBlock.hidden = false; ests.querySelector('button').focus();
    }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), m.t);
    methods.appendChild(b);
  });
  d.ests.forEach(function(e, i){
    var b = h('button', {class:'est', type:'button', onClick:function(){
      estPick = e;
      ests.querySelectorAll('.est').forEach(function(x){ x.disabled = true; });
      b.classList.add(e.ok?'good':'bad');
      /* The approach and the estimate are selections; the worked route under the estimate is a supplied example the learner adopts
         explicitly. All three go on the trail with their provenance — none of it is called "my working". */
      var at = {id:'a1', est:e.t, work:e.work, slip:e.s, ok:e.ok, idx:i, estIdx:i, methodIdx:d.methods.indexOf(methodPick), methodText:methodPick.t, methodShort:methodPick.short, methodOk:methodPick.ok, provenance:'provided', parentId:null, ai:false};
      rec().attempts.push(at); rec().attempt = at;
      settle('A', 'own attempt');
      var pts = rec().phasePts.A, mp = methodPick.ok?PTS.A.method:PTS.A.methodWrong, ep = e.ok?PTS.A.est:PTS.A.estWrong;
      fb.innerHTML=''; fb.appendChild(h('div', {class:'feedback '+(e.ok?'':'warn')}, h('span', {class:'verdict'}, e.ok?'Attempt on record.':'Attempt on record — off, and that\'s useful.'), tpl(e.ok?d.estfb.ok:d.estfb.bad), h('span', {class:'cls', html:'<b>'+CLS.own+'</b> — an attempt now exists on your record: estimate <b>'+esc(e.t)+'</b> (selected) plus the worked example you adopt below — labelled as such on your trail. +'+pts+' kept.'})));
      trail({k:'A', label:'Approach', text:methodPick.t, prov:'example', cls:'own', pts:mp, short:'Attempt: '+(methodPick.ok?'right method':'shaky method')});
      trail({k:'A', label:'Estimate', text:e.t+(e.ok?'':' — off'), prov:'estimate', cls:'own', pts:ep, short:'Estimate '+e.t+(e.ok?'':' (off)')});
      worked.innerHTML=''; worked.appendChild(h('div', {class:'worked'}, h('div', {class:'sub-h'}, 'Supplied worked example'), h('div', {class:'q'}, e.work), h('p', {class:'note'}, 'This route was written for the estimate you selected. Adopting it puts it on your trail as a supplied example — retrieval, not your own derivation.')));
      cont.innerHTML='';
      var adopt = continueBtn('Adopt this worked example and consult →', function(){
        trail({k:'A', label:'Worked example adopted', text:e.work, prov:'provided', cls:'mech', pts:0, short:'Supplied worked example adopted'});
        nextPhase();
      });
      /* Or type the calculation: provenance 'learner', filed as learner-entered, and the request then says "My calculation". No extra points. */
      adopt.appendChild(h('button', {class:'btn ghost', type:'button', onClick:function(){
        var ta = h('textarea', {class:'free', rows:'4', 'aria-label':'My own calculation', placeholder:'Your own steps and number, with units — any language, at least 8 characters.'});
        var go = h('button', {class:'btn primary', type:'button', disabled:'', onClick:function(){
          var text = ta.value.trim(); go.disabled = true; ta.disabled = true;
          at.provenance = 'learner'; at.work = text; at.text = text;
          trail({k:'A', label:'My calculation', text:text, prov:'learner', cls:'own', pts:0, short:'Learner-entered calculation'});
          nextPhase();
        }}, 'Record my calculation and consult →');
        ta.addEventListener('input', function(){ go.disabled = Array.from(ta.value.trim()).length < 8; });
        worked.innerHTML=''; worked.appendChild(h('div', {class:'worked own'}, h('div', {class:'sub-h'}, 'My own calculation'), ta, h('p', {class:'note'}, 'Your text is recorded after the supplied example was shown; it is not assessed as independent calculation. The selected estimate remains the number used by this scripted critique.')));
        cont.innerHTML=''; cont.appendChild(h('div', {class:'actions'}, go, h('span', {class:'hint'}, 'Enter inserts a newline; click to continue.'))); ta.focus();
      }}, 'Enter my own calculation instead'));
      cont.appendChild(adopt); cont.querySelector('button').focus();
    }}, e.t);
    ests.appendChild(b);
  });
  var node = h('div', null,
    phaseHead('A', 'Try it yourself first.', 'Connect it to what you know and make a first attempt. It doesn\'t need to be right — it needs to exist before any AI output does.'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '“'+PHASE_META.A.ask+'”'), h('div', {class:'sub-h'}, d.mq), methods, estBlock, fb, worked, cont, h('div', {class:'actions'}, keyHint())),
      sideBrief()
    )
  );
  render(node);
}

/* ---------- C ---------- */
function screenC(){
  var sc = cur(), d = sc.C;
  var chosen = null;
  var stageBox = h('div');
  var chat = h('div', {class:'chat'}, h('div', {class:'bar'}, h('span', {class:'led'}), 'AI assistant · phase C · scripted practice case · consultation open'), h('div', {class:'body'}, h('div', {class:'msg bot'}, h('div', {class:'who'}, 'Assistant'), 'Hi! I can see you\'ve been working on this. What do you need from me?')));
  var body = chat.querySelector('.body');
  var opts = h('div', {class:'opts', role:'group', 'aria-label':'Prompts'});
  var a = attempt();
  var gapText = a.ai ? 'The only number on the table is the AI\'s: '+a.est+'. Nothing of yours exists to compare it with.' : tpl(a.ok ? d.gap.ok : d.gap.bad);
  if(!a.ai && a.methodOk===false) gapText += ' Your selected approach was "'+a.methodShort+'". '+(a.provenance==='learner' ? 'Your entered calculation is recorded below; this scripted reply does not grade its method.' : 'The supplied worked example uses a different route. Check which method you will defend.');
  gapText += ' The work you keep in this scenario: '+sc.protected+'.';
  var order = d.prompts.map(function(_, i){ return i; });
  for(var oi = order.length-1; oi>0; oi--){ var oj = Math.floor(Math.random()*(oi+1)); var ot = order[oi]; order[oi] = order[oj]; order[oj] = ot; } // shuffle so position is never the tell
  order.forEach(function(idx, i){
    var p = d.prompts[idx];
    var text = tpl(p.t);
    var b = h('button', {class:'opt mono', type:'button', onClick:function(){ choose(p, b, text); }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), text);
    opts.appendChild(b);
  });
  var pickBox = h('div', null, h('div', {class:'sub-h'}, 'Which request do you send?'), opts, h('div', {class:'actions'}, keyHint()));

  function tagFor(kind){ return kind==='bnd' ? '<b>'+CLS.sup+'</b>' : (kind==='sub' ? '<b>'+CLS.sub+'</b>' : (kind==='unb' ? '<b>'+CLS.leak+'</b> — supportive intent, no limit set' : '<b>'+CLS.leak+'</b> — a limit with nothing inside it')); }

  function choose(p, btn, text){
    chosen = p;
    opts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
    btn.classList.remove('dim'); btn.classList.add(p.kind==='bnd'?'good':(p.kind==='sub'?'bad':'meh'));
    var fbEl = h('div', {class:'feedback '+(p.kind==='bnd'?'':(p.kind==='sub'?'bad':'warn'))}, h('span', {class:'verdict'}, p.kind==='bnd'?'Bounded.':(p.kind==='sub'?'That hands over the task.':'Close, but leaky.')), p.fb, h('span', {class:'cls', html:tagFor(p.kind)}));
    pickBox.appendChild(fbEl);
    if(p.kind==='bnd'){
      send(text, 'direct', 'bnd');
    } else {
      /* A draft is not a send: nothing is scored, nothing is given away and no badge is lost until a request actually goes out. */
      rec().drafts.push({kind:p.kind, text:text});
      trail({k:'C', label:(p.kind==='sub'?'Draft: whole-task request (not sent)':'Draft: request (not sent yet)'), text:text, cls:(p.kind==='sub'?'sub':'leak'), pts:0, short:'Consult: '+(p.kind==='sub'?'whole-task draft':'leaky draft'), draft:true});
      var acts = h('div', {class:'actions'},
        h('button', {class:'btn ai', type:'button', onClick:function(){ acts.remove(); fixer(p); }}, 'Fix the prompt before sending'),
        h('button', {class:'btn ghost', type:'button', onClick:function(){ acts.remove(); sendAnyway(p); }}, 'Send it anyway')
      );
      pickBox.appendChild(acts); acts.querySelector('button').focus();
    }
  }

  function fixer(p){
    var on = {};
    var parts = h('div', {class:'parts', role:'group', 'aria-label':'Prompt parts'});
    var preview = h('div', {class:'prompt', 'aria-live':'polite'});
    function upd(){
      var txt = d.parts.filter(function(x,i){return on[i];}).map(function(x){return tpl(x.t);}).join(' ');
      preview.innerHTML = txt ? esc(txt) : '<span class="ph">Tick the parts that belong in a bounded request…</span>';
      sendBtn.disabled = !txt;
    }
    d.parts.forEach(function(pt, i){
      var b = h('button', {class:'part'+(pt.need?'':' trap'), type:'button', 'aria-pressed':'false', onClick:function(){ on[i]=!on[i]; b.setAttribute('aria-pressed', String(!!on[i])); upd(); }}, h('span', {class:'lbl'}, pt.l), tpl(pt.t));
      parts.appendChild(b);
    });
    var sendBtn = h('button', {class:'btn ai', type:'button', disabled:'', onClick:function(){
      var needAll = d.parts.every(function(x,i){ return x.need ? !!on[i] : true; });
      var trapAny = d.parts.some(function(x,i){ return !x.need && !!on[i]; });
      var txt = d.parts.filter(function(x,i){return on[i];}).map(function(x){return tpl(x.t);}).join(' ');
      parts.querySelectorAll('.part').forEach(function(x){ x.disabled = true; });
      sendBtn.disabled = true;
      if(needAll && !trapAny){
        box.appendChild(h('div', {class:'feedback'}, h('span', {class:'verdict'}, 'Boundary repaired.'), 'Attempt, gap, job, boundary — and no add-on that quietly re-delegates the task. Same credit as a request bounded on the first try; the repair itself is on your trail. ', h('span', {class:'cls', html:'<b>'+CLS.sup+'</b> — the AI critiques work you made.'})));
        send(txt, 'repaired', 'bnd');
      } else {
        var why = trapAny ? 'The add-on you kept asks for the answer — one clause is enough to turn a critique request back into delegation.' : 'Something essential is missing (' + d.parts.filter(function(x,i){return x.need&&!on[i];}).map(function(x){return x.l.toLowerCase();}).join(', ') + '). The AI will fill the gap with its own choices.';
        box.appendChild(h('div', {class:'feedback warn'}, h('span', {class:'verdict'}, 'Sent, but still leaky.'), why, h('span', {class:'cls', html:'<b>'+CLS.leak+'</b> — the limit is not fully yours. Watch what comes back.'})));
        send(txt, 'partial', p.kind);
      }
    }}, 'Send the fixed request');
    var box = h('div', {class:'fixer'}, h('h3', null, 'Fix the prompt'), h('p', null, 'A bounded request has four parts: your attempt, the one gap, AI\'s job, and the boundary. Tick what belongs — and watch for add-ons that hand the task back.'), parts, h('div', {class:'assembled'}, h('div', {class:'lbl'}, 'Assembled request'), preview), h('div', {class:'actions'}, sendBtn));
    pickBox.appendChild(box); upd(); parts.querySelector('button').focus();
  }

  function sendAnyway(p){
    if(p.kind==='sub') send(tpl(p.t), 'whole', 'sub'); else send(tpl(p.t), 'asis', p.kind);
  }

  function typing(cb){
    var t = h('div', {class:'msg bot'}, h('div', {class:'typing', 'aria-label':'Assistant is typing'}, h('i'), h('i'), h('i')));
    body.appendChild(t); chat.scrollIntoView({behavior:reduceMotion?'auto':'smooth', block:'nearest'});
    setTimeout(function(){ t.remove(); cb(); }, reduceMotion ? 50 : 900);
  }
  /* The ONE send path. The callers only decide the route. This writes the request fields, builds the immutable reply record, files the
     request on the trail with the reply text and the claim ids, scores the request once, and renders exactly the record's text in the chat.
     Bounded: a critique of the learner's own numbers. Leaky: the same critique plus the AI quietly doing the part the request left open —
     judgeable in E, waiting as the trap in T, and it costs now. Whole: the whole-task reply, whose own sentences are what E will judge. */
  function send(txt, route, kind){
    var R = ROUTE[route], r = rec();
    r.promptFinal = R.final;
    if(route==='repaired') r.repaired = true;
    if(route==='partial'){ r.partial = true; r.leakKind = kind; noteMiss('bounded', 'the request you sent in '+scenNo()+' was still leaky'); }
    if(route==='asis'){ r.leakKind = kind; noteMiss('bounded', 'you sent an unbounded request as it was in '+scenNo()); }
    if(route==='whole'){ r.status.C = 'given'; noteMiss('bounded', 'you sent the AI the whole task in '+scenNo()); }
    var record = buildReply(d, route, txt);
    r.consultations.push(record);
    var pts = route==='whole' ? -PTS.C.sendAnywayGiven : (route==='partial' ? PTS.C.partial : (R.final==='bnd' ? PTS.C.bnd : PTS.C[kind]));
    var entry = {k:'C', label:R.label, text:txt, reply:record.reply.text, claimIds:record.reply.claims.map(function(c){ return c.id; }), cls:R.cls, pts:pts, short:R.short};
    if(route==='whole') entry.given = true;
    trail(entry);
    if(route==='whole') giveAway(PTS.C.sendAnywayGiven, 'whole task sent'); else settle('C', R.settle);
    body.appendChild(h('div', {class:'msg me', text:txt}));
    typing(function(){
      var leaky = record.variant==='leaky', whole = record.variant==='whole';
      var bot = h('div', {class:'msg bot'}, h('div', {class:'who'}, 'Assistant'), replyLines(record.reply.text, leaky));
      if(!whole) bot.appendChild(h('div', {class:'foot-note'}, '(You will judge each numbered point in E. The reply stays on your trail exactly as received.)'));
      body.appendChild(bot);
      if(leaky){
        r.leaked = true; r.status.C = 'leaky';
        giveAway(LEAK_GIVEN, 'leaky request');
        trail({k:'C', label:'The AI did the part your request left open', text:d.uninvited, cls:'leak', pts:-LEAK_GIVEN, short:'Consult: AI answered past the limit', leak:true, claimId:sc.id+'-uninv'});
        pickBox.appendChild(h('div', {class:'feedback warn'}, h('span', {class:'verdict'}, 'It walked through the door you left open.'), 'The last paragraph is the part you were supposed to keep — a decision, made for you, with no reasoning you can check. Receiving it is not adopting it: you can reject it or hold it in E. If you do not, it will be waiting in T. ', h('span', {class:'cls', html:'<b>'+CLS.leak+'</b> — the delegated part is on your trail. −'+LEAK_GIVEN+' given.'})));
      }
      if(whole){
        var a = attempt();
        pickBox.appendChild(h('div', {class:'feedback bad'}, h('span', {class:'verdict'}, 'A full solution came back.'), 'It reads well. It also contains errors — and '+(a.ai ? 'there is no attempt of yours for it to build on' : 'it does not build on your '+a.est+'; it replaces it')+'. In E you will judge exactly these sentences, because that is the only move left. ', h('span', {class:'cls', html:'<b>'+CLS.sub+'</b> — you handed the AI the whole task and set no limit. This phase counts as the AI\'s.'})));
      }
      var c = continueBtn(whole ? 'Evaluate what came back →' : 'Evaluate the reply →', nextPhase);
      pickBox.appendChild(c); c.querySelector('button').focus();
    });
  }

  var node = h('div', null,
    phaseHead('C', 'Consult — with a boundary.', 'This is the one phase where AI enters directly. A bounded request shows your attempt, names the gap, states the AI\'s job and limits its role — what it may do and what it may not. The words "do not" are not the boundary; the work you keep is. The request decides who does the thinking.'),
    h('div', {class:'two'},
      h('div', null,
        h('p', {class:'ask-yourself'}, '“'+PHASE_META.C.ask+'”'),
        h('div', {class:'feedback ai', style:'margin:0 0 16px'}, h('span', {class:'verdict'}, 'Your gap.'), gapText),
        chat, h('div', {style:'height:14px'}), pickBox, stageBox),
      sideBrief()
    )
  );
  render(node);
}

/* ---------- E ---------- */
/* Verdict semantics (shown at the top of E): accept = keep the claim as it stands; revise = keep the valid part and repair the rest,
   saying what changes; reject = exclude the claim or recommendation. Each reason carries the verdicts it is credited with (r.ok), so a
   defensible pair scores: rejecting a constraint-violating recommendation with the sound reason is as good as revising it. */
var E_SEMANTICS = 'Accept = keep this claim in my result as it stands. Revise = keep the valid part and repair the rest — you will say what changes. Reject = exclude this claim or recommendation from my result.';
function scoreJudgment(c, verdict, r){
  var pairOK = r.ok.indexOf(verdict) >= 0, valid = r.kind==='valid_evidence', vOK = pairOK || verdict===c.best;
  var pts = pairOK ? PTS.E.verdict+PTS.E.reason : (vOK ? PTS.E.verdict : (valid ? PTS.E.reasonOnly : 0));
  return {pairOK:pairOK, vOK:vOK, valid:valid, pts:pts};
}
/* The bounded follow-up question for a claim: its own entry, else the nearest planted claim of the same kind. A sound claim has nothing to send back. */
function followupFor(sc, c){
  var fu = sc.C.followups || {};
  function get(id){ var v = fu[id]; return typeof v==='string' ? get(v) : (v || null); }
  if(get(c.id)) return get(c.id);
  var alias = {unsupported:'constraint', uninvited:'constraint'}, t = alias[c.type] || c.type;
  var same = sc.C.claims.filter(function(x){ return x.type===t && get(x.id); })[0];
  if(same) return get(same.id);
  if(c.type==='ok') return null;
  var planted = sc.C.claims.filter(function(x){ return x.type!=='ok' && get(x.id); });
  return planted.length ? get(planted[planted.length-1].id) : null;
}
/* Preserve the revision verbatim. Do not infer a new estimate from a number that may be a coefficient, dimension or intermediate step. */
function recordRevision(text, claimId){
  var r = rec(), prev = r.attempt || r.attempts[r.attempts.length-1] || null, k = PHASES[S.phase];
  var at = {id:'a'+(r.attempts.length+1), parentId:prev ? prev.id : null, provenance:'learner', text:text, work:text, slip:'', ai:false,
            est:prev ? prev.est : '', ok:null, estimateStatus:'not parsed from revision',
            methodIdx:prev ? prev.methodIdx : null, methodShort:prev ? prev.methodShort : '', methodText:prev ? prev.methodText : '', methodOk:prev ? prev.methodOk : null, estIdx:prev ? prev.estIdx : null};
  r.attempts.push(at); r.attempt = at;
  r.revisions.push({phase:k, fromAttemptId:prev ? prev.id : null, toAttemptId:at.id, causedByClaimIds:claimId ? [claimId] : [], explanation:text});
  trail({k:k, label:'Attempt revised', text:text, prov:'revised', cls:'own', pts:0, claimId:claimId || null, short:'Attempt revised'});
  return at;
}
/* The inline "Revise my attempt" box (any language, ≥ 8 characters, Ctrl+Enter records). */
function reviseBox(claimId){
  var ta = h('textarea', {class:'free', rows:'3', 'aria-label':'Write the corrected step or number', placeholder:'Write the corrected step or number — any language, at least 8 characters.'});
  var save = h('button', {class:'btn ghost', type:'button', disabled:'', onClick:submit}, 'Record the revision');
  var box = h('div', {class:'revise revise-attempt'}, h('label', null, h('span', {class:'lbl'}, 'Revise my attempt'), ta), h('div', {class:'row'}, save, h('span', {class:'hint'}, 'Your first attempt stays on the trail; this is filed as a revision. Ctrl+Enter records it.')));
  ta.addEventListener('input', function(){ save.disabled = Array.from(ta.value.trim()).length < 8; });
  ta.addEventListener('keydown', function(e){ if(e.key==='Enter' && (e.ctrlKey || e.metaKey) && !save.disabled){ e.preventDefault(); submit(); } });
  function submit(){
    if(save.disabled) return;
    var text = ta.value.trim(); ta.disabled = true; save.disabled = true;
    recordRevision(text, claimId);
    box.appendChild(h('div', {class:'feedback', style:'margin-top:8px'}, h('span', {class:'verdict'}, 'Revision on record.'), 'Filed as “Revised by learner”, next to the first attempt — which stays as it was. No points either way.'));
  }
  setTimeout(function(){ ta.focus(); }, 30);
  return box;
}
function screenE(){
  var sc = cur(), d = sc.C, r = rec();
  var done = 0, fb = h('div'), cont = h('div');
  var claims = h('div', {class:'claims'});
  /* E renders the reply record built at send time — the exact text received, with its claim objects — never a scenario-level lookup. */
  var record = lastReply();
  console.assert(record, 'E reached without a reply record');
  var list = record ? record.reply.claims : [];
  var numbered = list.filter(function(c){ return !c.unsolicited; }).length;
  var planted = list.filter(function(c){ return c.type!=='ok' && !c.unsolicited; }).length;
  r.eClaims = list.map(function(c){ return {id:c.id, type:c.type, best:c.best, unsolicited:!!c.unsolicited}; }); // what "n of m planted errors" is counted against
  var returnBtns = [], pendingReturn = 0;
  function currentE(){ return S && S.mode==='phase' && PHASES[S.phase]==='E' && rec()===r; }
  function syncContinue(){ var b = cont.querySelector('button'); if(b){ b.disabled = pendingReturn>0; b.title = pendingReturn ? 'Finish or cancel the return consultation first' : ''; } }
  function syncReturnBtns(){ returnBtns.forEach(function(b){ if(r.returnUsed){ b.disabled = true; b.title = 'One bounded return consultation per scenario'; } }); }

  /* One verdict-and-reason picker. Used for the first judgment and, after a return consultation, for the one re-judgment.
     Revise opens a required "what do you keep, what changes?" field; the reasons enable once it has ≥ 8 characters. */
  function judgeUI(c, i, pass, onDecide){
    var verdict = null, ta = null;
    var vs = h('div', {class:'verdicts', role:'group', 'aria-label':(pass===2 ? 'Revised verdict' : 'Verdict')+' for '+(c.unsolicited ? 'the uninvited recommendation' : 'point '+(i+1))});
    var reviseBox = h('div'), reasonsBox = h('div');
    vs.appendChild(h('span', {class:'vlab'}, c.unsolicited ? (pass===2 ? 'Re-judge:' : 'Uninvited:') : (pass===2 ? 'Re-judge point '+(i+1)+':' : 'Point '+(i+1)+':')));
    ['accept','revise','reject'].forEach(function(v){
      var b = h('button', {class:'vbtn '+v, type:'button', 'aria-pressed':'false', onClick:function(){
        verdict = v; vs.querySelectorAll('.vbtn').forEach(function(x){ x.setAttribute('aria-pressed', String(x===b)); });
        vs.setAttribute('data-keys-off', '');   // number keys now address the reasons
        showReasons();
      }}, v.charAt(0).toUpperCase()+v.slice(1));
      vs.appendChild(b);
    });
    function ready(){ return verdict!=='revise' || (ta && Array.from(ta.value.trim()).length >= 8); }
    function showReasons(){
      reviseBox.innerHTML = ''; reasonsBox.innerHTML = ''; ta = null;
      var rb = h('div', {class:'reasons'}, h('div', {class:'lbl'}, 'Because…'));
      var shuffled = c.reasons.slice();
      if(i%3===1) shuffled.push(shuffled.shift()); else if(i%3===2) shuffled.unshift(shuffled.pop());   // stable pseudo-shuffle so the good reason isn't always first
      var btns = shuffled.map(function(rr){ return h('button', {class:'rbtn', type:'button', onClick:function(){ if(ready()) finish(rr); }}, rr.t); });
      btns.forEach(function(b){ rb.appendChild(b); });
      function sync(){ var ok = ready(); btns.forEach(function(b){ b.disabled = !ok; }); rb.classList.toggle('waiting', !ok); }
      if(verdict==='revise'){
        ta = h('textarea', {class:'free', rows:'2', 'aria-label':'What do you keep, what changes?', placeholder:'What do you keep, what changes? Any language; at least 8 characters.'});
        ta.addEventListener('input', sync);
        ta.addEventListener('keydown', function(e){ if(e.key==='Enter' && (e.ctrlKey || e.metaKey) && ready()){ e.preventDefault(); btns[0].focus(); } });
        reviseBox.appendChild(h('div', {class:'revise'}, h('label', null, h('span', {class:'lbl'}, 'Revise — what do you keep, what changes?'), ta), h('div', {class:'hint'}, 'Then Tab or Ctrl+Enter to reach the reasons.')));
      }
      reasonsBox.appendChild(rb); sync();
      if(ta) ta.focus(); else btns[0].focus();
    }
    function finish(rr){
      var expl = ta ? ta.value.trim() : '';
      vs.querySelectorAll('.vbtn').forEach(function(x){ x.disabled = true; });
      if(ta) ta.disabled = true;
      reasonsBox.querySelectorAll('.rbtn').forEach(function(x){ x.disabled = true; x.setAttribute('aria-pressed', String(x.textContent===rr.t)); });
      reasonsBox.querySelector('.reasons').setAttribute('data-keys-off', '');
      onDecide(verdict, rr, expl);
    }
    return h('div', {class:'judge'}, vs, reviseBox, reasonsBox);
  }

  list.forEach(function(c, i){
    var card = h('div', {class:'claim'}), area = h('div'), explainBox = h('div'), explained = false;
    /* Reveal order: heading, type, the reason's tail, then the gap bar. The case's own explanation appears only after a gap-bar choice
       (or at once when the pair was credited on evidence), so a re-judgment is a correction, not a copy. */
    function revealExplain(){ if(explained) return; explained = true; explainBox.appendChild(h('div', {class:'reveal explain'}, h('b', null, 'What the case shows. '), c.explain)); }
    function decide(pass){ return function(verdict, rr, expl){
      if(!currentE()) return;
      if(pass===2){ pendingReturn = Math.max(0, pendingReturn-1); syncContinue(); }
      var suffix = {invalid_technical_reason:' · misconception', unsupported_authority:' · trust', convenience:' · convenience'}[rr.kind] || '';
      var reasonChip = h('span', {class:'rkind '+rr.kind}, 'Your reason: '+REASON_KIND[rr.kind].label);
      var valid = rr.kind==='valid_evidence', credited, canonical, pts = 0, head, body = '', flag = rr.flag || null;
      var beforeCredit = r.phasePts.E || 0;
      var j = {claimId:c.id, claimText:c.t, claimType:c.type, verdict:verdict, reasonText:rr.t, reasonKind:rr.kind, pass:pass, pts:0, canonical:false, credited:false, explanation:expl || null};
      if(c.unsolicited){
        /* Not point-scored: a boundary matter, not a planted computation. Credited when the reason's flag allows the verdict —
           reject with any flag excludes it; revise with "unsupported" holds it pending evidence; accept adopts it. */
        credited = rr.ok.indexOf(verdict) >= 0; canonical = credited;
        if(verdict==='accept'){ head = 'Received — and now adopted.'; body = 'Receiving a recommendation is not the same as adopting it. Accepting this one puts a decision you did not ask for, and that checks nothing, into your result. '; }
        else if(credited && verdict==='reject'){ head = 'Excluded from your result.'; body = 'Flagged as '+FLAG_LABEL[flag]+' — a reason on record, and the recommendation is out. '; }
        else if(credited){ head = 'Held pending evidence.'; body = 'It stays out of your result until the evidence arrives — and none arrives in this scenario, so it stays out. '; }
        else if(flag){ head = 'That reason excludes it.'; body = 'A recommendation outside your request, or one that breaks a constraint, is not held — it goes out. Only "unsupported" earns a hold, pending evidence. '; }
        else { head = 'Right call — but "because" matters.'; }
        j.flag = flag; j.unsolicited = true; j.credited = credited; j.canonical = credited;
        r.judgments.push(j);
        r.uninvitedJudged = {verdict:verdict, flag:flag, credited:credited};
        pop(0, credited ? (verdict==='reject' ? 'excluded — no points at stake' : 'held pending evidence') : (verdict==='accept' ? 'uninvited decision adopted' : 'not excluded'));
      } else {
        var s = scoreJudgment(c, verdict, rr); pts = s.pts; credited = s.pairOK; canonical = s.vOK;
        j.pts = pts; j.canonical = canonical; j.credited = credited;
        /* The judgment is the record; badges and the debrief counters are derived from it later (judgmentStats), never kept in step by hand.
           A pass-2 judgment is credited under the PTS.E.rejudged cap inside creditFor('E'). */
        r.judgments.push(j);
        head = credited ? (verdict===c.best ? 'Right, for the right reason.' : 'Defensible — and supported.') : (canonical ? 'Right call — but "because" matters.' : 'The call should be: '+c.best+'.');
        settle('E', pass===2 ? 'revised judgment' : (credited ? 'judged with evidence' : (canonical ? (rr.kind==='invalid_technical_reason' ? 'right call, wrong argument' : 'right call, weak reason') : 'missed')));
      }
      if(credited && verdict==='revise' && expl) r.revisions.push({phase:'E', causedByClaimIds:[c.id], explanation:expl, kind:'verdict'});
      card.classList.remove('right', 'half', 'wrong'); card.classList.add(credited && valid ? 'right' : (canonical ? 'half' : 'wrong'));
      var reveal = h('div', {class:'reveal'}, h('b', null, head+' '), body + (valid ? '' : reasonTail(rr)), h('span', {class:'etype '+(c.type==='ok'?'ok':'')}, TYPE_LABEL[c.type]), reasonChip);
      if(expl) reveal.appendChild(h('div', {class:'expl'}, h('span', {class:'prov'}, PROV.learner), ' What changes: “'+expl+'”'));
      area.appendChild(reveal);
      var tag = c.unsolicited ? (credited ? (verdict==='reject' ? ' (excluded)' : ' (held)') : (verdict==='accept' ? ' (adopted)' : ' (not excluded)')) : (credited ? (verdict===c.best ? ' (correct)' : ' (defensible)') : (canonical ? ' (correct)' : ' (should be '+c.best+')'));
      var entry = {k:'E', label:(pass===2 ? 'Revised judgment (after the follow-up named the correction) — ' : 'First judgment — ')+(c.unsolicited ? 'uninvited recommendation: ' : '')+verdict+tag,
                   text:'“'+c.t+'” — because: '+rr.t+(expl ? '\nWhat changes: '+expl : ''), cls:(c.unsolicited && verdict==='accept' ? 'sub' : 'own'), pts:c.unsolicited ? 0 : (r.phasePts.E || 0)-beforeCredit, rawPts:pts,
                   short:(pass===2 ? 'Re-judged ' : '')+(c.unsolicited ? 'Uninvited: ' : 'Point '+(i+1)+': ')+verdict+(canonical ? ' ✓' : ' ✗')+suffix, reasonKind:rr.kind, claimId:c.id, pass:pass, unsolicited:!!c.unsolicited};
      if(expl) entry.prov = 'learner';
      trail(entry);   // filed in the order judged; the claim id on the entry says which point it was
      if(pass===1){ done++; if(done===list.length) finishE(); }
      if(pass===1 && !(credited && valid)) showGapBar(); else revealExplain();
    }; }
    /* After a judgment that was not credited on evidence: revise the attempt, check a reference, or return to C once — or continue. */
    function showGapBar(){
      var fu = followupFor(sc, c);
      var bar = h('div', {class:'gapbar'}, h('span', {class:'lbl'}, 'A gap showed. What now?'));
      var b1 = h('button', {class:'btn ghost', type:'button', onClick:function(){ bar.remove(); area.appendChild(reviseBox(c.id)); revealExplain(); }}, 'Revise my attempt');
      var b2 = h('button', {class:'btn ghost', type:'button', onClick:function(){ bar.remove(); revealExplain(); openTray(c.evidenceHint); }}, 'Check a reference');
      var b3 = fu ? h('button', {class:'btn ghost', type:'button', onClick:function(){ bar.remove(); returnToC(fu); }}, 'Return to C with this question') : null;
      var b4 = h('button', {class:'btn ghost', type:'button', onClick:function(){ bar.remove(); revealExplain(); }}, 'Continue');
      bar.appendChild(b1); bar.appendChild(b2); if(b3){ bar.appendChild(b3); returnBtns.push(b3); } bar.appendChild(b4);
      area.appendChild(bar); syncReturnBtns(); b1.focus();
    }
    /* Return to C: one bounded consultation per scenario. The question is pre-written and editable; the boundary sentence is fixed; the reply
       is critique only — no new number, no verdict. Then this point may be re-judged once, under the pass-2 cap. */
    function returnToC(fu){
      r.returnUsed = true; pendingReturn++; syncReturnBtns(); syncContinue(); updateHUD();
      var fixed = 'Do not recompute or give a verdict.';
      var q = h('textarea', {class:'free', rows:'2', 'aria-label':'Your bounded question'}); q.value = fu.q;
      var chat = h('div', {class:'chat return'}, h('div', {class:'bar'}, h('span', {class:'led'}), 'Return to C · one bounded consultation · scripted practice case'), h('div', {class:'body'}));
      var body = chat.querySelector('.body');
      var sendBtn = h('button', {class:'btn ai', type:'button', onClick:sendReturn}, 'Send this question');
      var compose = h('div', {class:'compose'}, h('div', {class:'lbl'}, 'Your question — edit it if you like; the boundary sentence is fixed'), q, h('div', {class:'fixed'}, fixed), h('div', {class:'row'}, sendBtn, h('span', {class:'hint'}, 'Critique only: the reply gives no new number and no verdict. Then you may re-judge this point once.')));
      compose.appendChild(h('button', {class:'btn ghost', type:'button', onClick:function(){
        chat.remove(); pendingReturn--; r.returnUsed = false; returnBtns.forEach(function(b){ b.disabled = false; }); syncContinue(); updateHUD(); revealExplain();
      }}, 'Cancel this follow-up'));
      body.appendChild(compose);
      function sendReturn(){
        var qt = q.value.trim() || fu.q, request = qt + (qt.indexOf(fixed) >= 0 ? '' : ' '+fixed);
        compose.remove();
        var recd = deepFreeze({id:'k'+(r.consultations.length+1), kind:'return', claimId:c.id, request:request, reply:{text:fu.reply}, at:Date.now()});
        r.consultations.push(recd);
        trail({k:'C', label:'Return consultation (bounded)', text:request+'\n— '+fu.reply, cls:'sup', pts:0, short:'Consult: bounded return question', claimId:c.id});
        body.appendChild(h('div', {class:'msg me', text:request}));
        var t = h('div', {class:'msg bot'}, h('div', {class:'typing', 'aria-label':'Assistant is typing'}, h('i'), h('i'), h('i')));
        body.appendChild(t);
        setTimeout(function(){
          if(!currentE()) return;
          t.remove();
          body.appendChild(h('div', {class:'msg bot'}, h('div', {class:'who'}, 'Assistant'), fu.reply, h('div', {class:'foot-note'}, '(Critique only — no recomputation, no verdict. The judgment is still yours.)')));
          var ui = judgeUI(c, i, 2, decide(2));
          area.appendChild(h('div', {class:'rejudge'}, h('div', {class:'lbl'}, 'Re-judge this point — a revised judgment earns at most '+PTS.E.rejudged+' of '+(PTS.E.verdict+PTS.E.reason)), ui));
          ui.querySelector('.vbtn').focus();
        }, reduceMotion ? 50 : 900);
      }
      area.appendChild(chat); q.focus();
    }
    if(c.unsolicited) card.classList.add('uninv');
    card.appendChild(h('div', {class:'n'}, c.unsolicited ? 'Assistant · uninvited — outside the request' : 'Assistant · point '+(i+1)+' of '+numbered, h('code', {class:'cid'}, '['+c.id+']')));
    card.appendChild(h('div', {class:'txt', text:c.t}));
    card.appendChild(judgeUI(c, i, 1, decide(1)));
    card.appendChild(area); card.appendChild(explainBox);
    claims.appendChild(card);
  });
  function finishE(){
    fb.appendChild(h('div', {class:'feedback'}, h('span', {class:'verdict'}, 'All '+list.length+' judged.'), 'This reply carried '+planted+' planted error'+(planted===1?'':'s')+(record.variant==='leaky' ? ' and one recommendation you did not ask for' : '')+'. The verdicts are yours, and each one has a reason on record — that is what turns "I checked it" into evidence.'));
    if(!r.revisions.some(function(v){ return v.toAttemptId; })){
      var box = h('div');
      var end = h('div', {class:'gapbar'}, h('span', {class:'lbl'}, 'The reply as a whole:'),
        h('button', {class:'btn ghost', type:'button', onClick:function(){ end.remove(); box.appendChild(reviseBox(null)); }}, 'Revise my attempt'),
        h('button', {class:'btn ghost', type:'button', onClick:function(){ openTray(); }}, 'Check a reference'));
      fb.appendChild(end); fb.appendChild(box);
    }
    cont.appendChild(continueBtn('Transform & transfer →', nextPhase)); syncContinue(); cont.querySelector('button').focus();
  }
  if(!record){ fb.appendChild(h('div', {class:'feedback warn'}, h('span', {class:'verdict'}, 'No reply on record.'), 'Nothing was sent in C, so there is nothing to judge here.')); cont.appendChild(continueBtn('Transform & transfer →', nextPhase)); }
  var circular = h('button', {class:'btn ghost', type:'button', onClick:function(){
    giveAway(PTS.E.circularGiven, 'circular check'); noteMiss('gate', 'you asked a second AI to verify the first in '+scenNo());
    trail({k:'E', label:'Asked a second AI to verify the first', text:'Second assistant: "Looks correct to me — the reasoning is sound throughout."', cls:'sub', pts:-PTS.E.circularGiven, short:'Evaluate: circular AI check', given:true});
    circular.disabled = true;
    fb.appendChild(h('div', {class:'feedback bad'}, h('span', {class:'verdict'}, '“Looks correct to me — the reasoning is sound throughout.”'), 'A second model agreed with the first, errors included. Agreement from another model is not independent evidence. What calculation, source, or observation supports the claim? Nothing was computed here — that is circular verification, and it cost you without checking anything. ', h('span', {class:'cls', html:'<b>'+CLS.sub+'</b> of the judgment itself.'})));
  }}, 'Ask another AI to double-check this');
  var node = h('div', null,
    phaseHead('E', 'Judge what came back.', 'For each point: accept, revise, or reject — and pick the reason. The verdict is yours; the evidence is what makes it count. The Evidence tray is open for checks.'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '“'+PHASE_META.E.ask+'”'),
        h('div', {class:'semantics'}, E_SEMANTICS),
        rec().status.C==='given' ? (attempt().ai
          ? h('div', {class:'feedback warn', style:'margin:0 0 14px'}, h('span', {class:'verdict'}, 'No attempt to compare against.'), 'The AI did your attempt and then the whole task, so these claims must be judged cold. Notice how much harder that is.')
          : h('div', {class:'feedback warn', style:'margin:0 0 14px'}, h('span', {class:'verdict'}, 'It doesn\'t build on your attempt.'), 'You handed over the task, so this answer replaces your '+attempt().est+' instead of critiquing it. Judge it against your own number and your frame — they are the only independent check you have.')) : null,
        record ? replyPanel(record) : null,
        claims, h('div', {class:'actions'}, circular, h('span', {class:'hint'}, 'Tempting shortcut. Costs will show.')), fb, cont,
        h('div', {class:'actions'}, h('span', {class:'hint'}, 'Tip: 1–3 verdict, 1–3 reason · after Revise: type, then Tab or Ctrl+Enter to reach the reasons · Enter continues.'))),
      sideBrief()
    )
  );
  render(node);
}

/* ---------- T ---------- */
/* The integration pick is provisional. A pick that carries an error can be repaired once — a different option plus "what changed, and why?" —
   and the before / after goes on the trail. A repair earns at most PTS.T.repaired (less than getting it right first); a second visit adds nothing. */
function screenT(){
  var sc = cur(), d = sc.T, r = rec();
  var fb = h('div'), cont = h('div'), choice = h('div'), repairBox = h('div');
  var opts = h('div', {class:'opts', role:'group', 'aria-label':'Integrations'});
  var topts = h('div', {class:'opts', role:'group', 'aria-label':'Transfer statements'});
  var tBlock = h('div', {hidden:''}, h('div', {class:'sub-h'}, d.tq), topts);
  function showTransfer(){ tBlock.hidden = false; topts.querySelector('button').focus(); }
  function feedbackFor(o, stage){
    var a0 = r.attempts[0], uj = r.uninvitedJudged, canRepair = stage==='first' && !o.ok && !r.repairUsed, extra = '';
    if(o.trap && r.leaked){
      if(uj && uj.credited && uj.verdict==='reject') extra = ' In E you excluded this recommendation as '+FLAG_LABEL[uj.flag]+'. It is back in your result'+(canRepair ? ' — repair it?' : '.');
      else if(uj && uj.credited) extra = ' In E you held this recommendation pending evidence. None arrived — and it is now your design'+(canRepair ? ' — repair it?' : '.');
      else extra = ' This is the recommendation the assistant volunteered when your request left the door open — you did not ask for it'+(uj && uj.verdict==='accept' ? ', you accepted it in E' : '')+', and it is now your design'+(canRepair ? ' — repair it?' : '.');
    }
    else if(!o.ok && canRepair) extra = ' You can repair it below — the before and after go on your trail.';
    else if(o.ok && a0 && !a0.ok && !a0.ai){
      var rv = r.revisions.filter(function(v){ return v.phase==='E' && v.explanation; }), att = rv.filter(function(v){ return v.toAttemptId; });
      var last = att.length ? att[att.length-1] : null;
      extra = last ? ' Your first attempt said '+a0.est+'; you revised it in E to “'+last.explanation+'”.' : ' Your first selected estimate was '+a0.est+'. This recommendation is a supplied option you selected; no revision of your calculation is on record.';
    }
    var word = o.provisional ? 'Provisional — checks still needed.' : stage==='repaired' ? (o.ok ? 'Repaired — owned.' : 'Still carries an error.') : (o.ok ? (o.needsData ? 'Owned — and honest about the data.' : 'Owned.') : 'An error made it through.');
    return h('div', {class:'feedback '+(o.ok?'':'bad')}, h('span', {class:'verdict'}, word), o.fb + extra);
  }
  d.opts.forEach(function(o, i){
    var b = h('button', {class:'opt', type:'button', onClick:function(){
      opts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
      opts.setAttribute('data-keys-off', '');
      b.classList.remove('dim'); b.classList.add(o.ok?'good':'bad');
      r.tInteg.first = {idx:i, ok:!!o.ok, text:o.t, needsData:!!o.needsData, provisional:!!o.provisional};
      settle('T', o.ok ? 'provisional recommendation' : 'error carried');
      var pts = o.ok?PTS.T.integ:PTS.T.integWrong;
      fb.innerHTML=''; fb.appendChild(feedbackFor(o, 'first'));
      trail({k:'T', label:'Provisional recommendation', text:o.t, cls:'own', pts:pts, short:'Result (provisional): '+(o.ok?(o.needsData?'data requested':(o.provisional?'checks pending':'sound')):(o.trap&&r.leaked?'the uninvited recommendation':'carries an AI error'))});
      if(!o.ok && !r.repairUsed){
        choice.innerHTML = '';
        choice.appendChild(h('div', {class:'actions'},
          h('button', {class:'btn ghost', type:'button', onClick:function(){ r.repairUsed = true; choice.innerHTML = ''; openRepair(i); }}, 'Repair my recommendation'),
          h('button', {class:'btn ghost', type:'button', onClick:function(){ r.repairUsed = true; choice.innerHTML = ''; showTransfer(); }}, 'Keep it and move on')));
        choice.querySelector('button').focus();
      } else showTransfer();
    }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), o.t);
    opts.appendChild(b);
  });
  function openRepair(firstIdx){
    var pick = null;
    var ropts = h('div', {class:'repair-opts', role:'group', 'aria-label':'Repaired recommendation'});
    var ta = h('textarea', {class:'free', rows:'2', 'aria-label':'What changed, and why?', placeholder:'What changed, and why? Any language; at least 8 characters.'});
    var submit = h('button', {class:'btn ghost', type:'button', disabled:'', onClick:doRepair}, 'Record the repair');
    function ready(){ return pick!==null && Array.from(ta.value.trim()).length >= 8; }
    function sync(){ submit.disabled = !ready(); }
    d.opts.forEach(function(o, j){
      var b = h('button', {class:'opt'+(j===firstIdx ? ' dim' : ''), type:'button', 'aria-pressed':'false', disabled:(j===firstIdx ? '' : null), onClick:function(){
        pick = j; ropts.querySelectorAll('.opt').forEach(function(x){ x.setAttribute('aria-pressed', String(x===b)); }); sync(); ta.focus();
      }}, h('span', {class:'key', 'aria-hidden':'true'}, j+1), o.t);
      ropts.appendChild(b);
    });
    ta.addEventListener('input', sync);
    ta.addEventListener('keydown', function(e){ if(e.key==='Enter' && (e.ctrlKey || e.metaKey) && ready()){ e.preventDefault(); doRepair(); } });
    function doRepair(){
      if(!ready() || submit.disabled) return;
      var o = d.opts[pick], why = ta.value.trim(), first = r.tInteg.first;
      ropts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; if(x.getAttribute('aria-pressed')!=='true') x.classList.add('dim'); });
      ropts.setAttribute('data-keys-off', ''); ta.disabled = true; submit.disabled = true;
      r.tInteg.repaired = {idx:pick, ok:!!o.ok, text:o.t, needsData:!!o.needsData, provisional:!!o.provisional};
      var caused = r.judgments.filter(function(j){ return j.pass===1 && j.verdict!=='accept'; }).map(function(j){ return j.claimId; });
      r.revisions.push({phase:'T', fromAttemptId:null, toAttemptId:null, causedByClaimIds:caused, explanation:why, from:first.text, to:o.t});
      var before = r.phasePts.T || 0;
      settle('T', o.ok ? 'recommendation repaired' : 'repair still carries an error');
      trail({k:'T', label:'Recommendation revised', text:'Before: '+first.text+'\nAfter: '+o.t+'\nBecause: '+why, prov:'revised', cls:'own', pts:(r.phasePts.T || 0) - before, short:'Result revised: '+(o.needsData ? 'data requested' : (o.provisional ? 'checks pending' : (o.ok ? 'sound' : 'still carries an error')))});
      fb.innerHTML=''; fb.appendChild(feedbackFor(o, 'repaired'));
      showTransfer();
    }
    repairBox.appendChild(h('div', {class:'repair'}, h('div', {class:'lbl'}, 'Repair — choose the recommendation you now stand behind'), ropts, h('label', null, h('span', {class:'lbl'}, 'What changed, and why?'), ta), h('div', {class:'row'}, submit, h('span', {class:'hint'}, 'Before and after go on your trail. A repair earns at most '+PTS.T.repaired+' of '+PTS.T.integ+'. Ctrl+Enter records it.'))));
    ropts.querySelector('button:not([disabled])').focus();
  }
  d.topts.forEach(function(o, i){
    var b = h('button', {class:'opt', type:'button', onClick:function(){
      topts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
      topts.setAttribute('data-keys-off', '');
      b.classList.remove('dim'); b.classList.add(o.v==='best'?'good':(o.v==='ok'?'meh':'bad'));
      r.tTransfer = {idx:i, v:o.v};
      settle('T', 'strategy named');
      var pts = PTS.T[o.v];
      fb.innerHTML=''; fb.appendChild(h('div', {class:'feedback '+(o.v==='best'?'':(o.v==='ok'?'warn':'bad'))}, h('span', {class:'verdict'}, o.v==='best'?'Portable.':(o.v==='ok'?'Half a strategy.':'That is the opposite lesson.')), o.fb, h('span', {class:'cls', html:'<b>'+CLS.own+'</b> — the residue that outlasts the problem.'})));
      trail({k:'T', label:'Transfer note', text:o.t, cls:'own', pts:pts, short:'Transfer: '+o.v});
      cont.innerHTML=''; cont.appendChild(continueBtn('Scenario debrief →', nextPhase)); cont.querySelector('button').focus();
    }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), o.t);
    topts.appendChild(b);
  });
  var node = h('div', null,
    phaseHead('T', 'Make it yours, and carry it forward.', 'Fold your decisions into a result you own — provisionally, with one repair if it needs one — then name what you will do differently next time.'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '“'+PHASE_META.T.ask+'”'), lastReply() ? replyPanel(lastReply(), 'Reopen the reply from C') : null, h('div', {class:'sub-h'}, d.iq), opts, fb, choice, repairBox, tBlock, cont, h('div', {class:'actions'}, keyHint())),
      sideBrief()
    )
  );
  render(node);
}

/* ---------- AI outside C (temptation) ---------- */
function askAI(){
  if(!S || S.mode!=='phase') return;
  var k = PHASES[S.phase];
  if(k==='C'){ var first = document.querySelector('.opts .opt:not([disabled]), .part:not([disabled])'); if(first) first.focus(); return; }
  var sc = cur();
  var text = sc.outside[k];
  var isE = k==='E';
  var bg = h('div', {class:'modal-bg', role:'dialog', 'aria-modal':'true', 'aria-labelledby':'mtitle'}), app = document.getElementById('app'), modal;
  if(!$tray.hidden) hideTray();
  /* Close order matters: the background must stop being inert BEFORE focus goes back to the Ask AI button, or the focus call fails and the next key goes nowhere. */
  function close(){ app.removeAttribute('inert'); app.removeAttribute('aria-hidden'); bg.remove(); document.removeEventListener('keydown', onKey); $ask.focus(); }
  function onKey(e){
    if(e.key==='Escape'){ e.preventDefault(); e.stopImmediatePropagation(); dismiss(); return; }
    if(e.key==='Tab'){   // focus stays inside the dialog
      var f = modal.querySelectorAll('button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])'); if(!f.length) return;
      var first = f[0], last = f[f.length-1];
      if(e.shiftKey && (document.activeElement===first || !modal.contains(document.activeElement))){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && (document.activeElement===last || !modal.contains(document.activeElement))){ e.preventDefault(); first.focus(); }
    }
  }
  document.addEventListener('keydown', onKey);
  function dismiss(){
    giveAway(PTS.outside.peek, 'peeked outside C'); noteMiss('gate', 'you opened the assistant in phase '+k+' of '+scenNo());
    if(k==='P' || k==='F' || k==='A') noteMiss('human', 'you consulted the AI in phase '+k+' of '+scenNo()+' before attempting');
    trail({k:k, label:'Consulted AI outside C, then closed it', text:text, cls:'peek', pts:-PTS.outside.peek, short:'Peeked at AI in '+k+' — closed it'});
    close();
    refreshSide();
  }
  function use(){
    if(S.lock) return;
    S.lock = true;
    giveAway(PTS.outside.use, 'phase '+k+' given away'); noteMiss('gate', 'you let the AI do phase '+k+' in '+scenNo());
    if(k==='P' || k==='F' || k==='A') noteMiss('human', 'the AI did phase '+k+' in '+scenNo()+' before you attempted');
    if(k==='E'){ noteMiss('hunter', 'the AI\'s self-check went through unjudged in '+scenNo()); }
    rec().status[k] = 'given';
    trail({k:k, label:'AI did phase '+k+' — you used it', text:text, cls:'sub', pts:-PTS.outside.use, short:'Phase '+k+' given to AI', given:true});
    close();
    S.phase++;
    if(S.phase >= PHASES.length) debriefScreen(); else phaseScreen();
  }
  var consq = {
    P:'If you use this, the AI has named the problem — and quietly chosen what counts as done. You will not find out what it left out until later.',
    F:'If you use this, the criteria are the AI\'s. Every later check will be made against assumptions you never examined — some of them wrong.',
    A:'If you use this, no attempt of yours will exist. In E you will have nothing to compare the AI against — and this answer has an error in it.',
    E:'A model re-checking its own output is the same source twice. Nothing has been verified. If you use this, every claim — errors included — goes through unjudged.',
    T:'If you use this, the lesson on record is the AI\'s — and it is the wrong lesson.'
  }[k];
  modal = h('div', {class:'modal'},
    h('div', {class:'head'}, h('span', {class:'led'}), h('h3', {id:'mtitle'}, 'AI assistant · phase '+k+' — outside the consultation gateway'), h('span', {class:'warnp'}, 'Outside C')),
    h('div', {class:'body'},
      h('div', {class:'msg me', text: {P:'What is the problem here?', F:'What are the assumptions and criteria I should use?', A:'Solve this for me.', E:'Can you double-check your answer?', T:'Summarize the result and what I learned.'}[k]}),
      h('div', {class:'msg bot'}, h('div', {class:'who'}, 'Assistant'), text),
      h('div', {class:'consq', html:'<b>Consequence.</b> '+esc(consq)+' <b>Closing still costs</b> — the AI\'s framing is now in your head.'+(trayAllowed() ? ' To work independently at no cost, use the Evidence tray instead.' : '')})
    ),
    h('div', {class:'foot'},
      h('button', {class:'btn ghost', type:'button', onClick:dismiss}, 'Close — I\'ll do it myself (−'+PTS.outside.peek+')'),
      h('button', {class:'btn', type:'button', style:'border-color:var(--risk); color:var(--risk)', onClick:use}, isE ? 'Accept everything as verified (−'+PTS.outside.use+')' : 'Use this and move on (−'+PTS.outside.use+')')
    )
  );
  bg.appendChild(modal); document.body.appendChild(bg);
  app.setAttribute('inert', ''); app.setAttribute('aria-hidden', 'true');
  modal.querySelector('.foot button').focus();
}
function refreshSide(){
  var side = document.querySelector('.side'); if(!side) return;
  var open = Array.prototype.map.call(side.querySelectorAll('details.reply-full[open]'), function(x){ return x.getAttribute('data-i'); }); // a trail push mid-read must not snap the reply shut
  var fresh = sideBrief();
  open.forEach(function(i){ var x = fresh.querySelector('details.reply-full[data-i="'+i+'"]'); if(x) x.open = true; });
  side.parentNode.replaceChild(fresh, side);
}

/* ---------- Debrief ---------- */
function debriefScreen(){
  S.mode = 'debrief';
  var sc = cur(), r = rec();
  var max = scenMax(sc);
  var net = Math.max(0, r.kept - r.given);
  var st = judgmentStats(r);
  // Badges are judged from first-pass verdicts, here at debrief time. A technical misconception costs neither badge; it is listed separately below.
  if(st.errorsCaught < st.errorsTotal) noteMiss('hunter', 'a planted error slipped past in '+scenNo());
  if(st.uncritical) noteMiss('evidence', 'a verdict in '+scenNo()+' rested on the assistant\'s say-so or on convenience, not evidence');
  var dims = dimensionsFor(r, sc); r.dims = dims;
  var shown = dims.filter(function(d){ return d.state!=='na'; }), yes = shown.filter(function(d){ return d.state==='yes'; }).length;
  var headline = yes===shown.length ? 'Every dimension demonstrated.' : yes+' of '+shown.length+' dimensions demonstrated. Here is what the trail shows.';
  var clean = !r.given && !st.uncritical && r.promptFinal==='bnd';
  var subline = clean ? 'Nothing was handed over; no verdict rested on the assistant\'s say-so or on convenience.' : (r.given ? 'Some thinking left the room. Here is where.' : 'Nothing was handed over outright — but look where it leaked.');
  var dimList = h('div', {class:'dims'}, dims.map(function(d){
    return h('div', {class:'dim '+d.state}, h('span', {class:'dlab'}, d.label), h('span', {class:'dstate'}, d.text), d.evidence ? h('span', {class:'dev'}, d.evidence) : null);
  }));
  var rows = PHASES.map(function(k){
    var given = r.status[k]==='given', leaky = r.status[k]==='leaky';
    var pts = r.phasePts[k] || 0, maxP = phaseMax(sc, k);
    if(k==='E' && r.eClaims.length) maxP = Math.max(1, r.eClaims.filter(function(c){ return !c.unsolicited; }).length*(PTS.E.verdict+PTS.E.reason)); // the judged reply's own claim count (a whole-task reply can carry fewer)
    var w = given ? 100 : Math.round(100*Math.min(pts,maxP)/maxP);
    var bar = h('div', {class:'bar'+(given?' given':(leaky?' leaky':''))}, h('i'));
    setTimeout(function(){ bar.firstChild.style.width = w+'%'; }, 300);
    var lab = given ? 'given to AI' : (leaky ? 'leaked · '+pts+' / '+maxP : (k==='C' && r.repaired ? 'boundary repaired · '+pts+' / '+maxP : pts+' / '+maxP));
    return h('div', {class:'row'}, h('b', {class:k==='P'?'p':(k==='C'?'c':''), text:k}), bar, h('span', {class:'lab'}, lab));
  });
  var isLast = S.scen === SCENARIOS.length-1;
  // Quiet offloading counts too: a request that leaked, and a verdict that rested on the assistant's say-so or on convenience.
  var losses = r.trail.filter(function(e){ return e.pts < 0 || e.leak || (e.pass!==2 && (e.reasonKind==='unsupported_authority' || e.reasonKind==='convenience')); });
  var lossBox = losses.length ? h('div', {class:'stat rise d4', style:'grid-column:1 / -1'}, h('h3', null, 'Where the thinking left'),
      h('div', {class:'losses'}, losses.map(function(e){
        var note = e.reasonKind==='unsupported_authority' ? ' — reason was the assistant\'s say-so, not evidence' : (e.reasonKind==='convenience' ? ' — reason was convenience, not evidence' : '');
        // Badge names what actually happened on this entry, not a blanket "leak": a real leaked request carries e.leak, while a
        // soft E-verdict loss carries its own reasonKind (trust / convenience) — those are judgment lapses, not leaks.
        var badge = e.pts<0 ? e.pts : (e.leak ? 'leak' : (e.reasonKind==='unsupported_authority' ? 'trust' : (e.reasonKind==='convenience' ? 'convenience' : 'soft')));
        return h('div', {class:'loss'+(e.pts<0?'':' soft')}, h('b', {text:e.k}), h('span', null, e.label+note), h('span', {class:'pts'}, badge));
      })),
      h('div', {class:'sub', style:'margin-top:8px'}, 'Each of these is on your trail. None of them is fatal — the point is that you can see them.')) : null;
  var tech = r.judgments.filter(function(j){ return j.pass===1 && j.reasonKind==='invalid_technical_reason'; });
  var techBox = tech.length ? h('div', {class:'stat rise d5', style:'grid-column:1 / -1'}, h('h3', null, 'Technical points to revisit'),
      h('div', {class:'tech-list'}, tech.map(function(j){ return h('div', {class:'tech'}, h('code', null, j.claimId), h('span', null, 'Verdict '+j.verdict+', because: “'+j.reasonText+'” — a technical misconception, not a trust problem.')); })),
      h('div', {class:'sub', style:'margin-top:8px'}, 'Physics points to repair, listed apart from the moments thinking was handed over. They do not cost the Evidence badge.')) : null;
  var node = h('div', null,
    h('div', {class:'eyebrow rise'}, 'Debrief · '+sc.title),
    h('h2', {class:'rise d1', style:'font-family:var(--serif); font-weight:600; font-size:clamp(26px,4vw,38px); margin:0 0 8px'}, headline),
    h('p', {class:'debrief-sub rise d1'}, subline),
    h('div', {class:'stat rise d2', style:'margin-bottom:22px'}, h('h3', null, 'What the trail shows'), dimList),
    h('div', {class:'debrief'},
      h('div', {class:'stat rise d3'}, h('h3', null, 'Practice score'), h('div', {class:'bignum'}, net, h('small', null, ' / '+max)), h('div', {class:'sub'}, r.kept+' kept · '+r.given+' given away · '+st.errorsCaught+' of '+st.errorsTotal+' planted errors caught on the first pass')),
      h('div', {class:'stat rise d3'}, h('h3', null, 'Practice points by phase'), h('div', {class:'own'}, rows)),
      lossBox, techBox
    ),
    h('div', {class:'actions rise d4'},
      h('button', {class:'btn primary', type:'button', 'data-autofocus':'1', onClick:function(){ if(isLast){ transferScreen(); } else { S.scen++; introScreen(); } }}, isLast ? 'One last step →' : 'Next scenario: '+SCENARIOS[S.scen+1].title+' →')
    )
  );
  render(node);
}

/* ---------- Transfer (three-field plan) ---------- */
/* A plan, recorded as a plan: on which task, what the learner will attempt or check, what help they will request and what decision
   they keep. Validation checks only that the fields are filled — any script; no word list, no Latin-letter count, no pronoun test. */
function planFields(a, b, c){
  var vals = [a, b, c].map(function(x){ return String(x || '').trim(); });
  var names = ['the task', 'what you will attempt or check', 'what help you will request and what decision you keep'];
  for(var i=0;i<3;i++){
    if(!vals[i] || Array.from(vals[i]).length < 2) return {i:i, msg:'Please fill in '+names[i]+' — any language is fine.'};
    if(/^(.)\1*$/u.test(vals[i])) return {i:i, msg:'That looks like one repeated character. Write '+names[i]+' the way you would say it to a TA.'};
  }
  if(vals[0]===vals[1] && vals[1]===vals[2]) return {i:1, msg:'The three fields say the same thing. Each one answers a different question.'};
  return null;
}
function transferScreen(){
  S.mode = 'transfer';
  var task = h('input', {class:'free', type:'text', 'aria-label':'On which task?', placeholder:'e.g. Thursday\'s open-channel problem set', maxlength:'160'});
  var att = h('textarea', {class:'free', rows:'2', 'aria-label':'What will I attempt or check myself?', placeholder:'e.g. sketch the energy grade line and compute the critical depth myself, with units, before opening anything', maxlength:'400'});
  var help = h('textarea', {class:'free', rows:'2', 'aria-label':'What help will I request, and what decision will I retain?', placeholder:'e.g. ask AI only to critique my section choice; the channel size and the verdict stay mine', maxlength:'400'});
  var fields = [task, att, help];
  var nudge = h('div', {class:'feedback warn', role:'status', hidden:''});
  var btn = h('button', {class:'btn primary', type:'button', onClick:submit}, 'Finish and see my trail →');
  function submit(){
    var v = planFields(task.value, att.value, help.value);
    if(v){ nudge.textContent = v.msg; nudge.hidden = false; fields[v.i].focus(); return; }
    S.plan = {task:task.value.trim(), attempt:att.value.trim(), help:help.value.trim()};
    resultsScreen();
  }
  fields.forEach(function(f){ f.addEventListener('input', function(){ nudge.hidden = true; }); });
  help.addEventListener('keydown', function(e){ if(e.key==='Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); submit(); } });
  var example = h('div', {class:'example'}, h('div', {class:'lbl'}, 'Self-check example'),
    h('div', null, h('b', null, 'On which task? '), 'Thursday\'s open-channel problem set.'),
    h('div', null, h('b', null, 'What will I attempt or check myself? '), 'Sketch the energy grade line and compute the critical depth myself, with units, before opening anything.'),
    h('div', null, h('b', null, 'What help will I request, and what decision will I retain? '), 'Ask AI only to critique my section choice and my assumptions; the channel size and the verdict stay mine.'),
    h('p', {class:'note'}, 'This is recorded as a plan. Writing it is not the same as doing it — the next assignment is where transfer shows.'));
  var node = h('div', null,
    phaseHead('T', 'Transfer to your real work.', 'Three problems are behind you. Write the plan for your next real assignment in three short fields. It goes into your trail as a plan.'),
    h('div', {style:'max-width:680px'},
      h('p', {class:'ask-yourself'}, '“Where will I use this next, and how?”'),
      h('div', {class:'plan-fields'},
        h('label', null, h('span', null, 'On which task?'), task),
        h('label', null, h('span', null, 'What will I attempt or check myself?'), att),
        h('label', null, h('span', null, 'What help will I request, and what decision will I retain?'), help)),
      example, nudge,
      h('div', {class:'actions'}, btn, h('span', {class:'hint'}, 'Any language is fine. Stays in this browser; copy or download the trail at the end. Ctrl+Enter in the last field finishes.'))
    )
  );
  render(node);
  setTimeout(function(){ task.focus(); }, 400);
}

/* ---------- Results ---------- */
function dimShort(d){ return d.state==='yes' ? 'demonstrated' : (d.state==='no' ? 'not demonstrated' : (d.state==='na' ? 'not needed' : (d.id==='attempt' ? 'recorded; independent work not assessed' : (d.id==='constraints' ? 'checks pending' : 'partly')))); }
/* Plain-text and JSON exports of the trail. Valid only because records hold plain data (no DOM nodes, no SCENARIOS references). */
function trailText(){
  var res = S.result || {}, p = S.plan || {}, lines = [];
  lines.push('Flowline — thinking trail', 'Content version '+CONTENT_VERSION+' · '+new Date().toISOString().slice(0,10)+' · practice score '+res.score+' / '+res.max+' · '+res.rank, '');
  SCENARIOS.forEach(function(sc, si){
    var r = S.scens[si]; if(!r) return;
    lines.push((si+1)+'. '+sc.title+' — '+Math.max(0, r.kept-r.given)+' / '+scenMax(sc)+' practice points');
    if(r.dims) r.dims.forEach(function(d){ lines.push('  · '+d.label+': '+d.text+(d.evidence ? ' — '+d.evidence : '')); });
    r.trail.forEach(function(e){
      lines.push('['+e.k+'] '+e.label+' · '+(CLS[e.cls] || e.cls)+' · '+(e.pts>0 ? '+' : '')+e.pts+(e.claimId ? ' · ['+e.claimId+']' : '')+(e.prov ? ' · '+PROV[e.prov] : '')+(e.reasonKind ? ' · '+REASON_KIND[e.reasonKind].label : ''));
      lines.push('    '+String(e.text).replace(/\n/g, '\n    '));
      if(e.reply) lines.push('    Reply (as received): '+String(e.reply).replace(/\n/g, '\n    '));
    });
    lines.push('');
  });
  lines.push('Plan for the next real assignment (a plan, not demonstrated transfer)', '  On which task? '+(p.task || ''), '  What I will attempt or check: '+(p.attempt || ''), '  What help I will request, and what decision I retain: '+(p.help || ''), '', 'The P-FACET Model © Yupei Duan & Danielle Oprean, University of Missouri.');
  return lines.join('\n');
}
function trailJSON(){ var res = S.result || {}; return JSON.stringify({v:CONTENT_VERSION, date:new Date().toISOString().slice(0,10), score:res.score, max:res.max, rank:res.rank, scens:S.scens, plan:S.plan}, null, 2); }
function downloadText(name, text, type){
  try{
    var blob = new Blob([text], {type:type}), url = URL.createObjectURL(blob), a = h('a', {href:url, download:name});
    document.body.appendChild(a); a.click();
    setTimeout(function(){ a.remove(); URL.revokeObjectURL(url); }, 800);
    return true;
  }catch(e){ return false; }
}
function copyText(text){
  if(navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function(){ return true; }, function(){ return legacyCopy(text); });
  return Promise.resolve(legacyCopy(text));
}
function legacyCopy(text){
  try{ var ta = h('textarea', {style:'position:fixed; left:-9999px; top:0', 'aria-hidden':'true'}); ta.value = text; document.body.appendChild(ta); ta.select(); var ok = document.execCommand('copy'); ta.remove(); return ok; }catch(e){ return false; }
}
function resultsScreen(){
  S.mode = 'results';
  var max = SCENARIOS.reduce(function(a,sc){ return a+scenMax(sc); }, 0);
  var net = Math.max(0, S.kept - S.given);
  var pct = Math.round(100*net/max);
  var dimsAll = [];
  SCENARIOS.forEach(function(sc, si){ var r = S.scens[si]; if(r && r.dims) r.dims.forEach(function(d){ dimsAll.push({sc:sc, d:d}); }); });
  /* Rank is read off the points percentage and gated by the dimensions: Chief needs every non-"not applicable" dimension demonstrated
     in all three scenarios, so no blurb can say more than the trail shows. A run that clears the percentage but not the gate drops one rank. */
  var gate = dimsAll.length > 0 && dimsAll.every(function(x){ return x.d.state==='yes' || x.d.state==='na'; });
  var ri = 0; while(ri < RANKS.length-1 && pct/100 < RANKS[ri].min) ri++;
  if(ri===0 && !gate) ri = 1;
  var rank = RANKS[ri];
  S.result = {score:net, max:max, rank:rank.name, pct:pct};
  var earned = S.flags;
  var best = loadBest(), isBest = !best || net > best.score;
  if(isBest) saveBest({v:CONTENT_VERSION, score:net, max:max, rank:rank.name, date:new Date().toISOString().slice(0,10)});
  var demo = dimsAll.filter(function(x){ return x.d.state==='yes'; }).length;
  var notDemo = dimsAll.filter(function(x){ return x.d.state==='no' || x.d.state==='partial'; });
  try{ console.assert(JSON.stringify(S.scens), 'records are not plain data'); }catch(e){ console.error('records are not plain data', e); }

  var confetti = h('div', {class:'confetti', 'aria-hidden':'true'});
  if(!reduceMotion && pct >= .5*100){ for(var i=0;i<40;i++){ var c = h('i'); c.style.left = Math.random()*100+'%'; c.style.background = ['var(--learner)','var(--ai)','var(--anchor)','var(--water)'][i%4]; c.style.animationDelay = (Math.random()*1.2)+'s'; c.style.animationDuration = (2.2+Math.random()*1.4)+'s'; confetti.appendChild(c);} }

  var trailNode = h('div', {class:'trail'}, h('h3', null, 'Your thinking trail'), h('p', {class:'note'}, 'Everything you decided, in order: how you framed each problem, what you tried, what you asked, and why you kept or cut what came back. Each line says where its text came from. This is the record P-FACET exists to produce.'));
  SCENARIOS.forEach(function(sc, si){
    var r = S.scens[si]; if(!r) return;
    var box = h('div', {class:'trail-scen'}, h('h4', null, (si+1)+'. '+sc.title+' — '+Math.max(0,r.kept-r.given)+' / '+scenMax(sc)+' practice points'));
    if(r.dims) box.appendChild(h('div', {class:'dims-line'}, r.dims.map(function(d){ return h('span', {class:'d '+d.state}, d.label+': '+dimShort(d)); })));
    r.trail.forEach(function(e){
      var kcls = e.k==='P'?'p':(e.k==='C'?'c':''); if(e.given || e.cls==='sub') kcls = 'x';
      box.appendChild(h('div', {class:'tr'}, h('b', {class:'k '+kcls, text:e.k}), h('div', null,
        h('span', {class:'lab'}, e.label, e.claimId ? h('code', {class:'cid'}, '['+e.claimId+']') : null, h('span', {class:'cls '+e.cls}, CLS[e.cls]), e.prov ? h('span', {class:'prov'}, PROV[e.prov]) : null, e.reasonKind ? h('span', {class:'rkind '+e.reasonKind}, REASON_KIND[e.reasonKind].label) : null, ' ', h('span', {style:'color:var(--muted)'}, (e.pts>0?'+':'')+e.pts)),
        h('div', {class:'q', text:e.text}),
        e.reply ? h('div', {class:'reply-as'}, h('span', {class:'lab'}, 'Reply (as received)'), h('div', {class:'q', text:e.reply})) : null)));
    });
    trailNode.appendChild(box);
  });
  var p = S.plan || {};
  trailNode.appendChild(h('div', {class:'trail-scen plan-box'}, h('h4', null, 'Your plan for the next real assignment'), h('p', {class:'note'}, 'A plan, not demonstrated transfer — the next assignment is where transfer shows.'),
    h('div', {class:'plan'}, h('div', null, h('b', null, 'On which task? '), p.task || ''), h('div', null, h('b', null, 'What I will attempt or check: '), p.attempt || ''), h('div', null, h('b', null, 'What help I will request, and what decision I retain: '), p.help || ''))));

  var status = h('span', {class:'copy-status', role:'status'});
  var node = h('div', null,
    h('div', {class:'rank rise'}, confetti,
      h('div', {class:'kicker'}, 'Practice rank'),
      h('h2', null, rank.name),
      h('p', null, rank.blurb),
      h('div', {class:'debrief', style:'margin-top:18px; text-align:left'},
        h('div', {class:'stat'}, h('h3', null, 'Practice score'), h('div', {class:'bignum'}, net, h('small', null, ' / '+max)), h('div', {class:'sub'}, pct+'% of available practice points'+(isBest?' · new best in this browser':''))),
        h('div', {class:'stat'}, h('h3', null, 'Demonstrated'), h('div', {class:'bignum'}, demo, h('small', null, ' / '+dimsAll.length+' dimensions')), h('div', {class:'sub'}, notDemo.length ? 'Not demonstrated: '+notDemo.map(function(x){ return x.sc.id+' — '+x.d.label.toLowerCase()+(x.d.state==='partial' ? ' — '+dimShort(x.d) : ''); }).join('; ') : 'every dimension'))
      ),
      h('div', {class:'badges'}, BADGES.map(function(b){ return h('div', {class:'badge'+(earned[b.id]?'':' locked'), title:b.desc}, h('span', {class:'ico'}, b.ico), h('span', null, b.name, h('small', null, earned[b.id]?b.desc:'Missed — '+(S.miss[b.id] || b.desc)))); }))
    ),
    trailNode,
    h('p', {class:'note keep-note'}, 'The trail exists in this browser until you leave this page. Copy, download or print it to keep it; nothing is uploaded.'),
    h('div', {class:'actions'},
      h('button', {class:'btn primary', type:'button', onClick:function(){ S=null; titleScreen(); }}, 'Play again'),
      h('a', {class:'btn anchor', href:'takeaway.html'}, 'Take the one-page reference'),
      h('button', {class:'btn ghost', type:'button', onClick:function(){ copyText(trailText()).then(function(ok){ status.textContent = ok ? 'Copied.' : 'Copy failed — use download or print.'; }); }}, 'Copy trail'),
      h('button', {class:'btn ghost', type:'button', onClick:function(){ status.textContent = downloadText('flowline-trail.txt', trailText(), 'text/plain;charset=utf-8') ? 'Downloading flowline-trail.txt' : 'Download failed — use copy or print.'; }}, 'Download trail (.txt)'),
      h('button', {class:'btn ghost', type:'button', onClick:function(){ status.textContent = downloadText('flowline-trail.json', trailJSON(), 'application/json') ? 'Downloading flowline-trail.json' : 'Download failed — use copy or print.'; }}, 'Download trail (.json)'),
      h('button', {class:'btn ghost', type:'button', onClick:function(){ document.querySelectorAll('details.reply-full').forEach(function(x){ x.open = true; }); window.print(); }}, 'Print my trail'),
      status
    ),
    h('p', {style:'margin-top:26px; font-family:var(--serif); font-style:italic; font-size:20px; text-align:center'}, 'The next time AI helps you, ask one question: who did the thinking?')
  );
  render(node);
}

/* ---------- persistence ---------- */
function loadBest(){ try{ var s = JSON.parse(localStorage.getItem(STORE_KEY)); return s && s.v===CONTENT_VERSION && typeof s.score==='number' ? s : null; }catch(e){ return null; } }
function hasOldBest(){ try{ return OLD_STORE_KEYS.some(function(k){ return localStorage.getItem(k) != null; }); }catch(e){ return false; } }
function saveBest(b){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(b)); }catch(e){} }

/* ---------- keyboard: number keys pick the nth visible option ---------- */
document.addEventListener('keydown', function(e){
  if(!S) return;
  if(e.key==='Escape' && !$tray.hidden && !document.querySelector('.modal-bg')){ e.preventDefault(); closeTray(); return; }   // the modal's own Escape handler wins when both are open
  if(e.target && (e.target.tagName==='TEXTAREA' || e.target.tagName==='INPUT')) return;
  if(document.querySelector('.modal-bg')) return;
  if(e.key==='Enter' && !(e.target && /^(BUTTON|A|INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName))){
    var go = $stage.querySelector('.actions .btn.primary:not([disabled]), .actions .btn.anchor:not([disabled])');
    if(go){ e.preventDefault(); go.click(); }
    return;
  }
  if(S.mode!=='phase') return;
  var n = parseInt(e.key, 10);
  if(!(n>=1 && n<=9)) return;
  /* Number keys pick from the first option group in DOM order that still has an enabled button; an answered group is marked data-keys-off and skipped. */
  if(!$tray.hidden && $tray.contains(document.activeElement)) return;
  var selector = '.opts, .chips, .estimates, .parts, .verdicts, .reasons, .repair-opts';
  var focused = document.activeElement && document.activeElement.closest('.judge, .repair-opts');
  var scope = focused && $stage.contains(focused) ? focused : $stage;
  var groups = scope.matches(selector) ? [scope] : Array.prototype.slice.call(scope.querySelectorAll(selector));
  var active = null;
  for(var i=0;i<groups.length;i++){
    var g = groups[i]; if(g.closest('[hidden]') || g.hasAttribute('data-keys-off')) continue;
    var live = g.querySelectorAll('button:not([disabled])');
    if(live.length){ active = g.querySelectorAll('button'); break; }
  }
  if(active && active[n-1] && !active[n-1].disabled){ e.preventDefault(); active[n-1].click(); }
});

$ask.addEventListener('click', askAI);
$evid.addEventListener('click', toggleTray);
/* One leave prompt: the browser's own, for refresh, back and the brand link alike, while a run is in progress. Export (results screen) covers the rest. */
window.addEventListener('beforeunload', function(e){ if(S && S.mode && S.mode!=='results'){ e.preventDefault(); e.returnValue = ''; } });

/* Read-only inspection hook for acceptance runs (game.html?debug=1): exposes the state and the content tables; nothing in the game reads it. */
if(/[?&]debug=1/.test(location.search)) window.flowlineDebug = function(){ return {S:S, SCENARIOS:SCENARIOS, rec:rec, cur:cur, trailText:trailText, trailJSON:trailJSON}; };
titleScreen();
})();
