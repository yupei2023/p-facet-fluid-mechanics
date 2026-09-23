/* Flowline — the game for P-FACET for Simple Fluid Mechanics.
   The P-FACET Model © Yupei Duan & Danielle Oprean, University of Missouri.
   Vanilla JS, no dependencies. All content lives in SCENARIOS near the top; edit there to re-skin.
   Simplified Chinese edition. Logic, identifiers, ids and constants match docs/game.js; only learner-visible text is translated. */
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
      ? '示意图（迁移布置）：同样的 300 毫米主管和 150 毫米消火栓支管，但消防泵车已停止运行——水带已拆下，消火栓大出水口已封盖，65 毫米侧出水口敞开，向街面喷出一股射流，射流中置有一支皮托管压力计。'
      : '示意图：一根 300 毫米给水主管位于敞开的管沟中，经光滑渐缩管收缩为 150 毫米消火栓支管，支管向上接至消火栓。300 毫米一侧的压力表读数为 380 千帕；150 毫米支管中的压力以问号标出，是待求的未知量。消火栓通过水带与消防泵车相连，泵正在运行，因此支管处没有任何部分与大气相通。消火栓的 65 毫米侧出水口已封盖。') + '">'
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
        ? '<text x="12" y="34" fill="var(--anchor)" font-weight="700">泵车运行结束后</text>'
          + '<text x="12" y="50">水带已卸 · 大出水口已封盖</text>'
          + '<text x="12" y="66" fill="var(--anchor)">65 mm 侧出水口向街面敞开</text>'
          + '<text x="12" y="82">皮托管置于射流中</text>'
          + '<text x="336" y="82">消防泵车</text>'
        : '<text x="150" y="62" fill="var(--anchor)">此处无任何部分与大气相通</text>'
          + '<text x="336" y="82">消防泵车</text>'
          + '<text x="114" y="122">65 mm 侧口已封盖</text>')
    + '<text x="76" y="143">p₁ = 380 kPa 表压</text>'
    + (t ? '' : '<text x="178" y="178" fill="var(--anchor)" font-weight="700">p₂ = ?</text>')
    /* baseline 222, not 220: the main is a 26 px stroke centred on y=200, so its underside is y=213 and cap tops
       at 220 would graze it. Descenders still clear the trench floor at y=226. */
    + '<text x="16" y="222">① D₁ = 300 mm</text>'
    /* x=196, not 140: the caption belongs under the 150 mm lateral it names (which starts at x=182), not under the 300 mm main. */
    + '<text x="196" y="222">② D₂ = 150 mm</text>'
    + '<text x="10" y="238">V₁ = 2.0 m/s · 沟内水平布置 · 光滑渐缩管</text>'
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
  id:'hydrant', title:'格林德斯通路流量测试', level:'良构问题 · 预计九分钟', art:ART.hydrant, artT:ART.hydrantT, icon:ICONS.hydrant,
  blurb:'伯努利方程与连续性方程。两行代数——外加一个决定这个数字有没有意义的假设。',
  protected:'支管处是否为自由射流的判断、流速水头项的大小，以及对照 140 kPa 下限作出的"可以 / 停止"结论',
  intro:'消防部门正在进行一次验收流量测试。一根 300 mm 主管在消火栓处为末端，经渐缩管收缩为 150 mm 支管，因此全部测试流量都进入这根支管；两个测压点位于渐缩管两侧的同一段水平管上。消防泵车已接好并按计划流量抽水；两个测压点之间没有水泵。在计划流量下，主管流速为 2.0 m/s，上游压力表读数为 380 kPa；工程师以 140 kPa 为下限。支管上没有压力表。她问："那根支管的压力会是多少？"',
  goal:'求出计划流量下 150 mm 支管中的表压，并与情景中供水公司规定的 140 kPa 下限作比较。这只检验一个建模的管段，不是整个管网，也不是批准进行实际测试。',
  givens:['D₁ = 300 mm 主管，D₂ = 150 mm 支管；主管在消火栓处为末端。两个测压点位于同一段水平管上——z₁ = z₂。光滑渐缩管，忽略损失',
          'V₁ = 2.0 m/s，计划测试流量下 300 mm 主管中的流速',
          'p₁ = 380 kPa（表压），上游测压点；测试出流期间的下限为 140 kPa（表压）',
          'ρ = 1000 kg/m³，g = 9.81 m/s²。下游：支管继续通向消火栓，消火栓与消防泵车相连，泵正在运行。65 mm 侧出水口已封盖。'],
  P:{ q:'用你自己的话说——你在解决什么问题？它为什么重要？',
      opts:[
        {t:'预测计划流量下的支管压力，并检查这个建模管段是否满足规定的 140 kPa 下限。', v:'best', fb:'一个关系式，一个规定的阈值。满足这个局部判据并不能验证整个管网各处的压力。'},
        {t:'计算渐缩管两端的压降。', v:'ok', fb:'对，但不完整——压降不是压力，而压力也还不是结论。'},
        {t:'查一下 300 mm 主管在流量测试期间能维持多大的剩余压力。', v:'weak', fb:'没有这样的表：主管能维持多大压力取决于你从中抽走多少流量。把问题说错，正是 AI 替你选择问题的开始。'}
      ]},
  F:{ q:'下面哪些属于你的问题界定？选出一个好答案必须遵守的内容。', min:3,
      items:[
        {t:'在求任何压力之前，连续性方程先定下两个流速：Q = A₁V₁ = A₂V₂，其中 A = πD²/4——所以直径减半，流速变为四倍。', key:true, why:'流速不是自由输入量：直径和 V₁ 已经把它们定死了。'},
        {t:'能量方程：p₁/γ + V₁²/2g + z₁ = p₂/γ + V₂²/2g + z₂。同一段水平管，所以 z₁ = z₂；代入表压，得出表压。', key:true, why:'控制方程，加上几何条件为你赢得的简化。'},
        {t:'在暴露于空气的理想射流处，静压近似等于大气压。对于封闭管段，压力要由流动条件求出。', key:true, why:'答案取决于的那个判断——它是关于布置的事实，而不是关于方程的。'},
        {t:'约束：把建模得到的支管压力与规定的 140 kPa 下限作比较；结论只限于这个管段。', key:true, why:'工程师正在等的那个判据。'},
        {t:'支管是水离开渐缩管的地方，所以取 p₂ = 0（表压）——这是收缩段的标准假设。', key:false, why:'那是喷嘴向空气出流时的假设。在 C 阶段留意它。'}
      ]},
  A:{ mq:'你的尝试用的是哪条控制原理？',
      methods:[
        {t:'用连续性方程 Q = A₁V₁ = A₂V₂ 求 V₂，再沿水平管段列能量方程，把 p₂ 作为未知量解出。', ok:true, short:'连续性方程求 V₂，再沿水平管段用伯努利方程解出 p₂',
         fb:'两步都在——而且你把 p₂ 留作待求量，而不是假定它。这个承诺正是助手接下来要攻击的地方。'},
        {t:'渐缩管是水平的，长度不到一米，所以什么都不变：p₂ = p₁。', ok:false, short:'水平且短，所以 p₂ = p₁',
         fb:'高程不是唯一会改变压力的因素。支管流速快了四倍，这份速度是用压力换来的——不过你做出了尝试，现在你知道该检验什么了。'},
        {t:'对管件列动量方程：ΣF = ṁ(V₂ − V₁)，再从力的平衡反推 p₂。', ok:false, short:'对渐缩管列动量方程，从力的平衡反推 p₂',
         fb:'动量方程在两个压力都已知时给出支承力——它把 p₂ 当作输入量。伯努利方程给压力；动量方程给力。'},
        {t:'用厂家给出的 300 × 150 渐缩管 K 值来求压力变化。', ok:false, short:'厂家给出的 300 × 150 渐缩管 K 值',
         fb:'K 值给出的是损失，而这里已规定损失可忽略。渐缩管两端的变化是压强水头与流速水头之间的可逆交换——工程师的直觉，却指向了错误的项。'}
      ],
      eq:'你对 p₂（150 mm 支管中的表压）的估算：',
      /* Each estimate carries the working the learner would paste into a request ({work}) and, if it is off, the critique the
         assistant makes of THAT number in E (claim), which takes attemptSlot. s = the slip, revealed only after the pick.
         Two invariants: no chip slip coincides with a planted claim, and no chip critique states a value for p₂ — each one
         corrects the learner's intermediate and stops there, so the reply never contradicts itself and never breaks the
         boundary the bounded request just drew. */
      ests:[
        {t:'320 kPa', s:'流速水头里漏掉了 ½，所以算出的压降正好是伯努利方程给出值的两倍', ok:false,
         work:'A₁ = π(0.300)²/4 = 0.0707 m²，A₂ = π(0.150)²/4 = 0.0177 m²；V₂ = 4V₁ = 8.0 m/s；Δp = ρ(V₂² − V₁²) = 1000 × (64 − 4) = 60 000 Pa = 60.0 kPa；p₂ = 380 − 60.0 = 320 kPa（表压）',
         claim:{t:'在为所选估算值 320 kPa 提供的路线中，Δp = ρ(V₂² − V₁²)。流速水头是 ½ρV²——写成水头形式是 V²/2g——所以这里漏了 ½：½ρ(V₂² − V₁²) = 30.0 kPa，那条路线把压降算成了两倍。请你自己重新计算该管段的压力。', type:'ok', best:'accept',
           reasons:[{t:'流速水头是 ½ρV²，或以米计的 V²/2g——所提供的路线漏掉了 ½，把压降算成了两倍。', kind:'valid_evidence'},
                    {t:'拒绝——½ 只属于水头形式；在压力形式里这一项是 ρV²，所以 320 kPa 成立。', kind:'invalid_technical_reason'},
                    {t:'接受——助手的代数比我做得好。', kind:'unsupported_authority'}],
           explain:'对所选估算值所提供路线的正确评析。½ρV² 和 V²/2g 是同一项，分别以压力和水头表示——把水头形式乘以 γ = ρg，½ 在换算中依然保留。那条听起来很具体的拒绝理由，编造了一个并不存在的"压力形式"。'}},
        {t:'350 kPa', s:'p₂ = p₁ + ½ρ(V₁² − V₂²) = 380 − 30.0', ok:true,
         work:'A₁ = π(0.300)²/4 = 0.0707 m²，A₂ = π(0.150)²/4 = 0.0177 m²——D 减半则 A 为四分之一，所以 V₂ = 4V₁ = 8.0 m/s，Q = 0.141 m³/s = 141 L/s。水平，所以 z 抵消：p₂ = p₁ + ½ρ(V₁² − V₂²) = 380 000 + 500 × (4 − 64) = 350 000 Pa = 350 kPa（表压）。我把 p₂ 当作未知量而不是零——这是我最没把握的部分'},
        {t:'374 kPa', s:'流速按直径而不是按面积缩放——V₂ 算成了 4.0 m/s 而不是 8.0', ok:false,
         work:'V₁ = 2.0 m/s；支管直径是一半，所以 V₂ = 2 × 2.0 = 4.0 m/s；Δp = ½ρ(V₂² − V₁²) = 500 × (16 − 4) = 6000 Pa = 6.0 kPa；p₂ = 380 − 6.0 = 374 kPa（表压）',
         claim:{t:'为所选估算值 374 kPa 提供的路线用了 V₂ = 4.0 m/s。连续性方程是 A₁V₁ = A₂V₂，而面积与直径的平方成正比：D 减半则 A 为四分之一，所以 V₂ = 4V₁ = 8.0 m/s。那条路线里支管的流速水头小了四倍——应为 3.26 m 却算成 0.82 m——又因为要从中减去 V₁²，算出的压降小了五倍，而不是四倍。', type:'ok', best:'accept',
           reasons:[{t:'A = πD²/4，所以 A₁/A₂ = (D₁/D₂)² = 4，V₂ = 4V₁ = 8.0 m/s。流量平衡可以证实：0.07069 × 2.0 和 0.01767 × 8.0 都是 0.1414 m³/s，而 0.01767 × 4.0 只有 0.0707。', kind:'valid_evidence'},
                    {t:'拒绝——不可压缩流体的连续性方程是按直径写的，D₁V₁ = D₂V₂，所以 4.0 m/s 是对的。', kind:'invalid_technical_reason'},
                    {t:'接受——374 kPa 相对 140 kPa 下限的余量更大，这是能让测试进行下去的答案。', kind:'convenience'}],
           explain:'对所选估算值所提供路线的正确评析，而且是最有力的一种：连续性方程会自我校核。每一秒必须有同样多的水通过两个断面，而那条路线的流量平衡不成立——进 0.1414 m³/s，出 0.0707。体积是通过面积流过的，不是通过直径。至于"余量更大"，那是对答案的偏好，不是关于答案的证据。'}},
        {t:'410 kPa', s:'流速水头之差被加上而不是减去，于是又快又窄的管段反而成了高压段', ok:false,
         work:'V₂ = 4V₁ = 8.0 m/s；Δp = ½ρ(V₂² − V₁²) = 500 × 60 = 30 000 Pa = 30.0 kPa；支管更窄，所以压力升高：p₂ = 380 + 30.0 = 410 kPa（表压）',
         claim:{t:'为所选估算值 410 kPa 提供的路线让压力经过渐缩管后升高了。伯努利方程沿一条流线用压强水头换取流速水头：支管流速快了四倍，所以支管必然是压力较低的管段。那条路线里流速项的大小是对的——只是放在了方程错误的一边，把它移回去是你该做的一步。', type:'ok', best:'accept',
           reasons:[{t:'这里 p/γ + V²/2g 为常数；V²/2g 从 0.20 m 升到 3.26 m，所以 p/γ 必须下降同样的 3.06 m。', kind:'valid_evidence'},
                    {t:'拒绝——把水挤进更小的管子会压缩它，所以压力升高；这就是为什么喷嘴需要高压管件。', kind:'invalid_technical_reason'},
                    {t:'接受——助手对方向听起来很确定。', kind:'unsupported_authority'}],
           explain:'对所选估算值所提供路线的正确评析。总和是常数，所以一项增加，另一项就减少。在这样的压力下水不会被压缩；喷嘴需要牢固的管件，是因为其上游的压力，而不是喉部的压力。'}}
      ],
      estfb:{ok:'{est}：V₂ = 8.0 m/s，流速水头耗掉 30 kPa——表压 350 kPa，高出下限 210。你把 p₂ 当作了未知量，而不是零。你确定吗？看看支管接下来通向哪里。',
             bad:'你记录了 {est}：{slip}。在这个阶段偏离没关系；这是咨询的理由，不是跳过的理由。'}},
  C:{ gap:{ok:'你已有 V₂ = 8.0 m/s，p₂ ≈ {est}。你的疑问：支管是否向大气出流。工程师正在等"可以"还是"停止"。',
           bad:'你已由连续性方程得到支管流速，p₂ ≈ {est}，但你对它有疑问。你也不确定支管是否向大气出流。工程师正在等"可以"还是"停止"。'},
      /* The learner's attempt travels as the attached card above the options, not restated inside each one; the bounded / leaky
         distinction lives in the JOB and BOUNDARY clauses. Order is shuffled at render, so position is never the tell. */
      prompts:[
        {t:'一根流速 2.0 m/s 的 300 mm 主管经渐缩管在末端接入 150 mm 消火栓支管；上游压力表读数 380 kPa。求支管压力，并告诉我流量测试能否在 140 kPa 以上进行。写出所有步骤。', kind:'sub', fb:'这把全部目标工作都交了出去——计算、背后的假设，以及给现场人员的答案。就算它答对了，也没有一样是你的。'},
        {t:'附上我的尝试——思路与估算值 {est}。我说不准支管是否向大气出流，也还没有决定这个数字对照 140 kPa 下限意味着什么。请逐步检查，纠正所有错误，重新计算 p₂，并告诉我他们能否进行测试。', kind:'unb', fb:'很细致，也附上了你的尝试——但"纠正所有错误……重新计算 p₂……告诉我能否进行测试"把数字和结论都交了出去。细致不等于边界。'},
        {t:'附上我的尝试——思路与估算值 {est}。缺口：我不确定支管是否向大气出流——p₂ 是零还是未知量。评析我的设定和这个假设；指出错误假设、单位失误或遗漏的约束。不要重新计算 p₂，也不要告诉我是否进行测试——那是我来决定的。', kind:'bnd', fb:'展示了尝试，点明了缺口，说明了 AI 的任务，划定了边界。思考仍然是你的；助手成了评论者。'},
        {t:'能帮我检查一下流量测试的计算吗？别直接把答案给我。', kind:'vag', fb:'边界是有了，但你没有点明缺口，也没有给助手任何任务——所以它会去猜，而且多半还是会把整道题做完。'}
      ],
      parts:[
        {l:'我的尝试', t:'我的尝试（附上）：思路与估算值 {est}。', need:true},
        {l:'那一个缺口', t:'我不确定 150 mm 支管是否算作向大气出流——p₂ 是零，还是我必须解出的未知量。', need:true},
        {l:'AI 的任务', t:'评析我的设定和这个假设；指出任何错误假设、单位失误或遗漏的约束。', need:true},
        {l:'边界', t:'不要重新计算 p₂，也不要告诉我是否进行测试——那是我来决定的。', need:true},
        {l:'诱人的附加句', t:'然后直接告诉我支管压力，以及它是否高于 140 kPa。', need:false}
      ],
      whole:'没问题。先看连续性：A₁ = π(0.300)²/4 = 0.0707 m²，A₂ = π(0.150)²/4 = 0.0177 m²，因此在 V₁ = 2.0 m/s 时，支管流速 V₂ = 4V₁ = 8.0 m/s，测试流量 Q = A₁V₁ = 0.141 m³/s = 141 L/s。接下来，150 mm 支管是水离开渐缩管的地方，因此它是处于大气压下的自由射流：p₂ = 0（表压）。取 p₂ = 0，由伯努利方程得 V₂ = √(V₁² + 2p₁/ρ) = √(4.0 + 760) = 27.6 m/s，所以这个消火栓实际出流量 Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s。488 L/s 是仓库 95 L/s 消防流量要求的五倍有余，所以剩余压力没问题，队员可以让测试全开进行。要我把这两行写进流量测试记录表吗？',
      /* Whole-task reply, decomposed for E. Each claim is copied verbatim out of `whole` (checked at load). */
      wholeClaims:[
        {t:'先看连续性：A₁ = π(0.300)²/4 = 0.0707 m²，A₂ = π(0.150)²/4 = 0.0177 m²，因此在 V₁ = 2.0 m/s 时，支管流速 V₂ = 4V₁ = 8.0 m/s，测试流量 Q = A₁V₁ = 0.141 m³/s = 141 L/s。', type:'ok', best:'accept',
         reasons:[{t:'Q = A₁V₁ = A₂V₂，A = πD²/4——流速和流量我都能自己复现。', kind:'valid_evidence'},
                  {t:'修订——V₂ 应为 4.0 m/s，因为流速随直径缩放。', kind:'invalid_technical_reason'},
                  {t:'它与 AI 的其他数字一致，所以一定是对的。', kind:'unsupported_authority'}],
         /* Its own explanation, not c1\'s: the reasons offered on this route are the diameter-scaling misconception and internal
            consistency, and neither is what c1\'s centreline paragraph answers. */
         explain:'正确的论断——也是这份回复中唯一站得住的一句。证据是你可以自己算的流量平衡：0.0707 × 2.0 和 0.01767 × 8.0 都是 0.141 m³/s。"流速随直径缩放"会给出 V₂ = 4.0 m/s，出去的流量只有进来的一半——那根本不是连续性。而内部一致也不是证据：这份回复的其余部分同样自洽，却是错的。记住这个 8.0 m/s——它正是能戳破下一句的校核。'},
        {t:'150 mm 支管是水离开渐缩管的地方，因此它是处于大气压下的自由射流：p₂ = 0（表压）。取 p₂ = 0，由伯努利方程得 V₂ = √(V₁² + 2p₁/ρ) = √(4.0 + 760) = 27.6 m/s，所以这个消火栓实际出流量 Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s。488 L/s 是仓库 95 L/s 消防流量要求的五倍有余，所以剩余压力没问题，队员可以让测试全开进行。', type:'assumption', best:'reject',
         reasons:[{t:'断面 2 处没有任何部分与大气相通；支管继续通向与泵车相连的消火栓。而且由已知条件按连续性方程定下 V₂ = 8.0 m/s、Q = 141 L/s，27.6 m/s 和 488 L/s 与之矛盾。', kind:'valid_evidence'},
                  {t:'修订——保留 p₂ = 0 和 488 L/s，只是说得更严谨些：一旦出流量满足了所需消防流量，剩余压力自然跟着满足，因为流量和剩余压力是同向变化的。', kind:'invalid_technical_reason'},
                  {t:'接受——488 L/s 加上全开测试，正是能让这个消火栓通过验收的答案。', kind:'convenience'}],
         explain:'预设错误：一个错误假设，正是这道题的核心——而且它得出的结论还叠在上面。"大气压"是与空气相通的水的属性，不是示意图上最后一个断面的属性，而这根支管继续通向一个与运行中的泵相连的消火栓。两条反驳，都不需要新的物理知识：布置这一事实，以及回复自己的算术——它第一句已定下 V₂ = 8.0 m/s，而 27.6 m/s 是这个流速的三倍半，中间却没有任何地方补进水来。结论比假设更糟：流量和剩余压力朝相反方向变化，所以满足消防流量要求永远不能证明压力下限得到满足。它根本没有触及你界定的判据——支管中的 140 kPa。'}
      ],
      /* Reasons for excluding (or holding) the uninvited paragraph in E; the scope reason is shared and lives in uninvitedClaim(). */
      uninvitedReasons:{unsupported:'无依据——它给出了"进行测试"的结论，却从未把任何数字与 140 kPa 下限作比较。',
                        violates:'它违反了我的问题界定：一个断面是否处于大气压，是关于布置的事实，而这根支管继续通向一个与泵车相连的消火栓。'},
      uninvitedExplain:'你没有要求这个，而它替你决定了你唯一保留的那件事。排除它——或者搁置它，直到你有了一个可以放心对照 140 kPa 下限的 p₂——正是设边界要实现的补救。在 T 阶段留意它。',
      reply:'对所选示例路线的脚本化评析（输入的计算不作评估）：',
      /* What the assistant adds when the request left a door open. It does not compute; it decides — and that decision is the trap waiting in T. */
      uninvited:'另外，省得你再打无线电：出水口处于大气压，支管没什么可担心的——告诉她全开进行测试吧。',
      /* Evidence-tray item each claim points at ("Check a reference"), keyed by the id suffix. */
      hints:{c1:'cont', c2:'jet', w1:'cont', w2:'jet', 'est-0':'head', 'est-2':'cont', 'est-3':'bern', uninv:'jet'},
      /* Bounded return consultations: the learner's question and a critique-only reply — no new number, no verdict. */
      followups:{
        /* No boundary tail here: the fixed sentence appended at send time already carries it (see returnToC). */
        'hydrant-c2':{q:'说明一个断面可以取为大气压的条件，并说明这里 150 mm 支管的下游是什么。',
          reply:'在暴露于空气的理想自由射流或自由液面处，静压近似等于大气压。上游的封闭管段不会仅仅因为下游有一个出口就被固定在这个压力。150 mm 支管是封闭的：它继续通向消火栓，而消火栓与泵正在运行的消防泵车相连，所以那里的水是封闭的，其压力由能量方程决定。我那句"自由射流"描述的是向街面敞开的消火栓出水口，而不是这个断面。我没有重新计算 p₂。'},
        'hydrant-w2':{q:'两件事：说明一个断面可以取为大气压的条件并说明支管的下游是什么；再说明满足消防流量要求的出流量能否证明剩余压力下限得到满足。',
          reply:'第一点：在暴露于空气的理想自由射流处，静压近似等于大气压；这并不能把上游的封闭管段固定在同一压力。150 mm 支管是封闭的；它继续通向消火栓，而消火栓与泵正在运行的消防泵车相连，所以那里的水是封闭的。第二点：不能。流量和剩余压力朝相反方向变化——消火栓出流越多，留在其后的压力越低——所以一个流量数字说明不了压力下限是否得到满足。这是对照两个不同判据的两项独立检查，而我那句话用的出流量，是从一个假定的边界推出来的，而不是你的连续性方程给出的那个。没有新数字，也没有结论。'},
        'hydrant-uninv':'hydrant-w2'
      },
      attemptSlot:0,
      claims:[
        {tAI:'这种布置下，连续性在任何压力之前就已确定：A₁ = π(0.300)²/4 = 0.0707 m²，A₂ = π(0.150)²/4 = 0.0177 m²，因此在 V₁ = 2.0 m/s 时，支管流速 V₂ = 4V₁ = 8.0 m/s。将管段视为水平、从而消去高程项，也是正确的。',
         t:'为所选估算值 350 kPa 提供的连续性路线是正确的：A₁ = π(0.300)²/4 = 0.0707 m²，A₂ = π(0.150)²/4 = 0.0177 m²，因此在 V₁ = 2.0 m/s 时，支管流速 V₂ = 4V₁ = 8.0 m/s。将管段视为水平、从而消去高程项，也是正确的。', type:'ok', best:'accept',
         reasons:[{t:'A = πD²/4 使面积比等于直径比的平方，所以 V₂ = 8.0 m/s；两个测压点在同一段水平管上。', kind:'valid_evidence'},
                  {t:'修订——高程项只在直径相等时才抵消；渐缩管会带来 75 mm 的管中心线落差。', kind:'invalid_technical_reason'},
                  {t:'它和我的数字一致，所以一定是对的。', kind:'unsupported_authority'}],
         explain:'正确的论断。证据是流量平衡和布置，而不是"一致"——模型的赞同只是同一个来源用了两次。这里的渐缩管是同心的，管轴不会移动：没有什么管中心线落差需要加上。'},
        {tAfterCritique:'关于所选路线的第二点：150 mm 支管是水离开渐缩管的地方，因此它是处于大气压下的自由射流——p₂ = 0（表压），而不是未知量。取 p₂ = 0，由伯努利方程得 V₂ = √(V₁² + 2p₁/ρ) = √(4.0 + 760) = 27.6 m/s，所以这个消火栓实际出流量 Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s。',
         t:'不过，关于所选路线有一点：150 mm 支管是水离开渐缩管的地方，因此它是处于大气压下的自由射流——p₂ = 0（表压），而不是未知量。取 p₂ = 0，由伯努利方程得 V₂ = √(V₁² + 2p₁/ρ) = √(4.0 + 760) = 27.6 m/s，所以这个消火栓实际出流量 Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s。', type:'assumption', best:'reject',
         reasons:[{t:'断面 2 处没有任何部分与大气相通；支管继续通向与泵车相连的消火栓。而且由已知条件按连续性方程定下 V₂ = 8.0 m/s，27.6 与之矛盾。', kind:'valid_evidence'},
                  {t:'修订——渐缩管出口处的断面是缩脉，而缩脉总是处于大气压；保留 p₂ = 0 和 488 L/s。', kind:'invalid_technical_reason'},
                  {t:'接受——488 L/s 正是能让这个消火栓通过验收、让大家都离开管沟的数字。', kind:'convenience'}],
         explain:'预设错误：正是这道题所针对的那个错误假设。"大气压"是与空气相通的水的属性，不是你示意图上最后一个断面的属性——而这根支管继续通向一个与运行中的泵相连的消火栓。两条彼此独立的反驳，都不需要新的物理知识：布置这一事实，以及情景的流量平衡，因为连续性方程已定下 V₂ = 8.0 m/s，而 27.6 m/s 是这个流速的三倍半，中间却没有任何地方补进水来。（缩脉也并非"总是处于大气压"：它的压力取决于它周围是什么——在管内，就是管内的压力。）'}
      ]},
  T:{ iq:'整合：泵车运行结束，水带已卸。队长封住大出水口，打开 65 mm 侧出水口向街面出流，以便读取皮托管读数。现在怎么办？',
      opts:[
        {t:'原先支管压力为 350 kPa（表压），高出规定下限 210。新的布置需要重新计算。在敞开的侧出水口处，射流静压近似为 0（表压）；皮托管测得的是高于此值的滞止压力，理想情况下高出 ½ρV²。仅凭这一边界假设并不能验证一次测量。', ok:true,
         fb:'正确：辨明实际的断面及其周围环境，并让每个结果都与它所属的布置绑定。射流静压和皮托管滞止压力是不同的量。真实的流量估算还需要合适的出口系数和规范读取的读数；这两者在这里都没有得到验证。'},
        {t:'我在支管处拒绝了大气压假设，所以在侧出水口处也不会用它：皮托管读数不可用，测试没有流量数据。', ok:false, trap:true,
         fb:'矫枉过正：不要因为一个有用的边界条件曾被误用就把它禁掉。在暴露的射流中，静压近似等于大气压。在皮托管开口处流动滞止，所以那里测得的压力更高。'},
        {t:'两者都与大气相通，所以各处 p = 0：支管没有承压，消火栓出流量为 488 L/s。', ok:false,
         fb:'预设错误一路活到了流量测试记录表上：一个是你自己连续性方程三倍半的消防流量，另一个是会让一根实际处于 350 kPa 的主管停止测试的支管读数。'}
      ],
      tq:'迁移：你会把什么带到下一道伯努利方程题——以及 FE 考试中去？',
      topts:[
        {t:'在把任何压力设为零之前，我会先追踪管道接下来通向哪里——而且我会请 AI 攻击这个判断，绝不让它替我做判断。', v:'best', fb:'整套流程浓缩成一句话，而且可迁移：假设要对照布置来检验，而检验权留在你手里。在 FE 考试上这花五秒钟，却能救下一整道题。'},
        {t:'我会始终用两种方式计算流速水头项——以米水柱和以千帕——并让它们一致。', v:'ok', fb:'一个值得保持的真实习惯——通向同一项的两条路线必须一致。不过它抓不住今天的错误：再多的单位规范也标不出一个从图纸边缘读出来的边界。'},
        {t:'如果一个断面位于管道末端，p = 0（表压）。我就把这当作规则。', v:'weak', fb:'这恰恰是今天失效的那条规则。"管道末端"说的是图纸；"与空气相通"说的是水。'}
      ]},
  outsideEst:'0 kPa（表压）',
  evidence:[
    {id:'cont', kind:'equation', title:'连续性方程',
     body:'Q = A₁V₁ = A₂V₂，其中 A = πD²/4。面积与 D² 成正比，所以直径减半，面积变为四分之一，流速变为四倍。',
     cond:'恒定流、不可压缩、一进一出；D 以米计。承载流量通过的是面积，不是直径——D₁V₁ = D₂V₂ 不是定律。',
     action:{type:'calc', prompt:'150 mm 支管中的 V₂', unit:'m/s', expect:8.0, tol:0.15}},

    {id:'bern', kind:'equation', title:'能量方程（伯努利方程），水平管段',
     body:'p₁/γ + V₁²/2g + z₁ = p₂/γ + V₂²/2g + z₂。当 z₁ = z₂ 时，即 p₂ = p₁ + ½ρ(V₁² − V₂²)。',
     cond:'恒定流、不可压缩、无轴功、沿一条流线忽略损失；两个压力取同一基准。它给出的是某一断面处的压力——并不告诉你该断面是否与空气相通。',
     /* tol 1.5, not 3: dropping the upstream velocity head — p₂ = p₁ − ½ρV₂², the reservoir form of Bernoulli carried over
        by habit — gives 380 − 32.0 = 348.0 kPa, which ±3 would pass silently. Both legitimate routes land on 350.0 exactly. */
     action:{type:'calc', prompt:'p₂，以 kPa 表压计', unit:'kPa', expect:350, tol:1.5}},

    {id:'head', kind:'equation', title:'流速水头的两种写法',
     body:'以米水柱计的 V²/2g，或以帕斯卡计的 ½ρV²——同一项，分别以水头和压力表示。把水头形式乘以 γ = ρg = 9.81 kN/m³ 就得到压力形式；½ 在换算中依然保留。以米计的水头，在乘以 γ 之前，还不是以 kPa 计的压力。',
     cond:'ρ = 1000 kg/m³，g = 9.81 m/s²。不存在"没有 ½ 的压力形式"。水头只有通过 γ 才变成压力：h 米 × 9.81 kPa 每米。只把水头乘以 ρ 根本不是压力——(kg/m³)(m) 是 kg/m²，而帕斯卡是 kg/(m·s²)——它丢掉的因子正是 g = 9.81，表面上"少了十倍"就是从这里来的。',
     action:{type:'calc', prompt:'流速水头之差 V₂²/2g − V₁²/2g', unit:'m', expect:3.06, tol:0.1}},

    {id:'jet', kind:'reference', title:'什么时候一个断面处于大气压？',
     body:'在暴露于周围空气的理想自由射流处，或与空气相通的自由液面处，静压近似等于大气压。在封闭的管段中，压力是需要计算的未知量；它可能恰好等于大气压，但封闭本身并不能固定它的值。',
     cond:'辨明确切的断面及其周围环境。一个通大气的出口并不能使上游管道处于大气压。在射流中，皮托管测得的是滞止压力，理想情况下比静压高 ½ρV²。真实的流量估算还需要合适的出口系数。',
     note:'这就是本情景所取决于的那个判断。'},

    {id:'resid', kind:'reference', title:'流量测试期间的剩余压力下限',
     body:'在本练习中，供水公司规定建模支管断面处的下限为 140 kPa（表压）。将计算得到的局部压力与这一给定判据作比较。这个计算并不能确定管网其他位置的最低压力，也不能批准现场操作。',
     cond:'对于给定的供水布置，出流量越大，剩余压力一般越低。满足出流量目标并不能证明压力判据得到满足：两者要分别检查。',
     action:{type:'compare', fields:[{l:'你算出的 p₂', unit:'kPa 表压'}, {l:'你所依据的下限', unit:'kPa 表压'}],
       run:function(v){ var p2 = v[0], fl = v[1], m = p2 - fl, okP = Math.abs(p2 - 350) <= 1.5, okFloor = Math.abs(fl - 140) < 0.001;   // ±1.5, the same window as `bern` and for the same reason: 348.0 must not pass
         return {ok: okP && okFloor && m >= 0,
           text:(okP ? '你的压力计算在容差范围内。'
                     : '你的压力计算超出了容差范围——检查连续性方程、那个 ½，以及流速项的正负号。')
             + (!okFloor ? '请使用情景给定的下限 140 kPa（表压）。' : '')
             + (m >= 0 ? '输入的压力高出输入的下限 ' + m.toFixed(0) + ' kPa；这只是一次局部比较。'
                      : '输入的压力低于输入的下限 ' + Math.abs(m).toFixed(0) + ' kPa。')
             + ' 条件：两个数字必须取同一基准，而且这只是该管段的压力——立管和水带不在其中。'}; }}},

    {id:'units', kind:'conversion', title:'表压、绝对压力与单位',
     body:'p_abs = p_gauge + p_atm，其中 p_atm ≈ 101.3 kPa。在 p₁ − p₂ 中这个偏移量相互抵消，所以代入表压得出表压，压力差两种写法完全相同。1 kPa = 1000 Pa。½ρV² 中 ρ 取 kg/m³、V 取 m/s，结果以 Pa 计。1 L/s = 0.001 m³/s。',
     cond:'全程使用同一基准；现场压力表按其构造读出的就是表压。'},

    {id:'data', kind:'data', from:'C', title:'情景数据',
     body:'D₁ = 300 mm 主管，D₂ = 150 mm 消火栓支管与之同轴，主管在消火栓处为末端，因此全部测试流量都经过两个测压点；两个测压点位于管沟内同一段水平管上，在渐缩管两侧各几百毫米处；计划测试流量下 V₁ = 2.0 m/s；300 mm 一侧上游测压点 p₁ = 380 kPa（表压）；测试出流期间供水公司下限 140 kPa（表压）；ρ = 1000 kg/m³，g = 9.81 m/s²。断面 2 下游：支管继续通向消火栓，消火栓与消防泵车相连，泵正在运行。仓库消防流量要求 95 L/s（背景信息）。消火栓的 65 mm 侧出水口已封盖。',
     note:'布置与读数均由情景给定，不是来自你所做的检查。'}
  ],
  outside:{
    P:'当然！问题是 150 mm 支管中的压力。先快速看一眼：那个断面是水离开渐缩管的地方，所以它向大气出流，那里的压力是零表压——没什么可解的。要我改为求消火栓的出流量吗？',
    F:'假设：（1）150 mm 支管是处于大气压下的自由射流，p₂ = 0（表压）；（2）让伯努利方程而不是连续性方程来确定流速；（3）把结果报告为出流量，因为流量测试就是为了这个。成功判据：以 L/s 报告流量。',
    A:'取 p₂ = 0（表压），V₂ = √(V₁² + 2p₁/ρ) = √764 = 27.6 m/s；Q = A₂V₂ = 0.01767 × 27.6 = 0.488 m³/s = 488 L/s。消火栓出流量为 488 L/s，远高于所需的 95 L/s，所以剩余压力没问题，测试可以全开进行。',
    E:'我已经重新检查了推理，全程一致。你可以放心采用。',
    T:'流量测试记录表摘要：488 L/s，剩余压力正常，进行测试。经验：出口处的压力总是大气压。'
  }
}
];

