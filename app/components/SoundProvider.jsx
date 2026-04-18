"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "aiforj-sound";
const SoundContext = createContext(null);

const PROFILE_META = {
  rain: {
    key: "rain",
    label: "Rain hush",
    shortLabel: "Rain on",
    icon: "🌧️",
    reason: "A steadier water-like bed for higher-arousal or nighttime states.",
    volume: 0.12,
  },
  stream: {
    key: "stream",
    label: "Soft stream",
    shortLabel: "Stream on",
    icon: "💧",
    reason: "A neutral flowing-water bed for grounding, grief, shame, and conversation-heavy pages.",
    volume: 0.105,
  },
  birds: {
    key: "birds",
    label: "Birdsong",
    shortLabel: "Birdsong on",
    icon: "🐦",
    reason: "A slightly brighter natural soundscape for low mood, loneliness, and energy-rebuild moments.",
    volume: 0.096,
  },
};

const HIGH_AROUSAL_EMOTIONS = new Set([
  "anxious",
  "angry",
  "overwhelmed",
  "stressed-burned-out",
  "scared-fearful",
  "self-destructive",
]);

const LOW_ENERGY_EMOTIONS = new Set([
  "sad-low",
  "lonely",
  "stuck-lost",
]);

const TENDER_EMOTIONS = new Set([
  "grief-loss",
  "shame-guilt",
  "numb-disconnected",
]);

const HELP_EMOTION_HINTS = {
  "after-argument": "angry",
  "anxiety-at-work": "anxious",
  "before-presentation": "anxious",
  "burnout-recovery": "stressed-burned-out",
  "cant-sleep": "anxious",
  "comparison-trap": "shame-guilt",
  grief: "grief-loss",
  "imposter-syndrome": "shame-guilt",
  lonely: "lonely",
  "morning-dread": "sad-low",
  overthinking: "anxious",
  "panic-attack": "anxious",
  perfectionism: "shame-guilt",
  "self-worth": "shame-guilt",
};

function createNoiseBuffer(ctx, color = "white", durationSeconds = 2.5) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * durationSeconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastBrown = 0;
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;

  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;

    if (color === "brown") {
      lastBrown = (lastBrown + 0.02 * white) / 1.02;
      data[i] = lastBrown * 3.5;
      continue;
    }

    if (color === "pink") {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      data[i] = pink * 0.11;
      continue;
    }

    data[i] = white;
  }

  return buffer;
}

function buildNoiseLayer(ctx, destination, { color, gainValue, filters = [], playbackRate = 1 }) {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, color);
  source.loop = true;
  source.playbackRate.value = playbackRate;

  let node = source;
  const disposables = [source];

  filters.forEach((filterConfig) => {
    const filter = ctx.createBiquadFilter();
    filter.type = filterConfig.type;
    filter.frequency.value = filterConfig.frequency;
    if (filterConfig.Q != null) filter.Q.value = filterConfig.Q;
    if (filterConfig.gain != null) filter.gain.value = filterConfig.gain;
    node.connect(filter);
    node = filter;
    disposables.push(filter);
  });

  const gain = ctx.createGain();
  gain.gain.value = gainValue;
  node.connect(gain);
  gain.connect(destination);
  disposables.push(gain);
  source.start();

  return () => {
    try {
      source.stop();
    } catch {}
    disposables.forEach((item) => {
      try {
        item.disconnect();
      } catch {}
    });
  };
}

function buildRainProfile(ctx, destination) {
  const cleanups = [
    buildNoiseLayer(ctx, destination, {
      color: "brown",
      gainValue: 0.38,
      filters: [
        { type: "lowpass", frequency: 1100 },
        { type: "highpass", frequency: 90 },
      ],
    }),
    buildNoiseLayer(ctx, destination, {
      color: "white",
      gainValue: 0.1,
      filters: [
        { type: "highpass", frequency: 2200 },
        { type: "lowpass", frequency: 7200 },
      ],
    }),
  ];

  return () => cleanups.forEach((cleanup) => cleanup());
}

function buildStreamProfile(ctx, destination) {
  const cleanups = [];
  const movementGain = ctx.createGain();
  movementGain.gain.value = 0.14;
  movementGain.connect(destination);

  const lfo = ctx.createOscillator();
  const lfoDepth = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoDepth.gain.value = 0.045;
  lfo.connect(lfoDepth);
  lfoDepth.connect(movementGain.gain);
  lfo.start();

  cleanups.push(() => {
    try {
      lfo.stop();
    } catch {}
    [lfo, lfoDepth, movementGain].forEach((node) => {
      try {
        node.disconnect();
      } catch {}
    });
  });

  cleanups.push(
    buildNoiseLayer(ctx, movementGain, {
      color: "pink",
      gainValue: 1,
      filters: [
        { type: "bandpass", frequency: 1100, Q: 0.7 },
        { type: "highpass", frequency: 150 },
      ],
      playbackRate: 0.92,
    })
  );

  cleanups.push(
    buildNoiseLayer(ctx, destination, {
      color: "white",
      gainValue: 0.045,
      filters: [
        { type: "bandpass", frequency: 2400, Q: 0.8 },
      ],
      playbackRate: 1.04,
    })
  );

  return () => cleanups.forEach((cleanup) => cleanup());
}

