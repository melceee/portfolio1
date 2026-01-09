// src/components/skills/SkillsKeyboard3D.jsx
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import gsap from "gsap";
import { KEYBOARD_SKILLS } from "./skillsKeyboardData";
import { AnimatePresence, motion } from "framer-motion";

/** ---------- Safety: WebGL support + Error Boundary ---------- **/
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

class R3FErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/** ---------- Scene: subtle camera parallax ---------- **/
function CameraParallax({ strength = 0.25 }) {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      target.current = { x, y };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ camera }) => {
    // Smoothly drift the camera a bit
    const tx = target.current.x * strength;
    const ty = -target.current.y * strength;

    camera.position.x += (tx - camera.position.x) * 0.03;
    camera.position.y += (1.9 + ty - camera.position.y) * 0.03;

    camera.lookAt(0, 0.25, 0);
  });

  return null;
}

/** ---------- A single 3D keycap ---------- **/
function Keycap({
  skill,
  position,
  size = [1.1, 0.35, 1.1],
  selected,
  onHover,
  onUnhover,
  onSelect,
}) {
  const ref = useRef();
  const matRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!ref.current || !matRef.current) return;

    // Base state
    const baseY = position[1];
    const upY = baseY + (hovered || selected ? 0.18 : 0);

    gsap.to(ref.current.position, {
      y: upY,
      duration: 0.22,
      ease: "power3.out",
    });

    gsap.to(ref.current.rotation, {
      x: hovered || selected ? -0.06 : 0,
      z: hovered ? 0.04 : 0,
      duration: 0.22,
      ease: "power3.out",
    });

    // Glow via emissiveIntensity
    gsap.to(matRef.current, {
      emissiveIntensity: hovered || selected ? 1.0 : 0.25,
      duration: 0.22,
      ease: "power3.out",
    });

    // Slight scale pop
    gsap.to(ref.current.scale, {
      x: hovered ? 1.03 : 1,
      y: hovered ? 1.03 : 1,
      z: hovered ? 1.03 : 1,
      duration: 0.22,
      ease: "power3.out",
    });
  }, [hovered, selected, position]);

  return (
    <group>
      <mesh
        ref={ref}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover?.(skill);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onUnhover?.();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          // Small press animation
          if (ref.current) {
            gsap.fromTo(
              ref.current.position,
              { y: ref.current.position.y },
              { y: ref.current.position.y - 0.06, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.out" }
            );
          }
          onSelect?.(skill);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          ref={matRef}
          color={skill.color}
          roughness={0.25}
          metalness={0.18}
          emissive={skill.color}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* tiny top plate to add depth */}
      <mesh position={[position[0], position[1] + 0.18, position[2]]} rotation={[0, 0, 0]}>
        <boxGeometry args={[size[0] * 0.96, 0.03, size[2] * 0.96]} />
        <meshStandardMaterial color={"#0b0f1a"} roughness={0.6} metalness={0.05} />
      </mesh>
    </group>
  );
}

/** ---------- Keyboard layout (pyramid-ish) ---------- **/
function SkillsKeyboardScene({ skills, selectedId, onHover, onUnhover, onSelect }) {
  const layout = useMemo(() => {
    // Stacked rows like a cute keyboard mountain
    // Each key position is [x, y, z]
    const rows = [
      ["react", "tailwind", "vue", "playwright"],
      ["spring", "java", "python"],
      ["opencv", "sql"],
    ];

    const pos = [];
    const zGap = 1.25;
    const xGap = 1.25;
    const baseY = 0.0;

    rows.forEach((row, r) => {
      const z = r * zGap;
      const totalWidth = (row.length - 1) * xGap;
      row.forEach((id, i) => {
        const x = i * xGap - totalWidth / 2;
        // slight slope upward
        const y = baseY + r * 0.07;
        pos.push({ id, position: [x, y, -z] });
      });
    });

    return pos;
  }, []);

  const map = useMemo(() => {
    const m = new Map(skills.map((s) => [s.id, s]));
    return m;
  }, [skills]);

  return (
    <group position={[0, 0, 0]}>
      {/* soft base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, -1.2]} receiveShadow>
        <circleGeometry args={[6.2, 64]} />
        <meshStandardMaterial color="#0b1020" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* lights */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 2]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 2, 2]} intensity={0.7} color={"#a855f7"} />
      <pointLight position={[5, 2, -4]} intensity={0.7} color={"#60a5fa"} />

      {/* keys */}
      {layout.map((k) => {
        const skill = map.get(k.id);
        if (!skill) return null;
        return (
          <Keycap
            key={k.id}
            skill={skill}
            position={k.position}
            selected={selectedId === k.id}
            onHover={onHover}
            onUnhover={onUnhover}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

/** ---------- Main component with UI overlay ---------- **/
export default function SkillsKeyboard3D() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const webglOk = useMemo(() => hasWebGL(), []);

  const details = selected || hovered;

  const fallback = (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-neutral-300">
        Your device/browser doesn’t support WebGL. Here’s a simplified skills list instead.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {KEYBOARD_SKILLS.map((s) => (
          <span
            key={s.id}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );

  if (!webglOk) return fallback;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* 3D Canvas card */}
      <R3FErrorBoundary fallback={fallback}>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-2 pb-3">
            <div>
              <p className="text-xs text-neutral-400">3D Skills Keyboard</p>
              <p className="text-sm font-semibold text-white">
                Hover (desktop) or tap (mobile) a key
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10"
            >
              Clear
            </button>
          </div>

          <div className="h-[360px] w-full rounded-2xl border border-white/10 bg-neutral-950/40">
            <Canvas
              shadows
              dpr={[1, 1.75]}
              camera={{ position: [0, 1.9, 5.2], fov: 42 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              onPointerMissed={() => {
                // tap/click empty space: close hover, keep selected
                setHovered(null);
              }}
            >
              <Suspense fallback={null}>
                <Environment preset="city" />
                <CameraParallax strength={0.18} />
                <SkillsKeyboardScene
                  skills={KEYBOARD_SKILLS}
                  selectedId={selected?.id ?? null}
                  onHover={(s) => setHovered(s)}
                  onUnhover={() => setHovered(null)}
                  onSelect={(s) => setSelected(s)}
                />
              </Suspense>
            </Canvas>
          </div>

          <p className="mt-3 text-xs text-neutral-400">
            Tip: Desktop hover previews. Mobile tap selects and opens details.
          </p>
        </div>
      </R3FErrorBoundary>

      {/* Details panel */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-neutral-400">Skill details</p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              {details ? details.title : "Pick a key"}
            </h3>
          </div>

          {details ? (
            <span
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
              title="Proficiency"
            >
              {details.level}
            </span>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          {details ? (
            <motion.div
              key={details.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="mt-4"
            >
              <p className="text-sm leading-relaxed text-neutral-300">
                {details.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {details.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-white/10 bg-neutral-950/30 px-3 py-1 text-xs text-neutral-200"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(details)}
                  className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
                >
                  Pin selection
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setHovered(null);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white hover:bg-white/10"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="mt-4"
            >
              <p className="text-sm text-neutral-300">
                This 3D keyboard is interactive. Hover or tap any keycap to preview a skill.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                  <p className="text-sm font-semibold text-white">Desktop</p>
                  <p className="mt-1 text-xs text-neutral-400">Hover to preview, click to select.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                  <p className="text-sm font-semibold text-white">Mobile</p>
                  <p className="mt-1 text-xs text-neutral-400">Tap to select, use “Clear” anytime.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