/* Copy shared across scenarios */
var PHASE_META = {
  P:{name:'问题', full:'以问题为中心的挑战', who:'你', ask:'我在解决什么问题？它为什么重要？'},
  F:{name:'界定', full:'界定问题', who:'你', ask:'什么才算一个好答案？'},
  A:{name:'尝试', full:'类比与尝试', who:'你', ask:'在咨询 AI 之前，我试过什么？'},
  C:{name:'咨询', full:'咨询与建构', who:'你 + AI', ask:'我此刻具体需要什么贡献？'},
  E:{name:'评价', full:'评价与解释', who:'你', ask:'什么证据支持我的决定？'},
  T:{name:'迁移', full:'转化与迁移', who:'你', ask:'什么改变了？我下一次在哪里用它？'}
};
var PHASES = ['P','F','A','C','E','T'];
var CLS = {own:'学习者自主', mech:'机械性卸载', sup:'支持性卸载', leak:'支持性——未设限', sub:'替代性卸载', peek:'C 之外——查看后关闭未使用', supplied:'所提供示例（已采用）'};
/* Provenance. Any number, sentence or worked route the learner did not type is labelled with where it came from — on the screen,
   on the trail and in the debrief. Checkpoints describe recorded entries and supplied selections, not independent mastery. */
var PROV = {option:'所选选项', example:'所选思路', estimate:'所选估算值', provided:'所提供的解题示例（已采用）', learner:'学习者输入', revised:'学习者修订', supplied:'情景给定读数'};
/* Display labels for internal enum values. The values themselves ('accept' | 'revise' | 'reject'; evidence kinds) stay in English in the records. */
var VERDICT_LABEL = {accept:'接受', revise:'修订', reject:'拒绝'};
var KIND_LABEL = {equation:'公式', conversion:'换算', reference:'参考', data:'数据'};
/* Why a verdict was given. A wrong technical argument is a physics point to repair, not a trust problem; only the last two kinds
   are uncritical adoption, and only those cost the Evidence badge. A reason may carry its own tail when the generic one would misdiagnose. */
