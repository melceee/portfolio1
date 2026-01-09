import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ORB SURGE — modern mini-game for portfolio About section
 * - Click/tap targets to score
 * - Combo multiplier + streak feedback
 * - "Time Dilation" power-up (slow targets)
 * - Particles + floating HUD + modern glass UI
 * - Runs smooth without external libs
 */

const GAME_SECONDS = 35;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function nowMs() {
  return performance.now();
}

export default function AboutMiniGame() {
  const boxRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(nowMs());

  // Refs for high-frequency game state (no rerender on every frame)
  const targetsRef = useRef([]);
  const particlesRef = useRef([]);
  const slowRef = useRef({ active: false, until: 0 });

  // UI state
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hudMsg, setHudMsg] = useState("");
  const [hudPulse, setHudPulse] = useState(0);
  const [slowReady, setSlowReady] = useState(true);
  const [tick, setTick] = useState(0); // forces occasional re-render

  const [best, setBest] = useState(() => {
    const v = localStorage.getItem("orb_surge_best");
    return v ? Number(v) : 0;
  });

  const difficulty = useMemo(() => {
    // Size shrinks with score; speed increases with score
    const size = clamp(38 - score / 12, 18, 38);
    const speedMul = 1 + score / 120;
    const spawnMax = clamp(5 + Math.floor(score / 20), 5, 11);
    return { size, speedMul, spawnMax };
  }, [score]);

  function showHud(text) {
    setHudMsg(text);
    setHudPulse((p) => p + 1);
    // auto clear
    window.clearTimeout(showHud._t);
    showHud._t = window.setTimeout(() => setHudMsg(""), 900);
  }

  function reset() {
    setRunning(false);
    setTimeLeft(GAME_SECONDS);
    setScore(0);
    setCombo(0);
    setHudMsg("");
    setSlowReady(true);
    slowRef.current = { active: false, until: 0 };
    targetsRef.current = [];
    particlesRef.current = [];
    setTick((t) => t + 1);
  }

  function start() {
    reset();
    setRunning(true);
    // spawn initial targets
    for (let i = 0; i < 5; i++) spawnTarget();
    showHud("INIT ✓");
  }

  function endGame() {
    setRunning(false);
    setCombo(0);
    setSlowReady(true);
    slowRef.current = { active: false, until: 0 };

    setBest((b) => {
      const next = Math.max(b, score);
      localStorage.setItem("orb_surge_best", String(next));
      return next;
    });

    showHud("SYSTEM STABLE");
  }

  // Countdown timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) return 0;
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  // End on time 0
  useEffect(() => {
    if (running && timeLeft === 0) endGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, running]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (k === "r") start();
      if (k === " " || k === "s") {
        // Space or S = slow time
        e.preventDefault();
        activateSlow();
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, slowReady]);

  function rect() {
    const el = boxRef.current;
    if (!el) return null;
    return el.getBoundingClientRect();
  }

  function spawnTarget(type = "orb") {
    const r = rect();
    if (!r) return;

    const size = difficulty.size;
    const isPower = type === "power";

    const t = {
      id: crypto.randomUUID(),
      type,
      x: rand(10, r.width - size - 10),
      y: rand(10, r.height - size - 10),
      vx: rand(-170, 170) * difficulty.speedMul * (isPower ? 0.9 : 1),
      vy: rand(-170, 170) * difficulty.speedMul * (isPower ? 0.9 : 1),
      s: isPower ? size + 8 : size,
      born: nowMs(),
      life: isPower ? rand(5.5, 8) : rand(5, 11),
      hue: isPower ? 150 : Math.floor(rand(200, 285)),
      ring: isPower,
      sparkle: Math.random() > 0.55,
    };

    targetsRef.current.push(t);
  }

  function burstParticles(x, y, hue, count = 12) {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        id: crypto.randomUUID(),
        x,
        y,
        vx: rand(-220, 220),
        vy: rand(-220, 220),
        a: 1,
        life: rand(0.35, 0.8),
        born: nowMs(),
        hue,
        s: rand(2, 5),
      });
    }
  }

  function activateSlow() {
    if (!running) return;
    if (!slowReady) return;

    setSlowReady(false);
    const until = nowMs() + 3800;
    slowRef.current = { active: true, until };
    showHud("TIME DILATION");

    // recharge after a while
    window.setTimeout(() => setSlowReady(true), 7000);
  }

  // Animation loop
  useEffect(() => {
    const loop = (ts) => {
      const dt = (ts - lastRef.current) / 1000;
      lastRef.current = ts;

      const r = rect();
      if (r && running) {
        const slow = slowRef.current.active && ts < slowRef.current.until;
        if (!slow && slowRef.current.active) slowRef.current.active = false;

        const slowMul = slow ? 0.35 : 1;

        // Keep target count up
        const targets = targetsRef.current;
        const desired = difficulty.spawnMax;

        while (targets.length < desired) spawnTarget();

        // Occasionally spawn a power target
        if (Math.random() < 0.012 && targets.filter((t) => t.type === "power").length < 1) {
          spawnTarget("power");
        }

        // Update targets
        for (let i = targets.length - 1; i >= 0; i--) {
          const t = targets[i];
          const age = (ts - t.born) / 1000;
          if (age > t.life) {
            targets.splice(i, 1);
            // missing resets combo slightly
            setCombo((c) => (c > 0 ? Math.max(0, c - 2) : 0));
            continue;
          }

          t.x += t.vx * dt * slowMul;
          t.y += t.vy * dt * slowMul;

          const minX = 8;
          const minY = 8;
          const maxX = r.width - t.s - 8;
          const maxY = r.height - t.s - 8;

          if (t.x <= minX || t.x >= maxX) t.vx *= -1;
          if (t.y <= minY || t.y >= maxY) t.vy *= -1;

          t.x = clamp(t.x, minX, maxX);
          t.y = clamp(t.y, minY, maxY);
        }

        // Update particles
        const parts = particlesRef.current;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          const age = (ts - p.born) / 1000;
          if (age > p.life) {
            parts.splice(i, 1);
            continue;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.a = 1 - age / p.life;
          p.vx *= 0.97;
          p.vy *= 0.97;
        }

        // repaint sometimes
        if (Math.random() < 0.10) setTick((t) => t + 1);
      } else {
        // still animate particles even when paused
        const parts = particlesRef.current;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          const age = (ts - p.born) / 1000;
          if (age > p.life) {
            parts.splice(i, 1);
            continue;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.a = 1 - age / p.life;
          p.vx *= 0.97;
          p.vy *= 0.97;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, difficulty.spawnMax]);

  function clickTarget(id) {
    if (!running) return;

    const targets = targetsRef.current;
    const idx = targets.findIndex((t) => t.id === id);
    if (idx === -1) return;

    const t = targets[idx];
    targets.splice(idx, 1);

    // Center for particles
    const cx = t.x + t.s / 2;
    const cy = t.y + t.s / 2;

    burstParticles(cx, cy, t.hue, t.type === "power" ? 22 : 14);

    if (t.type === "power") {
      activateSlow();
      setScore((s) => s + 40);
      setCombo((c) => c + 2);
      showHud("POWER UP +40");
    } else {
      setCombo((c) => c + 1);
      setScore((s) => s + 12 + combo * 2);
      if (combo >= 6) showHud(`COMBO x${combo + 1}`);
    }

    setTick((t) => t + 1);
  }

  const slowActive = slowRef.current.active && nowMs() < slowRef.current.until;
  const targets = targetsRef.current;
  const particles = particlesRef.current;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
      {/* gradient glow */}
      <div className="pointer-events-none absolute -top-24 left-[-8rem] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-[-8rem] h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />

      {/* Top HUD */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs text-neutral-300">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle" />
            Modern interactive game
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-white">
            Orb Surge — React Mini Game
          </h3>
          <p className="mt-1 text-xs text-neutral-400">
            Click orbs. Catch the green power core. Press <b>Space</b> to slow time. Press <b>R</b> to restart.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge label="TIME" value={`${timeLeft}s`} />
          <Badge label="SCORE" value={score} />
          <Badge label="BEST" value={best} />
        </div>
      </div>

      <div className="relative px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Controls */}
          <div className="flex items-center gap-2">
            {!running ? (
              <button
                type="button"
                onClick={start}
                className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400 transition"
              >
                Start
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRunning(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Pause
              </button>
            )}

            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              Reset
            </button>
          </div>

          {/* Power */}
          <div className="flex items-center gap-2">
            <div
              className={[
                "rounded-2xl border px-3 py-2 text-xs backdrop-blur",
                slowActive
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                  : slowReady
                  ? "border-white/10 bg-white/5 text-neutral-200"
                  : "border-white/10 bg-white/5 text-neutral-400",
              ].join(" ")}
            >
              <span className="font-semibold text-white">Time Dilation</span>
              <span className="ml-2">
                {slowActive ? "ACTIVE" : slowReady ? "READY" : "RECHARGING"}
              </span>
            </div>

            <button
              type="button"
              disabled={!slowReady || !running}
              onClick={activateSlow}
              className={[
                "rounded-xl px-4 py-2 text-xs font-semibold transition",
                !running || !slowReady
                  ? "bg-white/5 text-neutral-500 border border-white/10 cursor-not-allowed"
                  : "bg-emerald-500/15 text-white border border-emerald-400/30 hover:bg-emerald-500/20",
              ].join(" ")}
            >
              Activate (Space)
            </button>
          </div>
        </div>

        {/* Arena */}
        <div
          ref={boxRef}
          className="relative mt-4 h-[340px] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/40"
        >
          {/* subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] [background-size:18px_18px]" />
          </div>

          {/* combo meter */}
          <div className="pointer-events-none absolute left-4 top-4 z-20">
            <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-neutral-200 backdrop-blur">
              Combo <span className="text-white font-semibold">x{Math.max(1, combo + 1)}</span>
            </div>
          </div>

          {/* center HUD message */}
          {!!hudMsg && (
            <div
              key={hudPulse}
              className="pointer-events-none absolute left-1/2 top-10 z-20 -translate-x-1/2"
            >
              <div className="animate-[pop_0.35s_ease-out] rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs text-white backdrop-blur">
                {hudMsg}
              </div>
            </div>
          )}

          {/* Targets */}
          {targets.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => clickTarget(t.id)}
              className="absolute rounded-full focus:outline-none"
              style={{
                left: `${t.x}px`,
                top: `${t.y}px`,
                width: `${t.s}px`,
                height: `${t.s}px`,
                background:
                  t.type === "power"
                    ? `radial-gradient(circle at 30% 30%, hsla(${t.hue}, 95%, 70%, 0.95), hsla(${t.hue}, 95%, 55%, 0.55) 55%, rgba(0,0,0,0) 72%)`
                    : `radial-gradient(circle at 30% 30%, hsla(${t.hue}, 90%, 70%, 0.95), hsla(${t.hue}, 90%, 55%, 0.55) 55%, rgba(0,0,0,0) 72%)`,
                boxShadow:
                  t.type === "power"
                    ? `0 0 28px hsla(${t.hue}, 95%, 60%, 0.65)`
                    : `0 0 22px hsla(${t.hue}, 90%, 60%, 0.55)`,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              aria-label={t.type === "power" ? "Power core" : "Orb target"}
            >
              {/* outer ring for power */}
              {t.ring && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    border: "1px solid rgba(255,255,255,0.18)",
                    boxShadow: "inset 0 0 18px rgba(255,255,255,0.10)",
                  }}
                />
              )}

              {/* sparkle */}
              {t.sparkle && (
                <span
                  className="pointer-events-none absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    boxShadow: "0 0 18px rgba(255,255,255,0.65)",
                  }}
                />
              )}
            </button>
          ))}

          {/* Particles */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.s}px`,
                height: `${p.s}px`,
                opacity: p.a,
                background: `hsla(${p.hue}, 95%, 70%, ${p.a})`,
                boxShadow: `0 0 14px hsla(${p.hue}, 95%, 60%, ${p.a})`,
              }}
            />
          ))}

          {/* Game Over Overlay */}
          {!running && timeLeft === 0 && (
            <div className="absolute inset-0 z-30 grid place-items-center bg-black/55 p-6 text-center backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-950/60 p-6 shadow-2xl">
                <div className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
                  SESSION COMPLETE
                </div>
                <h4 className="mt-3 text-3xl font-extrabold text-white">
                  System Stabilized
                </h4>
                <p className="mt-2 text-sm text-neutral-300">
                  Score: <span className="font-semibold text-white">{score}</span>{" "}
                  • Best: <span className="font-semibold text-white">{best}</span>
                </p>
                <div className="mt-5 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={start}
                    className="rounded-xl bg-indigo-500 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-400 transition"
                  >
                    Play again
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      
      </div>

      {/* keyframes for hud pop */}
      <style>{`
        @keyframes pop {
          0% { transform: translateY(10px) scale(0.96); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Badge({ label, value }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
      <span className="text-neutral-400">{label}</span>{" "}
      <span className="text-white font-semibold">{value}</span>
    </span>
  );
}
