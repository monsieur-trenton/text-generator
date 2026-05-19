import { useState } from "react";

const FRAMEWORKS = {
  CEFR: {
    levels: ["A1","A2","B1","B2","C1","C2"],
    desc: { A1:"Découverte", A2:"Survie", B1:"Seuil", B2:"Avancé", C1:"Autonome", C2:"Maîtrise" },
    color: "#2563eb", badge: "CECRL",
  },
  ACTFL: {
    levels: ["Novice Low","Novice Mid","Novice High","Intermediate Low","Intermediate Mid","Intermediate High","Advanced Low","Advanced Mid","Advanced High","Superior","Distinguished"],
    desc: { "Novice Low":"Mots isolés","Novice Mid":"Listes de mots","Novice High":"Phrases simples","Intermediate Low":"Phrases personnelles","Intermediate Mid":"Phrases enchaînées","Intermediate High":"Paragraphes","Advanced Low":"Narration","Advanced Mid":"Argumentation","Advanced High":"Discours professionnel","Superior":"Abstraction","Distinguished":"Quasi-natif" },
    color: "#7c3aed", badge: "ACTFL",
  },
};

const LAYOUTS = [
  { id:"wordbank",  label:"Word bank",  note:"A1–B1 / Novice–Intermediate" },
  { id:"writeonly", label:"Write only", note:"No bank → full production"    },
];

