"use client";

import { useState, useEffect } from "react";
import EmailCapture from "./EmailCapture";

const STEPS = ["landing","assess","result","energy","values","boundaries","recover","close"];

export default function BurnedOutPage() {
  const [step, setStep] = useState("landing");
  const [fk, setFk] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const [scores, setScores] = useState({e1:0,e2:0,e3:0,c1:0,c2:0,c3:0,i1:0,i2:0,i3:0});
  const [drains, setDrains] = useState("");
  const [fills, setFills] = useState("");
  const [valueBefore, setValueBefore] = useState("");
  const [valueLost, setValueLost] = useState("");
  const [boundaryYes, setBoundaryYes] = useState("");
  const [boundaryNo, setBoundaryNo] = useState("");
  const [microAct, setMicroAct] = useState("");
  const [timeline, setTimeline] = useState("");

  useEffect(() => {
    if (step === "landing") return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [step, startTime]);

  const mins = Math.floor(elapsed / 60);
  const stepIdx = STEPS.indexOf(step);
  const progress = stepIdx <= 0 ? 0 : (stepIdx / (STEPS.length - 1)) * 100;
  const go = (s) => { setFk(k => k + 1); setStep(s); };

  const eScore = scores.e1 + scores.e2 + scores.e3;
  const cScore = scores.c1 + scores.c2 + scores.c3;
  const iScore = scores.i1 + scores.i2 + scores.i3;
  const total = eScore + cScore + iScore;
  const level = total <= 9 ? "mild" : total <= 18 ? "moderate" : "severe";
  const levelColor = level === "mild" ? "#5a8c6b" : level === "moderate" ? "#b8935a" : "#c4796b";
  const primary = eScore >= cScore && eScore >= iScore ? "exhaustion" : cScore >= iScore ? "cynicism" : "inefficacy";

  const ac = "#b8935a";

  const Btn = ({ onClick, children, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"16px 44px", fontSize:15, fontFamily:"'DM Sans', sans-serif",
      background:disabled?"rgba(184,147,90,0.1)":ac, color:disabled?"rgba(184,147,90,0.3)":"#fff",
      border:"none", borderRadius:40, cursor:disabled?"not-allowed":"pointer", fontWeight:600, width:"100%", maxWidth:360,
    }}>{children}</button>
  );

  const Slider = ({ label, value, onChange, desc }) => (
    <div style={{ marginBottom:16 }}>
      <p style={{ fontSize:13, color:"#2d2a25", marginBottom:4, lineHeight:1.5 }}>{label}</p>
      {desc && <p style={{ fontSize:11, color:"#7d7870", marginBottom:6 }}>{desc}</p>}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:11, color:"#7d7870", minWidth:40 }}>Never</span>
        <input type="range" min={0} max={3} value={value} onChange={e => onChange(+e.target.value)} style={{ accentColor:ac, flex:1 }} />
        <span style={{ fontSize:11, color:"#7d7870", minWidth:46, textAlign:"right" }}>Always</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans', sans-serif", color:"#2d2a25", background:"#f7f3ee" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300;0,7..72,400;1,7..72,300&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        textarea:focus,input:focus{outline:none;border-color:rgba(184,147,90,0.4) !important}
        input[type="range"]{accent-color:${ac};width:100%}
        ::selection{background:rgba(184,147,90,0.2)}
        *{box-sizing:border-box;margin:0}
      `}</style>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse at 70% 80%, rgba(184,147,90,0.04) 0%, transparent 50%)" }} />

      {step !== "landing" && (
        <div style={{ position:"fixed", top:0, left:0, right:0, height:3, background:"rgba(184,147,90,0.1)", zIndex:50 }}>
          <div style={{ height:3, background:ac, width:`${progress}%`, transition:"width 0.8s ease" }} />
        </div>
      )}

      <header style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:10 }}>
        <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"baseline", gap:2 }}>
          <span style={{ fontFamily:"'Literata', serif", fontSize:19, color:"rgba(45,42,37,0.4)" }}>AI</span>
          <span style={{ fontFamily:"'Literata', serif", fontSize:19, color:ac }}>Forj</span>
        </a>
        {step !== "landing" && step !== "close" && (
          <span style={{ fontSize:11, color:"rgba(45,42,37,0.25)", fontVariantNumeric:"tabular-nums" }}>{mins}:{(elapsed%60).toString().padStart(2,"0")}</span>
        )}
      </header>

      <main style={{ maxWidth:540, margin:"0 auto", padding:"0 20px 80px", position:"relative", zIndex:5 }}>

        {step === "landing" && (
          <div key={fk} style={{ animation:"fadeUp 1s ease", paddingTop:"10vh" }}>
            <p style={{ fontSize:12, color:ac, letterSpacing:4, textTransform:"uppercase", marginBottom:20, fontWeight:500 }}>Burnout protocol</p>
            <h1 style={{ fontFamily:"'Literata', serif", fontSize:"clamp(30px,6vw,46px)", fontWeight:300, lineHeight:1.25, marginBottom:24 }}>You're not lazy.<br/>You're running<br/>on empty.</h1>
            <p style={{ fontSize:15, lineHeight:1.9, color:"#7d7870", marginBottom:20 }}>You keep pushing but nothing moves. Things that used to energize you feel like obligations. Rest doesn't recharge. You wonder if you're broken, weak, or just not trying hard enough.</p>
            <p style={{ fontSize:15, lineHeight:1.9, color:"rgba(45,42,37,0.8)", marginBottom:20 }}>Nothing is wrong with you. Burnout is a measurable state with specific biological markers. The WHO classifies it as caused by "chronic stress that has not been successfully managed." But it doesn't only come from work — caregiving, relationships, financial pressure, and simply existing in a world that demands constant output all contribute.</p>

            <div style={{ padding:20, background:"rgba(255,255,255,0.6)", borderRadius:14, border:"1px solid #e0dbd3", marginBottom:24 }}>
              <p style={{ fontSize:14, color:"#2d2a25", lineHeight:1.8 }}><strong style={{ color:ac }}>Burnout vs. Depression — they're different.</strong> Depression says "nothing matters." Burnout says "this mattered so much it broke me." Depression is generalized loss of interest. Burnout is specific — tied to demands exceeding resources. The distinction matters because the interventions differ.</p>
            </div>

            <p style={{ fontSize:16, lineHeight:1.8, color:ac, marginBottom:40 }}>This protocol is built on the Maslach Burnout framework — the most validated measure in existence, 35+ years of research. You'll assess your specific burnout pattern, identify what's draining you, and leave with a concrete recovery plan.</p>

            <div style={{ textAlign:"center" }}><Btn onClick={() => go("assess")}>Assess my burnout</Btn></div>
            <p style={{ fontSize:10, color:"#7d7870", opacity:0.4, marginTop:32, textAlign:"center", lineHeight:1.7 }}>Built by a Board Certified PMHNP. Nothing stored or sent.</p>
          </div>
        )}

        {step === "assess" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 1 of 6</p>
            <h2 style={{ fontFamily:"'Literata', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>The three dimensions of burnout</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#7d7870", marginBottom:20 }}>Christina Maslach (UC Berkeley) identified that burnout isn't one thing — it's three distinct dimensions. Most people are high on one or two, not all three. Knowing YOUR pattern tells you exactly where to focus recovery.</p>

            <div style={{ padding:20, background:"rgba(255,255,255,0.6)", borderRadius:14, border:"1px solid #e0dbd3", marginBottom:16 }}>
              <h3 style={{ fontFamily:"'Literata', serif", fontSize:17, color:"#c4796b", fontWeight:400, marginBottom:4 }}>Emotional Exhaustion</h3>
              <p style={{ fontSize:12, color:"#7d7870", marginBottom:14, lineHeight:1.6 }}>Feeling drained, depleted, unable to recover. The tank isn't just low — it has a hole.</p>
              <Slider label="I feel emotionally drained by my responsibilities" value={scores.e1} onChange={v => setScores(s=>({...s,e1:v}))} />
              <Slider label="I feel used up at the end of every day" value={scores.e2} onChange={v => setScores(s=>({...s,e2:v}))} />
              <Slider label="I dread the start of another day" value={scores.e3} onChange={v => setScores(s=>({...s,e3:v}))} />
            </div>

            <div style={{ padding:20, background:"rgba(255,255,255,0.6)", borderRadius:14, border:"1px solid #e0dbd3", marginBottom:16 }}>
              <h3 style={{ fontFamily:"'Literata', serif", fontSize:17, color:ac, fontWeight:400, marginBottom:4 }}>Cynicism & Detachment</h3>
              <p style={{ fontSize:12, color:"#7d7870", marginBottom:14, lineHeight:1.6 }}>Feeling disconnected, numb, or resentful toward things you used to care about. A wall your brain builds when caring hurts too much.</p>
              <Slider label="I've become more cynical or critical than I used to be" value={scores.c1} onChange={v => setScores(s=>({...s,c1:v}))} />
              <Slider label="I feel detached from my work or the people around me" value={scores.c2} onChange={v => setScores(s=>({...s,c2:v}))} />
              <Slider label="I've stopped caring as much about doing a good job" value={scores.c3} onChange={v => setScores(s=>({...s,c3:v}))} />
            </div>

            <div style={{ padding:20, background:"rgba(255,255,255,0.6)", borderRadius:14, border:"1px solid #e0dbd3", marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Literata', serif", fontSize:17, color:"#7d7870", fontWeight:400, marginBottom:4 }}>Reduced Accomplishment</h3>
              <p style={{ fontSize:12, color:"#7d7870", marginBottom:14, lineHeight:1.6 }}>Feeling like nothing you do matters. Even wins don't register.</p>
              <Slider label="I feel like I'm not accomplishing anything meaningful" value={scores.i1} onChange={v => setScores(s=>({...s,i1:v}))} />
              <Slider label="I doubt my ability to handle my responsibilities" value={scores.i2} onChange={v => setScores(s=>({...s,i2:v}))} />
              <Slider label="My efforts don't seem to make a difference" value={scores.i3} onChange={v => setScores(s=>({...s,i3:v}))} />
            </div>

            <div style={{ textAlign:"center" }}><Btn onClick={() => go("result")}>See my results</Btn></div>
          </div>
        )}

        {step === "result" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <h2 style={{ fontFamily:"'Literata', serif", fontSize:28, fontWeight:300, marginBottom:16 }}>Your burnout profile</h2>

            <div style={{ padding:24, background:"rgba(255,255,255,0.6)", borderRadius:16, border:"1px solid #e0dbd3", marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16 }}>
                <span style={{ fontSize:14, fontWeight:600 }}>Overall</span>
                <span style={{ fontSize:22, fontFamily:"'Literata', serif", color:levelColor, textTransform:"capitalize" }}>{level}</span>
              </div>
              {[{label:"Emotional Exhaustion",score:eScore,max:9,color:"#c4796b"},{label:"Cynicism & Detachment",score:cScore,max:9,color:ac},{label:"Reduced Accomplishment",score:iScore,max:9,color:"#7d7870"}].map(d => (
                <div key={d.label} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, color:"#7d7870" }}>{d.label}</span>
                    <span style={{ fontSize:12, color:d.color, fontWeight:600 }}>{d.score}/{d.max}</span>
                  </div>
                  <div style={{ height:6, background:"#e0dbd3", borderRadius:3 }}>
                    <div style={{ height:6, width:`${(d.score/d.max)*100}%`, background:d.color, borderRadius:3, transition:"width 0.5s" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding:20, background:"rgba(184,147,90,0.05)", borderRadius:14, marginBottom:16 }}>
              <p style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontWeight:600 }}>Your primary dimension</p>
              {primary === "exhaustion" && <p style={{ fontSize:14, lineHeight:1.8 }}>Your primary dimension is <strong style={{ color:"#c4796b" }}>emotional exhaustion</strong>. You're depleted — giving more than you're getting back. Recovery priority: resource restoration — sleep, genuine rest (not scrolling), physical care, and reducing output.</p>}
              {primary === "cynicism" && <p style={{ fontSize:14, lineHeight:1.8 }}>Your primary dimension is <strong style={{ color:ac }}>cynicism & detachment</strong>. You've built walls to protect yourself from caring too much. Recovery priority: values reconnection — remembering why you started and rebuilding meaning one piece at a time.</p>}
              {primary === "inefficacy" && <p style={{ fontSize:14, lineHeight:1.8 }}>Your primary dimension is <strong style={{ color:"#7d7870" }}>reduced accomplishment</strong>. You feel like nothing matters. Recovery priority: efficacy restoration — small wins, visible progress, and reconnecting with the impact you actually have.</p>}
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>When did you start feeling this way?</label>
              <p style={{ fontSize:12, color:"#7d7870", marginBottom:8 }}>This helps identify whether it's situational (a specific trigger) or accumulated (slow build over months/years).</p>
              <textarea value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="e.g., 'About 6 months ago when I took on the extra project' or 'Honestly I can't remember NOT feeling this way'" rows={2} style={{ width:"100%", padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.6)", border:"1px solid #e0dbd3", borderRadius:12, color:"#2d2a25", resize:"vertical", lineHeight:1.7 }} />
            </div>

            <div style={{ textAlign:"center" }}><Btn onClick={() => go("energy")}>Next: Energy Audit</Btn></div>
          </div>
        )}

        {step === "energy" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 3 of 6</p>
            <h2 style={{ fontFamily:"'Literata', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>Where is your energy going?</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#7d7870", marginBottom:20 }}>Burnout is an energy equation: output exceeding input over a sustained period. You can't fix it with motivation. You fix it by changing the equation. Be specific — "work" is too vague. "Responding to Slack messages that aren't urgent" is actionable.</p>

            <div style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#c4796b" }} />
                <label style={{ fontSize:13, fontWeight:600 }}>Energy drains</label>
              </div>
              <textarea value={drains} onChange={e => setDrains(e.target.value)} placeholder={"Saying yes to things I don't want to do\nNot sleeping because I need 'me time' late at night\nCaring about work that leadership doesn't care about\nScrolling instead of resting\nOther people's emotions I absorb\nThe commute — dead time"} rows={6} style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(196,121,107,0.03)", border:"1px solid rgba(196,121,107,0.12)", borderRadius:12, color:"#2d2a25", resize:"vertical", lineHeight:1.8 }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#5a8c6b" }} />
                <label style={{ fontSize:13, fontWeight:600 }}>Energy sources</label>
                <span style={{ fontSize:11, color:"#7d7870", opacity:0.5 }}>— even small ones</span>
              </div>
              <textarea value={fills} onChange={e => setFills(e.target.value)} placeholder={"Being outside — even 10 minutes\nCooking when I'm not rushed\nThat one friend who doesn't need me to perform\nMoving my body — not 'exercise,' just walking\nMaking something with my hands\n(It's okay if this list is short)"} rows={5} style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(90,140,107,0.03)", border:"1px solid rgba(90,140,107,0.12)", borderRadius:12, color:"#2d2a25", resize:"vertical", lineHeight:1.8 }} />
            </div>

            <div style={{ padding:16, background:"rgba(184,147,90,0.05)", borderRadius:12 }}>
              <p style={{ fontSize:12, color:"#7d7870", lineHeight:1.7 }}><strong style={{ color:ac }}>Notice the ratio.</strong> If drains outnumber fills 3:1, that's burnout in a single image. Recovery isn't eliminating all drains — it's rebalancing. Even small additions to fills and small subtractions from drains create measurable change over weeks.</p>
            </div>

            {drains.trim().length > 10 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("values")}>Next: Values Reconnection</Btn></div>}
          </div>
        )}

        {step === "values" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 4 of 6</p>
            <h2 style={{ fontFamily:"'Literata', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>Remember why you cared</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#7d7870", marginBottom:20 }}>Burnout often starts as passion. You cared deeply — and the cost exceeded the return. Your brain started protecting you by numbing the connection. Cynicism is armor. But the values underneath are still there.</p>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>Before burnout, what mattered most to you?</label>
              <p style={{ fontSize:12, color:"#7d7870", marginBottom:8 }}>Not "what were you doing" — what VALUE was it serving? Growth? Connection? Impact? Mastery? Freedom?</p>
              <textarea value={valueBefore} onChange={e => setValueBefore(e.target.value)} placeholder="I wanted to help people. I wanted to build something meaningful. I cared about being excellent at my craft. I valued growth and learning." rows={4} style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.6)", border:"1px solid #e0dbd3", borderRadius:12, color:"#2d2a25", resize:"vertical", lineHeight:1.8 }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>What part of that feels lost right now?</label>
              <textarea value={valueLost} onChange={e => setValueLost(e.target.value)} placeholder="I don't feel like I'm helping anyone. The work feels pointless. I'm going through motions. I can't remember feeling proud of something I did." rows={3} style={{ width:"100%", padding:16, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.6)", border:"1px solid #e0dbd3", borderRadius:12, color:"#2d2a25", resize:"vertical", lineHeight:1.7 }} />
            </div>

            <div style={{ padding:16, background:"rgba(184,147,90,0.05)", borderRadius:12 }}>
              <p style={{ fontSize:12, color:"#7d7870", lineHeight:1.7 }}><strong style={{ color:ac }}>ACT insight:</strong> Values can't be "achieved" — they're directions, not destinations. You can always move toward a value, no matter how burned out you are. Even tiny values-aligned actions rebuild the connection burnout severed.</p>
            </div>

            {valueBefore.trim().length > 10 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("boundaries")}>Next: Boundaries</Btn></div>}
          </div>
        )}

        {step === "boundaries" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 5 of 6</p>
            <h2 style={{ fontFamily:"'Literata', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>The boundary audit</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#7d7870", marginBottom:20 }}>Burnout almost always involves a boundary failure — saying yes when you meant no, absorbing responsibilities that aren't yours, being available when you need to be unreachable. Boundaries aren't selfish. They're the infrastructure that makes sustained giving possible.</p>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, color:"#5a8c6b", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>What do I need to say YES to for myself this week?</label>
              <textarea value={boundaryYes} onChange={e => setBoundaryYes(e.target.value)} placeholder="Going to bed before 11pm. Asking for help. Taking Saturday morning completely off. Eating a real meal instead of snacking through the day." rows={3} style={{ width:"100%", padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(90,140,107,0.04)", border:"1px solid rgba(90,140,107,0.12)", borderRadius:12, color:"#2d2a25", resize:"vertical", lineHeight:1.7 }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:"#c4796b", letterSpacing:2, textTransform:"uppercase", display:"block", marginBottom:6, fontWeight:600 }}>What do I need to say NO to this week?</label>
              <textarea value={boundaryNo} onChange={e => setBoundaryNo(e.target.value)} placeholder="Checking email after 7pm. Saying 'sure, I can do that' when I'm at capacity. Working through lunch. Being everyone's emotional support." rows={3} style={{ width:"100%", padding:14, fontSize:14, fontFamily:"'DM Sans', sans-serif", background:"rgba(196,121,107,0.03)", border:"1px solid rgba(196,121,107,0.12)", borderRadius:12, color:"#2d2a25", resize:"vertical", lineHeight:1.7 }} />
            </div>

            <div style={{ padding:16, background:"rgba(184,147,90,0.05)", borderRadius:12 }}>
              <p style={{ fontSize:12, color:"#7d7870", lineHeight:1.7 }}><strong style={{ color:ac }}>Maslach's research:</strong> The strongest predictor of burnout recovery isn't vacation, therapy, or medication — it's restoring a sense of control over your own time and energy. Every boundary is an act of agency recovery.</p>
            </div>

            {boundaryYes.trim().length > 5 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center", marginTop:20 }}><Btn onClick={() => go("recover")}>Final step</Btn></div>}
          </div>
        )}

        {step === "recover" && (
          <div key={fk} style={{ animation:"fadeUp 0.8s ease", paddingTop:"6vh" }}>
            <p style={{ fontSize:11, color:ac, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Step 6 of 6</p>
            <h2 style={{ fontFamily:"'Literata', serif", fontSize:28, fontWeight:300, marginBottom:12 }}>One micro-recovery. Today.</h2>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#7d7870", marginBottom:6 }}>Burnout recovery doesn't require a sabbatical. It starts with micro-recoveries — small, deliberate acts of restoration. Research shows frequent small recovery activities are more effective than infrequent large ones.</p>
            <p style={{ fontSize:14, lineHeight:1.8, color:ac, marginBottom:16 }}>Look at your energy sources. Pick ONE thing for today — not to be productive, just to put something back in the tank.</p>

            {fills.trim() && (
              <div style={{ padding:14, background:"rgba(90,140,107,0.04)", borderRadius:12, marginBottom:16, border:"1px solid rgba(90,140,107,0.1)" }}>
                <p style={{ fontSize:11, color:"#5a8c6b", letterSpacing:2, textTransform:"uppercase", marginBottom:4, fontWeight:600 }}>Your energy sources</p>
                <p style={{ fontSize:13, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{fills}</p>
              </div>
            )}

            <div style={{ padding:20, background:"rgba(255,255,255,0.6)", borderRadius:14, border:"1px solid #e0dbd3", marginBottom:16 }}>
              <p style={{ fontSize:14, color:ac, fontWeight:600, marginBottom:10 }}>Today, I will give myself:</p>
              <input type="text" value={microAct} onChange={e => setMicroAct(e.target.value)} placeholder="20 minutes outside with no phone. Just that." style={{ width:"100%", padding:14, fontSize:15, fontFamily:"'DM Sans', sans-serif", background:"rgba(255,255,255,0.5)", border:"1px solid #e0dbd3", borderRadius:10, color:"#2d2a25" }} />
            </div>

            {microAct.trim().length > 5 && <div style={{ animation:"fadeUp 0.5s ease", textAlign:"center" }}><Btn onClick={() => go("close")}>See my recovery plan</Btn></div>}
          </div>
        )}

        {step === "close" && (
          <div key={fk} style={{ animation:"fadeUp 1s ease", paddingTop:"6vh" }}>
            <h2 style={{ fontFamily:"'Literata', serif", fontSize:32, fontWeight:300, marginBottom:8, lineHeight:1.3 }}>This is your<br/>recovery map.</h2>
            <p style={{ fontSize:15, lineHeight:1.8, color:"#7d7870", marginBottom:24 }}>You completed a clinical burnout assessment, identified your primary dimension, mapped your energy equation, reconnected with your values, set boundaries, and committed to a micro-recovery. That's a real recovery plan — not a motivational poster.</p>

            <div style={{ padding:24, background:"rgba(255,255,255,0.6)", borderRadius:16, border:"1px solid #e0dbd3", marginBottom:20 }}>
              <p style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", marginBottom:16, fontWeight:600 }}>Your burnout recovery plan</p>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div><p style={{ fontSize:10, color:"#7d7870", textTransform:"uppercase", letterSpacing:1 }}>Burnout level</p><p style={{ fontSize:18, color:levelColor, fontWeight:600, textTransform:"capitalize", fontFamily:"'Literata', serif" }}>{level} — primarily {primary === "exhaustion" ? "emotional exhaustion" : primary === "cynicism" ? "cynicism & detachment" : "reduced accomplishment"}</p></div>
                {timeline && <div><p style={{ fontSize:10, color:"#7d7870", textTransform:"uppercase", letterSpacing:1 }}>Onset</p><p style={{ fontSize:13, fontStyle:"italic" }}>"{timeline}"</p></div>}
                <div><p style={{ fontSize:10, color:"#7d7870", textTransform:"uppercase", letterSpacing:1 }}>Core values to reconnect with</p><p style={{ fontSize:13, fontStyle:"italic" }}>"{valueBefore}"</p></div>
                <div><p style={{ fontSize:10, color:"#5a8c6b", textTransform:"uppercase", letterSpacing:1 }}>Saying YES to</p><p style={{ fontSize:13 }}>{boundaryYes}</p></div>
                <div><p style={{ fontSize:10, color:"#c4796b", textTransform:"uppercase", letterSpacing:1 }}>Saying NO to</p><p style={{ fontSize:13 }}>{boundaryNo}</p></div>
                <div><p style={{ fontSize:10, color:ac, textTransform:"uppercase", letterSpacing:1 }}>Today's micro-recovery</p><p style={{ fontSize:16, color:ac, fontWeight:600, fontFamily:"'Literata', serif" }}>"{microAct}"</p></div>
                <div><p style={{ fontSize:10, color:"#7d7870", textTransform:"uppercase", letterSpacing:1 }}>Session</p><p style={{ fontSize:13 }}>{mins} min · Maslach assessment · Energy audit · ACT values · DBT boundaries</p></div>
              </div>
            </div>

            <div style={{ padding:22, background:"rgba(184,147,90,0.04)", borderRadius:16, marginBottom:20 }}>
              <p style={{ fontSize:11, color:ac, letterSpacing:2, textTransform:"uppercase", marginBottom:12, fontWeight:600 }}>The road from here</p>
              <p style={{ fontSize:14, color:"#7d7870", lineHeight:1.8, marginBottom:10 }}><strong style={{ color:"#2d2a25" }}>This week:</strong> Do your micro-recovery daily. Hold one boundary. That's enough.</p>
              <p style={{ fontSize:14, color:"#7d7870", lineHeight:1.8, marginBottom:10 }}><strong style={{ color:"#2d2a25" }}>This month:</strong> Revisit your energy audit. Have the drains shifted? Track the ratio.</p>
              <p style={{ fontSize:14, color:"#7d7870", lineHeight:1.8 }}><strong style={{ color:"#2d2a25" }}>If it doesn't improve:</strong> Burnout that persists despite changes may have tipped into clinical depression. That's not failure — it's a signal you need professional support.</p>
            </div>

            <div style={{ padding:16, background:"rgba(184,147,90,0.04)", borderRadius:12, marginBottom:20 }}>
              <p style={{ fontSize:14, color:"#7d7870", lineHeight:1.7 }}>Bookmark <strong style={{ color:ac }}>aiforj.com/burned-out</strong> — free, private, always here. Share it with someone running on empty.</p>
            </div>

            <div style={{ textAlign:"center", marginBottom:24 }}>
              <p style={{ fontSize:14, color:"#7d7870", marginBottom:14 }}>Forj can help build daily recovery practices and guide you through evidence-based techniques.</p>
              <a href="/" style={{ display:"inline-block", padding:"14px 36px", fontSize:15, background:"transparent", color:ac, border:`1px solid ${ac}`, borderRadius:40, textDecoration:"none", fontWeight:600 }}>Talk to Forj — Free</a>
            </div>

            <EmailCapture />

            <div style={{ padding:16, borderRadius:12, border:"1px solid #e0dbd3", textAlign:"center" }}>
              <p style={{ fontSize:11, color:"#7d7870", opacity:0.4, lineHeight:1.8 }}>If you're in crisis: <strong>988 Lifeline</strong> — call or text 988 | <strong>Crisis Text Line</strong> — text HOME to 741741</p>
            </div>
            <p style={{ textAlign:"center", fontSize:10, color:"#7d7870", opacity:0.25, marginTop:24 }}>Built by a Board Certified PMHNP-BC — Caring for the Whole Human<br/>© 2026 AIForj.com</p>
          </div>
        )}
      </main>
    </div>
  );
}
