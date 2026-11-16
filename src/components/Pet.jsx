import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { prefersReduced } from "../lib/smooth";
import { CMS_URL, WHATSAPP_URL } from "../data/site";

// The site's cat. It walks wherever it likes, but only ever rests where it covers no text.
// It has moods, reacts to being stared at, petted and knocked over, and when clicked it
// listens through the microphone and answers out loud, with subtitles in a cloud.
const SRC = (n) => `/images/cat/${n}.png`;
const WALK = ["walk1", "walk2", "walk3", "walk2"];
const SPEED = 70; // pixels per second
const API = (CMS_URL || "") + "/api/companion/talk";
const TEXTY = new Set(["H1", "H2", "H3", "H4", "P", "A", "BUTTON", "LI", "INPUT", "TEXTAREA", "LABEL", "DT", "DD", "EM", "IMG", "svg", "path"]);

const STARE = ["Staring is rude, you know.", "Yes? Are we talking, or just looking?", "Still here. Fine. Click me and say something."];
const PET = ["Hmph. That is... acceptable.", "Do not get used to this.", "Fine. A little more."];
const FALL = ["Hey! Rude.", "I meant to do that.", "Was that necessary?"];
const NAP = "I am napping. Use the Start a project page, or WhatsApp a human.";
const EMOTES = [["sleepy", "z z z"], ["curious", "?"], ["smug", "✦"], ["happy", "♥"], ["angry", "!"]];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

// A small synthesized meow: a rising, then falling chirp.
let audio;
function meow(high = true) {
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const t = audio.currentTime;
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(high ? 620 : 400, t);
    o.frequency.exponentialRampToValueAtTime(high ? 1180 : 700, t + 0.12);
    o.frequency.exponentialRampToValueAtTime(high ? 720 : 360, t + 0.42);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.15, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.46);
    o.connect(g).connect(audio.destination);
    o.start(t);
    o.stop(t + 0.5);
  } catch { /* no audio on this device */ }
}

// Speak in short phrases, each at a different pitch, so the voice rises and falls instead of droning.
const PITCH = { happy: [1.95, 1.6, 2], angry: [1.25, 1, 1.4], sleepy: [1.1, 0.9], sad: [1.2, 1.05], neutral: [1.7, 1.4, 1.85, 1.5] };
function speak(text, mood) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const bangla = /[\u0980-\u09FF]/.test(text);
    const voices = synth.getVoices();
    const voice = bangla ? voices.find((v) => v.lang.startsWith("bn")) : voices.find((v) => v.lang.startsWith("en") && /female|zira|samantha|aria|jenny|sonia|google uk english female/i.test(v.name));
    const pitches = PITCH[mood] || PITCH.neutral;
    text.split(/(?<=[.!?,;:])\s+/).filter(Boolean).forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      if (voice) u.voice = voice;
      if (bangla) u.lang = "bn-BD";
      u.pitch = pitches[i % pitches.length];
      u.rate = mood === "sleepy" ? 0.88 : 1.08;
      synth.speak(u);
    });
  } catch { /* no speech on this device: the subtitles still show */ }
}
const store = (k, v) => { try { return v === undefined ? sessionStorage.getItem(k) : sessionStorage.setItem(k, v); } catch { return null; } };

