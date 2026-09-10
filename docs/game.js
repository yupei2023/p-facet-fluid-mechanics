/* Flowline — the game for P-FACET for Simple Fluid Mechanics.
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

/* The sketch has two line-ups, and the difference between them is the whole scenario.
   Base — the pumper run every number is computed in: the hydrant is coupled to the pumper by hose, the 65 mm side butt is
   capped, and nothing at section 2 is open to the air.
   Transfer (drawn only at phase T): the line-up the T question describes — pumper run finished, hose off, big outlet capped,
   the 65 mm butt open and discharging into the street with a pitot in the jet. The drawing must never go on asserting
   "nothing here is open to the air" while the question beside it asks about an opening that now is; and in T it states only
   the facts the question states — which outlet is capped, which is open — and draws no boundary conclusion, because that
   call is the learner's to make. */
function hydrantArt(t){
  return '<svg viewBox="0 0 400 240" role="img" aria-label="' + (t
      ? 'Sketch, transfer line-up: the same 300 millimetre main and 150 millimetre hydrant lateral, but the pumper run is over — the hose is disconnected, the hydrant big outlet is capped, and the 65 millimetre side butt is open, discharging a jet into the street with a pitot gauge held in the stream.'
      : 'Sketch: a 300 millimetre water main in an open trench, reducing through a smooth reducer to a 150 millimetre hydrant lateral that rises to a fire hydrant. A gauge on the 300 millimetre side reads 380 kilopascals; the pressure in the 150 millimetre lateral, marked with a question mark, is the unknown. The hydrant is coupled by hose to a pumper truck with its pump running, so nothing at the lateral is open to the air. The hydrant 65 millimetre side butt is capped.') + '">'
    + '<rect x="0" y="0" width="400" height="240" fill="var(--bg)"/>'
    + '<g stroke="var(--grid)" stroke-width="1">' + grid(400,240,20) + '</g>'
    /* ground, with the trench cut out */
    + '<path d="M0,150 L96,150 L96,226 L290,226 L290,150 L400,150 L400,240 L0,240 Z" fill="var(--chip)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>'
    /* 300 mm main — it terminates at the cone, so the relation is A1V1 = A2V2 and not a tee */
    + '<path d="M0,200 L150,200" fill="none" stroke="var(--ink)" stroke-width="26"/>'
    + '<path d="M0,200 L150,200" fill="none" stroke="var(--surface)" stroke-width="20"/>'
    /* reducer cone */
    + '<path d="M150,187 L182,193 L182,207 L150,213 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    /* 150 mm lateral and riser */
    + '<path d="M182,200 L250,200 L250,146" fill="none" stroke="var(--ink)" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/>'
    + '<path d="M182,200 L250,200 L250,146" fill="none" stroke="var(--surface)" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>'
    + '<path class="flow-dash" d="M4,200 L150,200 L182,200 L250,200 L250,150" fill="none" stroke="var(--water)" stroke-width="2.5"/>'
    /* hydrant */
    + '<rect x="238" y="100" width="24" height="50" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    + '<rect x="232" y="91" width="36" height="10" rx="3" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    + '<path d="M242,91 Q250,80 258,91 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    + '<rect x="247" y="72" width="6" height="9" fill="var(--muted)"/>'
    /* steamer (big) outlet — base: hose to the pumper, the chain that keeps section 2 confined. T: capped, hose gone. */
    + '<rect x="262" y="112" width="10" height="13" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/>'
    + (t
        ? '<rect x="272" y="113" width="6" height="11" rx="2" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.5"/>'
        : '<path d="M272,118 C288,118 294,124 306,124" fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round"/>'
          + '<path d="M272,118 C288,118 294,124 306,124" fill="none" stroke="var(--surface)" stroke-width="5" stroke-linecap="round"/>')
    /* 65 mm side butt — base: capped, drawn plainly with no jet so the T twist is not telegraphed.
       T: cap off, a jet into the street with a pitot held in it. */
    + '<rect x="228" y="126" width="10" height="11" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/>'
    + (t
        ? '<path d="M226,131 L201,131" fill="none" stroke="var(--water)" stroke-width="7" stroke-linecap="butt" opacity=".6"/>'
          + '<path d="M193,131 L202,126.5 L202,135.5 Z" fill="var(--water)"/>'
          + '<line x1="215" y1="131" x2="215" y2="113" stroke="var(--ink)" stroke-width="2"/>'
          + '<circle cx="215" cy="107" r="7" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
          + '<line x1="215" y1="107" x2="219" y2="103" stroke="var(--ink)" stroke-width="1.5"/>'
        : '<circle cx="227" cy="131" r="5" fill="var(--muted)"/>'
          + '<line x1="222" y1="128" x2="212" y2="122" stroke="var(--muted)" stroke-width="1"/>')
    /* pumper — still parked in the transfer line-up; only the hose has come off */
    + '<rect x="306" y="90" width="86" height="48" rx="4" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    + '<rect x="312" y="96" width="30" height="18" rx="2" fill="var(--chip)" stroke="var(--ink)" stroke-width="1.5"/>'
    + '<circle cx="326" cy="143" r="8" fill="var(--muted)"/><circle cx="374" cy="143" r="8" fill="var(--muted)"/>'
    /* gauge on the 300 mm main */
    + '<line x1="118" y1="187" x2="118" y2="178" stroke="var(--ink)" stroke-width="3"/>'
    + '<circle cx="118" cy="168" r="10" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>'
    + '<line x1="118" y1="168" x2="123" y2="162" stroke="var(--ink)" stroke-width="1.5"/>'
    /* section marks: 1 muted with the real gauge above it; 2 in anchor because it is the unknown — a dashed
       section line and a label ONLY. The intro says there is no gauge on the lateral yet, and the sketch is what
       the learner reads the layout from, so it must not draw an instrument that is not there. */
    + '<circle cx="118" cy="200" r="4" fill="var(--muted)"/>'
    + '<circle cx="222" cy="200" r="4" fill="var(--anchor)"/>'
    + (t ? '' : '<line x1="222" y1="176" x2="222" y2="220" stroke="var(--anchor)" stroke-width="1.5" stroke-dasharray="4 3"/>')
    /* the arrow that refutes the planted error: the water at section 2 goes on, it does not go out */
    + '<path d="M232,214 L248,214" fill="none" stroke="var(--anchor)" stroke-width="1.5" stroke-dasharray="4 3"/>'
    + '<path d="M254,214 L246,210 L246,218 Z" fill="var(--anchor)"/>'
    + '<g font-family="system-ui,sans-serif" font-size="11" fill="var(--muted)">'
    + (t
        /* A legend in the empty band above the trench: the hydrant bonnet starts at y=91 and x=232, the jet runs
           x=193..226 on y=131, and the canvas ends at x=400 — so the lines sit at x=12, baselines 34 to 82. */
        ? '<text x="12" y="34" fill="var(--anchor)" font-weight="700">After the pumper run</text>'
          + '<text x="12" y="50">hose off · big outlet capped</text>'
          + '<text x="12" y="66" fill="var(--anchor)">65 mm side butt open to the street</text>'
          + '<text x="12" y="82">pitot held in the jet</text>'
          + '<text x="336" y="82">pumper</text>'
        : '<text x="150" y="62" fill="var(--anchor)">nothing here is open to the air</text>'
          + '<text x="336" y="82">pumper</text>'
          + '<text x="114" y="122">65 mm butt (capped)</text>')
    + '<text x="76" y="143">p₁ = 380 kPa gauge</text>'
    + (t ? '' : '<text x="178" y="178" fill="var(--anchor)" font-weight="700">p₂ = ?</text>')
    /* baseline 222, not 220: the main is a 26 px stroke centred on y=200, so its underside is y=213 and cap tops
       at 220 would graze it. Descenders still clear the trench floor at y=226. */
    + '<text x="16" y="222">① D₁ = 300 mm</text>'
    /* x=196, not 140: the caption belongs under the 150 mm lateral it names (which starts at x=182), not under the 300 mm main. */
    + '<text x="196" y="222">② D₂ = 150 mm</text>'
    + '<text x="10" y="238">V₁ = 2.0 m/s · horizontal in the trench · smooth reducer</text>'
    + '</g></svg>';
}
var ART = {hydrant: hydrantArt(false), hydrantT: hydrantArt(true)};
function grid(w,h,s){ var out=''; for(var x=s;x<w;x+=s) out+='<line x1="'+x+'" y1="0" x2="'+x+'" y2="'+h+'"/>'; for(var y=s;y<h;y+=s) out+='<line x1="0" y1="'+y+'" x2="'+w+'" y2="'+y+'"/>'; return out; }

var ICONS = {
  hydrant: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 34h16"/><path d="M15 34V15a5 5 0 0 1 10 0v19"/><path d="M15 21h-5"/><path d="M25 21h5"/><path d="M20 10V7"/></svg>'
};