var REASON_KIND = {
  valid_evidence:           {label:'证据',        tail:''},
  invalid_technical_reason: {label:'技术性误解',  tail:' 你的理由是一个技术论证——而这个论证是错的。这是一个需要修补的物理知识点（见证据栏），不是信任问题。'},
  unsupported_authority:    {label:'无依据的权威', tail:' 你的理由是助手这么说、表示同意，或听起来很确定。模型的赞同不是独立证据——有什么计算、来源或观察支持这个论断？'},
  convenience:              {label:'图方便',      tail:' 你的理由是这个结果更省事、更划算或"更保险"。那是对结果的偏好，不是关于论断的证据。'}
};
function reasonTail(r){ return r.tail != null ? r.tail : REASON_KIND[r.kind].tail; }
var TYPE_LABEL = {ok:'正确的论断', assumption:'错误假设', unit:'单位错误', plausible:'似是而非', constraint:'遗漏约束', unsupported:'无依据的建议', uninvited:'超出请求范围'};
var FLAG_LABEL = {outside_scope:'超出你的请求范围', unsupported:'无依据', violates_constraint:'违反约束'};

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
   checkpoint met — see resultsScreen). Blurbs point at the dimension list instead of asserting its content. */
var RANKS = [
  {min:.85, name:'水力总工程师', blurb:'所有适用的练习检查点均已达成。这个等级反映的是记录下来的选择和输入，不是独立计算能力或专业胜任力。到真实的作业上去检验这套流程。'},
  {min:.70, name:'项目工程师', blurb:'下面的检查点列表说明了你的轨迹记录了哪些练习动作、没有记录哪些。那里标出的时刻，往往每次都是同一个时刻。'},
  {min:.50, name:'现场工程师', blurb:'这套流程在某些地方站住了。标为"未达成"的检查点会准确告诉你下一步该练哪一块。'},
  {min:0,   name:'留有轨迹的实习生', blurb:'练习得分不高——但你拥有大多数人没有的东西：一份准确记录了思考在哪里溜走的记录。再玩一次，守住它。'}
];
var BADGES = [
  /* The gate, not the authorship: S.flags.human tracks only whether AI was consulted before the attempt. Whether the attempt
     was your own writing or a selected chip is reported by the "first attempt recorded" dimension, which can say "partly". */
  {id:'human', name:'人先行', desc:'尝试之前没有用 AI', ico:'A'},
  {id:'bounded', name:'有边界', desc:'在 C 阶段发送了有边界的请求', ico:'C'},
  {id:'hunter', name:'错误猎手', desc:'抓住了每一个预设错误', ico:'E'},
  {id:'evidence', name:'凭证据，不凭感觉', desc:'没有任何首次判定依赖助手的说法或图方便', ico:'✓'},
  {id:'gate', name:'守门人', desc:'从未在 C 阶段之外咨询 AI', ico:'P'}
];
var CONTENT_VERSION = 5;                        // bump when scenarios or scoring change; a saved record from another version is not comparable and is never read
var STORE_KEY = 'flowline-best-zh-v' + CONTENT_VERSION;
var OLD_STORE_KEYS = [];      // the Chinese edition keeps its own record; English-edition keys are never read here, so translated rank text never mixes with English records

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
function scenNo(){ return '本情景'; }
function cur(){ return SCENARIOS[S.scen]; }
function rec(){ return S.scens[S.scen]; }
/* The learner's recorded attempt. If A was handed to the AI, the only number on the table is the AI's. */
function attempt(){
  if(rec().attempt) return rec().attempt;
  var sc = cur();
  if(rec().status.A==='given') return {id:'ai', est:sc.outsideEst, work:sc.outside.A, slip:'', ok:false, ai:true, methodShort:'无——A 阶段由助手完成'};
  var e = sc.A.ests.filter(function(x){ return x.ok; })[0]; // safety fallback only; nothing on the trail is written from it
  return {est:e.t, work:e.work, slip:e.s, ok:true, methodShort:sc.A.methods[0].short, provenance:'provided'};
}
function tpl(str){
  var a = attempt(), s = String(str);
  if(a.ai){
    s = s.replace(/附上我的尝试——思路与估算值 \{est\}。/g, '此前 AI 的输出是 {est}；我没有记录自己的尝试。')
      .replace(/我的尝试（附上）：思路与估算值 \{est\}。/g, '此前 AI 的输出：{est}。未记录学习者的尝试。')
      .replace(/评析我的设定/g, '评析此前 AI 的设定')
      .replace(/能帮我检查一下流量测试的计算吗/g, '能帮我检查一下此前 AI 的输出吗');
  }
  /* {work} and {method} stay available for a re-skin; this scenario's requests carry the attempt as the attached card in C
     instead of restating it, so only {est} and {slip} are actually substituted here.
     Every template closes {work} with its own full stop, so a typed calculation that already ends in one would read "…350 kPa gauge.." */
  var work = String(a.work == null ? '' : a.work).replace(/\s+$/, '').replace(/[.。]$/, '');
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
      {t:'超出了我的请求范围——我要的是评析，不是结论；它不进入我的结果。', kind:'valid_evidence', flag:'outside_scope', ok:['reject']},
      {t:d.uninvitedReasons.unsupported, kind:'valid_evidence', flag:'unsupported', ok:['reject','revise']},
      {t:d.uninvitedReasons.violates, kind:'valid_evidence', flag:'violates_constraint', ok:['reject']},
      {t:'接受——它和我自己的数字一致，等于白得一次确认。', kind:'unsupported_authority', ok:[]},
      {t:'接受——决定就是决定；省得我跑一趟。', kind:'convenience', ok:[]} ],
    explain:d.uninvitedExplain };
}
/* route → what the record says about the request. The variant decides the reply: bounded = the critique; leaky = the critique plus the
   uninvited paragraph (appended as a judgeable claim); whole = the whole-task reply, decomposed into its own verbatim claims. */
var ROUTE = {
  direct:  {variant:'bounded', final:'bnd',   label:'请求已发送',                 short:'咨询：有边界的请求',                   cls:'sup',  settle:'有边界的请求'},
  repaired:{variant:'bounded', final:'bnd',   label:'请求已发送——边界已修复',     short:'咨询：边界已修复，发送了有边界的请求', cls:'sup',  settle:'边界已修复'},
  partial: {variant:'leaky',   final:'leaky', label:'请求已发送（仍有漏洞）',     short:'咨询：请求仍有漏洞',                   cls:'leak', settle:'部分修复'},
  asis:    {variant:'leaky',   final:'leaky', label:'请求已发送（未修改）',       short:'咨询：有漏洞的请求原样发送',           cls:'leak', settle:'发送了有漏洞的请求'},
  whole:   {variant:'whole',   final:'sub',   label:'请求已发送（整个任务）',     short:'咨询：整个任务已委托',                 cls:'sub'}
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
      if(a && a.ai) c.t = c.t.replace(/所选路线/g, '此前 AI 的设定');
      delete c.tAI; delete c.tAfterCritique;
    });
    text = (a && a.ai ? '关于本情景的脚本化论断；未记录学习者的尝试：' : tpl(d.reply)) + '\n' + claims.map(function(c,i){ return (i+1)+'. '+c.t; }).join('\n');
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
  return h('details', {class:'reply-full panel'}, h('summary', null, label || '重新打开完整回复'),
    h('div', {class:'chat'}, h('div', {class:'body'}, h('div', {class:'msg me', text:record.request}), h('div', {class:'msg bot'}, h('div', {class:'who'}, '助手'), replyLines(record.reply.text, record.variant==='leaky')))));
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
/* First sentence: Latin terminators need a following space or end of string (so "0.300" is not a break); Chinese full-width terminators end a sentence on their own. */
function firstSentence(s){ var mm = String(s).match(/^[\s\S]*?(?:[.!?](?=\s|$)|[。！？])/); return mm ? mm[0].trim() : String(s); }
/* Internal claim ids ('hydrant-w1') exist so a trail line can be matched to the claim it judged. They are debug labels, not
   learner language, so nothing on screen ever prints one: every surface asks for the tag E assigned instead. */
function claimTag(r, id){ return (r && r.claimTags && r.claimTags[id]) || id; }
/* Assigned once, at send time, so a trail line written in C already carries the tag E will use. Idempotent. */
function tagClaims(r, claims){ var n = 0; claims.forEach(function(c){ var tag = c.unsolicited ? '未经请求' : '第 '+(++n)+' 点'; if(!r.claimTags[c.id]) r.claimTags[c.id] = tag; }); }
/* Five practice checkpoints: recorded entries and selected responses, with their provenance.
   Meeting a checkpoint does not establish correctness of free text or independent mastery. */
