"use client";

import { useState, useEffect } from "react";
import AuthorByline from "../../components/AuthorByline";

function InlineEmailCapture({ accentColor = "#7b6b9a", textColor = "#2a2f35", bgColor = "rgba(123,107,154,0.06)", borderColor = "rgba(123,107,154,0.12)" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email_address: email }) });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  };
  if (status === "done") return <div style={{ textAlign: "center", padding: "32px 20px", marginTop: 40, background: bgColor, borderRadius: 16, border: `1px solid ${borderColor}` }}><p style={{ fontSize: 18, color: accentColor, fontWeight: 500 }}>You're in! Check your inbox.</p></div>;
  if (status === "error") return <div style={{ textAlign: "center", padding: "32px 20px", marginTop: 40, background: bgColor, borderRadius: 16, border: `1px solid ${borderColor}` }}><p style={{ fontSize: 16, color: "#e07070", marginBottom: 12 }}>Something went wrong. Try again.</p><button onClick={() => setStatus("idle")} style={{ padding: "10px 24px", borderRadius: 10, background: accentColor, border: "none", color: "#fff", fontSize: 14, cursor: "pointer" }}>Retry</button></div>;
  return (
    <div style={{ textAlign: "center", padding: "32px 20px", marginTop: 40, background: bgColor, borderRadius: 16, border: `1px solid ${borderColor}` }}>
      <h3 style={{ fontSize: 18, marginBottom: 8, color: textColor, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Get one 60-second technique every week</h3>
      <p style={{ fontSize: 14, color: textColor, opacity: 0.5, marginBottom: 16 }}>Free. No spam. Unsubscribe anytime.</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, justifyContent: "center", maxWidth: 400, margin: "0 auto", flexWrap: "wrap" }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: "1 1 200px", padding: "12px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: "rgba(255,255,255,0.5)", color: "#2a2f35", fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
        <button type="submit" disabled={status === "loading"} style={{ padding: "12px 24px", borderRadius: 10, background: accentColor, border: "none", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", opacity: status === "loading" ? 0.6 : 1 }}>{status === "loading" ? "..." : "Subscribe"}</button>
      </form>
    </div>
  );
}

const STEPS = ["landing","breathe","dump","triage","mvd","accept","commit","close"];

export default function OverwhelmedPage() {
  const [step, setStep] = useState("landing");
  const [fk, setFk] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const [capacityLevel, setCapacityLevel] = useState(8);
  const [bPhase, setBPhase] = useState("ready");
  const [bCount, setBCount] = useState(0);
  const [bCycle, setBCycle] = useState(0);
  const [breathDone, setBreathDone] = useState(false);
  const [dumpText, setDumpText] = useState("");
  const [triageToday, setTriageToday] = useState("");
  const [triageWeek, setTriageWeek] = useState("");
  const [triageNot, setTriageNot] = useState("");
  const [mvd1, setMvd1] = useState("");
  const [mvd2, setMvd2] = useState("");
  const [mvd3, setMvd3] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [permission, setPermission] = useState("");
  const [oneAction, setOneAction] = useState("");
  const [postCapacity, setPostCapacity] = useState(5);

  useEffect(() => {
    if (step === "landing") return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [step, startTime]);

  const mins = Math.floor(elapsed / 60);
  const stepIdx = STEPS.indexOf(step);
  const progress = stepIdx <= 0 ? 0 : (stepIdx / (STEPS.length - 1)) * 100;
  const go = (s) => { setFk(k => k + 1); setStep(s); };

  // Breathing 4-2-8
  useEffect(() => {
    if (bPhase === "ready" || bPhase === "done") return;
    if (bCycle >= 3) { setBPhase("done"); setBreathDone(true); return; }
    const durations = { inhale: 4, hold: 2, exhale: 8 };
    const dur = durations[bPhase];
    setBCount(0);
    const ci = setInterval(() => setBCount(c => Math.min(c + 1, dur)), 1000);
    const t = setTimeout(() => {
      clearInterval(ci);
      if (bPhase === "inhale") setBPhase("hold");
      else if (bPhase === "hold") setBPhase("exhale");
      else { setBCycle(c => c + 1); setBPhase("inhale"); }
    }, dur * 1000);
    return () => { clearTimeout(t); clearInterval(ci); };
  }, [bPhase, bCycle]);

  const sz = bPhase === "inhale" ? 150 : bPhase === "hold" ? 150 : 75;
  const bLabel = bPhase === "inhale" ? "In" : bPhase === "hold" ? "Hold" : "Slow out";
  const wordCount = dumpText.split(/\s+/).filter(Boolean).length;
  const lineCount = dumpText.split("\n").filter(l => l.trim()).length;

  const ac = "#7b6b9a";
  const Btn = ({ onClick, children, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "16px 44px", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
      background: disabled ? "rgba(123,107,154,0.1)" : ac, color: disabled ? "rgba(123,107,154,0.3)" : "#fff",
      border: "none", borderRadius: 40, cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 600, width: "100%", maxWidth: 360,
    }}>{children}</button>
  );

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", background: "var(--bg-primary)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        textarea:focus,input:focus { outline:none; border-color:rgba(123,107,154,0.4) !important; }
        input[type="range"] { accent-color:${ac}; width:100%; }
        ::selection { background:rgba(123,107,154,0.2); }
        * { box-sizing:border-box; margin:0; }
      `}</style>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse at 30% 20%, rgba(123,107,154,0.04) 0%, transparent 50%)" }} />

      {step !== "landing" && (
        <div style={{ position:"fixed", top:60, left:0, right:0, height:3, background:"rgba(123,107,154,0.1)", zIndex:50 }}>
          <div style={{ height:3, background:ac, width:`${progress}%`, transition:"width 0.8s ease" }} />
        </div>
      )}

      {step !== "landing" && step !== "close" && (
        <div style={{ textAlign:"center", padding:"4px 0", fontSize:11, color:"var(--text-muted)", fontVariantNumeric:"tabular-nums" }}>{mins}:{(elapsed%60).toString().padStart(2,"0")}</div>
      )}

      <main style={{ maxWidth:540, margin:"0 auto", padding:"0 20px 80px", position:"relative", zIndex:5 }}>

        {step === "landing" && (
          <div key={fk} style={{ animation:"fadeUp 1s ease", paddingTop:"10vh" }}>
            <p style={{ fontSize:12, color:ac, letterSpacing:4, textTransform:"uppercase", marginBottom:20, fontWeight:500 }}>Overwhelm protocol</p>
            <h1 style={{ fontFamily:"'Newsreader', serif", fontSize:"clamp(30px,6vw,46px)", fontWeight:300, lineHeight:1.25, marginBottom:24 }}>Everything is<br/>too much<br/>right now.</h1>
            <AuthorByline />
            <p style={{ fontSize:15, lineHeight:1.9, color:"#5a5a62", marginBottom:20 }}>The to-do list has a to-do list. There's no visible starting point. You feel paralyzed, panicky, numb, or all three at once.</p>
            <p style={{ fontSize:15, lineHeight:1.9, color:"rgba(42,47,53,0.8)", marginBottom:20 }}>That's not weakness — it's a cognitive bottleneck. When the load gets too high, attention narrows, sequencing gets harder, and even obvious next steps can disappear. That's why overwhelm can make you feel scattered or stuck. You're not failing. Your system hit a limit.</p>
            <p style={{ fontSize:15, lineHeight:1.9, color:"rgba(42,47,53,0.8)", marginBottom:20 }}>There's a name for this: <strong>cognitive overload</strong>. Working memory can only hold a limited amount at once, and stress often makes that feel even smaller. When you're trying to carry dozens of obligations, worries, and emotions at the same time, the system jams. It's not a character flaw — it's overload.</p>
            <p style={{ fontSize:16, lineHeight:1.8, color:ac, marginBottom:20 }}>This protocol will take you from "I can't" to "I can do this one thing" in under 10 minutes. Seven steps. All evidence-based.</p>

            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:36 }}>
              {[{n:"1",l:"Check",d:"Measure your current overload level"},{n:"2",l:"Regulate",d:"Extended exhale breathing — 4-2-8 pattern"},{n:"3",l:"Externalize",d:"Brain dump everything onto the screen"},{n:"4",l:"Triage",d:"Sort chaos into today / this week / not mine"},{n:"5",l:"Minimum Viable Day",d:"If today is survival mode, what are the bare minimum 3 things?"},{n:"6",l:"Accept + Permit",d:"Radical acceptance + give yourself permission"},{n:"7",l:"One Action",d:"The smallest possible next move"}].map(s => (
                <div key={s.n} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"10px 14px", background:"rgba(255,255,255,0.5)", borderRadius:10, border:"1px solid #e0dbd3" }}>
                  <span style={{ fontFamily:"'Newsreader', serif", fontSize:18, color:ac, minWidth:22 }}>{s.n}</span>
                  <div><span style={{ fontSize:13, fontWeight:600 }}>{s.l}</span><p style={{ fontSize:11, color:"#5a5a62", marginTop:1, lineHeight:1.4 }}>{s.d}</p></div>
                </div>
              ))}
            </div>

            <div style={{ textAlign:"center" }}><Btn onClick={() => go("breathe")}>Let's slow it down</Btn></div>
            <p style={{ fontSize:10, color:"#5a5a62", opacity:0.4, marginTop:32, lineHeight:1.7, textAlign:"center" }}>Clinician-informed by Kevin, a psychiatric nurse practitioner candidate. Local-first where supported.</p>

            <InlineEmailCapture />
          </div>
        )}

        {step === "breathe" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 1 of 7</p>
            <h2 style={{ fontFamily:"'Newsreader', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>Bring your brain back online</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#5a5a62", marginBottom:6 }}>Overwhelm often comes with shallow breathing, tight chest, and narrowed thinking. This 4-2-8 pattern uses a longer exhale to help your system downshift. Three cycles is often enough to create a little more room.</p>
            <p style={{ fontSize:13, color:ac, opacity:0.8, marginBottom:20 }}>4 in. 2 hold. 8 slow out. Three cycles.</p>

            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, padding:"12px 0" }}>
              {bPhase === "ready" ? (
                <Btn onClick={() => setBPhase("inhale")}>Begin</Btn>
              ) : bPhase === "done" ? (
                <div style={{ textAlign:"center" }}>
                  <p style={{ fontSize:18, fontFamily:"'Newsreader', serif", color:ac }}>Better. Your exhale was twice your inhale.</p>
                  <p style={{ fontSize:13, color:"#5a5a62", marginTop:6 }}>Your system is starting to come back online.</p>
                </div>
              ) : (
                <>
                  <div style={{ width:180, height:180, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:sz, height:sz, borderRadius:"50%", transition:"all 2.2s ease-in-out", background:`radial-gradient(circle, rgba(123,107,154,0.2) 0%, rgba(123,107,154,0.02) 100%)`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                      <span style={{ fontSize:11, letterSpacing:4, color:ac, textTransform:"uppercase" }}>{bLabel}</span>
                      <span style={{ fontSize:28, fontWeight:300, fontFamily:"'Newsreader', serif" }}>{bCount}</span>
                    </div>
                  </div>
                  <span style={{ fontSize:11, color:"#5a5a62", letterSpacing:2 }}>{Math.min(bCycle+1,3)} / 3</span>
                </>
              )}
            </div>
            {breathDone && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("dump")}>Next: Empty your head</Btn></div>}
          </div>
        )}

        {step === "dump" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 2 of 7</p>
            <h2 style={{ fontFamily:"'Newsreader', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>Empty your head completely</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#5a5a62", marginBottom:6 }}>Your brain is recycling the same worries because it's terrified of dropping one. The solution: move EVERYTHING from internal storage to external storage. Every task, worry, obligation, "I should," half-finished thought, unnamed dread. Don't organize. Don't prioritize. Don't judge. Just dump.</p>
            <p style={{ fontSize:14, lineHeight:1.8, color:ac, opacity:0.8, marginBottom:20 }}>Aim for at least 10 items. The messier, the better — this isn't about clarity yet, it's about extraction.</p>

            <textarea value={dumpText} onChange={e => setDumpText(e.target.value)} placeholder={"Work deadline Friday...\nHaven't responded to Sarah's text...\nApartment is a mess...\nThat thing I said last week...\nDentist appointment I keep canceling...\nMoney stuff I'm avoiding...\nI'm exhausted but can't sleep...\nMom's birthday...\nI don't feel like I'm doing enough...\nGroceries...\nThat project I said yes to but shouldn't have..."} rows={10} style={{ width:"100%", padding:18, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.6)", border:"1px solid #e0dbd3", borderRadius:14, color:"#2a2f35", resize:"vertical", lineHeight:1.8 }} />

            {wordCount > 0 && <p style={{ fontSize:12, color:ac, opacity:0.6, marginTop:8 }}>{lineCount} items, {wordCount} words externalized.{lineCount >= 10 ? " That's a full working memory dump." : " Keep going — get everything out."}</p>}

            <div style={{ padding:16, background:"rgba(123,107,154,0.04)", borderRadius:12, border:"1px solid rgba(123,107,154,0.08)", marginTop:16 }}>
              <p style={{ fontSize:12, color:"#5a5a62", lineHeight:1.7 }}><strong style={{ color:ac }}>Why this can help:</strong> Externalizing worries onto paper or a screen often makes them feel more manageable. Once your brain no longer has to hold every item internally, it becomes easier to sort, sequence, and choose one next step.</p>
            </div>
            <p style={{ fontSize:10, color:"#5a5a62", opacity:0.3, marginTop:12, textAlign:"center" }}>Nothing stored or sent anywhere.</p>

            {lineCount >= 3 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("triage")}>Next: Triage the chaos</Btn></div>}
          </div>
        )}

        {step === "triage" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 3 of 7</p>
            <h2 style={{ fontFamily:"'Newsreader', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>Not everything is urgent</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#5a5a62", marginBottom:6 }}>Overwhelm collapses time — everything feels like it needs to happen NOW. But your brain is lying. Look at your dump and sort into three containers. Be ruthless: "today" means real consequences if not done in the next 12 hours. Most things will go in "this week" or "not mine." That's the point.</p>

            <div style={{ display:"flex", flexDirection:"column", gap:18, marginTop:16 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#c4796b" }} />
                  <label style={{ fontSize:13, fontWeight:600 }}>Must happen today</label>
                  <span style={{ fontSize:11, color:"#5a5a62", opacity:0.5 }}>— actual consequences if not</span>
                </div>
                <textarea value={triageToday} onChange={e => setTriageToday(e.target.value)} placeholder="Only things with real deadlines or consequences TODAY" rows={3} style={{ width:"100%", padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(196,121,107,0.04)", border:"1px solid rgba(196,121,107,0.15)", borderRadius:12, color:"#2a2f35", resize:"vertical", lineHeight:1.7 }} />
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#b8935a" }} />
                  <label style={{ fontSize:13, fontWeight:600 }}>This week</label>
                  <span style={{ fontSize:11, color:"#5a5a62", opacity:0.5 }}>— important but not today</span>
                </div>
                <textarea value={triageWeek} onChange={e => setTriageWeek(e.target.value)} placeholder="Things that matter but can genuinely wait 2-7 days" rows={3} style={{ width:"100%", padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(184,147,90,0.04)", border:"1px solid rgba(184,147,90,0.12)", borderRadius:12, color:"#2a2f35", resize:"vertical", lineHeight:1.7 }} />
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"#5a8c6b" }} />
                  <label style={{ fontSize:13, fontWeight:600 }}>Not mine to carry right now</label>
                  <span style={{ fontSize:11, color:"#5a5a62", opacity:0.5 }}>— future, hypothetical, or someone else's</span>
                </div>
                <textarea value={triageNot} onChange={e => setTriageNot(e.target.value)} placeholder={'"What if" worries, other people\'s emotions, things I literally cannot act on'} rows={3} style={{ width:"100%", padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(90,140,107,0.04)", border:"1px solid rgba(90,140,107,0.12)", borderRadius:12, color:"#2a2f35", resize:"vertical", lineHeight:1.7 }} />
              </div>
            </div>

            {triageToday.trim() && (
              <div style={{ padding:14, background:"rgba(123,107,154,0.04)", borderRadius:12, marginTop:16 }}>
                <p style={{ fontSize:13, color:"#2a2f35", lineHeight:1.7 }}>Look at your "today" list. If it has more than 3 items, challenge yourself — can any genuinely move to "this week"? Overwhelm shrinks when you tell the truth about what's actually urgent vs. what just feels urgent.</p>
              </div>
            )}

            {triageToday.trim() && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("mvd")}>Next: Minimum Viable Day</Btn></div>}
          </div>
        )}

        {step === "mvd" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 4 of 7</p>
            <h2 style={{ fontFamily:"'Newsreader', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>Your Minimum Viable Day</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#5a5a62", marginBottom:6 }}>This concept comes from software development: a Minimum Viable Product is the simplest version that still works. Your Minimum Viable Day is: if today is a survival day — not a great day, not a productive day, just a "I made it through" day — what are the absolute bare minimum 3 things that need to happen?</p>
            <p style={{ fontSize:14, lineHeight:1.8, color:ac, opacity:0.8, marginBottom:20 }}>These should be small, specific, and completable. Not "get my life together." More like "send that one email."</p>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[{v:mvd1,s:setMvd1,n:"1"},{v:mvd2,s:setMvd2,n:"2"},{v:mvd3,s:setMvd3,n:"3"}].map(({v,s,n}) => (
                <div key={n} style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <span style={{ fontFamily:"'Newsreader', serif", fontSize:22, color:ac, minWidth:28 }}>{n}</span>
                  <input type="text" value={v} onChange={e => s(e.target.value)} placeholder={n==="1"?"e.g., Reply to the urgent email":n==="2"?"e.g., Eat an actual meal":"e.g., Take a 10-minute walk"} style={{ flex:1, padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.6)", border:"1px solid #e0dbd3", borderRadius:10, color:"#2a2f35" }} />
                </div>
              ))}
            </div>

            <div style={{ padding:16, background:"rgba(123,107,154,0.04)", borderRadius:12, marginTop:16 }}>
              <p style={{ fontSize:12, color:"#5a5a62", lineHeight:1.7 }}><strong style={{ color:ac }}>Why 3?</strong> Research on decision fatigue shows that limiting choices to 3 reduces cognitive load while maintaining a sense of control. If you complete these 3 things, today was not a failure — no matter what else happens. That reframe alone reduces overwhelm.</p>
            </div>

            {mvd1.trim() && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("accept")}>Next: Acceptance + Permission</Btn></div>}
          </div>
        )}

        {step === "accept" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 5 of 7</p>
            <h2 style={{ fontFamily:"'Newsreader', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>Accept + Permit</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#5a5a62", marginBottom:20 }}>Two exercises from DBT (Dialectical Behavior Therapy). First: radical acceptance — naming what you can't change so you stop spending energy fighting it. Second: permission — explicitly giving yourself the thing you've been denying.</p>

            <div style={{ padding:20, background:"rgba(255,255,255,0.6)", borderRadius:14, border:"1px solid #e0dbd3", marginBottom:20 }}>
              <p style={{ fontSize:15, fontFamily:"'Newsreader', serif", color:ac, fontStyle:"italic", marginBottom:12 }}>"Right now, I cannot change the fact that..."</p>
              <textarea value={acceptance} onChange={e => setAcceptance(e.target.value)} placeholder="...I can't do everything. I'm one person with limited hours and energy. Some things will have to wait, and fighting that reality is making it worse." rows={3} style={{ width:"100%", padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.5)", border:"1px solid #e0dbd3", borderRadius:10, color:"#2a2f35", resize:"vertical", lineHeight:1.7 }} />
            </div>

            <div style={{ padding:20, background:"rgba(255,255,255,0.6)", borderRadius:14, border:"1px solid #e0dbd3", marginBottom:16 }}>
              <p style={{ fontSize:15, fontFamily:"'Newsreader', serif", color:ac, fontStyle:"italic", marginBottom:12 }}>"Today, I give myself permission to..."</p>
              <textarea value={permission} onChange={e => setPermission(e.target.value)} placeholder="...not be productive. To rest without guilt. To ask for help. To lower my standards for one day. To say no. To not reply immediately." rows={3} style={{ width:"100%", padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.5)", border:"1px solid #e0dbd3", borderRadius:10, color:"#2a2f35", resize:"vertical", lineHeight:1.7 }} />
            </div>

            <div style={{ padding:16, background:"rgba(123,107,154,0.04)", borderRadius:12 }}>
              <p style={{ fontSize:12, color:"#5a5a62", lineHeight:1.7 }}><strong style={{ color:ac }}>Marsha Linehan (creator of DBT):</strong> Radical acceptance reduces emotional suffering more than any other DBT skill. It doesn't fix the problem — it frees up the energy you were spending fighting the unfixable. Permission slips work similarly: most overwhelmed people are running on implicit rules ("I can't rest until everything is done") that guarantee burnout. Making the permission explicit breaks the rule.</p>
            </div>

            {acceptance.trim().length > 10 && permission.trim().length > 5 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("commit")}>Final step</Btn></div>}
          </div>
        )}

        {step === "commit" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 6 of 7</p>
            <h2 style={{ fontFamily:"'Newsreader', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>One action. Absurdly small.</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#5a5a62", marginBottom:6 }}>Look at your Minimum Viable Day item #1. Now make it even smaller. Not "reply to the email" — "open the email." Not "clean up" — "put 3 things away." The neuroscience: starting a task releases dopamine that sustains the effort. The hardest part is the first 30 seconds.</p>

            {mvd1 && (
              <div style={{ padding:14, background:"rgba(196,121,107,0.04)", borderRadius:12, marginBottom:16, border:"1px solid rgba(196,121,107,0.1)" }}>
                <p style={{ fontSize:11, color:"#c4796b", letterSpacing:2, textTransform:"uppercase", marginBottom:4, fontWeight:600 }}>MVD item #1</p>
                <p style={{ fontSize:14, lineHeight:1.6 }}>{mvd1}</p>
              </div>
            )}

            <div style={{ padding:20, background:"rgba(255,255,255,0.6)", borderRadius:14, border:"1px solid #e0dbd3", marginBottom:16 }}>
              <p style={{ fontSize:14, color:ac, fontWeight:600, marginBottom:10 }}>In the next 10 minutes, I will:</p>
              <input type="text" value={oneAction} onChange={e => setOneAction(e.target.value)} placeholder="Open the document and write the first sentence" style={{ width:"100%", padding:14, fontSize:15, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.5)", border:"1px solid #e0dbd3", borderRadius:10, color:"#2a2f35" }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>How overwhelmed do you feel now?</label>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:"#5a5a62" }}>Manageable</span>
                <span style={{ fontSize:22, fontFamily:"'Newsreader', serif", color:postCapacity>7?"#c4796b":postCapacity>4?"#b8935a":"#5a8c6b" }}>{postCapacity}</span>
                <span style={{ fontSize:12, color:"#5a5a62" }}>Drowning</span>
              </div>
              <input type="range" min={1} max={10} value={postCapacity} onChange={e => setPostCapacity(+e.target.value)} />
            </div>

            {oneAction.trim().length > 5 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center" }}><Btn onClick={() => go("close")}>See my plan</Btn></div>}
          </div>
        )}

        {step === "close" && (
          <div key={fk} style={{ animation:"fadeUp 1s ease", paddingTop:"6vh" }}>
            <h2 style={{ fontFamily:"'Newsreader', serif", fontSize:32, fontWeight:300, marginBottom:8, lineHeight:1.3 }}>You went from "everything"<br/>to "this one thing."</h2>
            <p style={{ fontSize:15, lineHeight:1.8, color:"#5a5a62", marginBottom:24 }}>That's the entire mechanism of overwhelm recovery. You regulated your nervous system, externalized the chaos, triaged what's real, defined your minimum viable day, accepted what you can't control, gave yourself permission, and committed to one concrete action.</p>

            {capacityLevel > postCapacity && (
              <div style={{ padding:20, background:"rgba(90,140,107,0.06)", borderRadius:14, border:"1px solid rgba(90,140,107,0.12)", marginBottom:20, textAlign:"center" }}>
                <p style={{ fontSize:11, color:"#5a8c6b", letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Overwhelm level</p>
                <p style={{ fontSize:36, fontFamily:"'Newsreader', serif", color:"#5a8c6b" }}>{capacityLevel} → {postCapacity}</p>
              </div>
            )}

            <div style={{ padding:22, background:"rgba(255,255,255,0.6)", borderRadius:16, border:"1px solid #e0dbd3", marginBottom:20 }}>
              <p style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", marginBottom:14, fontWeight:600 }}>Your plan</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div><p style={{ fontSize:10, color:"#5a5a62", textTransform:"uppercase", letterSpacing:1 }}>Minimum Viable Day</p><p style={{ fontSize:14, lineHeight:1.6 }}>1. {mvd1}{mvd2 ? ` · 2. ${mvd2}` : ""}{mvd3 ? ` · 3. ${mvd3}` : ""}</p></div>
                <div><p style={{ fontSize:10, color:"#5a5a62", textTransform:"uppercase", letterSpacing:1 }}>Accepted</p><p style={{ fontSize:13, fontStyle:"italic" }}>"{acceptance}"</p></div>
                <div><p style={{ fontSize:10, color:"#5a5a62", textTransform:"uppercase", letterSpacing:1 }}>Permission granted</p><p style={{ fontSize:13, fontStyle:"italic" }}>"{permission}"</p></div>
                <div><p style={{ fontSize:10, color:"#5a5a62", textTransform:"uppercase", letterSpacing:1 }}>Next action</p><p style={{ fontSize:15, color:ac, fontWeight:600 }}>"{oneAction}"</p></div>
                <div><p style={{ fontSize:10, color:"#5a5a62", textTransform:"uppercase", letterSpacing:1 }}>Session</p><p style={{ fontSize:13 }}>{mins} min · {lineCount} items externalized · 4-2-8 breathing · CBT triage · DBT acceptance</p></div>
              </div>
            </div>

            <div style={{ padding:20, background:"rgba(123,107,154,0.04)", borderRadius:14, marginBottom:20 }}>
              <p style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", marginBottom:10, fontWeight:600 }}>After your one action</p>
              <p style={{ fontSize:14, color:"#5a5a62", lineHeight:1.8 }}>Do NOT look at the full list again yet. Complete the one action first. Then pick the next smallest thing from your MVD. If overwhelm returns, come back here. This protocol works every time because it's built on how your brain actually processes load — not on willpower or motivation.</p>
            </div>

            <div style={{ padding:24, background:"rgba(123,107,154,0.06)", borderRadius:16, border:"1px solid rgba(123,107,154,0.12)", marginBottom:20, textAlign:"center" }}>
              <p style={{ fontSize:16, color:"#2a2f35", fontWeight:500, marginBottom:8 }}>This helped? Share it with someone who might need it.</p>
              <p style={{ fontSize:13, color:"#5a5a62", marginBottom:16, lineHeight:1.5 }}>"Everything feels like too much? This free 10-minute protocol actually works. No app, no login."</p>
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={() => { if(navigator.share){navigator.share({title:"Overwhelm Protocol",text:"Everything feels like too much? This free 10-minute protocol actually works. No app, no login.",url:"https://aiforj.com/overwhelmed"}).catch(()=>{});}else{navigator.clipboard.writeText("Everything feels like too much? This free 10-minute protocol actually works. No app, no login → https://aiforj.com/overwhelmed");} }} style={{ padding:"10px 24px", fontSize:14, fontWeight:600, background:ac, color:"#fff", border:"none", borderRadius:30, cursor:"pointer" }}>Share</button>
                <button onClick={() => navigator.clipboard.writeText("https://aiforj.com/overwhelmed")} style={{ padding:"10px 24px", fontSize:14, fontWeight:500, background:"transparent", color:ac, border:`1px solid ${ac}`, borderRadius:30, cursor:"pointer" }}>Copy link</button>
              </div>
            </div>

            <div style={{ padding:22, background:"var(--bg-secondary)", borderRadius:16, border:"1px solid rgba(45,42,38,0.06)", marginBottom:20, textAlign:"center" }}>
              <p style={{ fontSize:17, fontFamily:"'Fraunces', serif", fontWeight:500, color:"var(--text-primary)", marginBottom:8 }}>Now discover your Emotional Blueprint</p>
              <p style={{ fontSize:13, color:"var(--text-secondary)", marginBottom:16, lineHeight:1.6 }}>A 2-minute assessment that reveals your stress response pattern and best-match techniques.</p>
              <a href="/blueprint" style={{ display:"inline-block", padding:"12px 28px", fontSize:14, fontFamily:"'Fraunces', serif", fontWeight:600, background:"var(--interactive)", color:"#fff", borderRadius:24, textDecoration:"none" }}>Take the Assessment — Free</a>
            </div>

            <div style={{ textAlign:"center", marginBottom:24 }}>
              <p style={{ fontSize:14, color:"var(--text-secondary)", marginBottom:14, lineHeight:1.7 }}>If overwhelm is recurring, Forj can help build longer-term strategies.</p>
              <a href="/" style={{ display:"inline-block", padding:"14px 36px", fontSize:15, background:"transparent", color:ac, border:`1px solid ${ac}`, borderRadius:40, textDecoration:"none", fontWeight:600 }}>Talk to Forj — Free</a>
            </div>

            <InlineEmailCapture />
          </div>
        )}
      </main>
    </div>
  );
}
