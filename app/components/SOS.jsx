"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { track } from '../../lib/analytics';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('aiforj', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('interventions')) {
        db.createObjectStore('interventions', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveIntervention(data) {
  try {
    const db = await openDB();
    const tx = db.transaction('interventions', 'readwrite');
    tx.objectStore('interventions').add(data);
    return tx.complete;
  } catch (e) {
    // ignore failures silently
  }
}

export default function SOS() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [breathText, setBreathText] = useState('');
  const [distress, setDistress] = useState(null);
  const [groundingText, setGroundingText] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const timerRef = useRef();

  // hide on blueprint routes
  if (pathname && pathname.startsWith('/blueprint')) return null;

  useEffect(() => {
    if (!open) {
      clearTimeout(timerRef.current);
      setPhase('idle');
      setBreathText('');
      setDistress(null);
      return;
    }

    // breathing cycle: inhale 4s, hold 4s, exhale 6s, repeat
    let mounted = true;
    const cycle = async () => {
      if (!mounted) return;
      setPhase('inhale');
      setBreathText('Breathe in');
      await new Promise(r => timerRef.current = setTimeout(r, 4000));
      if (!mounted) return;
      setPhase('hold');
      setBreathText('Hold');
      await new Promise(r => timerRef.current = setTimeout(r, 4000));
      if (!mounted) return;
      setPhase('exhale');
      setBreathText('Breathe out');
      await new Promise(r => timerRef.current = setTimeout(r, 6000));
      if (!mounted) return cycle();
    };
    cycle();

    return () => { mounted = false; clearTimeout(timerRef.current); };
  }, [open]);

  function handleClose() {
    setShowExitConfirm(true);
  }

  async function handleExitAnswer(answer) {
    setShowExitConfirm(false);
    if (answer === 'yes') {
      await saveIntervention({ time: Date.now(), success: true, distress });
      setOpen(false);
    } else {
      // No -> route to voice companion
      setOpen(false);
      router.push('/send');
    }
  }

  function handleDistressSelect(n) {
    setDistress(n);
    if (n <= 2) {
      // grounding prompt
    } else if (n <= 4) {
      // start TIPP sequence
    } else {
      // show 988
    }
  }

  function openSosModal() {
    track('sos_button_opened', { path: pathname || '/' });
    setOpen(true);
  }

  return (
    <>
      <button
        aria-label="Emergency calm button"
        title="Instant calm — tap anytime"
        onClick={openSosModal}
        className="sos-button"
      >
        SOS
      </button>

      {open && (
        <div className="sos-overlay" role="dialog" aria-modal="true">
          <div className="sos-content">
            <button className="sos-close" onClick={handleClose} aria-label="Close">×</button>

            <div className="sos-breathing">
              <div className={`breath-circle ${phase}`}></div>
              <div className="breath-text">{breathText}</div>
            </div>

            <h2 className="sos-affirm">You're safe. This will pass.</h2>

            <div className="sos-resources" aria-label="Crisis resources">
              <a className="sos-resource primary" href="tel:988">Call 988</a>
              <a className="sos-resource" href="sms:988">Text 988</a>
              <a className="sos-resource" href="sms:741741&body=HOME">Text HOME to 741741</a>
              <a className="sos-resource" href="/find-help">Find a Provider</a>
            </div>

            <div className="sos-scale">
              <div className="sos-scale-prompt">How intense is this right now?</div>
              <div className="sos-scale-row">
                {[1,2,3,4,5].map(n => (
                  <button key={n} className={`sos-scale-btn ${distress===n?'active':''}`} onClick={() => handleDistressSelect(n)}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="sos-flow">
              {distress && distress <= 2 && (
                <div className="grounding">
                  <div className="grounding-prompt">Name 5 things you can see right now</div>
                  <input aria-label="Grounding response" value={groundingText} onChange={(e)=>setGroundingText(e.target.value)} placeholder="Type something you see..." />
                </div>
              )}

              {distress && distress >=3 && distress <=4 && (
                <div className="tipp">
                  <h3>TIPP — Quick grounding sequence</h3>
                  <ol>
                    <li><strong>Temperature:</strong> Splash cold water on your face or hold an ice cube for 30 seconds.</li>
                    <li><strong>Intense exercise:</strong> 20 jumping jacks or march in place for 30s.</li>
                    <li><strong>Paced breathing:</strong> Use the breathing circle above (4s in, 4s hold, 6s out).</li>
                    <li><strong>Progressive relaxation:</strong> Tense and release major muscle groups for 30s.</li>
                  </ol>
                </div>
              )}

              {distress && distress === 5 && (
                <div className="crisis">
                  <h3>You're not alone.</h3>
                  <p className="crisis-lines">If you might hurt yourself or someone else, use real-time human support now.</p>
                  <div className="crisis-actions">
                    <a className="btn-primary" href="tel:988">Call 988</a>
                    <a className="btn-secondary" href="sms:988">Text 988</a>
                    <a className="btn-secondary" href="sms:741741&body=HOME">Text HOME to 741741</a>
                    <a className="btn-secondary" href="/find-help">Find a Provider</a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="sos-exit-confirm" role="dialog" aria-modal="true">
          <div className="confirm-card">
            <div className="confirm-text">Feeling better?</div>
            <div className="confirm-actions">
              <button className="btn-primary" onClick={() => handleExitAnswer('yes')}>Yes</button>
              <button className="btn-secondary" onClick={() => handleExitAnswer('no')}>No</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sos-button {
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--accent-warm);
          color: white;
          border: none;
          box-shadow: var(--shadow-lg);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          z-index: 9999;
          cursor: pointer;
          transition: transform 160ms var(--ease-out), box-shadow 160ms var(--ease-out);
        }
        .sos-button:hover { transform: translateY(-3px); }
        .sos-button:focus { outline: 3px solid rgba(0,0,0,0.12); }

        .sos-overlay {
          position: fixed;
          inset: 0;
          background: rgba(26,24,20,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9998;
          padding: 24px;
        }

        .sos-content {
          width: 100%;
          max-width: 720px;
          background: transparent;
          color: var(--text-primary);
          text-align: center;
          position: relative;
        }

        .sos-close {
          position: absolute;
          right: 0;
          top: -8px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 36px;
          line-height: 1;
          cursor: pointer;
        }

        .sos-breathing { margin-top: 8vh; margin-bottom: 18px; }
        .breath-circle { width: 220px; height: 220px; border-radius: 50%; margin: 0 auto; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); box-shadow: 0 8px 40px rgba(0,0,0,0.25); transition: transform 600ms cubic-bezier(.16,1,.3,1), opacity 600ms; }
        .breath-circle.inhale { transform: scale(1.22); transition-duration: 4000ms; }
        .breath-circle.hold { transform: scale(1.22); transition-duration: 4000ms; }
        .breath-circle.exhale { transform: scale(0.86); transition-duration: 6000ms; }
        .breath-text { margin-top: 14px; color: #fff; font-family: 'Fraunces', serif; font-size: 1.25rem; }

        .sos-affirm { font-family: 'Fraunces', serif; color: #fff; margin-top: 18px; margin-bottom: 8px; }

        .sos-resources {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          max-width: 620px;
          margin: 18px auto 20px;
        }

        .sos-resource {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .sos-resource.primary {
          background: #c95d4f;
          border-color: rgba(255,255,255,0.24);
        }

        .sos-scale { margin-top: 12px; }
        .sos-scale-prompt { color: rgba(255,255,255,0.9); margin-bottom: 8px; }
        .sos-scale-row { display:flex; gap:10px; justify-content:center; }
        .sos-scale-btn { width:44px; height:44px; border-radius:8px; border:none; background: rgba(255,255,255,0.08); color: #fff; font-weight:700; cursor:pointer; }
        .sos-scale-btn.active { background: rgba(255,255,255,0.16); box-shadow: 0 6px 18px rgba(0,0,0,0.3); }

        .sos-flow { margin-top: 18px; color: #fff; }
        .grounding input { margin-top: 8px; width: 100%; max-width: 420px; padding: 10px 12px; border-radius: 8px; border: none; }

        .tipp { text-align:left; max-width:640px; margin: 8px auto; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; }
        .tipp ol { padding-left: 18px; }

        .crisis { color: #fff; }
        .crisis-lines { font-size: 1.1rem; margin-bottom: 8px; }
        .crisis-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

        .sos-exit-confirm { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; z-index:10000; }
        .confirm-card { background: var(--surface-elevated); padding: 18px; border-radius: 12px; box-shadow: var(--shadow-lg); }
        .confirm-text { margin-bottom: 12px; font-weight:600; }
        .confirm-actions { display:flex; gap:12px; justify-content:center; }

      `}</style>
    </>
  );
}
