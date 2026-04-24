"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import EvidenceDrawer from "./EvidenceDrawer";
import EditorialReviewCard from "./EditorialReviewCard";
import AuthorByline from "../../components/AuthorByline";
import { getPageEvidence } from "../../data/evidence";

function InlineEmailCapture({ accentColor = "#5b8fa8", textColor = "rgba(200,215,230,0.75)", bgColor = "rgba(91,143,168,0.06)", borderColor = "rgba(91,143,168,0.12)" }) {
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
      <p style={{ fontSize: 14, color: textColor, opacity: 0.7, marginBottom: 16 }}>Free. No spam. Unsubscribe anytime.</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, justifyContent: "center", maxWidth: 400, margin: "0 auto", flexWrap: "wrap" }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: "1 1 200px", padding: "12px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: "rgba(255,255,255,0.06)", color: "#dde4ee", fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
        <button type="submit" disabled={status === "loading"} style={{ padding: "12px 24px", borderRadius: 10, background: accentColor, border: "none", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", opacity: status === "loading" ? 0.6 : 1 }}>{status === "loading" ? "..." : "Subscribe"}</button>
      </form>
    </div>
  );
}

const STEPS = ["landing","check","breathe","dump","forensics","shuffle","body","anchor","close"];

export default function ThreeAMSpiral() {
  const [step, setStep] = useState("landing");
  const [fk, setFk] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [stressLevel, setStressLevel] = useState(7);
  const [breathDone, setBreathDone] = useState(false);
  const [breathPhase, setBreathPhase] = useState("ready");
  const [breathCount, setBreathCount] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0);
  const [dumpText, setDumpText] = useState("");
  const [loudestThought, setLoudestThought] = useState("");
  const [distortion, setDistortion] = useState("");
  const [evidence, setEvidence] = useState("");
  const [balancedThought, setBalancedThought] = useState("");
  const [shuffleDone, setShuffleDone] = useState(false);
  const [shuffleIdx, setShuffleIdx] = useState(0);
  const [shuffleFade, setShuffleFade] = useState(false);
  const [bodyStep, setBodyStep] = useState(0);
  const [bodyDone, setBodyDone] = useState(false);
  const [morningAction, setMorningAction] = useState("");
  const [morningKindness, setMorningKindness] = useState("");
  const [postStress, setPostStress] = useState(5);
  const pageEvidence = getPageEvidence("3am-spiral");

  useEffect(() => {
    if (step === "landing") return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [step, startTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const stepIdx = STEPS.indexOf(step);
  const progress = stepIdx <= 0 ? 0 : (stepIdx / (STEPS.length - 1)) * 100;
  const go = (s) => { setFk(k => k + 1); setStep(s); };

  const breathPattern = { inhale: 4, hold: 7, exhale: 8 };
  const breathTotal = 3;

  useEffect(() => {
    if (breathPhase === "ready" || breathPhase === "done") return;
    if (breathCycle >= breathTotal) { setBreathPhase("done"); setBreathDone(true); return; }
    const dur = breathPattern[breathPhase];
    setBreathCount(0);
    const ci = setInterval(() => setBreathCount(c => Math.min(c + 1, dur)), 1000);
    const t = setTimeout(() => {
      clearInterval(ci);
      if (breathPhase === "inhale") setBreathPhase("hold");
      else if (breathPhase === "hold") setBreathPhase("exhale");
      else { setBreathCycle(c => c + 1); setBreathPhase("inhale"); }
    }, dur * 1000);
    return () => { clearTimeout(t); clearInterval(ci); };
  }, [breathPhase, breathCycle]);

  const shuffleWords = ["lighthouse","velvet","bicycle","cinnamon","glacier","hammock","copper","rainfall","compass","origami","lavender","telescope"];

  useEffect(() => {
    if (step !== "shuffle" || shuffleDone) return;
    if (shuffleIdx >= shuffleWords.length) { setShuffleDone(true); return; }
    const t = setTimeout(() => {
      setShuffleFade(true);
      setTimeout(() => {
        if (shuffleIdx < shuffleWords.length - 1) { setShuffleIdx(i => i + 1); setShuffleFade(false); }
        else setShuffleDone(true);
      }, 700);
    }, 3500);
    return () => clearTimeout(t);
  }, [shuffleIdx, step, shuffleDone]);

  const bodyRegions = [
    { name: "Forehead & Jaw", instruction: "Scrunch your forehead tight for 5 seconds... now release completely. Unclench your jaw — let it hang slightly open. Feel the warmth spread across your face." },
    { name: "Shoulders & Neck", instruction: "Pull your shoulders up toward your ears as hard as you can for 5 seconds... now drop them completely. Roll your neck slowly once in each direction." },
    { name: "Hands & Arms", instruction: "Make tight fists. Squeeze hard for 5 seconds... now open your hands wide and let them go completely limp. Feel the tingling." },
    { name: "Chest & Stomach", instruction: "Take a deep breath and tighten your whole torso for 5 seconds... exhale and release everything. Let your stomach be soft. No holding." },
    { name: "Legs & Feet", instruction: "Point your toes hard, tighten your thighs for 5 seconds... release. Flex your feet back, squeeze your calves... release. Feel your whole body heavy and warm." },
  ];

  const distortions = [
    { id: "catastrophizing", label: "Catastrophizing", desc: "Assuming the worst possible outcome is certain" },
    { id: "mindreading", label: "Mind-Reading", desc: "Believing you know what others think of you" },
    { id: "fortunetelling", label: "Fortune-Telling", desc: "Predicting a negative future as fact" },
    { id: "filtering", label: "Mental Filtering", desc: "Only seeing the negative, ignoring the positive" },
    { id: "allnothing", label: "All-or-Nothing", desc: "Perfect or complete failure, no middle" },
    { id: "shoulding", label: "Should Statements", desc: "'I should have... I should be...' pressure" },
    { id: "emotional", label: "Emotional Reasoning", desc: "Feeling bad = things ARE bad" },
    { id: "unsure", label: "Not sure", desc: "That's fine — naming the thought is enough" },
  ];

  const sz = breathPhase === "inhale" ? 170 : breathPhase === "hold" ? 170 : 90;
  const breathLabel = breathPhase === "inhale" ? "Breathe in" : breathPhase === "hold" ? "Hold gently" : "Slow release";
  const wordCount = dumpText.split(/\s+/).filter(Boolean).length;
  const lineCount = dumpText.split("\n").filter(l => l.trim()).length;

  const Btn = ({ onClick, children, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "16px 44px", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
      background: disabled ? "rgba(120,150,180,0.1)" : "#5b8fa8",
      color: disabled ? "rgba(180,200,220,0.3)" : "#060b12",
      border: "none", borderRadius: 40, cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 600, letterSpacing: 0.5, width: "100%", maxWidth: 360,
    }}>{children}</button>
  );

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#c0d0e0", background: "#060b12" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes starBlink { 0%,100% { opacity:.1; } 50% { opacity:.4; } }
        textarea:focus,input:focus { outline:none; border-color:rgba(91,143,168,0.4) !important; }
        input[type="range"] { accent-color:#5b8fa8; width:100%; }
        ::selection { background:rgba(91,143,168,0.3); }
        * { box-sizing:border-box; margin:0; }
      `}</style>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        {Array.from({length:50}).map((_,i) => (
          <div key={i} style={{ position:"absolute", left:`${(i*37)%100}%`, top:`${(i*53)%100}%`, width:i%5===0?2:1, height:i%5===0?2:1, background:"#c0d0e0", borderRadius:"50%", animation:`starBlink ${3+(i%4)}s ease ${i%3}s infinite` }} />
        ))}
      </div>

      {step !== "landing" && (
        <div style={{ position:"fixed", top:60, left:0, right:0, height:3, background:"rgba(91,143,168,0.1)", zIndex:50 }}>
          <div style={{ height:3, background:"#5b8fa8", width:`${progress}%`, transition:"width 0.8s ease" }} />
        </div>
      )}

      {step !== "landing" && step !== "close" && (
        <div style={{ textAlign:"center", padding:"4px 0", fontSize:11, color:"rgba(200,215,230,0.45)", fontVariantNumeric:"tabular-nums" }}>{mins}:{secs.toString().padStart(2,"0")}</div>
      )}

      <main style={{ maxWidth:520, margin:"0 auto", padding:"0 20px 80px", position:"relative", zIndex:5 }}>

        {step === "landing" && (
          <div key={fk} style={{ animation:"fadeUp 1.2s ease", paddingTop:"14vh" }}>
            <p style={{ fontSize:12, color:"#5b8fa8", letterSpacing:4, textTransform:"uppercase", marginBottom:20, fontWeight:500 }}>Can't sleep</p>
            <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(34px,7vw,52px)", fontWeight:300, lineHeight:1.15, marginBottom:24, color:"#dde4ee" }}>It's late. Your<br/>brain won't stop.</h1>
            <AuthorByline variant="dark" />
            <p style={{ fontSize:15, lineHeight:1.9, color:"rgba(200,215,230,0.75)", marginBottom:20 }}>Replaying conversations. Predicting disasters. Listing everything undone. The thoughts loop and there's no off switch.</p>
            <p style={{ fontSize:15, lineHeight:1.9, color:"rgba(200,215,230,0.82)", marginBottom:20 }}>Here's what's happening: when you're under-slept or jolted awake in the night, your brain usually gets worse at perspective-taking and better at threat-detection. That's why the same thought that feels manageable at 2pm can feel catastrophic at 2am. Your inner editor is tired, but the alarm system is still loud.</p>
            <p style={{ fontSize:15, lineHeight:1.9, color:"rgba(200,215,230,0.82)", marginBottom:20 }}>Hormones can play a role too. Your cortisol rhythm shifts as morning approaches, but the timing varies by person and by stress load. The practical point is simpler: late-night wakefulness can feel physiologically activating, and that can turn looping thoughts into a full-body spiral.</p>
            <p style={{ fontSize:16, lineHeight:1.8, color:"#5b8fa8", marginBottom:44 }}>This protocol uses six evidence-based techniques — sequenced in the order your nervous system needs them — to bring your rational brain back online. About 10 minutes. No app. No login.</p>
            <div style={{ textAlign:"center" }}><Btn onClick={() => go("check")}>Start the protocol</Btn></div>
            <p style={{ fontSize:10, color:"rgba(200,215,230,0.4)", marginTop:36, lineHeight:1.7, textAlign:"center" }}>Clinician-informed by Kevin, a psychiatric nurse practitioner candidate. Local-first where supported.</p>

            <InlineEmailCapture />
          </div>
        )}

        {step === "check" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 1 of 6</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:300, marginBottom:12, color:"#dde4ee" }}>How activated are you right now?</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(200,215,230,0.75)", marginBottom:24 }}>Baseline check. You'll rate again at the end to see the shift.</p>
            <div style={{ padding:24, background:"rgba(91,143,168,0.04)", borderRadius:16, border:"1px solid rgba(91,143,168,0.08)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:12, color:"rgba(200,215,230,0.6)" }}>Calm</span>
                <span style={{ fontSize:28, fontFamily:"'Cormorant Garamond', serif", color:stressLevel > 7 ? "#c4796b" : stressLevel > 4 ? "#b8935a" : "#5a8c6b" }}>{stressLevel}</span>
                <span style={{ fontSize:12, color:"rgba(200,215,230,0.6)" }}>Spiraling</span>
              </div>
              <input type="range" min={1} max={10} value={stressLevel} onChange={e => setStressLevel(+e.target.value)} />
              <p style={{ fontSize:12, color:"rgba(200,215,230,0.55)", marginTop:8, textAlign:"center" }}>
                {stressLevel <= 3 ? "Mildly restless — we'll settle this quickly" : stressLevel <= 6 ? "Moderately activated — your threat system has your attention right now" : stressLevel <= 8 ? "Highly activated — racing thoughts, tight chest. Common at this hour." : "Full alarm mode. This protocol is built for exactly this."}
              </p>
            </div>
            <div style={{ textAlign:"center", marginTop:28 }}><Btn onClick={() => go("breathe")}>Next: Calm the nervous system</Btn></div>
          </div>
        )}

        {step === "breathe" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 2 of 6</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:300, marginBottom:12, color:"#dde4ee" }}>The 4-7-8 breath</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(200,215,230,0.75)", marginBottom:6 }}>Developed by Dr. Andrew Weil and influenced by pranayama breathing traditions. The goal here is simple: slow the pace, lengthen the exhale, and give your body a more settle-down rhythm to follow.</p>
            <p style={{ fontSize:13, color:"#5b8fa8", opacity:0.8, marginBottom:20 }}>4 in through nose. 7 hold. 8 out through mouth. Three cycles.</p>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, padding:"12px 0" }}>
              {breathPhase === "ready" ? (
                <Btn onClick={() => setBreathPhase("inhale")}>Begin breathing</Btn>
              ) : breathPhase === "done" ? (
                <div style={{ textAlign:"center" }}>
                  <p style={{ fontSize:18, fontFamily:"'Cormorant Garamond', serif", color:"#5b8fa8" }}>Many people notice their body starting to settle here.</p>
                  <p style={{ fontSize:13, color:"rgba(200,215,230,0.6)", marginTop:6 }}>A longer exhale can be enough to take the edge off the spiral.</p>
                </div>
              ) : (
                <>
                  <div style={{ width:200, height:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:sz, height:sz, borderRadius:"50%", transition:"all 2.5s ease-in-out", background:`radial-gradient(circle, rgba(91,143,168,0.25) 0%, rgba(91,143,168,0.02) 100%)`, boxShadow:`0 0 ${sz/2}px rgba(91,143,168,0.12)`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                      <span style={{ fontSize:11, letterSpacing:4, color:"#5b8fa8", textTransform:"uppercase" }}>{breathLabel}</span>
                      <span style={{ fontSize:30, fontWeight:300, color:"#dde4ee", fontFamily:"'Cormorant Garamond', serif", marginTop:4 }}>{breathCount}</span>
                    </div>
                  </div>
                  <span style={{ fontSize:11, color:"rgba(180,200,220,0.3)", letterSpacing:2 }}>{Math.min(breathCycle+1, breathTotal)} / {breathTotal}</span>
                </>
              )}
            </div>
            {breathDone && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("dump")}>Next: Empty your head</Btn></div>}
          </div>
        )}

        {step === "dump" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 3 of 6</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:300, marginBottom:12, color:"#dde4ee" }}>Get it all out</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(200,215,230,0.75)", marginBottom:6 }}>Working memory is limited. When you try to hold too many worries at once, your brain often replays them so they do not get lost. Externalize everything so the loop has somewhere else to go.</p>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#5b8fa8", opacity:0.8, marginBottom:20 }}>Write EVERYTHING. Worries, tasks, replays, what-ifs, random fears, that thing from 2019. Don't organize. Just dump.</p>
            <textarea value={dumpText} onChange={e => setDumpText(e.target.value)} placeholder={"That email I haven't replied to...\nWhat if I said the wrong thing...\nRent is due and I'm not sure...\nI need to call the doctor...\nWhy did they look at me like that...\nI'm falling behind on everything...\nWhat if this never gets better..."} rows={9} style={{ width:"100%", padding:18, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(91,143,168,0.12)", borderRadius:14, color:"#c0d0e0", resize:"vertical", lineHeight:1.8 }} />
            {wordCount > 0 && <p style={{ fontSize:12, color:"#5b8fa8", opacity:0.5, marginTop:8 }}>{wordCount} words, {lineCount} thoughts externalized.{wordCount > 50 ? " Your working memory just got significantly lighter." : " Keep going."}</p>}
            <div style={{ padding:16, background:"rgba(91,143,168,0.06)", borderRadius:12, border:"1px solid rgba(91,143,168,0.1)", marginTop:16 }}>
              <p style={{ fontSize:12, color:"rgba(180,200,220,0.7)", lineHeight:1.7 }}><strong style={{ color:"#5b8fa8" }}>Why write it down:</strong> Externalizing worries can make repetitive thinking feel more containable. It is not magic, but for many people it lowers the mental traffic enough to think more clearly.</p>
            </div>
            <p style={{ fontSize:10, color:"rgba(200,215,230,0.4)", marginTop:12, textAlign:"center" }}>Nothing stored or sent. Exists only on your screen.</p>
            {wordCount >= 15 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("forensics")}>Next: Examine the loudest thought</Btn></div>}
          </div>
        )}

        {step === "forensics" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 4 of 6</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:300, marginBottom:12, color:"#dde4ee" }}>Thought forensics</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(200,215,230,0.75)", marginBottom:20 }}>One thought is louder than the rest — the one your brain keeps returning to. We're going to examine it like a detective examines evidence: with facts, not emotion. This is the core CBT technique adapted for 3am.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div>
                <label style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>The loudest thought right now</label>
                <p style={{ fontSize:12, color:"rgba(200,215,230,0.55)", marginBottom:8 }}>Write it exactly as your brain says it. Don't filter.</p>
                <input type="text" value={loudestThought} onChange={e => setLoudestThought(e.target.value)} placeholder="e.g., 'Everything is falling apart and I can't fix any of it'" style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(91,143,168,0.12)", borderRadius:12, color:"#c0d0e0" }} />
              </div>
              {loudestThought.trim() && (
                <div style={{ animation:"fadeUp 0.4s ease" }}>
                  <label style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:8, fontWeight:600 }}>What thinking trap is this?</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {distortions.map(d => (
                      <button key={d.id} onClick={() => setDistortion(d.id)} style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", padding:"12px 16px", background:distortion===d.id ? "rgba(91,143,168,0.1)" : "rgba(255,255,255,0.02)", border:distortion===d.id ? "1px solid rgba(91,143,168,0.3)" : "1px solid rgba(91,143,168,0.06)", borderRadius:10, cursor:"pointer", textAlign:"left", width:"100%" }}>
                        <span style={{ fontSize:13, fontWeight:500, color:"#c0d0e0" }}>{d.label}</span>
                        <span style={{ fontSize:11, color:"rgba(200,215,230,0.6)", marginTop:2 }}>{d.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {distortion && (
                <div style={{ animation:"fadeUp 0.4s ease" }}>
                  <label style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>Evidence that CONTRADICTS this thought</label>
                  <p style={{ fontSize:12, color:"rgba(200,215,230,0.55)", marginBottom:8 }}>Not feelings. Facts. Things that happened. Things that are true.</p>
                  <textarea value={evidence} onChange={e => setEvidence(e.target.value)} placeholder="e.g., 'I handled a similar situation last month. I have people who've helped. Last time I thought everything was ruined, it wasn't.'" rows={3} style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(91,143,168,0.12)", borderRadius:12, color:"#c0d0e0", resize:"vertical", lineHeight:1.7 }} />
                </div>
              )}
              {evidence.trim().length > 10 && (
                <div style={{ animation:"fadeUp 0.4s ease" }}>
                  <label style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>What would morning-you say about this?</label>
                  <textarea value={balancedThought} onChange={e => setBalancedThought(e.target.value)} placeholder="e.g., 'This feels huge right now but it's not an emergency. I can deal with this tomorrow when I can think clearly.'" rows={3} style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(91,143,168,0.12)", borderRadius:12, color:"#c0d0e0", resize:"vertical", lineHeight:1.7 }} />
                </div>
              )}
            </div>
            {balancedThought.trim().length > 10 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:24 }}><Btn onClick={() => go("shuffle")}>Next: Break the loop</Btn></div>}
          </div>
        )}

        {step === "shuffle" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 5 of 6</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:300, marginBottom:12, color:"#dde4ee" }}>Cognitive shuffle</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(200,215,230,0.75)", marginBottom:6 }}>Your brain spirals by pattern-matching — each thought triggers the next. Cognitive shuffling (Dr. Luc Beaudoin, Simon Fraser University) breaks the chain with random, unrelated imagery. Like jamming a radio signal.</p>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#5b8fa8", opacity:0.8, marginBottom:20 }}>Picture each word vividly. Color, shape, texture, weight. Fill your mind with it. When the next appears, let the old one dissolve.</p>
            {!shuffleDone ? (
              <div style={{ textAlign:"center", padding:"28px 0", minHeight:180 }}>
                <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:4, textTransform:"uppercase", marginBottom:12 }}>Visualize</p>
                <p style={{ fontSize:42, fontFamily:"'Cormorant Garamond', serif", fontWeight:300, color:"#dde4ee", opacity:shuffleFade?0:1, transition:"opacity 0.7s ease", margin:"16px 0" }}>{shuffleWords[shuffleIdx]}</p>
                <p style={{ fontSize:11, color:"rgba(200,215,230,0.45)" }}>{shuffleIdx+1} / {shuffleWords.length}</p>
              </div>
            ) : (
              <div style={{ animation:"fadeUp 0.6s ease", textAlign:"center", padding:"20px 0" }}>
                <p style={{ fontSize:20, fontFamily:"'Cormorant Garamond', serif", color:"#5b8fa8", marginBottom:8 }}>The chain is broken.</p>
                <p style={{ fontSize:14, color:"rgba(200,215,230,0.6)", marginBottom:24 }}>Your thought loop was interrupted. Even if it tries to restart, the pattern has been weakened.</p>
                <Btn onClick={() => go("body")}>Next: Release the body</Btn>
              </div>
            )}
          </div>
        )}

        {step === "body" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 6 of 6</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:300, marginBottom:12, color:"#dde4ee" }}>Progressive release</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(200,215,230,0.75)", marginBottom:20 }}>Jacobson's Progressive Muscle Relaxation — tense then release — teaches your body the contrast between tension and relaxation. Used in clinical insomnia treatment. Do this lying down. Five regions.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {bodyRegions.map((region, i) => (
                <div key={i} style={{ padding:18, borderRadius:14, background:bodyStep===i ? "rgba(91,143,168,0.08)" : bodyStep>i ? "rgba(90,140,107,0.05)" : "rgba(255,255,255,0.02)", border:bodyStep===i ? "1px solid rgba(91,143,168,0.2)" : "1px solid rgba(91,143,168,0.05)", opacity:bodyStep<i ? 0.35 : 1, transition:"all 0.5s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:bodyStep===i?10:0 }}>
                    <span style={{ fontSize:14, fontWeight:500, color:bodyStep>i ? "rgba(90,140,107,0.7)" : "#c0d0e0" }}>{bodyStep>i ? "✓ " : ""}{region.name}</span>
                    {bodyStep===i && <span style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2 }}>ACTIVE</span>}
                  </div>
                  {bodyStep===i && (
                    <div style={{ animation:"fadeUp 0.4s ease" }}>
                      <p style={{ fontSize:14, color:"rgba(180,200,220,0.6)", lineHeight:1.8, marginBottom:14 }}>{region.instruction}</p>
                      <button onClick={() => { if (i < bodyRegions.length-1) setBodyStep(i+1); else setBodyDone(true); }} style={{ padding:"10px 28px", fontSize:13, background:"#5b8fa8", color:"#060b12", border:"none", borderRadius:30, cursor:"pointer", fontWeight:600 }}>
                        {i < bodyRegions.length-1 ? "Done — next region" : "Done — all released"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {bodyDone && (
              <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:24 }}>
                <p style={{ fontSize:16, fontFamily:"'Cormorant Garamond', serif", color:"#5b8fa8", marginBottom:16 }}>Your body is heavier now. That's the point.</p>
                <Btn onClick={() => go("anchor")}>Final step: Morning anchor</Btn>
              </div>
            )}
          </div>
        )}

        {step === "anchor" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Final step</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:300, marginBottom:12, color:"#dde4ee" }}>Give tomorrow-you a gift</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"rgba(200,215,230,0.75)", marginBottom:20 }}>3am spirals persist because you fear forgetting something important. Let's capture it so your brain can let go.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div>
                <label style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>Tomorrow-me will handle this first</label>
                <input type="text" value={morningAction} onChange={e => setMorningAction(e.target.value)} placeholder="e.g., 'Reply to that email before 10am'" style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(91,143,168,0.12)", borderRadius:12, color:"#c0d0e0" }} />
              </div>
              <div>
                <label style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>What I need to hear right now</label>
                <p style={{ fontSize:12, color:"rgba(200,215,230,0.55)", marginBottom:8 }}>What would you tell a friend lying awake feeling this way?</p>
                <input type="text" value={morningKindness} onChange={e => setMorningKindness(e.target.value)} placeholder="e.g., 'You're not failing. You're just tired. Tomorrow is a new start.'" style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(91,143,168,0.12)", borderRadius:12, color:"#c0d0e0" }} />
              </div>
              <div>
                <label style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>How activated do you feel now?</label>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:"rgba(180,200,220,0.3)" }}>Calm</span>
                  <span style={{ fontSize:22, fontFamily:"'Cormorant Garamond', serif", color:postStress>7?"#c4796b":postStress>4?"#b8935a":"#5a8c6b" }}>{postStress}</span>
                  <span style={{ fontSize:12, color:"rgba(180,200,220,0.3)" }}>Spiraling</span>
                </div>
                <input type="range" min={1} max={10} value={postStress} onChange={e => setPostStress(+e.target.value)} />
              </div>
            </div>
            {morningAction.trim() && morningKindness.trim() && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:24 }}><Btn onClick={() => go("close")}>See my session summary</Btn></div>}
          </div>
        )}

        {step === "close" && (() => {
          // Log completion
          try {
            const data = JSON.parse(localStorage.getItem("techniques_completed") || "[]");
            if (!data.some(d => d.slug === "3am-spiral" && new Date(d.date).toDateString() === new Date().toDateString())) {
              data.push({ slug: "3am-spiral", date: new Date().toISOString(), minutes: mins });
              localStorage.setItem("techniques_completed", JSON.stringify(data.slice(-100)));
            }
          } catch {}
          return true;
        })() && (
          <div key={fk} style={{ animation:"fadeUp 1s ease", paddingTop:"6vh" }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:34, fontWeight:300, marginBottom:8, color:"#dde4ee", lineHeight:1.3 }}>You did something<br/>most people don't.</h2>
            <p style={{ fontSize:15, lineHeight:1.8, color:"rgba(200,215,230,0.75)", marginBottom:24 }}>Instead of fighting your brain in the dark, you used a structured calming protocol: regulated your nervous system, externalized thoughts, challenged the loudest one, broke the spiral, released body tension, and anchored for tomorrow.</p>

            {stressLevel > postStress && (
              <div style={{ padding:20, background:"rgba(90,140,107,0.06)", borderRadius:14, border:"1px solid rgba(90,140,107,0.12)", marginBottom:20, textAlign:"center" }}>
                <p style={{ fontSize:36, fontFamily:"'Cormorant Garamond', serif", color:"#5a8c6b" }}>{stressLevel} → {postStress}</p>
                <p style={{ fontSize:13, color:"rgba(90,140,107,0.7)" }}>Activation dropped {stressLevel-postStress} point{stressLevel-postStress>1?"s":""} in {mins} minute{mins!==1?"s":""}</p>
              </div>
            )}

            <div style={{ padding:22, background:"rgba(91,143,168,0.04)", borderRadius:16, border:"1px solid rgba(91,143,168,0.08)", marginBottom:20 }}>
              <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", marginBottom:14, fontWeight:600 }}>Session summary</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div><p style={{ fontSize:10, color:"rgba(200,215,230,0.6)", textTransform:"uppercase", letterSpacing:1 }}>Techniques</p><p style={{ fontSize:13, color:"#c0d0e0", lineHeight:1.6 }}>4-7-8 Breathing (Weil) · Expressive Writing (Pennebaker) · CBT Thought Record · Cognitive Shuffle (Beaudoin) · Progressive Muscle Relaxation (Jacobson)</p></div>
                <div><p style={{ fontSize:10, color:"rgba(200,215,230,0.6)", textTransform:"uppercase", letterSpacing:1 }}>Externalized</p><p style={{ fontSize:13, color:"#c0d0e0" }}>{wordCount} words, {lineCount} items</p></div>
                {loudestThought && <div><p style={{ fontSize:10, color:"rgba(200,215,230,0.6)", textTransform:"uppercase", letterSpacing:1 }}>Loudest thought</p><p style={{ fontSize:13, color:"#c0d0e0", fontStyle:"italic" }}>"{loudestThought}"</p></div>}
                {balancedThought && <div><p style={{ fontSize:10, color:"rgba(200,215,230,0.6)", textTransform:"uppercase", letterSpacing:1 }}>Morning-you says</p><p style={{ fontSize:13, color:"#5b8fa8" }}>"{balancedThought}"</p></div>}
                {morningAction && <div><p style={{ fontSize:10, color:"rgba(200,215,230,0.6)", textTransform:"uppercase", letterSpacing:1 }}>Tomorrow's action</p><p style={{ fontSize:14, color:"#5b8fa8", fontWeight:600 }}>"{morningAction}"</p></div>}
                {morningKindness && <div><p style={{ fontSize:10, color:"rgba(200,215,230,0.6)", textTransform:"uppercase", letterSpacing:1 }}>What you needed to hear</p><p style={{ fontSize:15, fontFamily:"'Cormorant Garamond', serif", color:"#dde4ee", fontStyle:"italic" }}>"{morningKindness}"</p></div>}
              </div>
            </div>

            <div style={{ padding:22, background:"rgba(91,143,168,0.04)", borderRadius:16, border:"1px solid rgba(91,143,168,0.08)", marginBottom:20 }}>
              <p style={{ fontSize:11, color:"#5b8fa8", letterSpacing:2, textTransform:"uppercase", marginBottom:12, fontWeight:600 }}>Next 15 minutes</p>
              <p style={{ fontSize:14, color:"rgba(180,200,220,0.6)", lineHeight:1.8, marginBottom:10 }}><strong style={{ color:"#c0d0e0" }}>Phone face-down.</strong> Bright screens can delay melatonin and make it harder to settle back down.</p>
              <p style={{ fontSize:14, color:"rgba(180,200,220,0.6)", lineHeight:1.8, marginBottom:10 }}><strong style={{ color:"#c0d0e0" }}>If a thought returns:</strong> "I notice I'm having the thought that..." (ACT defusion — become the observer, not the thought).</p>
              <p style={{ fontSize:14, color:"rgba(180,200,220,0.6)", lineHeight:1.8 }}><strong style={{ color:"#c0d0e0" }}>Still awake in 20 min?</strong> Get up, do something boring in dim light for 10 min, then return. Stimulus control therapy — prevents your brain from linking bed with anxiety.</p>
            </div>

            <div style={{ padding:24, background:"rgba(91,143,168,0.06)", borderRadius:16, border:"1px solid rgba(91,143,168,0.12)", marginBottom:20, textAlign:"center" }}>
              <p style={{ fontSize:16, color:"#dde4ee", fontFamily:"'DM Sans', sans-serif", fontWeight:500, marginBottom:8 }}>This helped? Share it with someone who might need it.</p>
              <p style={{ fontSize:13, color:"rgba(200,215,230,0.6)", marginBottom:16, lineHeight:1.5 }}>"Can't sleep because your brain won't stop? This free 10-minute protocol actually works. No app needed."</p>
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={() => { if(navigator.share){navigator.share({title:"3AM Spiral Protocol",text:"Can't sleep because your brain won't stop? This free 10-minute protocol actually works. No app needed.",url:"https://aiforj.com/3am-spiral"}).catch(()=>{});}else{navigator.clipboard.writeText("Can't sleep because your brain won't stop? This free 10-minute protocol actually works. No app needed → https://aiforj.com/3am-spiral");} }} style={{ padding:"10px 24px", fontSize:14, fontWeight:600, background:"#5b8fa8", color:"#060b12", border:"none", borderRadius:30, cursor:"pointer" }}>Share</button>
                <button onClick={() => navigator.clipboard.writeText("https://aiforj.com/3am-spiral")} style={{ padding:"10px 24px", fontSize:14, fontWeight:500, background:"transparent", color:"#5b8fa8", border:"1px solid rgba(91,143,168,0.3)", borderRadius:30, cursor:"pointer" }}>Copy link</button>
              </div>
            </div>

            <div style={{ padding:22, background:"rgba(91,143,168,0.06)", borderRadius:16, border:"1px solid rgba(91,143,168,0.12)", marginBottom:20, textAlign:"center" }}>
              <p style={{ fontSize:17, color:"#dde4ee", fontFamily:"'Cormorant Garamond', serif", fontWeight:400, marginBottom:8 }}>Discover Your Emotional Blueprint</p>
              <p style={{ fontSize:13, color:"rgba(200,215,230,0.6)", marginBottom:16, lineHeight:1.6 }}>A 2-minute assessment that reveals your stress pattern and best-match techniques.</p>
              <a href="/blueprint" style={{ display:"inline-block", padding:"12px 28px", fontSize:14, background:"#5b8fa8", color:"#060b12", border:"none", borderRadius:30, textDecoration:"none", fontWeight:600 }}>Take the Assessment — Free</a>
            </div>

            <div style={{ textAlign:"center", marginBottom:24 }}>
              <p style={{ fontSize:14, color:"rgba(200,215,230,0.6)", marginBottom:14, lineHeight:1.7 }}>Need more? Talk it through with Forj — voice or text, evidence-based, private.</p>
              <a href="/" style={{ display:"inline-block", padding:"14px 36px", fontSize:15, background:"transparent", color:"#5b8fa8", border:"1px solid rgba(91,143,168,0.3)", borderRadius:40, textDecoration:"none", fontWeight:600 }}>Talk to Forj — Free</a>
            </div>

            <InlineEmailCapture />

            <div style={{ padding:18, borderRadius:16, background:"rgba(91,143,168,0.04)", border:"1px solid rgba(91,143,168,0.08)", textAlign:"center", marginBottom:20 }}>
              <p style={{ fontSize:14, color:"#dde4ee", margin:"0 0 4px", fontWeight:500 }}>In crisis? You're not alone.</p>
              <p style={{ fontSize:13, color:"rgba(200,215,230,0.6)", margin:0 }}>Call or text <strong style={{ color:"#5b8fa8" }}>988</strong> · Text HOME to <strong style={{ color:"#5b8fa8" }}>741741</strong></p>
            </div>
            <p style={{ textAlign:"center", fontSize:13, color:"rgba(200,215,230,0.5)", lineHeight:1.7, marginBottom:20 }}>Forj is a wellness companion — not a therapist or substitute for professional care.</p>
            <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:16, marginBottom:20 }}>
              <a href="/" style={{ fontSize:12, color:"rgba(200,215,230,0.4)", textDecoration:"none" }}>Home</a>
              <a href="/blueprint" style={{ fontSize:12, color:"rgba(200,215,230,0.4)", textDecoration:"none" }}>Blueprint</a>
              <a href="/techniques" style={{ fontSize:12, color:"rgba(200,215,230,0.4)", textDecoration:"none" }}>Techniques</a>
              <a href="/send" style={{ fontSize:12, color:"rgba(200,215,230,0.4)", textDecoration:"none" }}>Send Calm</a>
            </div>
            <p style={{ textAlign:"center", fontSize:10, color:"rgba(180,200,220,0.15)", margin:0 }}>Clinician-informed by Kevin, a psychiatric nurse practitioner candidate · © 2026 AIForj</p>
          </div>
        )}

        <EvidenceDrawer
          evidence={pageEvidence}
          accentColor="#5b8fa8"
          borderColor="rgba(91,143,168,0.16)"
          background="rgba(91,143,168,0.05)"
          panelBackground="rgba(6,11,18,0.22)"
          textColor="#dde4ee"
          mutedColor="rgba(200,215,230,0.72)"
        />

        <EditorialReviewCard
          kind="Protocol"
          background="rgba(91,143,168,0.05)"
          border="1px solid rgba(91,143,168,0.16)"
          textColor="#dde4ee"
          mutedColor="rgba(200,215,230,0.72)"
        />
      </main>
    </div>
  );
}