export default function Pet() {
  const still = prefersReduced();
  const size = typeof window !== "undefined" && innerWidth < 640 ? 46 : 64;
  const [pos, setPos] = useState({ x: 24, y: typeof window !== "undefined" ? innerHeight - size - 14 : 500 });
  const [travel, setTravel] = useState(0);
  const [facing, setFacing] = useState(1);
  const [mode, setMode] = useState("idle"); // idle | walk | busy
  const [frame, setFrame] = useState("idle");
  const [cloud, setCloud] = useState(null); // { text, kind: "say" | "emote" | "ask" | "type" }
  const [gone, setGone] = useState(() => store("pet-hidden") === "1");
  const at = useRef(pos);
  const timers = useRef([]);
  const root = useRef(null);
  const history = useRef([]);
  const rub = useRef(0);
  const { pathname } = useLocation();

  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => { clearAll(); window.speechSynthesis?.cancel(); }, []);
  // "Call the cat" in the footer brings a hidden cat back.
  useEffect(() => {
    const show = () => { store("pet-hidden", "0"); setGone(false); setCloud(null); setFrame("idle"); setMode("idle"); };
    addEventListener("pet:show", show);
    return () => removeEventListener("pet:show", show);
  }, []);
  // Load every frame up front so the cat never flickers when it changes pose.
  useEffect(() => { ["idle", "talk", "happy", "angry", "sad", "smug", "curious", "fall", "sleepy", "walk1", "walk2", "walk3"].forEach((n) => { new Image().src = SRC(n); }); }, []);

  // Is this spot free of text and controls? Checks what lies under the cat's box.
  const free = useCallback((x, y) => {
    for (const [dx, dy] of [[0.5, 0.5], [0.1, 0.2], [0.9, 0.2], [0.1, 0.9], [0.9, 0.9]]) {
      for (const el of document.elementsFromPoint(x + size * dx, y + size * dy)) {
        if (root.current?.contains(el)) continue;
        if (TEXTY.has(el.tagName)) return false;
        if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return false;
      }
    }
    return true;
  }, [size]);

  const spot = useCallback(() => {
    const y = innerHeight - size - 10;
    for (let i = 0; i < 14; i++) {
      const x = 12 + Math.random() * (innerWidth - size - 24);
      if (free(x, y)) return { x, y };
    }
    return { x: 16, y };
  }, [free, size]);

  const walkTo = useCallback((to) => {
    const dist = Math.hypot(to.x - at.current.x, to.y - at.current.y);
    if (dist < 30) return;
    setFacing(to.x >= at.current.x ? 1 : -1);
    setTravel(dist / SPEED);
    at.current = to;
    setPos(to);
    setMode("walk");
    later(() => { setMode("idle"); setFrame("idle"); }, (dist / SPEED) * 1000 + 80);
  }, []);

  // Walk cycle.
  useEffect(() => {
    if (mode !== "walk") return;
    let i = 0;
    const id = setInterval(() => setFrame(WALK[i++ % WALK.length]), 130);
    return () => clearInterval(id);
  }, [mode]);

  // A life of its own: every so often it wanders off or shows what it is feeling.
  useEffect(() => {
    if (gone || still || mode !== "idle" || cloud) return;
    const t = setTimeout(() => {
      const roll = Math.random();
      if (roll < 0.4) return walkTo(spot());
      if (roll < 0.75) {
        setFrame("sleepy");
        setCloud({ text: "z z z", kind: "emote" });
        return later(() => { setCloud((c) => (c?.kind === "emote" ? null : c)); setFrame("idle"); }, 9000);
      }
      const [f, text] = pick(EMOTES);
      setFrame(f);
      setCloud({ text, kind: "emote" });
      later(() => { setCloud((c) => (c?.kind === "emote" ? null : c)); setFrame("idle"); }, 2600);
    }, 5000 + Math.random() * 7000);
    return () => clearTimeout(t);
  }, [mode, cloud, gone, still, walkTo, spot]);

  // Safety net: if it is ever left "busy" with nothing showing, it goes back to wandering.
  useEffect(() => {
    if (mode !== "busy" || cloud) return;
    const t = setTimeout(() => { setFrame("idle"); setMode("idle"); }, 5000);
    return () => clearTimeout(t);
  }, [mode, cloud]);

  // If the page moves text underneath a resting cat, it gets out of the way.
  useEffect(() => {
    if (gone || still) return;
    let t;
    const check = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const floor = innerHeight - size - 10;
        if (Math.abs(at.current.y - floor) > 4 && mode !== "walk") { at.current = { x: Math.min(at.current.x, innerWidth - size - 12), y: floor }; setPos(at.current); }
        else if (mode === "idle" && !cloud && !free(at.current.x, at.current.y)) walkTo(spot());
      }, 350);
    };
    addEventListener("scroll", check, { passive: true });
    addEventListener("resize", check);
    return () => { clearTimeout(t); removeEventListener("scroll", check); removeEventListener("resize", check); };
  }, [mode, cloud, gone, still, free, walkTo, spot]);

  useEffect(() => { setCloud((c) => (c?.kind === "emote" ? null : c)); }, [pathname]);

  // Speak a line aloud and show it as subtitles, a few words at a time.
  const say = useCallback((text, mood = "idle") => {
    clearAll();
    setMode("busy");
    const words = text.split(" ");
    let shown = 0;
    const step = () => {
      shown = Math.min(words.length, shown + 1);
      setCloud({ text: words.slice(Math.max(0, shown - 9), shown).join(" "), kind: "say" });
      setFrame(shown % 2 ? "talk" : mood === "neutral" ? "idle" : mood);
      if (shown < words.length) later(step, 190);
      else later(() => { setCloud(null); setFrame("idle"); setMode("idle"); }, 2200);
    };
    step();
    if (mood === "happy" || mood === "angry" || Math.random() < 0.5) meow(mood !== "angry" && mood !== "sleepy");
    later(() => speak(text, mood), 380);
  }, []);

  const ask = useCallback(async (message) => {
    clearAll();
    setMode("busy");
    setFrame("curious");
    setCloud({ text: "...", kind: "say" });
    try {
      const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, history: history.current }) });
      if (!res.ok) throw new Error(res.status);
      const { reply, mood } = await res.json();
      history.current = [...history.current, { from: "visitor", text: message }, { from: "cat", text: reply }].slice(-6);
      say(reply, mood);
    } catch {
      say(NAP, "sleepy");
    }
  }, [say]);

  const listen = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setCloud({ text: "", kind: "type" });
    clearAll();
    setMode("busy");
    setFrame("curious");
    setCloud({ text: "I am listening...", kind: "say" });
    const rec = new SR();
    rec.lang = navigator.language?.startsWith("bn") ? "bn-BD" : "en-US";
    rec.maxAlternatives = 1;
    let heard = false;
    rec.onresult = (e) => { heard = true; ask(e.results[0][0].transcript); };
    rec.onerror = () => { heard = true; setCloud({ text: "", kind: "type" }); };
    rec.onend = () => { if (!heard) { setCloud(null); setFrame("idle"); setMode("idle"); } };
    try { rec.start(); } catch { setCloud({ text: "", kind: "type" }); }
  }, [ask]);

  if (gone) return null;

  // Stop exactly where it is on screen, even mid-walk.
  const halt = () => {
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    at.current = { x: r.left, y: r.top };
    setPos(at.current);
  };
  const click = () => {
    halt();
    if (cloud?.kind === "ask" || cloud?.kind === "type") { setCloud(null); setFrame("idle"); setMode("idle"); return; }
    window.speechSynthesis?.cancel();
    clearAll();
    setMode("busy");
    setFrame("idle");
    if (store("pet-mic") === "1") return listen();
    setCloud({ text: "Want to talk? I need your microphone to hear you.", kind: "ask" });
  };
  const knock = () => {
    halt();
    window.speechSynthesis?.cancel();
    clearAll();
    setMode("busy");
    setCloud(null);
    setFrame("fall");
    later(() => say(pick(FALL), "angry"), 1300);
  };
  const enter = () => { rub.current = 0; if (mode === "idle" && !cloud) later(() => say(pick(STARE), "smug"), 2600); };
  const leave = () => { if (mode === "idle") clearAll(); };
  const move = (e) => {
    rub.current += Math.abs(e.movementX) + Math.abs(e.movementY);
    if (rub.current > 420 && mode === "idle" && !cloud) { rub.current = -900; clearAll(); say(pick(PET), "happy"); }
  };
  const hide = () => { store("pet-hidden", "1"); window.speechSynthesis?.cancel(); setGone(true); };

  const vw = typeof window !== "undefined" ? innerWidth : 1200;
  const cw = Math.min(cloud?.kind === "emote" ? 76 : 270, vw - 32);
  const shift = Math.max(16 - pos.x, Math.min(size / 2 - cw / 2, vw - 16 - cw - pos.x));
  const below = pos.y < 190;
  const flip = frame.startsWith("walk") && facing === -1;

  return (
    <div
      ref={root}
      onTransitionEnd={(e) => { if (e.target === root.current && mode === "walk") { setMode("idle"); setFrame("idle"); } }}
      className="pointer-events-none fixed left-0 top-0 z-[60] will-change-transform"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: mode === "walk" ? `transform ${travel}s linear` : "none", width: size }}
    >
      {cloud && (
        <div
          role={cloud.kind === "ask" || cloud.kind === "type" ? "dialog" : "status"}
          aria-live="polite"
          className={"pet-cloud pointer-events-auto absolute left-0 rounded-[22px] border border-ink/10 bg-white px-4 py-3 text-sm leading-snug shadow-[0_24px_60px_-24px_rgba(116,21,22,0.5)] " + (below ? "top-full mt-3" : "bottom-full mb-3")}
          style={{ width: cw, transform: `translateX(${shift}px)` }}
        >
          {cloud.kind === "emote" && <p className="text-center text-xl">{cloud.text}</p>}
          {cloud.kind === "say" && <p>{cloud.text}</p>}
          {cloud.kind === "ask" && (
            <>
              <p>{cloud.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => { store("pet-mic", "1"); listen(); }} className="flex h-11 items-center rounded-full bg-ink px-4 text-paper">Use microphone</button>
                <button onClick={() => setCloud({ text: "", kind: "type" })} className="flex h-11 items-center rounded-full border border-ink/20 px-4">Type instead</button>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-ink/55">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="flex h-11 items-center underline underline-offset-4">WhatsApp a human</a>
                <button onClick={hide} className="flex h-11 items-center underline underline-offset-4">Hide the cat</button>
              </div>
            </>
          )}
          {cloud.kind === "type" && (
            <form onSubmit={(e) => { e.preventDefault(); const v = e.currentTarget.q.value.trim(); if (v) ask(v); }} className="flex gap-2">
              <label className="sr-only" htmlFor="pet-q">Say something to the cat</label>
              <input id="pet-q" name="q" autoFocus maxLength={300} placeholder="Say something..." className="h-11 min-w-0 flex-1 rounded-full border border-ink/20 px-4 outline-none focus:border-ink" />
              <button className="flex h-11 items-center rounded-full bg-ink px-4 text-paper">Send</button>
            </form>
          )}
        </div>
      )}
      <button
        onClick={click}
        onDoubleClick={knock}
        onPointerEnter={enter}
        onPointerLeave={leave}
        onPointerMove={move}
        aria-label="Talk to the Neutorium cat"
        className={"pointer-events-auto relative block w-full " + (mode === "walk" ? "" : frame === "fall" || frame === "sleepy" ? "" : "pet-idle")}
        style={{ height: size }}
      >
        <span className="pet-shadow absolute inset-x-[12%] bottom-[-6%] h-[16%]" aria-hidden="true" />
        <img src={SRC(frame)} alt="" draggable="false" className="absolute bottom-0 left-1/2 max-h-full max-w-none -translate-x-1/2" style={{ height: frame === "fall" || frame === "sleepy" ? "64%" : "100%", scale: flip ? "-1 1" : "1 1" }} />
      </button>
    </div>
  );
}