function dimensionsFor(r, sc){
  var rows = [], a0 = r.attempts[0], st = judgmentStats(r), t = r.tInteg.repaired || r.tInteg.first;   // the final recommendation, after any repair
  function row(id, label, state, text, evidence){ rows.push({id:id, label:label, state:state, text:text, evidence:evidence||''}); }
  // Hints precede writing. Text entry establishes a record, not correctness or independence.
  if(a0 && a0.provenance==='learner') row('attempt', '已记录学习者的计算', 'yes', (a0.beforeWorkedExample===true ? '在提示之后、完整解题示例之前记录' : (a0.beforeWorkedExample===false ? '在提示和完整解题示例之后记录' : '在脚手架支持之后记录；是否看过示例未记录'))+'——正确性与独立推导均未评估', a0.work);
  else if(a0) row('attempt', '已记录学习者的计算', 'no', '选择了估算值并采用了所提供的示例；没有学习者自己写的计算', '思路：'+a0.methodShort+' · 所选估算值 '+a0.est+(a0.ok?'':'（偏离）'));
  else row('attempt', '已记录学习者的计算', 'no', '未记录学习者的计算——A 阶段由助手完成');
  if(r.promptFinal==='bnd') row('bounded', '选择了有边界的请求', 'yes', r.repaired ? '由所提供的部件组装——边界已修复' : '选择了有边界的请求');
  else if(r.promptFinal==='sub') row('bounded', '选择了有边界的请求', 'no', '未达成——整个任务被委托出去');
  else if(r.promptFinal==='leaky'){
    var uj = r.uninvitedJudged, note = !uj ? '' : (uj.verdict==='accept' ? '；在 E 阶段接受了未经请求的建议' : (uj.credited ? (uj.verdict==='reject' ? '；你在 E 阶段排除了未经请求的建议' : '；你把未经请求的建议搁置待证') : ''));
    row('bounded', '选择了有边界的请求', 'no', '未达成——发送时仍有漏洞；助手越过了限制作答'+note);
  }
  else row('bounded', '选择了有边界的请求', 'no', '未达成——没有发送任何请求');
  var ids = function(kind){ return r.judgments.filter(function(j){ return j.pass===1 && j.reasonKind===kind; }).map(function(j){ return claimTag(r, j.claimId); }).join('、'); };
  if(r.status.E==='given') row('checks', '选择了基于证据的判定', 'no', '未达成——助手的自我检查未经判定就通过了');
  else if(!st.total) row('checks', '选择了基于证据的判定', 'no', '未达成——没有记录任何判定');
  else {
    var parts = [];
    if(st.mismatched) parts.push(st.mismatched+' 项所给证据不支持所选判定');
    if(st.misconception) parts.push(st.misconception+' 项基于技术性误解（'+ids('invalid_technical_reason')+'）');
    if(st.unsupported) parts.push(st.unsupported+' 项基于助手的说法（'+ids('unsupported_authority')+'）');
    if(st.convenience) parts.push(st.convenience+' 项基于图方便（'+ids('convenience')+'）');
    var ev = st.total+' 项首次判定中有 '+st.valid+' 项基于证据'+(parts.length ? '；'+parts.join('；') : '');
    row('checks', '选择了基于证据的判定', st.valid===st.total ? 'yes' : (st.valid ? 'partial' : 'no'), st.valid===st.total ? '通过所提供的证据选项达成' : (st.valid ? '部分达成' : '未达成'), ev);
  }
  if(r.status.T==='given') row('constraints', '选择了情景建议', 'no', '未达成——T 阶段由助手完成');
  else if(!t) row('constraints', '选择了情景建议', 'no', '未达成——没有记录任何建议');
  else if(t.needsData) row('constraints', '选择了情景建议', 'na', '不适用——在给出建议之前先要求了数据');
  else if(t.provisional) row('constraints', '选择了情景建议', 'partial', '尚未验证——暂定选项；它所依赖的检查仍未完成', (r.tInteg.repaired ? '修复为：' : '所选：')+firstSentence(t.text));
  else if(t.ok) row('constraints', '选择了情景建议', 'yes', '通过所选的情景选项达成', (r.tInteg.repaired ? '修复为：' : '所选：')+firstSentence(t.text));
  else row('constraints', '选择了情景建议', 'no', '未达成——'+firstSentence(sc.T.opts[t.idx].fb));
  var explained = r.revisions.filter(function(v){ return v.explanation && String(v.explanation).trim(); });
  var needed = [];
  if(a0 && !a0.ok) needed.push('第一次尝试有偏离');
  /* A revise-canonical claim needed revising unless the learner excluded it with a credited reject — a defensible pair leaves nothing to revise. */
  if(r.eClaims.some(function(c){ return c.best==='revise' && !r.judgments.some(function(j){ return j.claimId===c.id && j.pass===1 && j.verdict==='reject' && j.credited; }); })) needed.push('回复中有一条论断需要修订');
  if(t && !t.ok && !t.needsData) needed.push('建议中带有错误');
  if(explained.length) row('revision', '已记录修订说明', 'yes', '已记录——说明内容不作评估', '"'+explained[explained.length-1].explanation+'"');
  else if(!needed.length) row('revision', '已记录修订说明', 'na', '不需要——首次结果成立');
  else row('revision', '已记录修订说明', 'no', '未达成——'+needed.join('；')+'，且没有记录任何关于改动的说明');
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
      if(k==='C' && rec().returnUsed){ sp.classList.add('ret'); sp.title = PHASE_META.C.full+'——已使用一次有边界的回访咨询'; }
    }
    $track.appendChild(sp);
  });
  var total = S.kept + S.given;
  $meterBar.style.width = (total ? Math.round(100*S.kept/total) : 100) + '%'; // a visual of kept against given — never described as a share of thinking
  $meterPct.textContent = '保留 '+S.kept+' · 让出 '+S.given;
  $score.textContent = Math.max(0, S.kept - S.given);
  console.assert(S.kept === S.scens.reduce(function(a,r){ return a + (r ? PHASES.reduce(function(b,k){ return b+(r.phasePts[k]||0); }, 0) : 0); }, 0), 'kept out of step with phasePts');
  var inC = S.mode==='phase' && PHASES[S.phase]==='C';
  $ask.classList.toggle('hot', inC);
  $ask.textContent = inC ? '问 AI' : '问 AI · 关闭 −4 / 使用 −18';
  $ask.setAttribute('aria-label', inC ? '问 AI——现在是 C 阶段，咨询已开放' : '在 C 之外问 AI：打开后关闭扣 4 分；使用回复则改扣 18 分');
  $ask.disabled = !(S.mode==='phase');
  $ask.title = S.mode==='phase' ? (inC ? '咨询已开放' : 'C 之外：关闭扣 4 分；使用则改扣 18 分。两者都会失去"守门人"；在 P、F 或 A 阶段还会失去"人先行"。这些是游戏规则。') : '助手在阶段开始后才可用';
  $evid.disabled = !trayAllowed();
  $evid.title = trayAllowed() ? '证据栏——参考资料与校核，不计分' : (S.mode==='phase' ? '到 A 阶段开放' : '阶段开始后开放');
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
  $tray.appendChild(h('div', {class:'thead'}, h('h3', null, '证据栏 · '+sc.title), h('button', {class:'close', type:'button', 'aria-label':'关闭证据栏', onClick:closeTray}, '×')));
  $tray.appendChild(h('p', {class:'tnote'}, '这是供你使用的参考资料，不是供你照抄的答案。校核只告诉你你的数字是否在容差范围内；使用校核会记入你的轨迹，不计分。按 Esc 关闭。'));
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
  box.appendChild(h('div', {class:'ttl'}, it.title, h('span', {class:'kind'}, KIND_LABEL[it.kind] || it.kind)));
  if(it.body) box.appendChild(h('div', {class:'body', text:it.body}));
  if(it.table) box.appendChild(renderTable(it.table));
  if(it.cond) box.appendChild(h('div', {class:'cond'}, '条件：'+it.cond));
  if(it.note) box.appendChild(h('div', {class:'tsup'}, it.note));
  if(it.action) box.appendChild(trayAction(it, k));
  return box;
}
function trayAction(it, k){
  var a = it.action, fields = a.fields || [{l:a.prompt, unit:a.unit}];
  var out = h('div', {class:'res', role:'status'});
  var inputs = fields.map(function(f){ return h('input', {type:'text', inputmode:'decimal', 'aria-label':f.l, placeholder:f.unit || ''}); });
  var btn = h('button', {class:'btn ghost check', type:'button', onClick:run}, '校核');
  function run(){
    var vals = inputs.map(function(x){ return parseNum(x.value); });
    if(vals.some(function(v){ return v===null; })){ out.textContent = '请'+(fields.length>1 ? '在每个字段中' : '')+'输入一个数字（例如 12.7 或 4.5e3）。'; out.className = 'res'; return; }
    var res = a.type==='calc'
      ? (function(){ var ok = Math.abs(vals[0]-a.expect) <= a.tol; return {ok:ok, text:ok ? '在容差范围内。条件：'+it.cond : '不在容差范围内——检查条件一行和你的单位。'}; })()
      : a.run(vals);
    out.textContent = res.text; out.className = 'res '+(res.ok===true ? 'ok' : (res.ok===false ? 'no' : ''));
    var entered = fields.map(function(f, i){ return f.l+' = '+inputs[i].value.trim(); }).join('；');
    rec().evidenceUses.push({evidenceId:it.id, phase:k, input:entered, ok:res.ok, at:Date.now()});
    trail({k:k, label:'使用了证据——'+it.title, text:'输入 '+entered+(res.ok===null ? '' : '；在容差范围内：'+(res.ok ? '是' : '否')), prov:'learner', cls:'own', pts:0, evidenceId:it.id, short:'证据：'+it.title});
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
        h('div', {class:'eyebrow rise'}, 'P-FACET / 流体力学'),
        h('h1', {class:'rise d1', html:'Flow<em>line</em>'}),
        h('p', {class:'tag rise d2', html:'一道真实的水力学问题，从头到尾——身边是一个自信却时常出错的 AI 助手。<b class="g">把思考留在自己手里</b>；<b class="b">带着边界去咨询</b>。'}),
        h('ul', {class:'how rise d3'},
          h('li', null, h('b', null, 'P'), h('span', null, 'P-FACET 六个阶段。五个是你的；AI 只在一个阶段进入。')),
          h('li', null, h('b', null, 'C'), h('span', null, '选择——或修正——你要发送的提示词：你问什么，决定了谁在思考。')),
          h('li', null, h('b', null, 'E'), h('span', null, '回复中有一处是预设错误；有漏洞的请求会引来一个你从未要求的结论。')),
          h('li', null, h('b', null, '?'), h('span', null, 'C 之外：查看后关闭扣 4 分；使用则改扣 18 分。两者都会失去"守门人"；在 P、F 或 A 阶段还会失去"人先行"。'))
        ),
        h('div', {class:'actions rise d4'},
          h('button', {class:'btn primary', type:'button', 'data-autofocus':'1', onClick:startGame}, '开始 · 预计 9 分钟'),
          h('a', {class:'btn ghost', href:'takeaway.html'}, '先读学习速查单')
        ),
        best ? h('p', {class:'best rise d5', html:'你的最佳练习得分：<b>'+esc(best.score)+' / '+esc(best.max)+' · '+esc(best.rank)+'</b>（'+esc(best.date)+'）'}) : h('p', {class:'best rise d5'}, hasOldBest() ? '最佳得分只保存在本浏览器中；Flowline 早期版本的得分不可比较，不予显示。' : '最佳得分只保存在本浏览器中。')
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
      h('div', {class:'goal rise d3', html:'<b>交付成果。</b>'+esc(sc.goal)}),
      h('div', {class:'goal keep rise d3', html:'<b>你要保留的。</b>'+esc(sc.protected.charAt(0).toUpperCase()+sc.protected.slice(1))+'。'}),
      h('div', {class:'actions rise d4'},
        h('button', {class:'btn anchor', type:'button', 'data-autofocus':'1', onClick:function(){ S.mode='phase'; phaseScreen(); }}, '从 P 开始 →'),
        h('span', {class:'hint'}, '你的 AI 助手已上线——它是脚本化的，回复中含有预设错误。')
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
  var trailBox = h('div', {class:'mytrail'}, h('h4', null, '你的轨迹（至今）'));
  var t = rec().trail;
  if(!t.length) trailBox.appendChild(h('div', {class:'muted', text:'还没有内容——轨迹从你的第一个决定开始。'}));
  t.forEach(function(e, i){
    var b = h('b', {text:e.k}); if(e.cls==='sub' || e.given) b.classList.add('risk'); if(e.k==='C') b.classList.add('ai');
    var row = h('div', null, b, e.short || e.label, e.claimId ? h('code', {class:'cid'}, '['+claimTag(rec(), e.claimId)+']') : null, e.prov ? h('span', {class:'prov'}, PROV[e.prov]) : null);
    if(e.reply) row.appendChild(h('details', {class:'reply-full', 'data-i':i}, h('summary', null, '显示回复'), h('div', {class:'q'}, e.reply)));
    trailBox.appendChild(row);
  });
  /* At T the crew has re-plumbed the hydrant, so the pinned sketch switches to the line-up the T question describes.
     Anywhere else it is the pumper-run line-up every number in the scenario was computed in. */
  var inT = S && S.mode==='phase' && PHASES[S.phase]==='T' && sc.artT;
  return h('aside', {class:'side'},
    h('div', {class:'brief'},
      h('div', {class:'fig', html:inT ? sc.artT : sc.art}),
      inT ? h('p', {class:'note fig-note'}, '已重绘：泵车运行结束，水带已卸，大出水口已封盖，65 mm 侧出水口敞开。下面的已知条件是泵车运行时的读数。') : null,
      h('h4', null, inT ? '已知条件（泵车运行时）' : '已知条件'),
      h('div', {class:'givens', html:sc.givens.map(esc).join('<br>')}),
      h('p', {class:'note keep', html:'<b>你要保留的：</b>'+esc(sc.protected)+'。'}),
      h('p', {class:'note', text:sc.goal})
    ),
    trailBox
  );
}
function continueBtn(label, fn){
  var b = h('button', {class:'btn primary', type:'button', onClick:function(){ b.disabled = true; fn(); }}, label || '继续 →');
  return h('div', {class:'actions'}, b);
}
function keyHint(){ return h('span', {class:'hint'}, '提示：按 1–9 选择，按 Enter 继续。'); }

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
  var opts = h('div', {class:'opts', role:'group', 'aria-label':'问题陈述'});
  d.opts.forEach(function(o, i){
    var b = h('button', {class:'opt', type:'button', onClick:function(){
      opts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
      b.classList.remove('dim'); b.classList.add(o.v==='best'?'good':(o.v==='ok'?'meh':'bad'));
      rec().pPick = i; settle('P', '已说出问题');
      var pts = PTS.P[o.v];
      fb.innerHTML=''; fb.appendChild(h('div', {class:'feedback '+(o.v==='best'?'':(o.v==='ok'?'warn':'bad'))}, h('span', {class:'verdict'}, o.v==='best'?'准确。':(o.v==='ok'?'部分对。':'还不够。')), o.fb, h('span', {class:'cls', html:'<b>'+CLS.own+'</b>——你说出了问题。保留 +'+pts+'。'})));
      trail({k:'P', label:'问题陈述', text:o.t, prov:'option', cls:'own', pts:pts, short:'问题：'+(o.v==='best'?'准确':(o.v==='ok'?'部分':'薄弱'))});
      cont.innerHTML=''; cont.appendChild(continueBtn('界定问题 →', nextPhase)); cont.querySelector('button').focus();
    }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), o.t);
    opts.appendChild(b);
  });
  var node = h('div', null,
    phaseHead('P', '先说清问题，再做别的。', '目的由你把握。这里还没有 AI——如果由它来说出问题，它也就选定了什么才算数。'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '"'+PHASE_META.P.ask+'"'), h('p', {html:'<b>'+esc(d.q)+'</b>'}), opts, fb, cont, h('div', {class:'actions'}, keyHint())),
      sideBrief()
    )
  );
  render(node);
}