function Spinner() {
  return <span style={{ display:"inline-block",width:13,height:13,border:"2px solid currentColor",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite",verticalAlign:"middle",marginRight:6 }}/>;
}
function Tag({ children, color }) {
  return <span style={{ fontSize:11,fontWeight:600,letterSpacing:"0.06em",padding:"2px 8px",borderRadius:4,background:color+"18",color,border:`1px solid ${color}44`,textTransform:"uppercase",display:"inline-block" }}>{children}</span>;
}
function Alert({ type="info", children }) {
  const m = { info:["var(--color-background-info)","var(--color-border-info)","var(--color-text-info)"], danger:["var(--color-background-danger)","var(--color-border-danger)","var(--color-text-danger)"] };
  const [bg,bd,tc] = m[type]||m.info;
  return <div style={{ background:bg,border:`0.5px solid ${bd}`,borderRadius:8,padding:"9px 14px",fontSize:13,color:tc,lineHeight:1.6 }}>{children}</div>;
}
function Toggle({ label, note, checked, onChange }) {
  return (
    <div onClick={()=>onChange(!checked)} style={{ display:"flex",alignItems:"flex-start",gap:10,padding:"10px 13px",borderRadius:8,border:`0.5px solid ${checked?"var(--color-border-info)":"var(--color-border-tertiary)"}`,background:checked?"var(--color-background-info)":"var(--color-background-primary)",cursor:"pointer",transition:"all 0.15s" }}>
      <div style={{ width:32,height:18,borderRadius:9,background:checked?"var(--color-text-info)":"var(--color-border-secondary)",position:"relative",flexShrink:0,marginTop:2,transition:"background 0.2s" }}>
        <div style={{ width:14,height:14,borderRadius:"50%",background:"white",position:"absolute",top:2,left:checked?15:2,transition:"left 0.2s" }}/>
      </div>
      <div>
        <div style={{ fontSize:13,fontWeight:500,color:checked?"var(--color-text-info)":"var(--color-text-primary)" }}>{label}</div>
        {note && <div style={{ fontSize:11,color:"var(--color-text-tertiary)",marginTop:2 }}>{note}</div>}
      </div>
    </div>
  );
}
function GapBlank({ answer, num, color }) {
  const underscores = "_".repeat(Math.max(8, (answer||"").length + 4));
  return (
    <span style={{ display:"inline-flex",alignItems:"baseline",gap:2,margin:"0 1px",whiteSpace:"nowrap" }}>
      <sup style={{ fontSize:"0.6em",fontWeight:700,color,fontFamily:"sans-serif",lineHeight:1 }}>{num}</sup>
      <span style={{ fontFamily:"monospace",letterSpacing:"0.04em",fontSize:"0.95em" }}>{underscores}</span>
    </span>
  );
}

function toMMDD(dateStr) {
  if (!dateStr) return null;
  const [, mm, dd] = dateStr.split("-");
  return `${mm}${dd}`;
}

function makeTitle(examDate, version) {
  const mmdd = toMMDD(examDate);
  const versionLabel = version ? `. Version ${version}` : "";
  return mmdd ? `Vocabulaire - ${mmdd}${versionLabel}` : `Vocabulaire${versionLabel}`;
}

function Sheet({ activity, framework, level, layout, examDate, version, fwColor, fwBadge, fwDesc }) {
  const [showKey, setShowKey] = useState(false);
  const title = makeTitle(examDate, version);
  const versionColor = version === "A" ? "#0891b2" : "#7c3aed";

  return (
    <div style={{ background:"var(--color-background-primary)",borderRadius:12,border:"0.5px solid var(--color-border-tertiary)",overflow:"hidden" }}>

      {/* Toolbar */}
      <div style={{ padding:"11px 18px",borderBottom:"0.5px solid var(--color-border-tertiary)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap" }}>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {version                      && <Tag color={versionColor}>Version {version}</Tag>}
          {activity.hasArticleChallenge && <Tag color="#0891b2">Article challenge</Tag>}
          {activity.hasVerbChallenge    && <Tag color="#059669">Conjugation challenge</Tag>}
          {activity.context             && <Tag color="#d97706">Contextualised</Tag>}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={()=>setShowKey(k=>!k)} style={{ fontSize:12,padding:"4px 12px" }}>
            {showKey?"Hide key":"Show key"}
          </button>
          <button onClick={()=>printSheet(title)} style={{ fontSize:12,padding:"4px 12px" }}>Print</button>
        </div>
      </div>

      <div id={`sheet-${version||"main"}`} style={{ padding:"26px 30px",fontFamily:"Georgia,serif" }}>

        {/* Title row */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18 }}>
          <div>
            <div style={{ fontSize:10,letterSpacing:"0.09em",textTransform:"uppercase",color:"var(--color-text-tertiary)",marginBottom:3,fontFamily:"sans-serif" }}>
              Exercice à trous
            </div>
            <div style={{ fontSize:20,fontWeight:700,letterSpacing:"0.01em" }}>{title}</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
            <span style={{ fontSize:13,fontWeight:700,padding:"4px 12px",borderRadius:6,background:fwColor+"18",color:fwColor,border:`1.5px solid ${fwColor}44` }}>
              {level} · {fwBadge}
            </span>
            <span style={{ fontSize:10,color:"var(--color-text-tertiary)",fontFamily:"sans-serif" }}>{fwDesc}</span>
          </div>
        </div>

        {/* Student fields */}
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:16,marginBottom:18,paddingBottom:16,borderBottom:"1px solid var(--color-border-tertiary)" }}>
          {["Nom / Prénom","Date","Note"].map((label,i)=>(
            <div key={i}>
              <div style={{ fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--color-text-tertiary)",marginBottom:4,fontFamily:"sans-serif" }}>{label}</div>
              <div style={{ borderBottom:"1.5px solid var(--color-text-primary)",height:22 }}/>
            </div>
          ))}
        </div>

        {/* Contextualization */}
        {activity.context && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#b45309",fontWeight:600,marginBottom:7,fontFamily:"sans-serif" }}>Mise en contexte</div>
            <div style={{ background:"#fffbeb",border:"0.5px solid #fcd34d",borderRadius:8,padding:"12px 16px" }}>
              <p style={{ fontSize:13,lineHeight:1.8,margin:"0 0 10px",fontStyle:"italic" }}>{activity.context.intro}</p>
              {activity.context.glossary?.length > 0 && (
                <div style={{ borderTop:"0.5px solid #fcd34d",paddingTop:9 }}>
                  <div style={{ fontSize:9,textTransform:"uppercase",letterSpacing:"0.08em",color:"#b45309",marginBottom:6,fontFamily:"sans-serif" }}>Vocabulaire utile</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:"4px 20px" }}>
                    {activity.context.glossary.map((g,i)=>(
                      <span key={i} style={{ fontSize:12 }}>
                        <strong>{g.word}</strong>
                        <span style={{ color:"var(--color-text-secondary)" }}> → {g.definition}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Challenge notes */}
        {(activity.hasArticleChallenge||activity.hasVerbChallenge) && (
          <div style={{ fontSize:11,fontStyle:"italic",color:"var(--color-text-secondary)",marginBottom:12,fontFamily:"sans-serif",lineHeight:1.6,borderLeft:"2px solid var(--color-border-tertiary)",paddingLeft:10 }}>
            {activity.hasArticleChallenge && <div>Pour les noms : indiquez l'article correct avec le nom.</div>}
            {activity.hasVerbChallenge    && <div>Pour les verbes : la banque donne l'infinitif — conjuguez à la forme correcte.</div>}
          </div>
        )}

        {/* Word bank */}
        {layout==="wordbank" && activity.wordBank?.length > 0 && (
          <div style={{ background:"var(--color-background-secondary)",borderRadius:8,padding:"10px 14px",marginBottom:14,border:"0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ fontSize:9,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--color-text-tertiary)",marginBottom:7,fontFamily:"sans-serif" }}>
              Banque de mots — {activity.wordBank.length} mots
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
              {activity.wordBank.map((w,i)=>(
                <span key={i} style={{ fontSize:13,padding:"2px 11px",border:"0.5px solid var(--color-border-tertiary)",borderRadius:4,fontStyle:w.isInfinitive?"italic":"normal" }}>
                  {w.word}
                  {w.isInfinitive && <span style={{ fontSize:9,verticalAlign:"super",marginLeft:2,fontFamily:"sans-serif",color:"var(--color-text-tertiary)" }}>inf.</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{ fontSize:12,fontStyle:"italic",color:"var(--color-text-secondary)",marginBottom:14,fontFamily:"sans-serif" }}>
          {layout==="wordbank"
            ? "Choisissez dans la banque de mots le terme qui convient et écrivez-le sur la ligne correspondante."
            : "Complétez chaque espace en écrivant le mot approprié sur la ligne."}
        </div>

        {/* Gapped text */}
        <div style={{ fontSize:15,lineHeight:2.6,marginBottom:24 }}>
          {activity.segments.map((seg,i)=>
            seg.type==="text"
              ? <span key={i}>{seg.value}</span>
              : <GapBlank key={i} answer={seg.answer} num={seg.num} color={fwColor}/>
          )}
        </div>

        {/* Answer key */}
        {showKey && (
          <div style={{ borderTop:"1.5px dashed var(--color-border-tertiary)",paddingTop:14 }}>
            <div style={{ fontSize:9,textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--color-text-tertiary)",marginBottom:10,fontFamily:"sans-serif" }}>
              Corrigé — à ne pas distribuer
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10 }}>
              {activity.gaps.map((g,i)=>(
                <div key={i} style={{ borderLeft:`2px solid ${fwColor}`,paddingLeft:8 }}>
                  <div style={{ fontSize:10,fontWeight:600,color:fwColor,fontFamily:"sans-serif",marginBottom:1 }}>[{i+1}]</div>
                  <div style={{ fontSize:13,fontWeight:500 }}>{g.answer}</div>
                  {g.wordbank!==g.answer && (
                    <div style={{ fontSize:10,color:"var(--color-text-tertiary)",fontStyle:"italic",fontFamily:"sans-serif" }}>banque : {g.wordbank}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function printSheet(title) {
  const sheets = document.querySelectorAll("[id^='sheet-']");
  if (!sheets.length) return;
  const combined = Array.from(sheets).map(s=>s.outerHTML).join('<hr style="border:none;border-top:3px dashed #ccc;margin:40px 0;page-break-after:always"/>');
  const w = window.open("","_blank");
  w.document.write(`<html><head><title>${title}</title>
  <style>
    body{font-family:Georgia,serif;padding:36px;max-width:680px;margin:0 auto;color:#111;font-size:14px;line-height:1.9}
    hr{page-break-after:always;border:none;border-top:2px dashed #ccc;margin:40px 0}
    @media print{body{padding:0}hr{margin:20px 0}}
    sup{font-size:0.6em;font-weight:700;font-family:sans-serif}
  </style></head><body>${combined}</body></html>`);
  w.document.close(); setTimeout(()=>{w.focus();w.print();},400);
}

function extractJSON(raw) {
  let text = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = Math.min(
    text.indexOf("{") === -1 ? Infinity : text.indexOf("{"),
    text.indexOf("[") === -1 ? Infinity : text.indexOf("["),
  );
  if (start === Infinity) return text;
  const endChar = text[start] === "{" ? "}" : "]";
  const end = text.lastIndexOf(endChar);
  return end === -1 ? text : text.slice(start, end + 1);
}

function getPriorLevel(framework, level) {
  const levels = FRAMEWORKS[framework].levels;
  const idx = levels.indexOf(level);
  return levels[Math.max(0,idx-1)];
}

function buildSegments(text, gaps) {
  let remaining = text;
  const segments = [];
  let n = 1;
  for (const gap of gaps) {
    const idx = remaining.indexOf(gap.original);
    if (idx===-1) continue;
    if (idx>0) segments.push({ type:"text",value:remaining.slice(0,idx) });
    segments.push({ type:"gap",num:n++,answer:gap.answer });
    remaining = remaining.slice(idx+gap.original.length);
  }
  if (remaining) segments.push({ type:"text",value:remaining });
  return segments;
}

async function buildWordBank(gaps, poolSize, layout, framework, level, verbMode, articleMode, callAI) {
  if (layout!=="wordbank") return [];
  const correctEntries = gaps.map(g=>({ word:g.wordbank, isInfinitive:verbMode&&g.pos==="verb" }));
  const extra = Math.max(0, poolSize - gaps.length);
  let extraWords = [];
  if (extra > 0) {
    const correctWords = correctEntries.map(e=>e.word.toLowerCase());
    const instr = `${framework} ${level}`;
    const raw = await callAI(
      `Generate ${extra} distractor words for a French word bank. Correct answers already present: ${correctWords.join(", ")}. Level: ${instr}. ${verbMode?"Verb distractors must be infinitives.":""} ${articleMode?"Noun distractors must be bare nouns (no article).":""} Do NOT duplicate: ${correctWords.join(", ")}. Return ONLY a JSON array: ["w1","w2"]`,
      "JSON-only. No markdown.",
      400
    );
    try { extraWords = JSON.parse(extractJSON(raw)).slice(0,extra).map(w=>({ word:w,isInfinitive:false })); }
    catch { extraWords = []; }
  }
  return [...correctEntries,...extraWords].sort(()=>Math.random()-0.5);
}

export default function App() {
  const [framework,   setFramework]   = useState("CEFR");
  const [level,       setLevel]       = useState("B1");
  const [topic,       setTopic]       = useState("");
  const [vocab,       setVocab]       = useState("");
  const [layout,      setLayout]      = useState("wordbank");
  const [maxGaps,     setMaxGaps]     = useState(5);
  const [poolSize,    setPoolSize]    = useState(10);
  const [articleMode, setArticleMode] = useState(false);
  const [verbMode,    setVerbMode]    = useState(false);
  const [contextMode, setContextMode] = useState(false);
  const [twoVersions, setTwoVersions] = useState(false);
  const [examDate,    setExamDate]    = useState("");
  const [activities,  setActivities]  = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [loadingMsg,  setLoadingMsg]  = useState("");
  const [error,       setError]       = useState("");
  const fw = FRAMEWORKS[framework];

  const callAI = async (userPrompt, system, maxTokens=2000) => {
    const body = { model:"claude-haiku-4-5-20251001", max_tokens:maxTokens, messages:[{ role:"user", content:userPrompt }] };
    if (system) body.system = system;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body:JSON.stringify(body),
    });
    const data = await res.json();
    if (data.error) throw new Error(`Claude API error: ${data.error.message}`);
    return data.content?.[0]?.text?.trim()||"";
  };

  const generate = async () => {
    if (!topic.trim()) { setError("Please enter a topic."); return; }
    if (!vocab.trim()) { setError("Please enter vocabulary words."); return; }
    setError(""); setActivities(null); setLoading(true);
    const vocabList = vocab.split(/[\n,]+/).map(v=>v.trim()).filter(Boolean);
    const sentenceCount = Math.max(6, Math.ceil(maxGaps*(twoVersions?2.2:1.5)));
    const instr = framework==="CEFR" ? `niveau ${level} du CECRL (${fw.desc[level]})` : `ACTFL ${level} (${fw.desc[level]})`;

    try {
      setLoadingMsg("Generating text and gaps…");
      const articleNote = articleMode ? `ARTICLE CHALLENGE: For noun gaps, "original" includes the article (e.g. "le chien"), "wordbank" is the bare noun, "answer" is article+noun.` : "";
      const verbNote    = verbMode    ? `CONJUGATION CHALLENGE: For verb gaps, "wordbank" is the infinitive, "answer" is the conjugated form in the text.` : "";
      const versionNote = twoVersions
        ? `TWO VERSIONS: Select TWO non-overlapping sets of ${maxGaps} gaps from the vocabulary — version_a_gaps and version_b_gaps. Each version must test DIFFERENT words so students seated together cannot share answers. If the vocabulary list is too short to fill both, reuse words but ensure the gap positions differ.`
        : `Select up to ${maxGaps} vocabulary items as gaps.`;

      const gapPrompt = `You are an expert French language teacher.

Topic: "${topic}"
Proficiency: ${instr}
Vocabulary: ${vocabList.join(", ")}
Text length: ${sentenceCount} sentences
${versionNote}
${articleNote}
${verbNote}

Instructions:
1. Write one coherent French text at the stated level, naturally using the vocabulary.
2. ${twoVersions ? "Return two gap sets (version_a_gaps, version_b_gaps) — each a different subset of vocabulary items gapped." : `Return up to ${maxGaps} gaps.`}
3. Each gap object: {"original":"...","answer":"...","wordbank":"...","pos":"verb|noun|adjective|other"}

Return ONLY valid JSON, no markdown:
${twoVersions ? `{
  "text": "...",
  "version_a_gaps": [{...}],
  "version_b_gaps": [{...}]
}` : `{
  "text": "...",
  "gaps": [{...}]
}`}`;

      const raw = await callAI(gapPrompt, "JSON-only responder. No markdown, no explanation.", 3000);
      let parsed;
      try { parsed = JSON.parse(extractJSON(raw)); }
      catch { console.error("Unparseable response:", raw); throw new Error("Could not parse the generated activity. Please try again."); }

      let context = null;
      if (contextMode) {
        setLoadingMsg("Generating mise en contexte…");
        const ctxRaw = await callAI(
          `Create a "Mise en contexte" block in French for a gap-fill exercise. Topic: "${topic}". Exercise level: ${instr}. Text: "${parsed.text}".
Write:
1. "intro": 2–3 sentences in French at ${getPriorLevel(framework,level)} level introducing the topic without revealing gap answers.
2. "glossary": 4–6 items — difficult words from the text, each with a short French definition (not a translation).
Return ONLY JSON: {"intro":"...","glossary":[{"word":"...","definition":"..."}]}`,
          "JSON-only. No markdown.", 800
        );
        try { context = JSON.parse(ctxRaw.replace(/```json|```/g,"").trim()); }
        catch { context = null; }
      }

      const hasArt  = g => articleMode && g.pos==="noun";
      const hasVerb = g => verbMode    && g.pos==="verb";

      const makeActivity = async (gaps, label) => {
        setLoadingMsg(`Building ${label ? "Version "+label : "activity"}…`);
        const wordBank = await buildWordBank(gaps, poolSize, layout, framework, level, verbMode, articleMode, callAI);
        return {
          fullText: parsed.text,
          gaps,
          segments: buildSegments(parsed.text, gaps),
          wordBank,
          context,
          hasArticleChallenge: gaps.some(hasArt),
          hasVerbChallenge:    gaps.some(hasVerb),
        };
      };

      if (twoVersions) {
        const [actA, actB] = await Promise.all([
          makeActivity(parsed.version_a_gaps||[], "A"),
          makeActivity(parsed.version_b_gaps||[], "B"),
        ]);
        setActivities({ a:actA, b:actB });
      } else {
        const actMain = await makeActivity(parsed.gaps||[], null);
        setActivities({ main:actMain });
      }

    } catch(e) {
      setError(e.message||"Something went wrong. Please try again.");
    } finally {
      setLoading(false); setLoadingMsg("");
    }
  };

  const sharedSheetProps = { framework, level, layout, examDate, fwColor:fw.color, fwBadge:fw.badge, fwDesc:fw.desc[level] };

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <h2 className="sr-only">French gap-fill activity generator</h2>

      <div style={{ padding:"1.5rem 0",display:"flex",flexDirection:"column",gap:18 }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
          <div>
            <div style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--color-text-tertiary)",marginBottom:3 }}>Générateur d'exercices</div>
            <div style={{ fontSize:20,fontWeight:500 }}>Gap-fill activity builder</div>
          </div>
          <div style={{ display:"flex",gap:6 }}>
            <Tag color="#c0392b">Claude</Tag>
            <Tag color="#e67e22">CamemBERT logic</Tag>
          </div>
        </div>

        <Alert>Preview mode — Claude handles text and distractor logic. The GitHub Pages version calls CamemBERT directly.</Alert>

        {/* Framework */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          {Object.entries(FRAMEWORKS).map(([key,f])=>(
            <button key={key} onClick={()=>{setFramework(key);setLevel(f.levels[0]);setActivities(null);}} style={{
              border:framework===key?`2px solid ${f.color}`:"0.5px solid var(--color-border-tertiary)",
              borderRadius:10,padding:"11px 14px",textAlign:"left",
              background:framework===key?f.color+"0c":"var(--color-background-primary)",transition:"all 0.15s",
            }}>
              <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:3 }}>
                <span style={{ fontSize:13,fontWeight:600,color:framework===key?f.color:"var(--color-text-primary)" }}>{key}</span>
                <span style={{ fontSize:10,color:f.color,background:f.color+"18",padding:"1px 6px",borderRadius:3,fontWeight:600 }}>{f.badge}</span>
              </div>
              <div style={{ fontSize:11,color:"var(--color-text-tertiary)" }}>{f.levels.length} levels · {f.levels[0]} → {f.levels[f.levels.length-1]}</div>
            </button>
          ))}
        </div>

        {/* Level */}
        <div>
          <div style={{ fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:7 }}>Proficiency level</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {fw.levels.map(l=>(
              <button key={l} onClick={()=>{setLevel(l);setActivities(null);}} style={{
                fontSize:12,padding:"5px 11px",borderRadius:6,
                border:level===l?`1.5px solid ${fw.color}`:"0.5px solid var(--color-border-tertiary)",
                background:level===l?fw.color:"transparent",
                color:level===l?"white":"var(--color-text-primary)",
                fontWeight:level===l?600:400,transition:"all 0.12s",
              }}>{l}</button>
            ))}
          </div>
          {level&&<div style={{ fontSize:11,color:"var(--color-text-tertiary)",marginTop:5 }}>{fw.desc[level]}</div>}
        </div>

        {/* Topic + Vocab */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div>
            <label style={{ fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",display:"block",marginBottom:6 }}>Topic / Thème</label>
            <input type="text" value={topic} onChange={e=>setTopic(e.target.value)}
              placeholder="e.g. l'environnement" style={{ width:"100%",fontSize:13 }}/>
          </div>
          <div>
            <label style={{ fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",display:"block",marginBottom:6 }}>
              Vocabulary <span style={{ fontWeight:400,color:"var(--color-text-tertiary)" }}>(comma or line separated)</span>
            </label>
            <textarea value={vocab} onChange={e=>setVocab(e.target.value)}
              placeholder={"manger, boire, le chien,\nrapide, admettre, soutient"}
              rows={3} style={{ width:"100%",fontSize:13,resize:"vertical",fontFamily:"var(--font-mono)" }}/>
          </div>
        </div>

        {/* Exam metadata */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div>
            <label style={{ fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",display:"block",marginBottom:6 }}>
              Exam date <span style={{ fontWeight:400,color:"var(--color-text-tertiary)" }}>(optional)</span>
            </label>
            <input type="date" value={examDate} onChange={e=>{setExamDate(e.target.value);setActivities(null);}}
              style={{ width:"100%",fontSize:13 }}/>
            {examDate && (
              <div style={{ fontSize:11,color:"var(--color-text-tertiary)",marginTop:4 }}>
                Title: <strong>{makeTitle(examDate, twoVersions?"A":null)}</strong>
              </div>
            )}
          </div>
          <div style={{ display:"flex",alignItems:"flex-start",paddingTop:22 }}>
            <Toggle
              label="Two versions (A / B)"
              note="Generates Version A and Version B with different gap selections to prevent copying"
              checked={twoVersions}
              onChange={v=>{setTwoVersions(v);setActivities(null);}}
            />
          </div>
        </div>

        {/* Rigor controls */}
        <div style={{ background:"var(--color-background-secondary)",borderRadius:10,padding:"14px 16px",border:"0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:14 }}>Rigor controls</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
            <div>
              <div style={{ fontSize:12,color:"var(--color-text-secondary)",marginBottom:7,fontWeight:500,display:"flex",justifyContent:"space-between" }}>
                <span>Number of gaps</span>
                <span style={{ fontSize:15,fontWeight:700,color:fw.color }}>{maxGaps}</span>
              </div>
              <input type="range" min={3} max={15} step={1} value={maxGaps}
                onChange={e=>{setMaxGaps(+e.target.value);setActivities(null);}} style={{ width:"100%" }}/>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--color-text-tertiary)",marginTop:3 }}>
                <span>3</span><span>15</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize:12,color:"var(--color-text-secondary)",marginBottom:7,fontWeight:500,display:"flex",justifyContent:"space-between" }}>
                <span>Word bank pool size</span>
                <span style={{ fontSize:15,fontWeight:700,color:fw.color }}>{poolSize}</span>
              </div>
              <input type="range" min={5} max={20} step={1} value={poolSize}
                onChange={e=>{setPoolSize(+e.target.value);setActivities(null);}} style={{ width:"100%" }}/>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--color-text-tertiary)",marginTop:3 }}>
                <span>5 (easier)</span><span>20 (harder)</span>
              </div>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
            <Toggle label="Article challenge"     note="Gaps omit the determiner"         checked={articleMode} onChange={v=>{setArticleMode(v);setActivities(null);}}/>
            <Toggle label="Conjugation challenge" note="Word bank shows infinitives"       checked={verbMode}    onChange={v=>{setVerbMode(v);setActivities(null);}}/>
            <Toggle label="Contextualisation"     note="Adds mise en contexte + glossary"  checked={contextMode} onChange={v=>{setContextMode(v);setActivities(null);}}/>
          </div>
        </div>

        {/* Layout */}
        <div>
          <div style={{ fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:7 }}>Exercise layout</div>
          <div style={{ display:"flex",gap:10 }}>
            {LAYOUTS.map(opt=>(
              <button key={opt.id} onClick={()=>setLayout(opt.id)} style={{
                flex:1,padding:"10px 14px",borderRadius:8,textAlign:"left",
                border:layout===opt.id?"2px solid var(--color-border-info)":"0.5px solid var(--color-border-tertiary)",
                background:layout===opt.id?"var(--color-background-info)":"var(--color-background-primary)",
                transition:"all 0.12s",
              }}>
                <div style={{ fontSize:13,fontWeight:500,color:layout===opt.id?"var(--color-text-info)":"var(--color-text-primary)",marginBottom:2 }}>{opt.label}</div>
                <div style={{ fontSize:11,color:"var(--color-text-tertiary)" }}>{opt.note}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <Alert type="danger">{error}</Alert>}

        <button onClick={generate} disabled={loading} style={{
          padding:"12px 0",borderRadius:8,fontSize:14,fontWeight:500,
          background:loading?"var(--color-background-secondary)":fw.color,
          color:loading?"var(--color-text-secondary)":"white",
          border:"none",transition:"all 0.15s",cursor:"pointer",
        }}>
          {loading?<><Spinner/>{loadingMsg}</>:twoVersions?"Generate Version A + Version B":"Generate activity"}
        </button>

        {/* Output */}
        {activities?.main && (
          <Sheet {...sharedSheetProps} activity={activities.main} version={null}/>
        )}
        {activities?.a && (
          <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
            <Sheet {...sharedSheetProps} activity={activities.a} version="A"/>
            <div style={{ borderTop:"2px dashed var(--color-border-tertiary)",paddingTop:4,textAlign:"center" }}>
              <span style={{ fontSize:11,color:"var(--color-text-tertiary)",fontFamily:"sans-serif",letterSpacing:"0.06em",textTransform:"uppercase" }}>— cut here —</span>
            </div>
            <Sheet {...sharedSheetProps} activity={activities.b} version="B"/>
          </div>
        )}
      </div>
    </>
  );
}