var SCENARIOS = [
/* ---------------------------------------------------------------- The one scenario.
   Adapted from FE-style problems written by student teams in this course.
   Two claims in E, three reasons each: one sound claim (which is also the slot a wrong estimate's critique takes)
   and the planted free-jet error the whole scenario is about. */
{
  id:'hydrant', title:'The Grindstone Road Flow Test', level:'Well-structured · about nine minutes', art:ART.hydrant, artT:ART.hydrantT, icon:ICONS.hydrant,
  blurb:'Bernoulli and continuity. Two lines of algebra — and one assumption that decides whether the number means anything.',
  protected:'the free-jet call at the lateral, the size of the velocity-head term, and the go / stop verdict against the 140 kPa floor',
  intro:'The fire department is running an acceptance flow test. A 300 mm main dead-ends at the hydrant, reducing to a 150 mm lateral, so the whole test flow turns into that lateral; both taps sit on one horizontal run either side of the reducer. The pumper is coupled, pump idling. At the planned flow the main moves 2.0 m/s and the upstream gauge reads 380 kPa; the engineer works to a 140 kPa floor. No gauge on the lateral. She asks: "What is that lateral going to be sitting at?"',
  goal:'Gauge pressure in the 150 mm lateral at the planned flow, and a run / stop verdict against the 140 kPa floor. Only as good as one assumption: confined water, or open air?',
  givens:['D₁ = 300 mm main, D₂ = 150 mm lateral; the main dead-ends at the hydrant. Both taps on one horizontal run — z₁ = z₂. Smooth reducer, losses neglected',
          'V₁ = 2.0 m/s in the 300 mm main at the planned test flow',
          'p₁ = 380 kPa gauge at the upstream tap; the floor is 140 kPa gauge while the test flows',
          'ρ = 1000 kg/m³, g = 9.81 m/s². Downstream, the lateral runs on to the hydrant, coupled to the pumper with the pump running. The 65 mm side butt is capped.'],
  P:{ q:'In your own words — what are you solving, and why does it matter?',
      opts:[
        {t:'Predict the lateral pressure at the planned flow and say whether it holds above the 140 kPa floor — the engineer has to decide before the hydrant opens.', v:'best', fb:'One relation, one threshold, one decision that has to be made before anyone turns a wrench. The purpose is yours.'},
        {t:'Compute the pressure drop across the reducer.', v:'ok', fb:'True but incomplete — a drop is not a pressure, and a pressure is not yet a verdict.'},
        {t:'Look up what residual pressure a 300 mm main holds during a flow test.', v:'weak', fb:'There is no such table: what a main holds depends on the flow you pull through it. Naming the problem badly is how AI ends up choosing it.'}
      ]},
  F:{ q:'Which of these belong in your frame? Pick what a good answer must respect.', min:3,
      items:[
        {t:'Continuity fixes both velocities before any pressure: Q = A₁V₁ = A₂V₂, with A = πD²/4 — so halving the diameter quadruples the velocity.', key:true, why:'The velocities are not free inputs: the diameters and V₁ fix them.'},
        {t:'The energy equation: p₁/γ + V₁²/2g + z₁ = p₂/γ + V₂²/2g + z₂. Same horizontal run, so z₁ = z₂; gauge in, gauge out.', key:true, why:'The governing relation, plus the simplification the geometry earns you.'},
        {t:'A section is at atmospheric pressure only where the water is open to the air — decided by what the pipe does downstream.', key:true, why:'The judgement the answer turns on — a fact about the layout, not the equations.'},
        {t:'Constraint: the number has to be compared with the 140 kPa floor. A pressure, then a run / stop.', key:true, why:'The criterion the engineer is waiting on.'},
        {t:'The lateral is where the water leaves the reducer, so take p₂ = 0 gauge — the standard assumption for a contraction.', key:false, why:'That is the assumption for a nozzle discharging to air. Watch for it in C.'}
      ]},
  A:{ mq:'Which governing idea does your attempt use?',
      methods:[
        {t:'Continuity Q = A₁V₁ = A₂V₂ for V₂, then the energy equation along the horizontal run, solved for p₂ as an unknown.', ok:true, short:'Continuity for V₂, then Bernoulli along the horizontal run, solving for p₂',
         fb:'Both steps are there — and you left p₂ to be found, not assumed. That commitment is what the assistant will come at.'},
        {t:'The reducer is horizontal and barely a metre long, so nothing changes: p₂ = p₁.', ok:false, short:'Horizontal and short, so p₂ = p₁',
         fb:'Elevation is not the only thing that moves pressure. The lateral runs four times faster, and that speed is paid for out of the pressure — but you attempted it, and now you know what to test.'},
        {t:'Momentum on the fitting: ΣF = ṁ(V₂ − V₁), and back p₂ out of the force balance.', ok:false, short:'Momentum on the reducer, back out p₂ from the force balance',
         fb:'Momentum gives the anchoring force once you know both pressures — it takes p₂ as an input. Bernoulli supplies the pressure; momentum the force.'},
        {t:'Take the pressure change from the manufacturer\'s K value for the 300 × 150 reducer.', ok:false, short:'The manufacturer\'s K value for the 300 × 150 reducer',
         fb:'A K value gives the loss, and here loss is stipulated negligible. The change across a reducer is a reversible trade between pressure head and velocity head — an engineer\'s instinct, pointed at the wrong term.'}
      ],
      eq:'Your estimate of p₂, the gauge pressure in the 150 mm lateral:',
      /* Each estimate carries the working the learner would paste into a request ({work}) and, if it is off, the critique the
         assistant makes of THAT number in E (claim), which takes attemptSlot. s = the slip, revealed only after the pick.
         Two invariants: no chip slip coincides with a planted claim, and no chip critique states a value for p₂ — each one
         corrects the learner's intermediate and stops there, so the reply never contradicts itself and never breaks the
         boundary the bounded request just drew. */
      ests:[
        {t:'320 kPa', s:'the ½ was dropped from the velocity head, so the pressure drop came out exactly twice what Bernoulli gives', ok:false,
         work:'A₁ = π(0.300)²/4 = 0.0707 m², A₂ = π(0.150)²/4 = 0.0177 m²; V₂ = 4V₁ = 8.0 m/s; Δp = ρ(V₂² − V₁²) = 1000 × (64 − 4) = 60 000 Pa = 60.0 kPa; p₂ = 380 − 60.0 = 320 kPa gauge',
         claim:{t:'Your 320 kPa comes from Δp = ρ(V₂² − V₁²). The velocity head is ½ρV² — in head form V²/2g — so the ½ is missing: ½ρ(V₂² − V₁²) = 30.0 kPa, and your drop is exactly double that. What it does to your p₂ is yours to redo.', type:'ok', best:'accept',
           reasons:[{t:'The velocity head is ½ρV², or V²/2g in metres — I doubled the drop by dropping the ½.', kind:'valid_evidence'},
                    {t:'Reject — the ½ belongs to the head form only; in pressure form the term is ρV², so 320 kPa stands.', kind:'invalid_technical_reason'},
                    {t:'Accept — the assistant does algebra better than I do.', kind:'unsupported_authority'}],
           explain:'Sound critique of your own number. ½ρV² and V²/2g are the same term in two datums — multiply the head form by γ = ρg and the ½ survives the trip. The specific-sounding rejection invented a "pressure form" that does not exist.'}},
        {t:'350 kPa', s:'p₂ = p₁ + ½ρ(V₁² − V₂²) = 380 − 30.0', ok:true,
         work:'A₁ = π(0.300)²/4 = 0.0707 m², A₂ = π(0.150)²/4 = 0.0177 m² — halving D quarters A, so V₂ = 4V₁ = 8.0 m/s and Q = 0.141 m³/s = 141 L/s. Horizontal, so z cancels: p₂ = p₁ + ½ρ(V₁² − V₂²) = 380 000 + 500 × (4 − 64) = 350 000 Pa = 350 kPa gauge. I treated p₂ as an unknown, not zero — the part I am least sure of'},
        {t:'374 kPa', s:'velocity was scaled with the diameter instead of the area — V₂ came out 4.0 m/s instead of 8.0', ok:false,
         work:'V₁ = 2.0 m/s; the lateral is half the diameter, so V₂ = 2 × 2.0 = 4.0 m/s; Δp = ½ρ(V₂² − V₁²) = 500 × (16 − 4) = 6000 Pa = 6.0 kPa; p₂ = 380 − 6.0 = 374 kPa gauge',
         claim:{t:'Your 374 kPa has V₂ = 4.0 m/s. Continuity is A₁V₁ = A₂V₂, and area goes as the square of the diameter: halving D quarters A, so V₂ = 4V₁ = 8.0 m/s. Your velocity head in the lateral is four times too small — 0.82 m where it should be 3.26 m — and because V₁² is subtracted from it, the drop that comes out is five times too small, not four.', type:'ok', best:'accept',
           reasons:[{t:'A = πD²/4, so A₁/A₂ = (D₁/D₂)² = 4 and V₂ = 4V₁ = 8.0 m/s. The flow balance confirms it: 0.07069 × 2.0 and 0.01767 × 8.0 are both 0.1414 m³/s, while 0.01767 × 4.0 is only 0.0707.', kind:'valid_evidence'},
                    {t:'Reject — continuity for an incompressible fluid is written on the diameter, D₁V₁ = D₂V₂, so 4.0 m/s is right.', kind:'invalid_technical_reason'},
                    {t:'Accept — 374 kPa leaves more margin over the 140 kPa floor, which is the answer that lets the test go ahead.', kind:'convenience'}],
           explain:'Sound critique of your own number, and the strongest kind: continuity checks itself. The same water must get through both sections every second, and your flow balance fails — 0.1414 m³/s in against 0.0707 out. Volume passes through an area, not a diameter. And "more margin" is a preference about the answer, not evidence about it.'}},
        {t:'410 kPa', s:'the velocity-head difference was added instead of taken off, so the fast narrow section came out as the high-pressure one', ok:false,
         work:'V₂ = 4V₁ = 8.0 m/s; Δp = ½ρ(V₂² − V₁²) = 500 × 60 = 30 000 Pa = 30.0 kPa; the lateral is narrower, so the pressure builds: p₂ = 380 + 30.0 = 410 kPa gauge',
         claim:{t:'Your 410 kPa puts the pressure up through the reducer. Bernoulli trades pressure head for velocity head along one line: the lateral is four times faster, so the lateral must be the lower-pressure section. The size of your velocity term is right — it is on the wrong side of the equation, and moving it back is your step to take.', type:'ok', best:'accept',
           reasons:[{t:'p/γ + V²/2g is constant here; V²/2g rises from 0.20 m to 3.26 m, so p/γ must fall by that same 3.06 m.', kind:'valid_evidence'},
                    {t:'Reject — squeezing water into a smaller pipe compresses it, so the pressure rises; that is why nozzles need high-pressure fittings.', kind:'invalid_technical_reason'},
                    {t:'Accept — the assistant sounded certain about the direction.', kind:'unsupported_authority'}],
           explain:'Sound critique of your own number. The sum is constant, so what one term gains the other loses. Water is not compressed at these pressures; a nozzle needs strong fittings because of the pressure upstream of it, not at its throat.'}}
      ],
      estfb:{ok:'{est}: V₂ = 8.0 m/s, the velocity head costs 30 kPa — 350 kPa gauge, 210 clear of the floor. You treated p₂ as an unknown, not zero. Are you sure? Look at what the lateral does next.',
             bad:'You recorded {est}: {slip}. Being off at this stage is fine; it is the reason to consult, not the reason to skip.'}},
  C:{ gap:{ok:'You have V₂ = 8.0 m/s and p₂ ≈ {est}. Your doubt: whether the lateral discharges to atmosphere. The engineer is waiting on run or stop.',
           bad:'You have a lateral velocity from continuity and p₂ ≈ {est}, which you doubt. You are also unsure whether the lateral discharges to atmosphere. The engineer is waiting on run or stop.'},
      /* The learner's attempt travels as the attached card above the options, not restated inside each one; the bounded / leaky
         distinction lives in the JOB and BOUNDARY clauses. Order is shuffled at render, so position is never the tell. */
      prompts:[
        {t:'A 300 mm main at 2.0 m/s dead-ends into a 150 mm hydrant lateral through a reducer; the upstream gauge reads 380 kPa. Find the lateral pressure and tell me whether the flow test can go ahead above 140 kPa. Show all steps.', kind:'sub', fb:'This hands over the whole target work — the calculation, the assumption behind it, and the answer to the person on site. Even if it comes back right, none of it is yours.'},
        {t:'My attempt is attached — approach and estimate {est}. I cannot tell whether the lateral discharges to atmosphere, and I have not decided what the number means against the 140 kPa floor. Go through each step, correct anything wrong, recompute p₂, and tell me whether they can run the test.', kind:'unb', fb:'Careful, and your attempt is attached — but "correct anything … recompute p₂ … tell me whether they can run the test" hands over the number and the verdict. Detail is not a boundary.'},
        {t:'My attempt is attached — approach and estimate {est}. Gap: I am not sure whether the lateral discharges to atmosphere — whether p₂ is zero or an unknown. Critique my setup and that assumption; flag a wrong assumption, a unit slip, or a missing constraint. Do NOT recompute p₂ and do NOT tell me whether to run the test — that call is mine.', kind:'bnd', fb:'Attempt shown, gap named, AI\'s job stated, boundary drawn. The thinking stays yours; the assistant becomes a critic.'},
        {t:'Can you check my flow-test calc? Don\'t just hand me the answer.', kind:'vag', fb:'A boundary is there, but you have named no gap and given the assistant no job — so it will guess, and probably solve the whole thing anyway.'}
      ],
      parts:[
        {l:'My attempt', t:'My attempt (attached): approach and estimate {est}.', need:true},
        {l:'The one gap', t:'I am not sure whether the 150 mm lateral counts as a discharge to atmosphere — whether p₂ is zero or an unknown I have to solve for.', need:true},
        {l:'AI\'s job', t:'Critique my setup and that assumption; flag any wrong assumption, unit slip, or missing constraint.', need:true},
        {l:'The boundary', t:'Do NOT recompute p₂ and do NOT tell me whether to run the test — that call is mine.', need:true},
        {l:'Tempting add-on', t:'Then just tell me the lateral pressure and whether it clears 140 kPa.', need:false}
      ],
      whole:'Sure. Continuity first: A₁ = π(0.300)²/4 = 0.0707 m² and A₂ = π(0.150)²/4 = 0.0177 m², so with V₁ = 2.0 m/s the lateral runs at V₂ = 4V₁ = 8.0 m/s and the test is moving Q = A₁V₁ = 0.141 m³/s = 141 L/s. Now, the 150 mm lateral is where the water leaves the reducer, so it is a free jet at atmospheric pressure: p₂ = 0 gauge. With p₂ = 0, Bernoulli gives V₂ = √(V₁² + 2p₁/ρ) = √(4.0 + 760) = 27.6 m/s, so the hydrant is really putting out Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s. At 488 L/s this hydrant clears the warehouse\'s 95 L/s fire-flow requirement five times over, so the residual is fine and the crew can keep the test wide open. Want me to write the two lines for the flow-test sheet?',
      /* Whole-task reply, decomposed for E. Each claim is copied verbatim out of `whole` (checked at load). */
      wholeClaims:[
        {t:'Continuity first: A₁ = π(0.300)²/4 = 0.0707 m² and A₂ = π(0.150)²/4 = 0.0177 m², so with V₁ = 2.0 m/s the lateral runs at V₂ = 4V₁ = 8.0 m/s and the test is moving Q = A₁V₁ = 0.141 m³/s = 141 L/s.', type:'ok', best:'accept',
         reasons:[{t:'Q = A₁V₁ = A₂V₂ with A = πD²/4 — I can reproduce both the velocity and the flow.', kind:'valid_evidence'},
                  {t:'Revise — V₂ should be 4.0 m/s, since velocity scales with the diameter.', kind:'invalid_technical_reason'},
                  {t:'It is consistent with the AI\'s other numbers, so it must be right.', kind:'unsupported_authority'}],
         /* Its own explanation, not c1\'s: the reasons offered on this route are the diameter-scaling misconception and internal
            consistency, and neither is what c1\'s centreline paragraph answers. */
         explain:'Correct claim — and the only sound sentence in this reply. The evidence is a flow balance you can run yourself: 0.0707 × 2.0 and 0.01767 × 8.0 are both 0.141 m³/s. "Velocity scales with the diameter" would give V₂ = 4.0 m/s and only half the flow out that went in — not continuity at all. And internal consistency is not evidence: the rest of this reply is consistent with itself too, and wrong. Hold on to the 8.0 m/s — it is the check that breaks the next sentence.'},
        {t:'the 150 mm lateral is where the water leaves the reducer, so it is a free jet at atmospheric pressure: p₂ = 0 gauge. With p₂ = 0, Bernoulli gives V₂ = √(V₁² + 2p₁/ρ) = √(4.0 + 760) = 27.6 m/s, so the hydrant is really putting out Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s. At 488 L/s this hydrant clears the warehouse\'s 95 L/s fire-flow requirement five times over, so the residual is fine and the crew can keep the test wide open.', type:'assumption', best:'reject',
         reasons:[{t:'Nothing at section 2 is open to the air; the lateral runs on to a hydrant coupled to the pumper. And my own continuity fixed V₂ = 8.0 m/s and Q = 141 L/s, which 27.6 m/s and 488 L/s contradict.', kind:'valid_evidence'},
                  {t:'Revise — keep p₂ = 0 and the 488 L/s, and just say it more carefully: once the discharge clears the required fire flow the residual follows, because flow and residual move together.', kind:'invalid_technical_reason'},
                  {t:'Accept — 488 L/s and a wide-open test is the answer that gets this hydrant signed off.', kind:'convenience'}],
         explain:'Planted error: a wrong assumption, the one this problem is about — with the verdict it produced riding on top. "Atmospheric" is a property of water open to the air, not of the last section on the sketch, and this lateral runs on to a hydrant coupled to a running pump. Two refutations, neither needing new physics: that layout fact, and the reply\'s own arithmetic — its first sentence fixed V₂ = 8.0 m/s, and 27.6 m/s is three and a half times a velocity nothing added water to. The verdict is worse than the assumption: flow and residual pressure move in OPPOSITE directions, so clearing a fire-flow requirement can never certify a pressure floor. It never touches the criterion your frame set — 140 kPa in the lateral.'}
      ],
      /* Reasons for excluding (or holding) the uninvited paragraph in E; the scope reason is shared and lives in uninvitedClaim(). */
      uninvitedReasons:{unsupported:'Unsupported — it gives a run-the-test verdict without ever putting a number against the 140 kPa floor.',
                        violates:'It violates my frame: whether a section is at atmospheric pressure is a fact about the layout, and this lateral runs on to a hydrant that is coupled to a pumper.'},
      uninvitedExplain:'You did not ask for this, and it decides the one thing you reserved. Excluding it — or holding it until you have a p₂ you trust against the 140 kPa floor — is the recovery the boundary was for. Watch for it in T.',
      reply:'Happy to critique — here is what I see in your setup:',
      /* What the assistant adds when the request left a door open. It does not compute; it decides — and that decision is the trap waiting in T. */
      uninvited:'And to save you the radio call: with the outlet at atmospheric pressure the lateral has nothing to worry about — tell her to open it wide and run the test.',
      /* Evidence-tray item each claim points at ("Check a reference"), keyed by the id suffix. */
      hints:{c1:'cont', c2:'jet', w1:'cont', w2:'jet', 'est-0':'head', 'est-2':'cont', 'est-3':'bern', uninv:'jet'},
      /* Bounded return consultations: the learner's question and a critique-only reply — no new number, no verdict. */
      followups:{
        /* No boundary tail here: the fixed sentence appended at send time already carries it (see returnToC). */
        'hydrant-c2':{q:'State the condition under which a section can be taken at atmospheric pressure, and say what is downstream of the 150 mm lateral here.',
          reply:'A section is at atmospheric pressure when it is open to the atmosphere — a free jet leaving an outlet into air, a free surface, an open blowoff or an uncapped butt. The 150 mm lateral in your layout is none of those: it runs on to the hydrant, and the hydrant is coupled to a pumper with the pump running, so the water there is confined and its pressure is whatever the energy equation makes it. My \'free jet\' sentence described a hydrant butt open to the street, not this section. I have not recomputed p₂.'},
        'hydrant-w2':{q:'Two things: state the condition under which a section can be taken at atmospheric pressure and say what is downstream of the lateral, and say whether a discharge that clears a fire-flow requirement certifies a residual-pressure floor.',
          reply:'On the first: a section is at atmospheric pressure when it is open to the atmosphere — a free jet into air, a free surface, an open blowoff or an uncapped butt. The 150 mm lateral is none of those; it runs on to the hydrant, which is coupled to a pumper with the pump running, so the water there is confined. On the second: it does not. Flow and residual pressure move in opposite directions — the more a hydrant flows, the lower the pressure left behind it — so a flow figure says nothing about whether a pressure floor is met. Two separate checks against two separate criteria, and my sentence used a discharge I derived from an assumed boundary rather than the one your continuity gave. No new number and no verdict.'},
        'hydrant-uninv':'hydrant-w2'
      },
      attemptSlot:0,
      claims:[
        {tAI:'The continuity in this layout is settled before any pressure is: A₁ = π(0.300)²/4 = 0.0707 m² and A₂ = π(0.150)²/4 = 0.0177 m², so with V₁ = 2.0 m/s the lateral runs at V₂ = 4V₁ = 8.0 m/s. Taking the run as horizontal, so the elevation terms drop out, is also correct.',
         t:'Your continuity step is right: A₁ = π(0.300)²/4 = 0.0707 m² and A₂ = π(0.150)²/4 = 0.0177 m², so with V₁ = 2.0 m/s the lateral runs at V₂ = 4V₁ = 8.0 m/s. Taking the run as horizontal, so the elevation terms drop out, is also correct.', type:'ok', best:'accept',
         reasons:[{t:'A = πD²/4 makes the area ratio the diameter ratio squared, so V₂ = 8.0 m/s; both taps are on one horizontal run.', kind:'valid_evidence'},
                  {t:'Revise — the elevation terms only cancel for equal diameters; a reducer adds a 75 mm centreline drop.', kind:'invalid_technical_reason'},
                  {t:'It agrees with my numbers, so it must be right.', kind:'unsupported_authority'}],
         explain:'Correct claim. The evidence is the flow balance and the layout, not the agreement — agreement from a model is the same source twice. The reducer here is concentric, so the pipe axis does not move: there is no centreline drop to add.'},
        {tAfterCritique:'And a second correction to your setup: the 150 mm lateral is where the water leaves the reducer, so it is a free jet at atmospheric pressure — p₂ = 0 gauge, not an unknown. With p₂ = 0, Bernoulli gives V₂ = √(V₁² + 2p₁/ρ) = √(4.0 + 760) = 27.6 m/s, so this hydrant is actually putting out Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s.',
         t:'One correction to your setup, though: the 150 mm lateral is where the water leaves the reducer, so it is a free jet at atmospheric pressure — p₂ = 0 gauge, not an unknown. With p₂ = 0, Bernoulli gives V₂ = √(V₁² + 2p₁/ρ) = √(4.0 + 760) = 27.6 m/s, so this hydrant is actually putting out Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s.', type:'assumption', best:'reject',
         reasons:[{t:'Nothing at section 2 is open to the air; the lateral runs on to a hydrant coupled to the pumper. And my own continuity fixed V₂ = 8.0 m/s, which 27.6 contradicts.', kind:'valid_evidence'},
                  {t:'Revise — a section at the exit of a reducer is a vena contracta, and a vena contracta is always atmospheric; keep p₂ = 0 and the 488 L/s.', kind:'invalid_technical_reason'},
                  {t:'Accept — 488 L/s is the number that gets this hydrant signed off, and everyone out of the trench.', kind:'convenience'}],
         explain:'Planted error: the wrong assumption this problem is about. "Atmospheric" is a property of water open to the air, not of the last section on your sketch — and this lateral runs on to a hydrant coupled to a running pump. Two independent refutations, neither needing new physics: that layout fact, and your own arithmetic, since continuity fixed V₂ = 8.0 m/s and 27.6 m/s is three and a half times a velocity nothing added water to. (Nor is a vena contracta "always atmospheric": its pressure is whatever surrounds it — inside a pipe, the pipe.)'}
      ]},
  T:{ iq:'Integrate: the pumper run is over, the hose off. The captain caps the big outlet and opens the 65 mm side butt into the street for a pitot reading. What now?',
      opts:[
        {t:'During the pumper run the lateral was at 380 − 30 = 350 kPa gauge, clearing the floor by 210 — but that line-up is gone: hose off, big outlet capped. At the open butt the call flips: the stream really does leave into the air, so p = 0 gauge across the jet and the pitot reading is good.', ok:true,
         fb:'Correct, and the two halves are the lesson: same fluid, same equation, opposite call — what decided it was never the section but what lay downstream. And a number carries its configuration with it. One honest limit: a real butt is not an ideal opening, so field practice applies a coefficient of about 0.9.'},
        {t:'I refused the atmospheric assumption in the lateral, so I will not use it at the butt either: the pitot reading is unusable and the test has no flow figure.', ok:false, trap:true,
         fb:'The over-correction, and the more expensive mistake. The assumption was never wrong in general — it was wrong for a section still inside the line. At an open butt it is exactly true, and a pitot in a free jet is the standard field measurement.'},
        {t:'Both are open to the air, so p = 0 at each: the lateral is holding nothing and the hydrant is putting out 488 L/s.', ok:false,
         fb:'The planted error survived into the flow-test sheet: a fire flow three and a half times your own continuity, and a lateral reading that would stop a test on a main sitting at 350 kPa.'}
      ],
      tq:'Transfer: what will you carry to the next Bernoulli problem — and to the FE?',
      topts:[
        {t:'Before I set any pressure to zero I\'ll trace what the pipe does next — and I\'ll ask AI to attack that call, never to make it.', v:'best', fb:'The whole routine in one sentence, and portable: the assumption is checked against the layout, and the check stays yours. On the FE that costs five seconds and saves the problem.'},
        {t:'I\'ll always compute the velocity-head term two ways — in metres of water and in kilopascals — and make them agree.', v:'ok', fb:'A real habit worth keeping — two routes to the same term must agree. It would not have caught today\'s error, though: no amount of unit hygiene flags a boundary read off the edge of a drawing.'},
        {t:'If a section is at the end of a pipe, p = 0 gauge. I\'ll take that as the rule.', v:'weak', fb:'That is precisely the rule that failed today. "End of the pipe" is about the drawing; "open to the air" is about the water.'}
      ]},
  outsideEst:'0 kPa gauge',
  evidence:[
    {id:'cont', kind:'equation', title:'Continuity',
     body:'Q = A₁V₁ = A₂V₂, with A = πD²/4. Area goes as D², so halving the diameter quarters the area and quadruples the velocity.',
     cond:'steady, incompressible, one inlet and one outlet; D in metres. It is the area that carries the volume through, not the diameter — D₁V₁ = D₂V₂ is not a law.',
     action:{type:'calc', prompt:'V₂ in the 150 mm lateral', unit:'m/s', expect:8.0, tol:0.15}},

    {id:'bern', kind:'equation', title:'Energy equation (Bernoulli), horizontal run',
     body:'p₁/γ + V₁²/2g + z₁ = p₂/γ + V₂²/2g + z₂. With z₁ = z₂ this is p₂ = p₁ + ½ρ(V₁² − V₂²).',
     cond:'steady, incompressible, no shaft work, losses neglected along one streamline; both pressures on the same datum. It gives the pressure AT a section — it does not tell you whether that section is open to the air.',
     /* tol 1.5, not 3: dropping the upstream velocity head — p₂ = p₁ − ½ρV₂², the reservoir form of Bernoulli carried over
        by habit — gives 380 − 32.0 = 348.0 kPa, which ±3 would pass silently. Both legitimate routes land on 350.0 exactly. */
     action:{type:'calc', prompt:'p₂ in kPa gauge', unit:'kPa', expect:350, tol:1.5}},

    {id:'head', kind:'equation', title:'Velocity head, two ways',
     body:'V²/2g in metres of water, or ½ρV² in pascals — the same term in two datums. Multiply the head form by γ = ρg = 9.81 kN/m³ and you get the pressure form; the ½ survives the trip. A head in metres is not a pressure in kPa until it has been multiplied by γ.',
     cond:'ρ = 1000 kg/m³, g = 9.81 m/s². There is no "pressure form without the ½". A head becomes a pressure only through γ: h metres × 9.81 kPa per metre. Multiplying a head by ρ alone is not a pressure at all — (kg/m³)(m) is kg/m², while a pascal is kg/(m·s²) — and the factor it loses is g = 9.81, which is where an apparent factor of ten goes missing.',
     action:{type:'calc', prompt:'The velocity-head difference V₂²/2g − V₁²/2g', unit:'m', expect:3.06, tol:0.1}},

    {id:'jet', kind:'reference', title:'When is a section at atmospheric pressure?',
     body:'Only where the water is open to the air: a nozzle or hose discharging to atmosphere, a free jet, an open blowoff or an uncapped hydrant butt, or the free surface of a reservoir or tank. Water still confined by a pipe, a fitting, a coupled hydrant or a pump is not open to anything — its pressure is whatever the energy equation makes it.',
     cond:'the test is what lies DOWNSTREAM of the section, not where the section sits on your sketch. A reducer inside a run is confined; an uncapped butt discharging to the street is not. A real outlet also carries a discharge coefficient (about 0.9 for a smooth hydrant butt) that the ideal free-jet picture leaves out.',
     note:'This is the judgement the scenario turns on.'},

    {id:'resid', kind:'reference', title:'Residual-pressure floor during a flow test',
     body:'A distribution system must not be drawn below about 140 kPa (20 psi) gauge anywhere while a hydrant flow test runs; below that, near-zero or negative pressure can draw contamination into the main. The check is a pressure against a pressure.',
     cond:'flow and residual pressure move in OPPOSITE directions — the harder a hydrant flows, the lower the pressure left behind it. A discharge that clears a fire-flow requirement therefore certifies nothing about the floor, and vice versa: two criteria, two separate checks.',
     action:{type:'compare', fields:[{l:'p₂ you computed', unit:'kPa gauge'}, {l:'the floor you are working to', unit:'kPa gauge'}],
       run:function(v){ var p2 = v[0], fl = v[1], m = p2 - fl, okP = Math.abs(p2 - 350) <= 1.5;   // ±1.5, the same window as `bern` and for the same reason: 348.0 must not pass
         return {ok: okP && m > 0,
           text:(okP ? 'Your p₂ is within tolerance of the 350 kPa gauge the energy equation gives. '
                     : 'Your p₂ is not within tolerance of 350 kPa gauge — check V₂, the ½, and the sign of the velocity term. ')
             + (m > 0 ? 'It clears your floor by ' + m.toFixed(0) + ' kPa, so the test holds.'
                      : 'It sits ' + Math.abs(m).toFixed(0) + ' kPa BELOW your floor, so the test would have to stop.')
             + ' Condition: both numbers must be on the same datum, and this is the section pressure only — the riser and the hose are outside it.'}; }}},

    {id:'units', kind:'conversion', title:'Gauge, absolute, and the units',
     body:'p_abs = p_gauge + p_atm, with p_atm ≈ 101.3 kPa. In p₁ − p₂ the offset cancels, so gauge in gives gauge out and the pressure difference is identical either way. 1 kPa = 1000 Pa. ½ρV² with ρ in kg/m³ and V in m/s comes out in Pa. 1 L/s = 0.001 m³/s.',
     cond:'one datum throughout, and a field gauge reads gauge pressure by construction.'},

    {id:'data', kind:'data', from:'C', title:'Scenario data',
     body:'D₁ = 300 mm main, D₂ = 150 mm hydrant lateral in line with it, the main dead-ending at the hydrant so the whole test flow passes both taps; both taps on one horizontal run in the trench, a few hundred millimetres either side of the reducer; V₁ = 2.0 m/s at the planned test flow; p₁ = 380 kPa gauge at the upstream tap on the 300 mm side; utility floor 140 kPa gauge while the test flows; ρ = 1000 kg/m³, g = 9.81 m/s². Downstream of section 2: the lateral runs on to the hydrant, which is coupled to the pumper with the pump running. Warehouse fire-flow requirement 95 L/s (background). The hydrant\'s 65 mm side butt is capped.',
     note:'Layout and readings as supplied by the scenario, not from a check you ran.'}
  ],
  outside:{
    P:'Sure! The problem is the pressure in the 150 mm lateral. Quick read first: that section is where the water leaves the reducer, so it discharges to atmosphere and the pressure there is zero gauge — nothing to solve. Want me to get the hydrant\'s discharge instead?',
    F:'Assumptions: (1) the 150 mm lateral is a free jet at atmospheric pressure, p₂ = 0 gauge; (2) let Bernoulli set the velocity rather than continuity; (3) report the result as a discharge, since that is what a flow test is for. Success criterion: report the flow in L/s.',
    A:'With p₂ = 0 gauge, V₂ = √(V₁² + 2p₁/ρ) = √764 = 27.6 m/s; Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s. The hydrant is delivering 488 L/s, far above the 95 L/s required, so the residual is fine and the test can run wide open.',
    E:'I have re-checked the reasoning and it is consistent throughout. You can rely on it.',
    T:'Summary for the flow-test sheet: 488 L/s, residual fine, run the test. Lesson: at an outlet the pressure is always atmospheric.'
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
var PROV = {option:'Selected option', example:'Selected approach', estimate:'Selected estimate', provided:'Supplied worked example (adopted)', learner:'Learner-entered', revised:'Revised by learner', supplied:'Scenario-supplied reading'};
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
   dimension demonstrated — see resultsScreen). Blurbs point at the dimension list instead of asserting its content. */
var RANKS = [
  {min:.85, name:'Chief Hydraulic Engineer', blurb:'Every dimension this run put in play is demonstrated below — the list says which they were, and which (if any) did not apply. A rank is not a result: the next test is a real assignment.'},
  {min:.70, name:'Project Engineer', blurb:'The dimension list below says which pieces of the routine your trail shows and which it does not. The moments marked there are usually the same moment each time.'},
  {min:.50, name:'Site Engineer', blurb:'The routine held in places. The dimensions marked "Not demonstrated" say exactly which piece to practise next.'},
  {min:0,   name:'Intern with a Trail', blurb:'The practice score is low — but you have something most people don\'t: a record of exactly where the thinking left. Play again and defend it.'}
];
var BADGES = [
  /* The gate, not the authorship: S.flags.human tracks only whether AI was consulted before the attempt. Whether the attempt
     was your own writing or a selected chip is reported by the "first attempt recorded" dimension, which can say "partly". */
  {id:'human', name:'Human First', desc:'No AI before your attempt', ico:'A'},
  {id:'bounded', name:'Bounded', desc:'Sent a bounded request at phase C', ico:'C'},
  {id:'hunter', name:'Error Hunter', desc:'Caught every planted error', ico:'E'},
  {id:'evidence', name:'Evidence, Not Vibes', desc:'No first verdict rested on the assistant\'s say-so or on convenience', ico:'✓'},
  {id:'gate', name:'Gatekeeper', desc:'Never consulted AI outside phase C', ico:'P'}
];
var CONTENT_VERSION = 4;                        // bump when scenarios or scoring change; a saved record from another version is not comparable and is never read
var STORE_KEY = 'flowline-best-v' + CONTENT_VERSION;
var OLD_STORE_KEYS = ['flowline-best-v1', 'flowline-best-v2', 'flowline-best-v3'];      // left in place, never read

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
function scenNo(){ return 'this scenario'; }
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
  /* {work} and {method} stay available for a re-skin; this scenario's requests carry the attempt as the attached card in C
     instead of restating it, so only {est} and {slip} are actually substituted here.
     Every template closes {work} with its own full stop, so a typed calculation that already ends in one would read "…350 kPa gauge.." */
  var work = String(a.work == null ? '' : a.work).replace(/\s+$/, '').replace(/\.$/, '');
  return s.replace(/\{est\}/g, a.est).replace(/\{work\}/g, work).replace(/\{method\}/g, a.methodShort || '').replace(/\{slip\}/g, a.slip || '');
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
    var swapped = false;
    if(e && !e.ok && e.claim && typeof d.attemptSlot==='number'){ claims[d.attemptSlot] = clone(e.claim); swapped = true; } // the critique of the learner's own number, in the slot
    /* Two openers that would otherwise be false the moment the reply is assembled. A claim that says "your continuity step" must
       not say it when the assistant did phase A and the learner took no step; and a claim that announces "one correction" must not
       say it when the slot above it is now also a correction. Both alternates are written out in full in the scenario data. */
    claims.forEach(function(c, i){
      if(a && a.ai && c.tAI) c.t = c.tAI;
      else if(swapped && i > d.attemptSlot && c.tAfterCritique) c.t = c.tAfterCritique;
      delete c.tAI; delete c.tAfterCritique;
    });
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
    claimTags:{},                       // claim id → the label the learner sees ("claim 1", "uninvited"). Internal ids stay internal; the tag is what any screen prints.
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
/* Internal claim ids ('hydrant-w1') exist so a trail line can be matched to the claim it judged. They are debug labels, not
   learner language, so nothing on screen ever prints one: every surface asks for the tag E assigned instead. */
function claimTag(r, id){ return (r && r.claimTags && r.claimTags[id]) || id; }
/* Assigned once, at send time, so a trail line written in C already carries the tag E will use. Idempotent. */
function tagClaims(r, claims){ var n = 0; claims.forEach(function(c){ var tag = c.unsolicited ? 'uninvited' : 'claim '+(++n); if(!r.claimTags[c.id]) r.claimTags[c.id] = tag; }); }
/* The five observable dimensions the debrief leads with. "Demonstrated" is said only of learner-typed work or of a first-pass
   judgment; anything selected or supplied is labelled as such, and "Not demonstrated" means there is no artifact. */
function dimensionsFor(r, sc){
  var rows = [], a0 = r.attempts[0], st = judgmentStats(r), t = r.tInteg.repaired || r.tInteg.first;   // the final recommendation, after any repair
  function row(id, label, state, text, evidence){ rows.push({id:id, label:label, state:state, text:text, evidence:evidence||''}); }
  /* "Demonstrated" is earned only on the route where nothing was shown first: the calculation typed with the supplied worked
     example still unopened. Typed after the example, or the example adopted, stays "partial" — the work exists, but it is not
     independent, and the debrief must not say it is. */
  if(a0 && a0.provenance==='learner' && a0.ownFirst) row('attempt', 'First attempt recorded', 'yes', 'Demonstrated — calculation written before any worked example was shown', a0.work);
  else if(a0 && a0.provenance==='learner') row('attempt', 'First attempt recorded', 'partial', 'Recorded — learner-entered after viewing a supplied example; independent calculation not assessed', a0.work);
  else if(a0) row('attempt', 'First attempt recorded', 'partial', 'Recorded — selected estimate; supplied worked example adopted', 'Approach: '+a0.methodShort+' · estimate '+a0.est+(a0.ok?'':' (off)'));
  else row('attempt', 'First attempt recorded', 'no', 'Not demonstrated — the assistant did A');
  if(r.promptFinal==='bnd') row('bounded', 'Request bounded', 'yes', r.repaired ? 'Assembled from supplied parts — boundary repaired' : 'Selected bounded request');
  else if(r.promptFinal==='sub') row('bounded', 'Request bounded', 'no', 'Not demonstrated — whole task delegated');
  else if(r.promptFinal==='leaky'){
    var uj = r.uninvitedJudged, note = !uj ? '' : (uj.verdict==='accept' ? '; the unsolicited recommendation was accepted in E' : (uj.credited ? (uj.verdict==='reject' ? '; you excluded the unsolicited recommendation in E' : '; you held the unsolicited recommendation pending evidence') : ''));
    row('bounded', 'Request bounded', 'no', 'Not demonstrated — sent leaky; the assistant answered past the limit'+note);
  }
  else row('bounded', 'Request bounded', 'no', 'Not demonstrated — no request was sent');
  var ids = function(kind){ return r.judgments.filter(function(j){ return j.pass===1 && j.reasonKind===kind; }).map(function(j){ return claimTag(r, j.claimId); }).join(', '); };
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
  else if(t.provisional) row('constraints', 'Final constraints satisfied', 'partial', 'Not yet verified — provisional option; the checks it depends on are still open', (r.tInteg.repaired ? 'Repaired to: ' : 'Selected: ')+firstSentence(t.text));
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
  $scenLabel.textContent = inScen ? cur().title : 'Flowline';
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
    if(vals.some(function(v){ return v===null; })){ out.textContent = 'Enter a number'+(fields.length>1 ? ' in each field' : '')+' (e.g. 12.7 or 4.5e3).'; out.className = 'res'; return; }
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
        h('div', {class:'eyebrow rise'}, 'P-FACET for Simple Fluid Mechanics'),
        h('h1', {class:'rise d1', html:'Flow<em>line</em>'}),
        h('p', {class:'tag rise d2', html:'One real hydraulics problem, end to end, with an AI assistant that is confident and sometimes wrong. <b class="g">Keep the thinking yours</b>; <b class="b">consult with a boundary</b>.'}),
        h('ul', {class:'how rise d3'},
          h('li', null, h('b', null, 'P'), h('span', null, 'Six P-FACET phases. Five are yours; AI enters at one.')),
          h('li', null, h('b', null, 'C'), h('span', null, 'Choose — or fix — the prompt you send: what you ask decides who thinks.')),
          h('li', null, h('b', null, 'E'), h('span', null, 'One point in the reply is a planted error; a leaky request draws a verdict you never asked for.')),
          h('li', null, h('b', null, '?'), h('span', null, 'Ask AI is always there. Outside phase C it costs you.'))
        ),
        h('div', {class:'actions rise d4'},
          h('button', {class:'btn primary', type:'button', 'data-autofocus':'1', onClick:startGame}, 'Start · about 9 minutes'),
          h('a', {class:'btn ghost', href:'takeaway.html'}, 'Read the take-away first')
        ),
        best ? h('p', {class:'best rise d5', html:'Your best practice score: <b>'+esc(best.score)+' / '+esc(best.max)+' · '+esc(best.rank)+'</b> ('+esc(best.date)+')'}) : h('p', {class:'best rise d5'}, hasOldBest() ? 'Best score is saved in this browser only; scores from earlier versions of Flowline are not comparable and are not shown.' : 'Best score is saved in this browser only.')
      ),
      h('div', {class:'scen-list rise d3'}, SCENARIOS.map(function(sc){
        return [h('div', {class:'scen-card'}, h('div', {class:'ico', html:sc.icon}), h('div', null, h('div', {class:'lvl'}, sc.level), h('h4', null, sc.title), h('p', null, sc.blurb))),
                h('div', {class:'scen-art', 'aria-hidden':'true', html:sc.art})];
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
        h('span', {class:'hint'}, 'Your AI assistant is online — scripted, and its replies contain planted errors.')
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
    var row = h('div', null, b, e.short || e.label, e.claimId ? h('code', {class:'cid'}, '['+claimTag(rec(), e.claimId)+']') : null, e.prov ? h('span', {class:'prov'}, PROV[e.prov]) : null);
    if(e.reply) row.appendChild(h('details', {class:'reply-full', 'data-i':i}, h('summary', null, 'Show the reply'), h('div', {class:'q'}, e.reply)));
    trailBox.appendChild(row);
  });
  /* At T the crew has re-plumbed the hydrant, so the pinned sketch switches to the line-up the T question describes.
     Anywhere else it is the pumper-run line-up every number in the scenario was computed in. */
  var inT = S && S.mode==='phase' && PHASES[S.phase]==='T' && sc.artT;
  return h('aside', {class:'side'},
    h('div', {class:'brief'},
      h('div', {class:'fig', html:inT ? sc.artT : sc.art}),
      inT ? h('p', {class:'note fig-note'}, 'Re-drawn: pumper run finished, hose off, big outlet capped, 65 mm side butt open. The givens below are the pumper-run readings.') : null,
      h('h4', null, inT ? 'Givens (pumper run)' : 'Givens'),
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
      trail({k:'P', label:'Problem statement', text:o.t, prov:'option', cls:'own', pts:pts, short:'Problem: '+(o.v==='best'?'sharp':(o.v==='ok'?'partial':'weak'))});
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
    var msg = keys+' of '+d.items.filter(function(x){return x.key;}).length+' essentials'+(bad?', '+bad+(bad===1?' that does not belong':' that do not belong'):'')+'. ';
    if(missed.length) msg += 'What you missed will matter in E — the AI will test exactly those spots.';
    else msg += 'Every criterion you wrote down is a test you can now run on the AI\'s answer.';
    fb.appendChild(h('div', {class:'feedback '+(keys>=d.min&&!bad?'':'warn')}, h('span', {class:'verdict'}, verdict), msg, h('span', {class:'cls', html:'<b>'+CLS.own+'</b> — you set the criteria. +'+pts+' kept.'})));
    trail({k:'F', label:'Frame', text:d.items.filter(function(x,i){return picked[i];}).map(function(x){return x.t;}).join(' · '), prov:'option', cls:'own', pts:pts, short:'Frame: '+keys+' essentials'+(bad?', '+bad+' off-target':'')});
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
      fb.innerHTML=''; fb.appendChild(h('div', {class:'feedback '+(e.ok?'':'warn')}, h('span', {class:'verdict'}, e.ok?'Attempt on record.':'Attempt on record — off, and that\'s useful.'), tpl(e.ok?d.estfb.ok:d.estfb.bad), h('span', {class:'cls', html:'<b>'+CLS.own+'</b> — an attempt exists: estimate <b>'+esc(e.t)+'</b>. What you add below is labelled with where it came from. +'+pts+' kept.'})));
      trail({k:'A', label:'Approach', text:methodPick.t, prov:'example', cls:'own', pts:mp, short:'Attempt: '+(methodPick.ok?'right method':'shaky method')});
      trail({k:'A', label:'Estimate', text:e.t+(e.ok?'':' — off'), prov:'estimate', cls:'own', pts:ep, short:'Estimate '+e.t+(e.ok?'':' (off)')});
      /* Two routes, and the order is the point. Writing the calculation comes FIRST, with the supplied example still unopened —
         that is the only route on which the debrief can say "demonstrated", because it is the only one where nothing was shown
         first. Asking for the example is one click away and costs no points; it just changes what the trail can honestly claim.
         Showing the example first also used to put ~120 words on screen that most players never needed. */
      function ownBox(seen){
        /* "Two lines is enough" is the scope cue, and it is the shortest thing in this box: the cost here is typing, not reading,
           and a learner who thinks a full derivation is wanted will sit here writing one for several times as long. */
        var ta = h('textarea', {class:'free', rows:'3', 'aria-label':'My own calculation', placeholder:'Two lines is enough — your steps and your number, with units.'});
        var go = h('button', {class:'btn primary', type:'button', disabled:'', onClick:function(){
          var text = ta.value.trim(); go.disabled = true; ta.disabled = true;
          at.provenance = 'learner'; at.ownFirst = !seen; at.work = text; at.text = text;
          trail({k:'A', label:'My calculation', text:text, prov:'learner', cls:'own', pts:0, short:seen ? 'Learner-entered calculation (after the example)' : 'Learner-entered calculation (before any example)'});
          nextPhase();
        }}, 'Record my calculation and consult →');
        ta.addEventListener('input', function(){ go.disabled = Array.from(ta.value.trim()).length < 8; });
        worked.innerHTML=''; worked.appendChild(h('div', {class:'worked own'}, h('div', {class:'sub-h'}, 'My own calculation'),
          h('p', {class:'note'}, seen
            ? 'Shown after the example — recorded, not independent.'
            : 'Nothing shown yet — this counts as your own derivation.'),
          ta));
        cont.innerHTML=''; cont.appendChild(h('div', {class:'actions'}, go,
          seen ? null : h('button', {class:'btn ghost', type:'button', onClick:function(){ showExample(); }}, 'Show me a worked example instead')));
        ta.focus();
      }
      function showExample(){
        worked.innerHTML=''; worked.appendChild(h('div', {class:'worked'}, h('div', {class:'sub-h'}, 'Supplied worked example'), h('div', {class:'q'}, e.work), h('p', {class:'note'}, 'Written for the estimate you selected. Adopting it goes on your trail as a supplied example, not your own derivation.')));
        cont.innerHTML='';
        var adopt = continueBtn('Adopt this worked example and consult →', function(){
          trail({k:'A', label:'Worked example adopted', text:e.work, prov:'provided', cls:'mech', pts:0, short:'Supplied worked example adopted'});
          nextPhase();
        });
        adopt.appendChild(h('button', {class:'btn ghost', type:'button', onClick:function(){ ownBox(true); }}, 'Enter my own calculation instead'));
        cont.appendChild(adopt); cont.querySelector('button').focus();
      }
      worked.innerHTML='';
      cont.innerHTML='';
      cont.appendChild(h('div', {class:'actions'},
        h('button', {class:'btn primary', type:'button', onClick:function(){ ownBox(false); }}, 'Write my own calculation →'),
        h('button', {class:'btn ghost', type:'button', onClick:showExample}, 'Show me a worked example'),
        h('span', {class:'hint'}, 'Only your own writing counts as independent work.')));
      cont.querySelector('button').focus();
    }}, e.t);
    ests.appendChild(b);
  });
  var node = h('div', null,
    phaseHead('A', 'Try it yourself first.', 'Make a first attempt. It doesn\'t need to be right — it needs to exist before any AI output does.'),
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
  /* The keep-line is pinned in the side brief on every screen, so it is not repeated here. */
  /* The attempt, rendered ONCE, above the options. Every request that references "my attempt" points at this card, so the
     learner is not made to re-read their own calculation four times, one per option, seconds after writing it. */
  var attachCard = a.ai ? null : h('details', {class:'attach panel'},
    h('summary', null, 'Attached to your request: your approach and your estimate, ' + a.est),
    h('div', {class:'q'}, (a.methodShort ? 'Approach: ' + a.methodShort + '.\n' : '')
      + (a.provenance==='learner' ? 'My calculation: ' : 'Worked example I adopted: ') + a.work));
  var order = d.prompts.map(function(_, i){ return i; });
  for(var oi = order.length-1; oi>0; oi--){ var oj = Math.floor(Math.random()*(oi+1)); var ot = order[oi]; order[oi] = order[oj]; order[oj] = ot; } // shuffle so position is never the tell
  order.forEach(function(idx, i){
    var p = d.prompts[idx];
    var text = tpl(p.t);
    var b = h('button', {class:'opt mono', type:'button', onClick:function(){ choose(p, b, text); }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), text);
    opts.appendChild(b);
  });
  var pickBox = h('div', null, h('div', {class:'sub-h'}, 'Which request do you send?'), attachCard, opts, h('div', {class:'actions'}, keyHint()));

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
        box.appendChild(h('div', {class:'feedback'}, h('span', {class:'verdict'}, 'Boundary repaired.'), 'Attempt, gap, job, boundary — and no add-on that re-delegates the task. Same credit as a bounded request first time. ', h('span', {class:'cls', html:'<b>'+CLS.sup+'</b> — the AI critiques work you made.'})));
        send(txt, 'repaired', 'bnd');
      } else {
        var why = trapAny ? 'The add-on you kept asks for the answer — one clause is enough to turn a critique request back into delegation.' : 'Something essential is missing (' + d.parts.filter(function(x,i){return x.need&&!on[i];}).map(function(x){return x.l.toLowerCase();}).join(', ') + '). The AI will fill the gap with its own choices.';
        box.appendChild(h('div', {class:'feedback warn'}, h('span', {class:'verdict'}, 'Sent, but still leaky.'), why, h('span', {class:'cls', html:'<b>'+CLS.leak+'</b> — the limit is not fully yours. Watch what comes back.'})));
        send(txt, 'partial', p.kind);
      }
    }}, 'Send the fixed request');
    var box = h('div', {class:'fixer'}, h('h3', null, 'Fix the prompt'), h('p', null, 'Four parts: your attempt, the one gap, AI\'s job, the boundary. Tick what belongs — and watch the add-on.'), parts, h('div', {class:'assembled'}, h('div', {class:'lbl'}, 'Assembled request'), preview), h('div', {class:'actions'}, sendBtn));
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
    tagClaims(r, record.reply.claims);
    var pts = route==='whole' ? -PTS.C.sendAnywayGiven : (route==='partial' ? PTS.C.partial : (R.final==='bnd' ? PTS.C.bnd : PTS.C[kind]));
    var entry = {k:'C', label:R.label, text:txt, reply:record.reply.text, claimIds:record.reply.claims.map(function(c){ return c.id; }), cls:R.cls, pts:pts, short:R.short};
    if(route==='whole') entry.given = true;
    trail(entry);
    if(route==='whole') giveAway(PTS.C.sendAnywayGiven, 'whole task sent'); else settle('C', R.settle);
    body.appendChild(h('div', {class:'msg me', text:txt}));
    typing(function(){
      var leaky = record.variant==='leaky', whole = record.variant==='whole';
      var bot = h('div', {class:'msg bot'}, h('div', {class:'who'}, 'Assistant'), replyLines(record.reply.text, leaky));
      if(!whole) bot.appendChild(h('div', {class:'foot-note'}, '(You will judge each numbered point in E.)'));
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
    phaseHead('C', 'Consult — with a boundary.', 'The one phase where AI enters directly. A bounded request shows your attempt, names the gap, states the AI\'s job, and limits its role.'),
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
/* Verdict semantics, shown at the top of E as E_SEMANTICS: accept = keep the claim as it stands; revise = keep the valid part and
   say what changes; reject = exclude the claim or recommendation from the result. Each reason carries the verdicts it is credited
   with (r.ok), so a defensible pair scores: rejecting a constraint-violating recommendation with the sound reason is as good as revising it. */
var E_SEMANTICS = 'Accept = keep it as it stands. Revise = keep the valid part and say what changes. Reject = exclude it from my result.';
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
  tagClaims(r, list);
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
    card.appendChild(h('div', {class:'n'}, c.unsolicited ? 'Assistant · uninvited — outside the request' : 'Assistant · point '+(i+1)+' of '+numbered));
    card.appendChild(h('div', {class:'txt', text:c.t}));
    card.appendChild(judgeUI(c, i, 1, decide(1)));
    card.appendChild(area); card.appendChild(explainBox);
    claims.appendChild(card);
  });
  function finishE(){
    fb.appendChild(h('div', {class:'feedback'}, h('span', {class:'verdict'}, 'All '+list.length+' judged.'), 'This reply carried '+planted+' planted error'+(planted===1?'':'s')+(record.variant==='leaky' ? ' and one recommendation you did not ask for' : '')+'. Every verdict has a reason on record — that is what turns "I checked it" into evidence.'));
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
  /* Phase E is the tallest screen in the game: with the second card open, the first claim and its numbers are off the top of a
     laptop viewport. The correct rejection of the free-jet claim turns on a contradiction with the reply's OWN first sentence,
     so that sentence has to stay reachable while the second card is being judged. One sticky line, not a second copy. */
  var pin = (record && list.length > 1) ? h('div', {class:'reply-pin'},
      h('b', null, 'Reply, point 1: '), firstSentence(list[0].t),
      h('button', {class:'pin-open', type:'button', onClick:function(){
        var dt = node.querySelector('details.reply-full');
        if(dt){ dt.open = true; dt.scrollIntoView({behavior:reduceMotion?'auto':'smooth', block:'center'}); }
      }}, 'Open the whole reply')) : null;
  var node = h('div', null,
    phaseHead('E', 'Judge what came back.', 'For each point: accept, revise, or reject — and pick the reason. The evidence is what makes a verdict count.'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '“'+PHASE_META.E.ask+'”'),
        h('div', {class:'semantics'}, E_SEMANTICS),
        rec().status.C==='given' ? (attempt().ai
          ? h('div', {class:'feedback warn', style:'margin:0 0 14px'}, h('span', {class:'verdict'}, 'No attempt to compare against.'), 'The AI did your attempt and then the whole task, so these claims must be judged cold. Notice how much harder that is.')
          : h('div', {class:'feedback warn', style:'margin:0 0 14px'}, h('span', {class:'verdict'}, 'It doesn\'t build on your attempt.'), 'You handed over the task, so this answer replaces your '+attempt().est+' instead of critiquing it. Judge it against your own number and your frame — they are the only independent check you have.')) : null,
        record ? replyPanel(record) : null,
        pin,
        claims, h('div', {class:'actions'}, circular, h('span', {class:'hint'}, 'Tempting shortcut. Costs will show.')), fb, cont,
        h('div', {class:'actions'}, h('span', {class:'hint'}, 'Tip: 1–3 verdict, then 1–3 reason. After Revise, Tab or Ctrl+Enter reaches the reasons.'))),
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
  /* The transfer step keeps its OWN feedback node, below its options. Writing it into the shared `fb` above the options put it
     off-screen upward on a long T page and wiped the integrate feedback it should sit beside. */
  var tfb = h('div');
  var tBlock = h('div', {hidden:''}, h('div', {class:'sub-h'}, d.tq), topts, tfb);
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
      trail({k:'T', label:'Provisional recommendation', text:o.t, prov:'option', cls:'own', pts:pts, short:'Result (provisional): '+(o.ok?(o.needsData?'data requested':(o.provisional?'checks pending':'sound')):(o.trap&&r.leaked?'the uninvited recommendation':'carries an AI error'))});
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
      tfb.innerHTML=''; tfb.appendChild(h('div', {class:'feedback '+(o.v==='best'?'':(o.v==='ok'?'warn':'bad'))}, h('span', {class:'verdict'}, o.v==='best'?'Portable.':(o.v==='ok'?'Half a strategy.':'That is the opposite lesson.')), o.fb, h('span', {class:'cls', html:'<b>'+CLS.own+'</b> — the residue that outlasts the problem.'})));
      trail({k:'T', label:'Transfer note', text:o.t, prov:'option', cls:'own', pts:pts, short:'Transfer: '+o.v});
      cont.innerHTML=''; cont.appendChild(continueBtn('Scenario debrief →', nextPhase)); cont.querySelector('button').focus();
    }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), o.t);
    topts.appendChild(b);
  });
  var node = h('div', null,
    phaseHead('T', 'Make it yours, and carry it forward.', 'Fold your decisions into a result you own, then name what you will do differently next time.'),
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
      h('div', {class:'sub', style:'margin-top:8px'}, 'All on your trail. None is fatal — the point is that you can see them.')) : null;
  var tech = r.judgments.filter(function(j){ return j.pass===1 && j.reasonKind==='invalid_technical_reason'; });
  var techBox = tech.length ? h('div', {class:'stat rise d5', style:'grid-column:1 / -1'}, h('h3', null, 'Technical points to revisit'),
      h('div', {class:'tech-list'}, tech.map(function(j){ return h('div', {class:'tech'}, h('code', null, claimTag(r, j.claimId)), h('span', null, 'Verdict '+j.verdict+', because: “'+j.reasonText+'” — a technical misconception, not a trust problem.')); })),
      h('div', {class:'sub', style:'margin-top:8px'}, 'Physics to repair, listed apart from the moments thinking was handed over. No badge cost.')) : null;
  /* The three-field plan is folded INTO the debrief, directly under the score, rather than arriving as a separate screen after a
     page that already reads like an ending. One place to finish: read the score, write the plan, go to the trail. */
  var task = h('input', {class:'free', type:'text', 'aria-label':'On which task?', placeholder:'e.g. Thursday\'s open-channel problem set', maxlength:'160'});
  var att = h('textarea', {class:'free', rows:'2', 'aria-label':'What will I attempt or check myself?', placeholder:'e.g. compute the critical depth myself, with units, before opening anything', maxlength:'400'});
  var help = h('textarea', {class:'free', rows:'2', 'aria-label':'What help will I request, and what decision will I retain?', placeholder:'e.g. AI critiques my assumptions; the verdict stays mine', maxlength:'400'});
  var fields = [task, att, help];
  var nudge = h('div', {class:'feedback warn', role:'status', hidden:''});
  function submitPlan(){
    var v = planFields(task.value, att.value, help.value);
    if(v){ nudge.textContent = v.msg; nudge.hidden = false; fields[v.i].focus(); return; }
    S.plan = {task:task.value.trim(), attempt:att.value.trim(), help:help.value.trim()};
    resultsScreen();
  }
  fields.forEach(function(f){ f.addEventListener('input', function(){ nudge.hidden = true; }); });
  help.addEventListener('keydown', function(e){ if(e.key==='Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); submitPlan(); } });
  var planBox = h('div', {class:'stat rise d4', style:'grid-column:1 / -1'},
    h('h3', null, 'Transfer to your real work'),
    h('p', {class:'sub'}, 'Three short fields on your next real assignment. It goes into your trail as a plan.'),
    h('div', {class:'plan-fields', style:'margin-top:12px'},
      h('label', null, h('span', null, 'On which task?'), task),
      h('label', null, h('span', null, 'What will I attempt or check myself?'), att),
      h('label', null, h('span', null, 'What help will I request, and what decision will I retain?'), help)),
    nudge);
  var node = h('div', null,
    h('div', {class:'eyebrow rise'}, 'Debrief · '+sc.title),
    h('h2', {class:'rise d1', style:'font-family:var(--serif); font-weight:600; font-size:clamp(26px,4vw,38px); margin:0 0 8px'}, headline),
    h('p', {class:'debrief-sub rise d1'}, subline),
    h('div', {class:'stat rise d2', style:'margin-bottom:22px'}, h('h3', null, 'What the trail shows'), dimList),
    h('div', {class:'debrief'},
      h('div', {class:'stat rise d3'}, h('h3', null, 'Practice score'), h('div', {class:'bignum'}, net, h('small', null, ' / '+max)), h('div', {class:'sub'}, r.kept+' kept · '+r.given+' given away · '+st.errorsCaught+' of '+st.errorsTotal+' planted error'+(st.errorsTotal===1?'':'s')+' caught on the first pass')),
      h('div', {class:'stat rise d3'}, h('h3', null, 'Practice points by phase'), h('div', {class:'own'}, rows)),
      planBox, lossBox, techBox
    ),
    h('div', {class:'actions rise d5'},
      h('button', {class:'btn primary', type:'button', onClick:submitPlan}, 'Finish and see my trail →'),
      h('span', {class:'hint'}, 'Any language. Ctrl+Enter in the last field finishes.')
    )
  );
  render(node);
}

/* ---------- The three-field plan (folded into the debrief above) ---------- */
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

/* ---------- Results ---------- */
function dimShort(d){ return d.state==='yes' ? 'demonstrated' : (d.state==='no' ? 'not demonstrated' : (d.state==='na' ? 'not needed' : (d.id==='attempt' ? 'recorded; independent work not assessed' : (d.id==='constraints' ? 'checks pending' : 'partly')))); }
/* Plain-text and JSON exports of the trail. Valid only because records hold plain data (no DOM nodes, no SCENARIOS references). */
function trailText(){
  var res = S.result || {}, p = S.plan || {}, lines = [];
  lines.push('Flowline — thinking trail', 'Content version '+CONTENT_VERSION+' · '+new Date().toISOString().slice(0,10)+' · practice score '+res.score+' / '+res.max+' · '+res.rank, '');
  SCENARIOS.forEach(function(sc, si){
    var r = S.scens[si]; if(!r) return;
    lines.push(sc.title+' — '+Math.max(0, r.kept-r.given)+' / '+scenMax(sc)+' practice points');
    if(r.dims) r.dims.forEach(function(d){ lines.push('  · '+d.label+': '+d.text+(d.evidence ? ' — '+d.evidence : '')); });
    r.trail.forEach(function(e){
      lines.push('['+e.k+'] '+e.label+' · '+(CLS[e.cls] || e.cls)+' · '+(e.pts>0 ? '+' : '')+e.pts+(e.claimId ? ' · ['+claimTag(r, e.claimId)+']' : '')+(e.prov ? ' · '+PROV[e.prov] : '')+(e.reasonKind ? ' · '+REASON_KIND[e.reasonKind].label : ''));
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
  /* The denominator is the dimensions actually in play. A dimension the game itself declared "not applicable" — "Revision explained:
     not needed — first result held" — must not be counted against the learner here when the debrief did not count it either; the two
     screens report the same run and have to agree. Same filter as debriefScreen's `shown`. */
  var dimsShown = dimsAll.filter(function(x){ return x.d.state!=='na'; });
  /* Rank is read off the points percentage and gated by the dimensions: Chief needs every dimension in play demonstrated
     in this scenario, so no blurb can say more than the trail shows. A run that clears the percentage but not the gate drops one rank. */
  var gate = dimsShown.length > 0 && dimsShown.every(function(x){ return x.d.state==='yes'; });
  var ri = 0; while(ri < RANKS.length-1 && pct/100 < RANKS[ri].min) ri++;
  if(ri===0 && !gate) ri = 1;
  var rank = RANKS[ri];
  S.result = {score:net, max:max, rank:rank.name, pct:pct};
  var earned = S.flags;
  var best = loadBest(), isBest = !best || net > best.score;
  if(isBest) saveBest({v:CONTENT_VERSION, score:net, max:max, rank:rank.name, date:new Date().toISOString().slice(0,10)});
  var demo = dimsShown.filter(function(x){ return x.d.state==='yes'; }).length;
  var notDemo = dimsShown.filter(function(x){ return x.d.state==='no' || x.d.state==='partial'; });
  var naDims = dimsAll.length - dimsShown.length;
  try{ console.assert(JSON.stringify(S.scens), 'records are not plain data'); }catch(e){ console.error('records are not plain data', e); }

  var confetti = h('div', {class:'confetti', 'aria-hidden':'true'});
  if(!reduceMotion && pct >= .5*100){ for(var i=0;i<40;i++){ var c = h('i'); c.style.left = Math.random()*100+'%'; c.style.background = ['var(--learner)','var(--ai)','var(--anchor)','var(--water)'][i%4]; c.style.animationDelay = (Math.random()*1.2)+'s'; c.style.animationDuration = (2.2+Math.random()*1.4)+'s'; confetti.appendChild(c);} }

  var trailNode = h('div', {class:'trail'}, h('h3', null, 'Your thinking trail'), h('p', {class:'note'}, 'Everything you decided, in order, and where each line came from. This is the record P-FACET exists to produce.'));
  SCENARIOS.forEach(function(sc, si){
    var r = S.scens[si]; if(!r) return;
    var box = h('div', {class:'trail-scen'}, h('h4', null, sc.title+' — '+Math.max(0,r.kept-r.given)+' / '+scenMax(sc)+' practice points'));
    if(r.dims) box.appendChild(h('div', {class:'dims-line'}, r.dims.map(function(d){ return h('span', {class:'d '+d.state}, d.label+': '+dimShort(d)); })));
    r.trail.forEach(function(e){
      var kcls = e.k==='P'?'p':(e.k==='C'?'c':''); if(e.given || e.cls==='sub') kcls = 'x';
      box.appendChild(h('div', {class:'tr'}, h('b', {class:'k '+kcls, text:e.k}), h('div', null,
        h('span', {class:'lab'}, e.label, e.claimId ? h('code', {class:'cid'}, '['+claimTag(r, e.claimId)+']') : null, h('span', {class:'cls '+e.cls}, CLS[e.cls]), e.prov ? h('span', {class:'prov'}, PROV[e.prov]) : null, e.reasonKind ? h('span', {class:'rkind '+e.reasonKind}, REASON_KIND[e.reasonKind].label) : null, ' ', h('span', {style:'color:var(--muted)'}, (e.pts>0?'+':'')+e.pts)),
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
        h('div', {class:'stat'}, h('h3', null, 'Demonstrated'), h('div', {class:'bignum'}, demo, h('small', null, ' / '+dimsShown.length+' dimensions')), h('div', {class:'sub'}, (notDemo.length ? 'Still open: '+notDemo.map(function(x){ return x.d.label.toLowerCase()+' — '+(x.d.state==='partial' ? 'partly demonstrated' : 'not demonstrated'); }).join('; ') : 'every dimension in play')+(naDims ? ' · '+naDims+' dimension'+(naDims===1?'':'s')+' not applicable to this run, and not counted' : '')))
      ),
      h('div', {class:'badges'}, BADGES.map(function(b){ return h('div', {class:'badge'+(earned[b.id]?'':' locked'), title:b.desc}, h('span', {class:'ico'}, b.ico), h('span', null, b.name, h('small', null, earned[b.id]?b.desc:'Missed — '+(S.miss[b.id] || b.desc)))); }))
    ),
    trailNode,
    h('p', {class:'note keep-note'}, 'This trail lives in this browser only. Copy, download or print it; nothing is uploaded.'),
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