function scheduleBirdsong(ctx, destination) {
  const timers = new Set();
  const activeNodes = new Set();
  let cancelled = false;

  const releaseNode = (node) => {
    activeNodes.delete(node);
    try {
      node.disconnect();
    } catch {}
  };

  const playChirp = () => {
    if (cancelled) return;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const duration = 0.18 + Math.random() * 0.14;
    const start = ctx.currentTime + Math.random() * 0.08;
    const base = 1800 + Math.random() * 1400;

    osc.type = Math.random() > 0.55 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(base, start);
    osc.frequency.linearRampToValueAtTime(base * (1.08 + Math.random() * 0.18), start + duration * 0.45);
    osc.frequency.linearRampToValueAtTime(base * (0.96 + Math.random() * 0.05), start + duration);

    filter.type = "bandpass";
    filter.frequency.value = base * 1.15;
    filter.Q.value = 7;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.03 + Math.random() * 0.014, start + duration * 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    [osc, filter, gain].forEach((node) => activeNodes.add(node));

    osc.start(start);
    osc.stop(start + duration + 0.02);
    osc.onended = () => {
      releaseNode(osc);
      releaseNode(filter);
      releaseNode(gain);
    };
  };

  const scheduleBurst = () => {
    if (cancelled) return;

    playChirp();

    if (Math.random() > 0.42) {
      const echoTimer = window.setTimeout(playChirp, 110 + Math.random() * 180);
      timers.add(echoTimer);
    }

    const nextTimer = window.setTimeout(scheduleBurst, 1800 + Math.random() * 2600);
    timers.add(nextTimer);
  };

  scheduleBurst();

  return () => {
    cancelled = true;
    timers.forEach((timer) => window.clearTimeout(timer));
    activeNodes.forEach((node) => {
      try {
        if ("stop" in node) node.stop();
      } catch {}
      releaseNode(node);
    });
  };
}

function buildBirdProfile(ctx, destination) {
  const cleanups = [
    buildNoiseLayer(ctx, destination, {
      color: "pink",
      gainValue: 0.04,
      filters: [
        { type: "highpass", frequency: 900 },
        { type: "lowpass", frequency: 3600 },
      ],
      playbackRate: 0.96,
    }),
    buildNoiseLayer(ctx, destination, {
      color: "brown",
      gainValue: 0.12,
      filters: [
        { type: "bandpass", frequency: 680, Q: 0.5 },
      ],
      playbackRate: 0.88,
    }),
    scheduleBirdsong(ctx, destination),
  ];

  return () => cleanups.forEach((cleanup) => cleanup());
}

function getProfileForEmotion(emotion) {
  if (HIGH_AROUSAL_EMOTIONS.has(emotion)) return PROFILE_META.rain;
  if (LOW_ENERGY_EMOTIONS.has(emotion)) return PROFILE_META.birds;
  if (TENDER_EMOTIONS.has(emotion)) return PROFILE_META.stream;
  return PROFILE_META.stream;
}

function readLocation() {
  if (typeof window === "undefined") {
    return { pathname: "/", search: "" };
  }

  return {
    pathname: window.location.pathname || "/",
    search: window.location.search || "",
  };
}

function inferProfile(pathname, search) {
  const searchParams = new URLSearchParams(search || "");
  const emotion = searchParams.get("emotion");
  if (emotion) return getProfileForEmotion(emotion);

  if (pathname === "/3am-spiral" || pathname === "/help/cant-sleep") return PROFILE_META.rain;
  if (pathname === "/burned-out") return PROFILE_META.stream;
  if (pathname === "/overwhelmed") return PROFILE_META.rain;
  if (pathname === "/weather") return PROFILE_META.birds;
  if (pathname === "/companion") return PROFILE_META.stream;
  if (pathname === "/send" || pathname.startsWith("/gift/") || pathname === "/success") return PROFILE_META.birds;

  if (pathname.startsWith("/help/")) {
    const slug = pathname.split("/").pop();
    const hint = HELP_EMOTION_HINTS[slug];
    if (hint) return getProfileForEmotion(hint);
  }

  return PROFILE_META.stream;
}