/* ---------- F ---------- */
function screenF(){
  var sc = cur(), d = sc.F;
  var picked = {};
  var chips = h('div', {class:'chips', role:'group', 'aria-label':'界定问题的条目'});
  var fb = h('div'); var cont = h('div');
  var lockBtn = h('button', {class:'btn primary', type:'button', disabled:'', onClick:lock}, '锁定我的界定');
  d.items.forEach(function(it, i){
    var b = h('button', {class:'chip', type:'button', 'aria-pressed':'false', onClick:function(){
      picked[i] = !picked[i]; b.setAttribute('aria-pressed', String(!!picked[i]));
      var n = Object.keys(picked).filter(function(x){return picked[x];}).length;
      lockBtn.disabled = n < d.min; lockBtn.textContent = n ? '锁定我的界定（已选 '+n+'，至少 '+d.min+'）' : '锁定我的界定';
    }}, it.t);
    chips.appendChild(b);
  });
  function lock(){
    var keys=0, bad=0, missed=[];
    d.items.forEach(function(it, i){
      var b = chips.children[i]; b.disabled = true;
      if(picked[i] && it.key){ keys++; b.classList.add('good'); b.appendChild(h('span', {class:'tagline'}, '属于 · '+it.why)); }
      else if(picked[i] && !it.key){ bad++; b.classList.add('bad'); b.appendChild(h('span', {class:'tagline'}, '不属于 · '+it.why)); }
      else if(!picked[i] && it.key){ missed.push(it); b.classList.add('miss'); b.appendChild(h('span', {class:'tagline'}, '漏选 · '+it.why)); }
    });
    rec().fPicks = d.items.map(function(x,i){ return !!picked[i]; });
    settle('F', '已设定界定');
    var pts = rec().phasePts.F;
    var verdict = keys>=d.min && bad===0 ? '界定扎实。' : (keys>=d.min ? '大体到位。' : '界定单薄。');
    var msg = d.items.filter(function(x){return x.key;}).length+' 项要点中选中了 '+keys+' 项'+(bad?'，另有 '+bad+' 项不属于':'')+'。';
    if(missed.length) msg += '你漏掉的内容会在 E 阶段起作用——AI 会恰好在那些地方考验你。';
    else msg += '你写下的每一条判据，现在都是一项可以用来检验 AI 答案的测试。';
    fb.appendChild(h('div', {class:'feedback '+(keys>=d.min&&!bad?'':'warn')}, h('span', {class:'verdict'}, verdict), msg, h('span', {class:'cls', html:'<b>'+CLS.own+'</b>——你设定了判据。保留 +'+pts+'。'})));
    trail({k:'F', label:'界定问题', text:d.items.filter(function(x,i){return picked[i];}).map(function(x){return x.t;}).join(' · '), prov:'option', cls:'own', pts:pts, short:'界定：'+keys+' 项要点'+(bad?'，'+bad+' 项偏离':'')});
    lockBtn.parentNode.removeChild(lockBtn);
    cont.appendChild(continueBtn('动手尝试 →', nextPhase)); cont.querySelector('button').focus();
  }
  var node = h('div', null,
    phaseHead('F', '决定什么才算好。', '已知、假设、判据、约束。至少选 '+d.min+' 项。AI 可以对界定提出质疑——但绝不替你写界定。'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '"'+PHASE_META.F.ask+'"'), h('p', {html:'<b>'+esc(d.q)+'</b>'}), chips, h('div', {class:'actions'}, lockBtn, keyHint()), fb, cont),
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
  var methods = h('div', {class:'opts', role:'group', 'aria-label':'解题思路'});
  var ests = h('div', {class:'estimates', role:'group', 'aria-label':'估算值'});
  var estBlock = h('div', {hidden:''}, h('div', {class:'sub-h'}, d.eq), ests);
  d.methods.forEach(function(m, i){
    var b = h('button', {class:'opt', type:'button', onClick:function(){
      methodPick = m;
      methods.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
      b.classList.remove('dim'); b.classList.add(m.ok?'good':'meh');
      fb.innerHTML=''; fb.appendChild(h('div', {class:'feedback '+(m.ok?'':'warn')}, h('span', {class:'verdict'}, m.ok?'原理正确。':'是一次尝试——很好。'), m.fb));
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
      settle('A', '自己的尝试');
      var pts = rec().phasePts.A, mp = methodPick.ok?PTS.A.method:PTS.A.methodWrong, ep = e.ok?PTS.A.est:PTS.A.estWrong;
      fb.innerHTML=''; fb.appendChild(h('div', {class:'feedback '+(e.ok?'':'warn')}, h('span', {class:'verdict'}, e.ok?'尝试已记录。':'尝试已记录——有偏离，而这很有用。'), tpl(e.ok?d.estfb.ok:d.estfb.bad), h('span', {class:'cls', html:'<b>'+CLS.own+'</b>——尝试已存在：估算值 <b>'+esc(e.t)+'</b>。你在下面添加的内容都会标明来源。保留 +'+pts+'。'})));
      trail({k:'A', label:'解题思路', text:methodPick.t, prov:'example', cls:'own', pts:mp, short:'尝试：'+(methodPick.ok?'方法正确':'方法不稳')});
      trail({k:'A', label:'估算值', text:e.t+(e.ok?'':'——偏离'), prov:'estimate', cls:'own', pts:ep, short:'估算值 '+e.t+(e.ok?'':'（偏离）')});
      // Both recording routes follow hints. Neither establishes independent derivation.
      function ownBox(seen){
        /* "Two lines is enough" is the scope cue, and it is the shortest thing in this box: the cost here is typing, not reading,
           and a learner who thinks a full derivation is wanted will sit here writing one for several times as long. */
        var ta = h('textarea', {class:'free', rows:'3', 'aria-label':'我自己的计算', placeholder:'两行就够——你的步骤和你的数字，带单位。'});
        var go = h('button', {class:'btn primary', type:'button', disabled:'', onClick:function(){
          var text = ta.value.trim(); go.disabled = true; ta.disabled = true;
          at.provenance = 'learner'; at.beforeWorkedExample = !seen; at.scaffolded = true; at.textAssessment = 'not assessed'; at.work = text; at.text = text;
          trail({k:'A', label:seen ? '学习者在提示和完整解题示例之后写的计算（不作评估）' : '学习者在提示之后、完整解题示例之前写的计算（不作评估）', text:text, prov:'learner', cls:'own', pts:0, short:seen ? '学习者在提示和示例之后的输入——未评估' : '学习者在提示之后、示例之前的输入——未评估'});
          nextPhase();
        }}, '记录我的计算并去咨询 →');
        ta.addEventListener('input', function(){ go.disabled = Array.from(ta.value.trim()).length < 8; });
        worked.innerHTML=''; worked.appendChild(h('div', {class:'worked own'}, h('div', {class:'sub-h'}, '我自己的计算'),
          h('p', {class:'note'}, seen
            ? '提示和解题示例已经显示过。你的输入会被记录，但不评估其正确性或独立性。'
            : '你已经看过提示和反馈。你的输入会被记录，但不评估其正确性或独立性。'),
          ta));
        cont.innerHTML=''; cont.appendChild(h('div', {class:'actions'}, go,
          seen ? null : h('button', {class:'btn ghost', type:'button', onClick:function(){ showExample(); }}, '改为给我看解题示例')));
        ta.focus();
      }
      function showExample(){
        worked.innerHTML=''; worked.appendChild(h('div', {class:'worked'}, h('div', {class:'sub-h'}, '所提供的解题示例'), h('div', {class:'q'}, e.work), h('p', {class:'note'}, '这是针对你所选估算值写的。采用它会以"所提供示例"记入你的轨迹，而不是你自己的推导。')));
        cont.innerHTML='';
        var adopt = continueBtn('采用这个解题示例并去咨询 →', function(){
          trail({k:'A', label:'已采用解题示例', text:e.work, prov:'provided', cls:'mech', pts:0, short:'已采用所提供的解题示例'});
          nextPhase();
        });
        adopt.appendChild(h('button', {class:'btn ghost', type:'button', onClick:function(){ ownBox(true); }}, '改为输入我自己的计算'));
        cont.appendChild(adopt); cont.querySelector('button').focus();
      }
      worked.innerHTML='';
      cont.innerHTML='';
      cont.appendChild(h('div', {class:'actions'},
        h('button', {class:'btn primary', type:'button', onClick:function(){ ownBox(false); }}, '写下我自己的计算 →'),
        h('button', {class:'btn ghost', type:'button', onClick:showExample}, '给我看解题示例'),
        h('span', {class:'hint'}, '写下来只是在脚手架支持之后记录你的推理；它不能证明独立完成。')));
      cont.querySelector('button').focus();
    }}, e.t);
    ests.appendChild(b);
  });
  var node = h('div', null,
    phaseHead('A', '先自己试一试。', '做出第一次尝试。它不必正确——但它必须在任何 AI 输出之前存在。'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '"'+PHASE_META.A.ask+'"'), h('div', {class:'sub-h'}, d.mq), methods, estBlock, fb, worked, cont, h('div', {class:'actions'}, keyHint())),
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
  var chat = h('div', {class:'chat'}, h('div', {class:'bar'}, h('span', {class:'led'}), 'AI 助手 · C 阶段 · 脚本化练习案例 · 咨询已开放'), h('div', {class:'body'}, h('div', {class:'msg bot'}, h('div', {class:'who'}, '助手'), '为这次练习对话选择一个请求。')));
  var body = chat.querySelector('.body');
  var opts = h('div', {class:'opts', role:'group', 'aria-label':'提示词'});
  var a = attempt();
  var gapText = a.ai ? '桌上唯一的数字是 AI 的：'+a.est+'。没有记录学习者的尝试。' : '你所选的估算值是 '+a.est+'。指出你想检验的那个边界假设。';
  if(!a.ai && a.methodOk===false) gapText += ' 你所选的思路是"'+a.methodShort+'"。'+(a.provenance==='learner' ? '你输入的计算记录在下方；这份脚本化回复不评判它的方法。' : '所提供的解题示例用的是另一条路线。想清楚你要为哪种方法辩护。');
  /* The keep-line is pinned in the side brief on every screen, so it is not repeated here. */
  /* The attempt, rendered ONCE, above the options. Every request that references "my attempt" points at this card, so the
     learner is not made to re-read their own calculation four times, one per option, seconds after writing it. */
  var attachCard = a.ai ? null : h('details', {class:'attach panel'},
    h('summary', null, '所选估算值：' + a.est + ' · 思路与记录的计算'),
    h('div', {class:'q'}, (a.methodShort ? '思路：' + a.methodShort + '。\n' : '')
      + (a.provenance==='learner' ? '学习者输入（不作评估）：' : '我采用的解题示例：') + a.work));
  var order = d.prompts.map(function(_, i){ return i; });
  for(var oi = order.length-1; oi>0; oi--){ var oj = Math.floor(Math.random()*(oi+1)); var ot = order[oi]; order[oi] = order[oj]; order[oj] = ot; } // shuffle so position is never the tell
  order.forEach(function(idx, i){
    var p = d.prompts[idx];
    var text = tpl(p.t);
    var b = h('button', {class:'opt mono', type:'button', 'data-prompt-kind':p.kind, onClick:function(){ choose(p, b, text); }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), text);
    opts.appendChild(b);
  });
  var pickBox = h('div', null, h('div', {class:'sub-h'}, '你要发送哪个请求？'), h('p', {class:'note script-scope'}, a.ai ? '回复中包含关于本情景的脚本化论断。没有记录学习者的尝试；此前的输出属于 AI。' : '回复会评析你所选的估算值及其所提供的示例路线。你输入的计算会原样保存，但本脚本不会阅读或评分。练习得分只跟随你的选择。'), attachCard, opts, h('div', {class:'actions'}, keyHint()));

  function tagFor(kind){ return kind==='bnd' ? '<b>'+CLS.sup+'</b>' : (kind==='sub' ? '<b>'+CLS.sub+'</b>' : (kind==='unb' ? '<b>'+CLS.leak+'</b>——有支持的意图，却没有设限' : '<b>'+CLS.leak+'</b>——设了限，里面却是空的')); }

  function choose(p, btn, text){
    chosen = p;
    opts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
    btn.classList.remove('dim'); btn.classList.add(p.kind==='bnd'?'good':(p.kind==='sub'?'bad':'meh'));
    var fbEl = h('div', {class:'feedback '+(p.kind==='bnd'?'':(p.kind==='sub'?'bad':'warn'))}, h('span', {class:'verdict'}, p.kind==='bnd'?'有边界。':(p.kind==='sub'?'这把任务交了出去。':'接近了，但有漏洞。')), (a.ai ? '此前的设定属于 AI；没有记录学习者的尝试。这个选择只改变本次请求的范围。' : p.fb), h('span', {class:'cls', html:tagFor(p.kind)}));
    pickBox.appendChild(fbEl);
    if(p.kind==='bnd'){
      send(text, 'direct', 'bnd');
    } else {
      /* A draft is not a send: nothing is scored, nothing is given away and no badge is lost until a request actually goes out. */
      rec().drafts.push({kind:p.kind, text:text});
      trail({k:'C', label:(p.kind==='sub'?'草稿：整个任务的请求（未发送）':'草稿：请求（尚未发送）'), text:text, cls:(p.kind==='sub'?'sub':'leak'), pts:0, short:'咨询：'+(p.kind==='sub'?'整个任务的草稿':'有漏洞的草稿'), draft:true});
      var acts = h('div', {class:'actions'},
        h('button', {class:'btn ai', type:'button', onClick:function(){ acts.remove(); fixer(p); }}, '发送前先修正提示词'),
        h('button', {class:'btn ghost', type:'button', onClick:function(){ acts.remove(); sendAnyway(p); }}, '照样发送')
      );
      pickBox.appendChild(acts); acts.querySelector('button').focus();
    }
  }

  function fixer(p){
    var on = {};
    var parts = h('div', {class:'parts', role:'group', 'aria-label':'提示词部件'});
    var preview = h('div', {class:'prompt', 'aria-live':'polite'});
    function upd(){
      var txt = d.parts.filter(function(x,i){return on[i];}).map(function(x){return tpl(x.t);}).join(' ');
      preview.innerHTML = txt ? esc(txt) : '<span class="ph">勾选属于有边界请求的部件……</span>';
      sendBtn.disabled = !txt;
    }
    d.parts.forEach(function(pt, i){
      var b = h('button', {class:'part'+(pt.need?'':' trap'), type:'button', 'aria-pressed':'false', onClick:function(){ on[i]=!on[i]; b.setAttribute('aria-pressed', String(!!on[i])); upd(); }}, h('span', {class:'lbl'}, a.ai && pt.l==='我的尝试' ? '此前 AI 的输出' : pt.l), tpl(pt.t));
      parts.appendChild(b);
    });
    var sendBtn = h('button', {class:'btn ai', type:'button', disabled:'', onClick:function(){
      var needAll = d.parts.every(function(x,i){ return x.need ? !!on[i] : true; });
      var trapAny = d.parts.some(function(x,i){ return !x.need && !!on[i]; });
      var txt = d.parts.filter(function(x,i){return on[i];}).map(function(x){return tpl(x.t);}).join(' ');
      parts.querySelectorAll('.part').forEach(function(x){ x.disabled = true; });
      sendBtn.disabled = true;
      if(needAll && !trapAny){
        box.appendChild(h('div', {class:'feedback'}, h('span', {class:'verdict'}, '边界已修复。'), (a.ai ? '指明了此前 AI 的输出，点明了缺口，设定了任务和边界。这并不能补回缺失的学习者尝试。' : '尝试、缺口、任务、边界——而且没有再把任务委托出去的附加句。') + '与一开始就发送有边界的请求得分相同。', h('span', {class:'cls', html:'<b>'+CLS.sup+'</b>——AI 评析的是你做出的工作。'})));
        send(txt, 'repaired', 'bnd');
      } else {
        var why = trapAny ? '你保留的附加句要的是答案——一句话就足以把评析请求变回委托。' : '缺少了必要的部分（' + d.parts.filter(function(x,i){return x.need&&!on[i];}).map(function(x){return x.l.toLowerCase();}).join('、') + '）。AI 会用它自己的选择来填补这个缺口。';
        box.appendChild(h('div', {class:'feedback warn'}, h('span', {class:'verdict'}, '已发送，但仍有漏洞。'), why, h('span', {class:'cls', html:'<b>'+CLS.leak+'</b>——限制没有完全握在你手里。留意回来的是什么。'})));
        send(txt, 'partial', p.kind);
      }
    }}, '发送修正后的请求');
    var box = h('div', {class:'fixer'}, h('h3', null, '修正提示词'), h('p', null, '四个部件：你的尝试、那一个缺口、AI 的任务、边界。勾选属于的——并留意附加句。'), parts, h('div', {class:'assembled'}, h('div', {class:'lbl'}, '组装后的请求'), preview), h('div', {class:'actions'}, sendBtn));
    pickBox.appendChild(box); upd(); parts.querySelector('button').focus();
  }

  function sendAnyway(p){
    if(p.kind==='sub') send(tpl(p.t), 'whole', 'sub'); else send(tpl(p.t), 'asis', p.kind);
  }

  function typing(cb){
    var t = h('div', {class:'msg bot'}, h('div', {class:'typing', 'aria-label':'助手正在输入'}, h('i'), h('i'), h('i')));
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
    if(route==='partial'){ r.partial = true; r.leakKind = kind; noteMiss('bounded', '你在'+scenNo()+'发送的请求仍有漏洞'); }
    if(route==='asis'){ r.leakKind = kind; noteMiss('bounded', '你在'+scenNo()+'原样发送了一个没有边界的请求'); }
    if(route==='whole'){ r.status.C = 'given'; noteMiss('bounded', '你在'+scenNo()+'把整个任务发给了 AI'); }
    var record = buildReply(d, route, txt);
    r.consultations.push(record);
    tagClaims(r, record.reply.claims);
    var pts = route==='whole' ? -PTS.C.sendAnywayGiven : (route==='partial' ? PTS.C.partial : (R.final==='bnd' ? PTS.C.bnd : PTS.C[kind]));
    var entry = {k:'C', label:R.label, text:txt, reply:record.reply.text, claimIds:record.reply.claims.map(function(c){ return c.id; }), cls:R.cls, pts:pts, short:R.short};
    if(route==='whole') entry.given = true;
    trail(entry);
    if(route==='whole') giveAway(PTS.C.sendAnywayGiven, '发送了整个任务'); else settle('C', R.settle);
    body.appendChild(h('div', {class:'msg me', text:txt}));
    typing(function(){
      var leaky = record.variant==='leaky', whole = record.variant==='whole';
      var bot = h('div', {class:'msg bot'}, h('div', {class:'who'}, '助手'), replyLines(record.reply.text, leaky));
      if(!whole) bot.appendChild(h('div', {class:'foot-note'}, '（你将在 E 阶段逐条判定每个编号要点。）'));
      body.appendChild(bot);
      if(leaky){
        r.leaked = true; r.status.C = 'leaky';
        giveAway(LEAK_GIVEN, '有漏洞的请求');
        trail({k:'C', label:'AI 做了你的请求留下缺口的那部分', text:d.uninvited, cls:'leak', pts:-LEAK_GIVEN, short:'咨询：AI 越过限制作答', leak:true, claimId:sc.id+'-uninv'});
        pickBox.appendChild(h('div', {class:'feedback warn'}, h('span', {class:'verdict'}, '它从你留下的门走了进来。'), '最后一段正是你本该保留的部分——一个替你做出的决定，没有任何你能检查的推理。收到它不等于采纳它：你可以在 E 阶段拒绝或搁置它。如果你不这么做，它会在 T 阶段等着你。', h('span', {class:'cls', html:'<b>'+CLS.leak+'</b>——被委托出去的部分已记入你的轨迹。让出 −'+LEAK_GIVEN+'。'})));
      }
      if(whole){
        var a = attempt();
        pickBox.appendChild(h('div', {class:'feedback bad'}, h('span', {class:'verdict'}, '回来了一份完整解答。'), '它读起来很顺。它也含有错误——而且'+(a.ai ? '没有任何你的尝试可供它依托' : '它并不建立在你的 '+a.est+' 之上；它取代了你的数字')+'。在 E 阶段你将逐句判定这些话，因为那是仅剩的一步。', h('span', {class:'cls', html:'<b>'+CLS.sub+'</b>——你把整个任务交给了 AI，也没有设限。这个阶段算作 AI 的。'})));
      }
      var c = continueBtn(whole ? '评价回来的内容 →' : '评价回复 →', nextPhase);
      pickBox.appendChild(c); c.querySelector('button').focus();
    });
  }

  var node = h('div', null,
    phaseHead('C', '咨询——带着边界。', 'AI 直接进入的唯一阶段。有边界的请求要展示你的尝试、点明缺口、说明 AI 的任务，并限定它的角色。'),
    h('div', {class:'two'},
      h('div', null,
        h('p', {class:'ask-yourself'}, '"'+PHASE_META.C.ask+'"'),
        h('div', {class:'feedback ai', style:'margin:0 0 16px'}, h('span', {class:'verdict'}, '你的缺口。'), gapText),
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
var E_SEMANTICS = '接受 = 原样保留。修订 = 保留正确的部分，并说明改动什么。拒绝 = 把它排除出我的结果。';
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
  var at = {id:'a'+(r.attempts.length+1), parentId:prev ? prev.id : null, provenance:'learner', scaffolded:true, textAssessment:'not assessed', text:text, work:text, slip:'', ai:false,
            est:prev ? prev.est : '', ok:null, estimateStatus:'not parsed from revision',
            methodIdx:prev ? prev.methodIdx : null, methodShort:prev ? prev.methodShort : '', methodText:prev ? prev.methodText : '', methodOk:prev ? prev.methodOk : null, estIdx:prev ? prev.estIdx : null};
  r.attempts.push(at); r.attempt = at;
  r.revisions.push({phase:k, fromAttemptId:prev ? prev.id : null, toAttemptId:at.id, causedByClaimIds:claimId ? [claimId] : [], explanation:text});
  trail({k:k, label:'尝试已修订', text:text, prov:'revised', cls:'own', pts:0, claimId:claimId || null, short:'尝试已修订'});
  return at;
}
/* The inline "Revise my attempt" box (any language, ≥ 8 characters, Ctrl+Enter records). */
function reviseBox(claimId){
  var ta = h('textarea', {class:'free', rows:'3', 'aria-label':'写下修正后的步骤或数字', placeholder:'写下修正后的步骤或数字——任何语言均可，至少 8 个字符。'});
  var save = h('button', {class:'btn ghost', type:'button', disabled:'', onClick:submit}, '记录修订');
  var box = h('div', {class:'revise revise-attempt'}, h('label', null, h('span', {class:'lbl'}, '修订我的尝试'), ta), h('div', {class:'row'}, save, h('span', {class:'hint'}, '你的第一次尝试仍保留在轨迹上；这条会作为修订归档。Ctrl+Enter 记录。')));
  ta.addEventListener('input', function(){ save.disabled = Array.from(ta.value.trim()).length < 8; });
  ta.addEventListener('keydown', function(e){ if(e.key==='Enter' && (e.ctrlKey || e.metaKey) && !save.disabled){ e.preventDefault(); submit(); } });
  function submit(){
    if(save.disabled) return;
    var text = ta.value.trim(); ta.disabled = true; save.disabled = true;
    recordRevision(text, claimId);
    box.appendChild(h('div', {class:'feedback', style:'margin-top:8px'}, h('span', {class:'verdict'}, '修订已记录。'), '以"学习者修订"归档，与第一次尝试并列——第一次尝试保持原样。两者都不计分。'));
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
  function syncContinue(){ var b = cont.querySelector('button'); if(b){ b.disabled = pendingReturn>0; b.title = pendingReturn ? '请先完成或取消回访咨询' : ''; } }
  function syncReturnBtns(){ returnBtns.forEach(function(b){ if(r.returnUsed){ b.disabled = true; b.title = '每个情景只能进行一次有边界的回访咨询'; } }); }

  /* One verdict-and-reason picker. Used for the first judgment and, after a return consultation, for the one re-judgment.
     Revise opens a required "what do you keep, what changes?" field; the reasons enable once it has ≥ 8 characters. */
  function judgeUI(c, i, pass, onDecide){
    var verdict = null, ta = null;
    var vs = h('div', {class:'verdicts', role:'group', 'aria-label':(c.unsolicited ? '对未经请求的建议' : '对第 '+(i+1)+' 点')+(pass===2 ? '的修订判定' : '的判定')});
    var reviseBox = h('div'), reasonsBox = h('div');
    vs.appendChild(h('span', {class:'vlab'}, c.unsolicited ? (pass===2 ? '重新判定：' : '未经请求：') : (pass===2 ? '重新判定第 '+(i+1)+' 点：' : '第 '+(i+1)+' 点：')));
    ['accept','revise','reject'].forEach(function(v){
      var b = h('button', {class:'vbtn '+v, type:'button', 'aria-pressed':'false', onClick:function(){
        verdict = v; vs.querySelectorAll('.vbtn').forEach(function(x){ x.setAttribute('aria-pressed', String(x===b)); });
        vs.setAttribute('data-keys-off', '');   // number keys now address the reasons
        showReasons();
      }}, VERDICT_LABEL[v]);
      vs.appendChild(b);
    });
    function ready(){ return verdict!=='revise' || (ta && Array.from(ta.value.trim()).length >= 8); }
    function showReasons(){
      reviseBox.innerHTML = ''; reasonsBox.innerHTML = ''; ta = null;
      var rb = h('div', {class:'reasons'}, h('div', {class:'lbl'}, '因为……'));
      var shuffled = c.reasons.slice();
      if(i%3===1) shuffled.push(shuffled.shift()); else if(i%3===2) shuffled.unshift(shuffled.pop());   // stable pseudo-shuffle so the good reason isn't always first
      var btns = shuffled.map(function(rr){ return h('button', {class:'rbtn', type:'button', onClick:function(){ if(ready()) finish(rr); }}, rr.t); });
      btns.forEach(function(b){ rb.appendChild(b); });
      function sync(){ var ok = ready(); btns.forEach(function(b){ b.disabled = !ok; }); rb.classList.toggle('waiting', !ok); }
      if(verdict==='revise'){
        ta = h('textarea', {class:'free', rows:'2', 'aria-label':'你保留什么，改动什么？', placeholder:'你保留什么，改动什么？任何语言均可；至少 8 个字符。'});
        ta.addEventListener('input', sync);
        ta.addEventListener('keydown', function(e){ if(e.key==='Enter' && (e.ctrlKey || e.metaKey) && ready()){ e.preventDefault(); btns[0].focus(); } });
        reviseBox.appendChild(h('div', {class:'revise'}, h('label', null, h('span', {class:'lbl'}, '修订——你保留什么，改动什么？'), ta), h('div', {class:'hint'}, '然后按 Tab 或 Ctrl+Enter 进入理由。')));
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
    function revealExplain(){ if(explained) return; explained = true; explainBox.appendChild(h('div', {class:'reveal explain'}, h('b', null, '这个案例说明了什么。'), c.explain)); }
    function decide(pass){ return function(verdict, rr, expl){
      if(!currentE()) return;
      if(pass===2){ pendingReturn = Math.max(0, pendingReturn-1); syncContinue(); }
      var suffix = {invalid_technical_reason:' · 误解', unsupported_authority:' · 信任', convenience:' · 图方便'}[rr.kind] || '';
      var reasonChip = h('span', {class:'rkind '+rr.kind}, '你的理由：'+REASON_KIND[rr.kind].label);
      var valid = rr.kind==='valid_evidence', credited, canonical, pts = 0, head, body = '', flag = rr.flag || null;
      var beforeCredit = r.phasePts.E || 0;
      var j = {claimId:c.id, claimText:c.t, claimType:c.type, verdict:verdict, reasonText:rr.t, reasonKind:rr.kind, pass:pass, pts:0, canonical:false, credited:false, explanation:expl || null};
      if(c.unsolicited){
        /* Not point-scored: a boundary matter, not a planted computation. Credited when the reason's flag allows the verdict —
           reject with any flag excludes it; revise with "unsupported" holds it pending evidence; accept adopts it. */
        credited = rr.ok.indexOf(verdict) >= 0; canonical = credited;
        if(verdict==='accept'){ head = '收到了——现在也采纳了。'; body = '收到一条建议不等于采纳它。接受这一条，就把一个你没有要求、也什么都没检验的决定放进了你的结果。'; }
        else if(credited && verdict==='reject'){ head = '已排除出你的结果。'; body = '标记为'+FLAG_LABEL[flag]+'——理由已记录，这条建议出局。'; }
        else if(credited){ head = '搁置待证。'; body = '在证据到来之前它不进入你的结果——而本情景中不会有证据到来，所以它始终在外。'; }
        else if(flag){ head = '这个理由足以排除它。'; body = '超出你请求范围的建议，或违反约束的建议，不是搁置——而是出局。只有"无依据"才换来搁置待证。'; }
        else { head = '判定对了——但"因为"很重要。'; }
        j.flag = flag; j.unsolicited = true; j.credited = credited; j.canonical = credited;
        r.judgments.push(j);
        r.uninvitedJudged = {verdict:verdict, flag:flag, credited:credited};
        pop(0, credited ? (verdict==='reject' ? '已排除——不涉及分数' : '搁置待证') : (verdict==='accept' ? '采纳了未经请求的决定' : '未排除'));
      } else {
        var s = scoreJudgment(c, verdict, rr); pts = s.pts; credited = s.pairOK; canonical = s.vOK;
        j.pts = pts; j.canonical = canonical; j.credited = credited;
        /* The judgment is the record; badges and the debrief counters are derived from it later (judgmentStats), never kept in step by hand.
           A pass-2 judgment is credited under the PTS.E.rejudged cap inside creditFor('E'). */
        r.judgments.push(j);
        head = credited ? (verdict===c.best ? '判定正确，理由也正确。' : '站得住——而且有依据。') : (canonical ? '判定对了——但"因为"很重要。' : '应当的判定是：'+VERDICT_LABEL[c.best]+'。');
        settle('E', pass===2 ? '修订后的判定' : (credited ? '凭证据判定' : (canonical ? (rr.kind==='invalid_technical_reason' ? '判定对，论证错' : '判定对，理由弱') : '判错了')));
      }
      if(credited && verdict==='revise' && expl) r.revisions.push({phase:'E', causedByClaimIds:[c.id], explanation:expl, kind:'verdict'});
      card.classList.remove('right', 'half', 'wrong'); card.classList.add(credited && valid ? 'right' : (canonical ? 'half' : 'wrong'));
      var reveal = h('div', {class:'reveal'}, h('b', null, head+' '), body + (valid ? '' : reasonTail(rr)), h('span', {class:'etype '+(c.type==='ok'?'ok':'')}, TYPE_LABEL[c.type]), reasonChip);
      if(expl) reveal.appendChild(h('div', {class:'expl'}, h('span', {class:'prov'}, PROV.learner), ' 改动内容："'+expl+'"'));
      area.appendChild(reveal);
      var tag = c.unsolicited ? (credited ? (verdict==='reject' ? '（已排除）' : '（已搁置）') : (verdict==='accept' ? '（已采纳）' : '（未排除）')) : (credited ? (verdict===c.best ? '（正确）' : '（站得住）') : (canonical ? '（正确）' : '（应为'+VERDICT_LABEL[c.best]+'）'));
      var entry = {k:'E', label:(pass===2 ? '修订后的判定（回访问题点明了纠正之后）——' : '首次判定——')+(c.unsolicited ? '未经请求的建议：' : '')+VERDICT_LABEL[verdict]+tag,
                   text:'"'+c.t+'"——因为：'+rr.t+(expl ? '\n改动内容：'+expl : ''), cls:(c.unsolicited && verdict==='accept' ? 'sub' : 'own'), pts:c.unsolicited ? 0 : (r.phasePts.E || 0)-beforeCredit, rawPts:pts,
                   short:(pass===2 ? '重新判定 ' : '')+(c.unsolicited ? '未经请求：' : '第 '+(i+1)+' 点：')+VERDICT_LABEL[verdict]+(canonical ? ' ✓' : ' ✗')+suffix, reasonKind:rr.kind, claimId:c.id, pass:pass, unsolicited:!!c.unsolicited};
      if(expl) entry.prov = 'learner';
      trail(entry);   // filed in the order judged; the claim id on the entry says which point it was
      if(pass===1){ done++; if(done===list.length) finishE(); }
      if(pass===1 && !(credited && valid)) showGapBar(); else revealExplain();
    }; }
    /* After a judgment that was not credited on evidence: revise the attempt, check a reference, or return to C once — or continue. */
    function showGapBar(){
      var fu = followupFor(sc, c);
      var bar = h('div', {class:'gapbar'}, h('span', {class:'lbl'}, '出现了一个缺口。现在怎么办？'));
      var b1 = h('button', {class:'btn ghost', type:'button', onClick:function(){ bar.remove(); area.appendChild(reviseBox(c.id)); revealExplain(); }}, '修订我的尝试');
      var b2 = h('button', {class:'btn ghost', type:'button', onClick:function(){ bar.remove(); revealExplain(); openTray(c.evidenceHint); }}, '查阅参考资料');
      var b3 = fu ? h('button', {class:'btn ghost', type:'button', onClick:function(){ bar.remove(); returnToC(fu); }}, '带着这个问题回到 C') : null;
      var b4 = h('button', {class:'btn ghost', type:'button', onClick:function(){ bar.remove(); revealExplain(); }}, '继续');
      bar.appendChild(b1); bar.appendChild(b2); if(b3){ bar.appendChild(b3); returnBtns.push(b3); } bar.appendChild(b4);
      area.appendChild(bar); syncReturnBtns(); b1.focus();
    }
    /* Return to C: one bounded consultation per scenario. The question is pre-written and editable; the boundary sentence is fixed; the reply
       is critique only — no new number, no verdict. Then this point may be re-judged once, under the pass-2 cap. */
    function returnToC(fu){
      r.returnUsed = true; pendingReturn++; syncReturnBtns(); syncContinue(); updateHUD();
      var fixed = '不要重新计算，也不要给出结论。';
      var q = h('textarea', {class:'free', rows:'2', 'aria-label':'你的有边界的问题'}); q.value = fu.q;
      var chat = h('div', {class:'chat return'}, h('div', {class:'bar'}, h('span', {class:'led'}), '回到 C · 一次有边界的咨询 · 脚本化练习案例'), h('div', {class:'body'}));
      var body = chat.querySelector('.body');
      var sendBtn = h('button', {class:'btn ai', type:'button', onClick:sendReturn}, '发送这个问题');
      var compose = h('div', {class:'compose'}, h('div', {class:'lbl'}, '你的问题——可以随意编辑；边界句是固定的'), q, h('div', {class:'fixed'}, fixed), h('div', {class:'row'}, sendBtn, h('span', {class:'hint'}, '这条论断的回复是固定的；你的编辑会被保存，但不会被解读。它不给新数字，也不给结论。之后你可以重新判定一次。')));
      compose.appendChild(h('button', {class:'btn ghost', type:'button', onClick:function(){
        chat.remove(); pendingReturn--; r.returnUsed = false; returnBtns.forEach(function(b){ b.disabled = false; }); syncContinue(); updateHUD(); revealExplain();
      }}, '取消这次追问'));
      body.appendChild(compose);
      function sendReturn(){
        var qt = q.value.trim() || fu.q, request = qt + (qt.indexOf(fixed) >= 0 ? '' : ' '+fixed);
        compose.remove();
        var recd = deepFreeze({id:'k'+(r.consultations.length+1), kind:'return', claimId:c.id, request:request, reply:{text:fu.reply}, at:Date.now()});
        r.consultations.push(recd);
        trail({k:'C', label:'回访咨询（有边界）', text:request+'\n——'+fu.reply, cls:'sup', pts:0, short:'咨询：有边界的回访问题', claimId:c.id});
        body.appendChild(h('div', {class:'msg me', text:request}));
        var t = h('div', {class:'msg bot'}, h('div', {class:'typing', 'aria-label':'助手正在输入'}, h('i'), h('i'), h('i')));
        body.appendChild(t);
        setTimeout(function(){
          if(!currentE()) return;
          t.remove();
          body.appendChild(h('div', {class:'msg bot'}, h('div', {class:'who'}, '助手'), fu.reply, h('div', {class:'foot-note'}, '（只有评析——没有重新计算，没有结论。判定仍然由你来做。）')));
          var ui = judgeUI(c, i, 2, decide(2));
          area.appendChild(h('div', {class:'rejudge'}, h('div', {class:'lbl'}, '重新判定这一点——修订后的判定最多得 '+PTS.E.rejudged+' 分（满分 '+(PTS.E.verdict+PTS.E.reason)+'）'), ui));
          ui.querySelector('.vbtn').focus();
        }, reduceMotion ? 50 : 900);
      }
      area.appendChild(chat); q.focus();
    }
    if(c.unsolicited) card.classList.add('uninv');
    card.appendChild(h('div', {class:'n'}, c.unsolicited ? '助手 · 未经请求——超出请求范围' : '助手 · 第 '+(i+1)+' 点，共 '+numbered+' 点'));
    card.appendChild(h('div', {class:'txt', text:c.t}));
    card.appendChild(judgeUI(c, i, 1, decide(1)));
    card.appendChild(area); card.appendChild(explainBox);
    claims.appendChild(card);
  });
  function finishE(){
    fb.appendChild(h('div', {class:'feedback'}, h('span', {class:'verdict'}, '全部 '+list.length+' 条已判定。'), '这份回复带有 '+planted+' 处预设错误'+(record.variant==='leaky' ? '，外加一条你没有要求的建议' : '')+'。每个判定都有记录在案的理由——正是这一点把"我检查过了"变成了证据。'));
    if(!r.revisions.some(function(v){ return v.toAttemptId; })){
      var box = h('div');
      var end = h('div', {class:'gapbar'}, h('span', {class:'lbl'}, '就整份回复而言：'),
        h('button', {class:'btn ghost', type:'button', onClick:function(){ end.remove(); box.appendChild(reviseBox(null)); }}, '修订我的尝试'),
        h('button', {class:'btn ghost', type:'button', onClick:function(){ openTray(); }}, '查阅参考资料'));
      fb.appendChild(end); fb.appendChild(box);
    }
    cont.appendChild(continueBtn('转化与迁移 →', nextPhase)); syncContinue(); cont.querySelector('button').focus();
  }
  if(!record){ fb.appendChild(h('div', {class:'feedback warn'}, h('span', {class:'verdict'}, '没有记录任何回复。'), 'C 阶段没有发送任何内容，所以这里没有可判定的东西。')); cont.appendChild(continueBtn('转化与迁移 →', nextPhase)); }
  var circular = h('button', {class:'btn ghost', type:'button', onClick:function(){
    giveAway(PTS.E.circularGiven, '循环检查'); noteMiss('gate', '你在'+scenNo()+'让第二个 AI 去验证第一个');
    trail({k:'E', label:'让第二个 AI 去验证第一个', text:'第二个助手："我看是对的——推理全程都很严谨。"', cls:'sub', pts:-PTS.E.circularGiven, short:'评价：循环的 AI 检查', given:true});
    circular.disabled = true;
    fb.appendChild(h('div', {class:'feedback bad'}, h('span', {class:'verdict'}, '"我看是对的——推理全程都很严谨。"'), '第二个模型赞同了第一个，连错误一起赞同。另一个模型的赞同不是独立证据。有什么计算、来源或观察支持这个论断？这里什么都没算——这是循环验证，它让你付出了代价，却什么都没检验。', h('span', {class:'cls', html:'<b>'+CLS.sub+'</b>——把判定本身也卸载了。'})));
  }}, '让另一个 AI 再核对一遍');
  /* Phase E is the tallest screen in the game: with the second card open, the first claim and its numbers are off the top of a
     laptop viewport. The correct rejection of the free-jet claim turns on a contradiction with the reply's OWN first sentence,
     so that sentence has to stay reachable while the second card is being judged. One sticky line, not a second copy. */
  var pin = (record && list.length > 1) ? h('div', {class:'reply-pin'},
      h('b', null, '回复，第 1 点：'), firstSentence(list[0].t),
      h('button', {class:'pin-open', type:'button', onClick:function(){
        var dt = node.querySelector('details.reply-full');
        if(dt){ dt.open = true; dt.scrollIntoView({behavior:reduceMotion?'auto':'smooth', block:'center'}); }
      }}, '打开完整回复')) : null;
  var node = h('div', null,
    phaseHead('E', '判定回来的内容。', '对每一点：接受、修订或拒绝——并选出理由。证据才是让判定算数的东西。'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '"'+PHASE_META.E.ask+'"'),
        h('div', {class:'semantics'}, E_SEMANTICS),
        rec().status.C==='given' ? (attempt().ai
          ? h('div', {class:'feedback warn', style:'margin:0 0 14px'}, h('span', {class:'verdict'}, '没有可以对照的尝试。'), 'AI 替你做了尝试，又做了整个任务，所以这些论断只能凭空判定。注意这有多难。')
          : h('div', {class:'feedback warn', style:'margin:0 0 14px'}, h('span', {class:'verdict'}, '它不建立在你的尝试之上。'), '你把任务交了出去，所以这个答案取代了你的 '+attempt().est+'，而不是评析它。用你自己的数字和你的问题界定来判定它——它们是你仅有的独立校核。')) : null,
        record ? replyPanel(record) : null,
        pin,
        claims, h('div', {class:'actions'}, circular, h('span', {class:'hint'}, '诱人的捷径。代价会显现。')), fb, cont,
        h('div', {class:'actions'}, h('span', {class:'hint'}, '提示：按 1–3 选判定，再按 1–3 选理由。选"修订"后，按 Tab 或 Ctrl+Enter 进入理由。'))),
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
  var opts = h('div', {class:'opts', role:'group', 'aria-label':'整合选项'});
  var topts = h('div', {class:'opts', role:'group', 'aria-label':'迁移陈述'});
  /* The transfer step keeps its OWN feedback node, below its options. Writing it into the shared `fb` above the options put it
     off-screen upward on a long T page and wiped the integrate feedback it should sit beside. */
  var tfb = h('div');
  var tBlock = h('div', {hidden:''}, h('div', {class:'sub-h'}, d.tq), topts, tfb);
  function showTransfer(){ tBlock.hidden = false; topts.querySelector('button').focus(); }
  function feedbackFor(o, stage){
    var a0 = r.attempts[0], uj = r.uninvitedJudged, canRepair = stage==='first' && !o.ok && !r.repairUsed, extra = '';
    if(o.trap && r.leaked){
      if(uj && uj.credited && uj.verdict==='reject') extra = ' 在 E 阶段你以"'+FLAG_LABEL[uj.flag]+'"排除了这条建议。它又回到了你的结果里'+(canRepair ? '——要修复吗？' : '。');
      else if(uj && uj.credited) extra = ' 在 E 阶段你把这条建议搁置待证。证据没有到来——而它现在成了你的设计'+(canRepair ? '——要修复吗？' : '。');
      else extra = ' 这是你的请求留下缺口时助手主动给出的建议——你没有要求它'+(uj && uj.verdict==='accept' ? '，你在 E 阶段接受了它' : '')+'，而它现在成了你的设计'+(canRepair ? '——要修复吗？' : '。');
    }
    else if(!o.ok && canRepair) extra = ' 你可以在下方修复它——修复前后都会记入你的轨迹。';
    else if(o.ok && a0 && !a0.ok && !a0.ai){
      var rv = r.revisions.filter(function(v){ return v.phase==='E' && v.explanation; }), att = rv.filter(function(v){ return v.toAttemptId; });
      var last = att.length ? att[att.length-1] : null;
      extra = last ? ' 你的第一次尝试是 '+a0.est+'；你在 E 阶段把它修订为"'+last.explanation+'"。' : ' 你第一次所选的估算值是 '+a0.est+'。这条建议是你所选的一个给定选项；没有记录你对计算的修订。';
    }
    var word = o.provisional ? '暂定——仍需检查。' : stage==='repaired' ? (o.ok ? '已修复——归你所有。' : '仍带有错误。') : (o.ok ? (o.needsData ? '归你所有——而且对数据很诚实。' : '归你所有。') : '一个错误漏了过去。');
    return h('div', {class:'feedback '+(o.ok?'':'bad')}, h('span', {class:'verdict'}, word), o.fb + extra);
  }
  d.opts.forEach(function(o, i){
    var b = h('button', {class:'opt', type:'button', onClick:function(){
      opts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
      opts.setAttribute('data-keys-off', '');
      b.classList.remove('dim'); b.classList.add(o.ok?'good':'bad');
      r.tInteg.first = {idx:i, ok:!!o.ok, text:o.t, needsData:!!o.needsData, provisional:!!o.provisional};
      settle('T', o.ok ? '暂定建议' : '带着错误');
      var pts = o.ok?PTS.T.integ:PTS.T.integWrong;
      fb.innerHTML=''; fb.appendChild(feedbackFor(o, 'first'));
      trail({k:'T', label:'暂定建议', text:o.t, prov:'option', cls:'own', pts:pts, short:'结果（暂定）：'+(o.ok?(o.needsData?'已要求数据':(o.provisional?'检查待完成':'正确')):(o.trap&&r.leaked?'未经请求的建议':'带有 AI 的错误'))});
      if(!o.ok && !r.repairUsed){
        choice.innerHTML = '';
        choice.appendChild(h('div', {class:'actions'},
          h('button', {class:'btn ghost', type:'button', onClick:function(){ r.repairUsed = true; choice.innerHTML = ''; openRepair(i); }}, '修复我的建议'),
          h('button', {class:'btn ghost', type:'button', onClick:function(){ r.repairUsed = true; choice.innerHTML = ''; showTransfer(); }}, '保留它，继续')));
        choice.querySelector('button').focus();
      } else showTransfer();
    }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), o.t);
    opts.appendChild(b);
  });
  function openRepair(firstIdx){
    var pick = null;
    var ropts = h('div', {class:'repair-opts', role:'group', 'aria-label':'修复后的建议'});
    var ta = h('textarea', {class:'free', rows:'2', 'aria-label':'改了什么，为什么？', placeholder:'改了什么，为什么？任何语言均可；至少 8 个字符。'});
    var submit = h('button', {class:'btn ghost', type:'button', disabled:'', onClick:doRepair}, '记录修复');
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
      settle('T', o.ok ? '建议已修复' : '修复后仍带有错误');
      trail({k:'T', label:'建议已修订', text:'修复前：'+first.text+'\n修复后：'+o.t+'\n因为：'+why, prov:'revised', cls:'own', pts:(r.phasePts.T || 0) - before, short:'结果已修订：'+(o.needsData ? '已要求数据' : (o.provisional ? '检查待完成' : (o.ok ? '正确' : '仍带有错误')))});
      fb.innerHTML=''; fb.appendChild(feedbackFor(o, 'repaired'));
      showTransfer();
    }
    repairBox.appendChild(h('div', {class:'repair'}, h('div', {class:'lbl'}, '修复——选出你现在愿意为之负责的建议'), ropts, h('label', null, h('span', {class:'lbl'}, '改了什么，为什么？'), ta), h('div', {class:'row'}, submit, h('span', {class:'hint'}, '修复前后都会记入你的轨迹。修复最多得 '+PTS.T.repaired+' 分（满分 '+PTS.T.integ+'）。Ctrl+Enter 记录。'))));
    ropts.querySelector('button:not([disabled])').focus();
  }
  d.topts.forEach(function(o, i){
    var b = h('button', {class:'opt', type:'button', onClick:function(){
      topts.querySelectorAll('.opt').forEach(function(x){ x.disabled = true; x.classList.add('dim'); });
      topts.setAttribute('data-keys-off', '');
      b.classList.remove('dim'); b.classList.add(o.v==='best'?'good':(o.v==='ok'?'meh':'bad'));
      r.tTransfer = {idx:i, v:o.v};
      settle('T', '已说出策略');
      var pts = PTS.T[o.v];
      tfb.innerHTML=''; tfb.appendChild(h('div', {class:'feedback '+(o.v==='best'?'':(o.v==='ok'?'warn':'bad'))}, h('span', {class:'verdict'}, o.v==='best'?'可迁移。':(o.v==='ok'?'只有半个策略。':'这是相反的教训。')), o.fb, h('span', {class:'cls', html:'<b>'+CLS.own+'</b>——比这道题活得更久的沉淀。'})));
      trail({k:'T', label:'迁移笔记', text:o.t, prov:'option', cls:'own', pts:pts, short:'迁移：'+({best:'最佳', ok:'尚可', weak:'薄弱'}[o.v] || o.v)});
      cont.innerHTML=''; cont.appendChild(continueBtn('情景复盘 →', nextPhase)); cont.querySelector('button').focus();
    }}, h('span', {class:'key', 'aria-hidden':'true'}, i+1), o.t);
    topts.appendChild(b);
  });
  var node = h('div', null,
    phaseHead('T', '把它变成你的，并带向前方。', '把你的决定整合成一个归你所有的结果，然后说出下一次你会怎样做得不同。'),
    h('div', {class:'two'},
      h('div', null, h('p', {class:'ask-yourself'}, '"'+PHASE_META.T.ask+'"'), lastReply() ? replyPanel(lastReply(), '重新打开 C 阶段的回复') : null, h('div', {class:'sub-h'}, d.iq), opts, fb, choice, repairBox, tBlock, cont, h('div', {class:'actions'}, keyHint())),
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
    giveAway(PTS.outside.peek, '在 C 之外偷看了'); noteMiss('gate', '你在'+scenNo()+'的 '+k+' 阶段打开了助手');
    if(k==='P' || k==='F' || k==='A') noteMiss('human', '你在'+scenNo()+'的 '+k+' 阶段、尝试之前咨询了 AI');
    trail({k:k, label:'在 C 之外咨询了 AI，随后关闭', text:text, cls:'peek', pts:-PTS.outside.peek, short:'在 '+k+' 阶段偷看了 AI——已关闭'});
    close();
    refreshSide();
  }
  function use(){
    if(S.lock) return;
    S.lock = true;
    giveAway(PTS.outside.use, k+' 阶段已让出'); noteMiss('gate', '你在'+scenNo()+'让 AI 做了 '+k+' 阶段');
    if(k==='P' || k==='F' || k==='A') noteMiss('human', '在'+scenNo()+'中，AI 在你尝试之前做了 '+k+' 阶段');
    if(k==='E'){ noteMiss('hunter', '在'+scenNo()+'中，AI 的自我检查未经判定就通过了'); }
    rec().status[k] = 'given';
    trail({k:k, label:'AI 做了 '+k+' 阶段——你使用了它', text:text, cls:'sub', pts:-PTS.outside.use, short:k+' 阶段交给了 AI', given:true});
    close();
    S.phase++;
    if(S.phase >= PHASES.length) debriefScreen(); else phaseScreen();
  }
  var consq = {
    P:'如果你使用它，就是 AI 说出了问题——并悄悄选定了什么才算完成。它遗漏了什么，你要到后面才会发现。',
    F:'如果你使用它，判据就是 AI 的。此后的每一次检查都会依据你从未审视过的假设——其中有些是错的。',
    A:'如果你使用它，就不会存在任何你自己的尝试。在 E 阶段你将没有任何东西可以用来对照 AI——而这个答案里有一个错误。',
    E:'模型重新检查自己的输出，只是同一个来源用了两次。什么都没有得到验证。如果你使用它，每一条论断——连同错误——都会未经判定就通过。',
    T:'如果你使用它，记录在案的教训就是 AI 的——而且是错误的教训。'
  }[k];
  modal = h('div', {class:'modal'},
    h('div', {class:'head'}, h('span', {class:'led'}), h('h3', {id:'mtitle'}, 'AI 助手 · '+k+' 阶段——在咨询关口之外'), h('span', {class:'warnp'}, 'C 之外')),
    h('div', {class:'body'},
      h('div', {class:'msg me', text: {P:'这里的问题是什么？', F:'我应该用哪些假设和判据？', A:'替我解出来。', E:'你能再核对一下你的答案吗？', T:'总结一下结果和我学到了什么。'}[k]}),
      h('div', {class:'msg bot'}, h('div', {class:'who'}, '助手'), text),
      h('div', {class:'consq', html:'<b>后果。</b>'+esc(consq)+' <b>查看即失去"守门人"徽章</b>'+((k==='P' || k==='F' || k==='A') ? '和"人先行"徽章' : '')+'。关闭扣 4 分；使用则改扣 18 分。这些是游戏规则；查看后拒绝与使用回复是分开记录的。'+(trayAllowed() ? ' 想不付代价地独立工作，请改用证据栏。' : '')})
    ),
    h('div', {class:'foot'},
      h('button', {class:'btn ghost', type:'button', onClick:dismiss}, '关闭——我自己来（−'+PTS.outside.peek+'）'),
      h('button', {class:'btn', type:'button', style:'border-color:var(--risk); color:var(--risk)', onClick:use}, isE ? '全部视为已验证并接受（−'+PTS.outside.use+'）' : '使用它并继续（−'+PTS.outside.use+'）')
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
  if(st.errorsCaught < st.errorsTotal) noteMiss('hunter', '在'+scenNo()+'中有一处预设错误漏了过去');
  if(st.uncritical) noteMiss('evidence', scenNo()+'中有一个判定依赖了助手的说法或图方便，而不是证据');
  var dims = dimensionsFor(r, sc); r.dims = dims;
  var shown = dims.filter(function(d){ return d.state!=='na'; }), yes = shown.filter(function(d){ return d.state==='yes'; }).length;
  var headline = yes===shown.length ? '所有练习检查点均已达成。' : shown.length+' 个练习检查点中达成了 '+yes+' 个。以下是轨迹的记录。';
  var clean = !r.given && !st.uncritical && r.promptFinal==='bnd';
  var subline = clean ? '没有任何东西被交出去；没有任何判定依赖助手的说法或图方便。' : (r.given ? '有些动作付出了练习分的代价。它们的使用或拒绝都记录在下方。' : '没有任何东西被明着交出去——但看看它是从哪里漏出去的。');
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
    var lab = given ? '交给了 AI' : (leaky ? '有漏洞 · '+pts+' / '+maxP : (k==='C' && r.repaired ? '边界已修复 · '+pts+' / '+maxP : pts+' / '+maxP));
    return h('div', {class:'row'}, h('b', {class:k==='P'?'p':(k==='C'?'c':''), text:k}), bar, h('span', {class:'lab'}, lab));
  });
  // Quiet offloading counts too: a request that leaked, and a verdict that rested on the assistant's say-so or on convenience.
  var losses = r.trail.filter(function(e){ return e.pts < 0 || e.leak || (e.pass!==2 && (e.reasonKind==='unsupported_authority' || e.reasonKind==='convenience')); });
  var lossBox = losses.length ? h('div', {class:'stat rise d4', style:'grid-column:1 / -1'}, h('h3', null, '分数代价与判定选择'),
      h('div', {class:'losses'}, losses.map(function(e){
        var note = e.reasonKind==='unsupported_authority' ? '——理由是助手的说法，不是证据' : (e.reasonKind==='convenience' ? '——理由是图方便，不是证据' : '');
        // Badge names what actually happened on this entry, not a blanket "leak": a real leaked request carries e.leak, while a
        // soft E-verdict loss carries its own reasonKind (trust / convenience) — those are judgment lapses, not leaks.
        var badge = e.pts<0 ? e.pts : (e.leak ? '漏洞' : (e.reasonKind==='unsupported_authority' ? '信任' : (e.reasonKind==='convenience' ? '图方便' : '软性')));
        return h('div', {class:'loss'+(e.pts<0?'':' soft')}, h('b', {text:e.k}), h('span', null, e.label+note), h('span', {class:'pts'}, badge));
      })),
      h('div', {class:'sub', style:'margin-top:8px'}, '全部都在你的轨迹上。没有一条是致命的——关键在于你能看见它们。')) : null;
  var tech = r.judgments.filter(function(j){ return j.pass===1 && j.reasonKind==='invalid_technical_reason'; });
  var techBox = tech.length ? h('div', {class:'stat rise d5', style:'grid-column:1 / -1'}, h('h3', null, '需要回顾的技术要点'),
      h('div', {class:'tech-list'}, tech.map(function(j){ return h('div', {class:'tech'}, h('code', null, claimTag(r, j.claimId)), h('span', null, '判定为'+VERDICT_LABEL[j.verdict]+'，理由："'+j.reasonText+'"——一个技术性误解，不是信任问题。')); })),
      h('div', {class:'sub', style:'margin-top:8px'}, '需要修补的物理知识，与思考被交出去的时刻分开列出。不扣徽章。')) : null;
  /* The three-field plan is folded INTO the debrief, directly under the score, rather than arriving as a separate screen after a
     page that already reads like an ending. One place to finish: read the score, write the plan, go to the trail. */
  var task = h('input', {class:'free', type:'text', 'aria-label':'用在哪项任务上？', placeholder:'例如：周四的明渠水流习题集', maxlength:'160'});
  var att = h('textarea', {class:'free', rows:'2', 'aria-label':'我会自己尝试或检查什么？', placeholder:'例如：在打开任何东西之前，先自己算出临界水深，带单位', maxlength:'400'});
  var help = h('textarea', {class:'free', rows:'2', 'aria-label':'我会请求什么帮助，保留哪个决定？', placeholder:'例如：AI 评析我的假设；结论由我来定', maxlength:'400'});
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
    h('h3', null, '迁移到你的真实工作中'),
    h('p', {class:'sub'}, '关于你下一次真实作业的三个简短字段。它会作为一份计划记入你的轨迹。'),
    h('div', {class:'plan-fields', style:'margin-top:12px'},
      h('label', null, h('span', null, '用在哪项任务上？'), task),
      h('label', null, h('span', null, '我会自己尝试或检查什么？'), att),
      h('label', null, h('span', null, '我会请求什么帮助，保留哪个决定？'), help)),
    nudge);
  var node = h('div', null,
    h('div', {class:'eyebrow rise'}, '复盘 · '+sc.title),
    h('h2', {class:'rise d1', style:'font-family:var(--serif); font-weight:600; font-size:clamp(26px,4vw,38px); margin:0 0 8px'}, headline),
    h('p', {class:'debrief-sub rise d1'}, subline),
    h('div', {class:'stat rise d2', style:'margin-bottom:22px'}, h('h3', null, '轨迹显示了什么'), dimList),
    h('div', {class:'debrief'},
      h('div', {class:'stat rise d3'}, h('h3', null, '练习得分'), h('div', {class:'bignum'}, net, h('small', null, ' / '+max)), h('div', {class:'sub'}, '保留 '+r.kept+' · 让出 '+r.given+' · 首轮抓住 '+st.errorsCaught+' / '+st.errorsTotal+' 处预设错误')),
      h('div', {class:'stat rise d3'}, h('h3', null, '各阶段练习分'), h('div', {class:'own'}, rows)),
      planBox, lossBox, techBox
    ),
    h('div', {class:'actions rise d5'},
      h('button', {class:'btn primary', type:'button', onClick:submitPlan}, '完成并查看我的轨迹 →'),
      h('span', {class:'hint'}, '任何语言均可。在最后一个字段按 Ctrl+Enter 完成。')
    )
  );
  render(node);
}

/* ---------- The three-field plan (folded into the debrief above) ---------- */
/* A plan, recorded as a plan: on which task, what the learner will attempt or check, what help they will request and what decision
   they keep. Validation checks only that the fields are filled — any script; no word list, no Latin-letter count, no pronoun test. */
function planFields(a, b, c){
  var vals = [a, b, c].map(function(x){ return String(x || '').trim(); });
  var names = ['任务', '你会自己尝试或检查什么', '你会请求什么帮助、保留哪个决定'];
  for(var i=0;i<3;i++){
    if(!vals[i] || Array.from(vals[i]).length < 2) return {i:i, msg:'请填写'+names[i]+'——任何语言都可以。'};
    if(/^(.)\1*$/u.test(vals[i])) return {i:i, msg:'这看起来只是一个重复的字符。请像对助教说话那样写下'+names[i]+'。'};
  }
  if(vals[0]===vals[1] && vals[1]===vals[2]) return {i:1, msg:'三个字段说的是同一件事。每个字段回答的是不同的问题。'};
  return null;
}

/* ---------- Results ---------- */
function dimShort(d){ return d.state==='yes' ? '已达成' : (d.state==='no' ? '未达成' : (d.state==='na' ? '不需要' : (d.id==='attempt' ? '已记录；独立完成未评估' : (d.id==='constraints' ? '检查待完成' : '部分达成')))); }
/* Plain-text and JSON exports of the trail. Valid only because records hold plain data (no DOM nodes, no SCENARIOS references). */
function trailText(){
  var res = S.result || {}, p = S.plan || {}, lines = [];
  lines.push('Flowline——思维轨迹', '内容版本 '+CONTENT_VERSION+' · '+new Date().toISOString().slice(0,10)+' · 练习得分 '+res.score+' / '+res.max+' · '+res.rank, '');
  SCENARIOS.forEach(function(sc, si){
    var r = S.scens[si]; if(!r) return;
    lines.push(sc.title+'——'+Math.max(0, r.kept-r.given)+' / '+scenMax(sc)+' 练习分');
    if(r.dims) r.dims.forEach(function(d){ lines.push('  · '+d.label+'：'+d.text+(d.evidence ? '——'+d.evidence : '')); });
    r.trail.forEach(function(e){
      lines.push('['+e.k+'] '+e.label+' · '+(CLS[e.cls] || e.cls)+' · '+(e.pts>0 ? '+' : '')+e.pts+(e.claimId ? ' · ['+claimTag(r, e.claimId)+']' : '')+(e.prov ? ' · '+PROV[e.prov] : '')+(e.reasonKind ? ' · '+REASON_KIND[e.reasonKind].label : ''));
      lines.push('    '+String(e.text).replace(/\n/g, '\n    '));
      if(e.reply) lines.push('    回复（原文）：'+String(e.reply).replace(/\n/g, '\n    '));
    });
    lines.push('');
  });
  lines.push('下一次真实作业的计划（只是计划，不是已证明的迁移）', '  用在哪项任务上？'+(p.task || ''), '  我会自己尝试或检查什么：'+(p.attempt || ''), '  我会请求什么帮助，保留哪个决定：'+(p.help || ''), '', 'P-FACET 模型 © Yupei Duan & Danielle Oprean，密苏里大学。');
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
  /* Rank is read off the points percentage and gated by the dimensions: Chief needs every applicable practice checkpoint met
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

  var trailNode = h('div', {class:'trail'}, h('h3', null, '你的思维轨迹'), h('p', {class:'note'}, '你决定的每一件事，按顺序排列，并标明每一行的来源。这就是 P-FACET 要产出的记录。'));
  SCENARIOS.forEach(function(sc, si){
    var r = S.scens[si]; if(!r) return;
    var box = h('div', {class:'trail-scen'}, h('h4', null, sc.title+'——'+Math.max(0,r.kept-r.given)+' / '+scenMax(sc)+' 练习分'));
    if(r.dims) box.appendChild(h('div', {class:'dims-line'}, r.dims.map(function(d){ return h('span', {class:'d '+d.state}, d.label+'：'+dimShort(d)); })));
    r.trail.forEach(function(e){
      var kcls = e.k==='P'?'p':(e.k==='C'?'c':''); if(e.given || e.cls==='sub') kcls = 'x';
      box.appendChild(h('div', {class:'tr'}, h('b', {class:'k '+kcls, text:e.k}), h('div', null,
        h('span', {class:'lab'}, e.label, e.claimId ? h('code', {class:'cid'}, '['+claimTag(r, e.claimId)+']') : null, h('span', {class:'cls '+e.cls}, CLS[e.cls]), e.prov ? h('span', {class:'prov'}, PROV[e.prov]) : null, e.reasonKind ? h('span', {class:'rkind '+e.reasonKind}, REASON_KIND[e.reasonKind].label) : null, ' ', h('span', {style:'color:var(--muted)'}, (e.pts>0?'+':'')+e.pts)),
        h('div', {class:'q', text:e.text}),
        e.reply ? h('div', {class:'reply-as'}, h('span', {class:'lab'}, '回复（原文）'), h('div', {class:'q', text:e.reply})) : null)));
    });
    trailNode.appendChild(box);
  });
  var p = S.plan || {};
  trailNode.appendChild(h('div', {class:'trail-scen plan-box'}, h('h4', null, '你对下一次真实作业的计划'), h('p', {class:'note'}, '只是计划，不是已证明的迁移——迁移要在下一次作业中才能显现。'),
    h('div', {class:'plan'}, h('div', null, h('b', null, '用在哪项任务上？'), p.task || ''), h('div', null, h('b', null, '我会自己尝试或检查什么：'), p.attempt || ''), h('div', null, h('b', null, '我会请求什么帮助，保留哪个决定：'), p.help || ''))));

  var status = h('span', {class:'copy-status', role:'status'});
  var node = h('div', null,
    h('div', {class:'rank rise'}, confetti,
      h('div', {class:'kicker'}, '练习等级'),
      h('h2', null, rank.name),
      h('p', null, rank.blurb),
      h('div', {class:'debrief', style:'margin-top:18px; text-align:left'},
        h('div', {class:'stat'}, h('h3', null, '练习得分'), h('div', {class:'bignum'}, net, h('small', null, ' / '+max)), h('div', {class:'sub'}, '占可得练习分的 '+pct+'%'+(isBest?' · 本浏览器中的新纪录':''))),
        h('div', {class:'stat'}, h('h3', null, '练习检查点'), h('div', {class:'bignum'}, demo, h('small', null, ' / '+dimsShown.length+' 已达成')), h('div', {class:'sub'}, (notDemo.length ? '仍未完成：'+notDemo.map(function(x){ return x.d.label.toLowerCase()+'——'+(x.d.state==='partial' ? '部分达成' : '未达成'); }).join('；') : '所有适用的练习检查点均已达成；独立表现未评估')+(naDims ? ' · '+naDims+' 个检查点不适用于本次运行，不计入' : '')))
      ),
      h('div', {class:'badges'}, BADGES.map(function(b){ return h('div', {class:'badge'+(earned[b.id]?'':' locked'), title:b.desc}, h('span', {class:'ico'}, b.ico), h('span', null, b.name, h('small', null, earned[b.id]?b.desc:'未获得——'+(S.miss[b.id] || b.desc)))); }))
    ),
    trailNode,
    h('p', {class:'note keep-note'}, '这份轨迹只保存在本浏览器中。你可以复制、下载或打印它；不会上传任何内容。'),
    h('div', {class:'actions'},
      h('button', {class:'btn primary', type:'button', onClick:function(){ S=null; titleScreen(); }}, '再玩一次'),
      h('a', {class:'btn anchor', href:'takeaway.html'}, '获取一页参考'),
      h('button', {class:'btn ghost', type:'button', onClick:function(){ copyText(trailText()).then(function(ok){ status.textContent = ok ? '已复制。' : '复制失败——请改用下载或打印。'; }); }}, '复制轨迹'),
      h('button', {class:'btn ghost', type:'button', onClick:function(){ status.textContent = downloadText('flowline-trail.txt', trailText(), 'text/plain;charset=utf-8') ? '正在下载 flowline-trail.txt' : '下载失败——请改用复制或打印。'; }}, '下载轨迹（.txt）'),
      h('button', {class:'btn ghost', type:'button', onClick:function(){ status.textContent = downloadText('flowline-trail.json', trailJSON(), 'application/json') ? '正在下载 flowline-trail.json' : '下载失败——请改用复制或打印。'; }}, '下载轨迹（.json）'),
      h('button', {class:'btn ghost', type:'button', onClick:function(){ document.querySelectorAll('details.reply-full').forEach(function(x){ x.open = true; }); window.print(); }}, '打印我的轨迹'),
      status
    ),
    h('p', {style:'margin-top:26px; font-family:var(--serif); font-style:italic; font-size:20px; text-align:center'}, '下一次 AI 帮你的时候，问一个问题：是谁在思考？')
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