export function SoundProvider({ children }) {
  const [location, setLocation] = useState({ pathname: "/", search: "" });
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(true);
  const engineRef = useRef(null);
  const stopTimeoutRef = useRef(null);

  const profile = useMemo(
    () => inferProfile(location.pathname, location.search),
    [location]
  );

  const ensureEngine = useCallback(async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setSupported(false);
      return null;
    }

    if (!engineRef.current) {
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      engineRef.current = { ctx, master, cleanup: null, profileKey: null };
    }

    if (engineRef.current.ctx.state === "suspended") {
      await engineRef.current.ctx.resume();
    }

    return engineRef.current;
  }, []);

  const applyProfile = useCallback(async (nextProfile, fadeIn = false) => {
    const engine = await ensureEngine();
    if (!engine) return;

    if (stopTimeoutRef.current) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    if (engine.profileKey === nextProfile.key && engine.cleanup) return;

    if (engine.cleanup) {
      engine.cleanup();
      engine.cleanup = null;
    }

    if (nextProfile.key === "rain") engine.cleanup = buildRainProfile(engine.ctx, engine.master);
    else if (nextProfile.key === "birds") engine.cleanup = buildBirdProfile(engine.ctx, engine.master);
    else engine.cleanup = buildStreamProfile(engine.ctx, engine.master);

    engine.profileKey = nextProfile.key;

    const now = engine.ctx.currentTime;
    engine.master.gain.cancelScheduledValues(now);
    if (fadeIn) {
      const previewPeak = Math.min(nextProfile.volume * 1.5, nextProfile.volume + 0.05);
      engine.master.gain.setValueAtTime(0.0001, now);
      engine.master.gain.linearRampToValueAtTime(previewPeak, now + 1.1);
      engine.master.gain.linearRampToValueAtTime(nextProfile.volume, now + 2.6);
    } else {
      engine.master.gain.setValueAtTime(nextProfile.volume, now);
    }

    setActive(true);
  }, [ensureEngine]);

  const stopAudio = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (stopTimeoutRef.current) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    const now = engine.ctx.currentTime;
    engine.master.gain.cancelScheduledValues(now);
    engine.master.gain.setValueAtTime(engine.master.gain.value, now);
    engine.master.gain.linearRampToValueAtTime(0.0001, now + 0.8);

    stopTimeoutRef.current = window.setTimeout(() => {
      if (!engineRef.current) return;
      engineRef.current.cleanup?.();
      engineRef.current.cleanup = null;
      engineRef.current.profileKey = null;
      stopTimeoutRef.current = null;
      setActive(false);
    }, 850);
  }, []);

  const toggle = useCallback(async () => {
    if (enabled && !active) {
      await applyProfile(profile, true);
      return;
    }

    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, String(next));

    if (next) {
      await applyProfile(profile, true);
    } else {
      stopAudio();
    }
    if (!next) {
      setActive(false);
    }
  }, [active, enabled, applyProfile, profile, stopAudio]);

  useEffect(() => {
    const syncLocation = () => setLocation(readLocation());
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const emitUrlChange = () => window.dispatchEvent(new Event("aiforj:urlchange"));

    window.history.pushState = function pushState(...args) {
      const result = originalPushState.apply(this, args);
      emitUrlChange();
      return result;
    };

    window.history.replaceState = function replaceState(...args) {
      const result = originalReplaceState.apply(this, args);
      emitUrlChange();
      return result;
    };

    syncLocation();
    window.addEventListener("popstate", syncLocation);
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("aiforj:urlchange", syncLocation);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", syncLocation);
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("aiforj:urlchange", syncLocation);
    };
  }, []);

  useEffect(() => {
    setSupported(Boolean(window.AudioContext || window.webkitAudioContext));
    const saved = localStorage.getItem(STORAGE_KEY);
    setEnabled(saved === "true");
    setActive(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (engineRef.current) {
      applyProfile(profile);
      return;
    }

    const resumeFromSavedPreference = () => {
      applyProfile(profile, true);
      window.removeEventListener("pointerdown", resumeFromSavedPreference);
      window.removeEventListener("keydown", resumeFromSavedPreference);
    };

    window.addEventListener("pointerdown", resumeFromSavedPreference, { once: true });
    window.addEventListener("keydown", resumeFromSavedPreference, { once: true });

    return () => {
      window.removeEventListener("pointerdown", resumeFromSavedPreference);
      window.removeEventListener("keydown", resumeFromSavedPreference);
    };
  }, [enabled, profile, applyProfile]);

  useEffect(() => {
    if (enabled) return;
    setActive(false);
  }, [enabled]);

  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) {
        window.clearTimeout(stopTimeoutRef.current);
      }
      if (!engineRef.current) return;
      engineRef.current.cleanup?.();
      engineRef.current.master.disconnect();
      engineRef.current.ctx.close().catch(() => {});
      engineRef.current = null;
    };
  }, []);

  const value = useMemo(
    () => ({
      enabled,
      active,
      supported,
      toggle,
      profile,
    }),
    [enabled, active, supported, toggle, profile]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useAdaptiveSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useAdaptiveSound must be used inside SoundProvider");
  }
  return context;
}
