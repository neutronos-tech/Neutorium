import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// A slow-turning sphere of light: thousands of points on a globe that breathes, leans toward
// the pointer and glows from white to rose. Drawn with three.js.
const vertex = `
uniform float uTime;
uniform float uScale;
attribute float aSeed;
varying float vMix;
varying float vAlpha;
vec3 rnd3(float i) {
  return fract(sin(vec3(i * 12.9898, i * 78.233, i * 37.719)) * 43758.5453);
}
void main() {
  vec3 p = position;
  // Every few seconds the globe settles into a new, uneven stone: the phases and the
  // stretch along each axis ease from one random set to the next.
  float k = uTime / 4.5;
  float f = smoothstep(0.0, 1.0, fract(k));
  vec3 ph = mix(rnd3(floor(k)), rnd3(floor(k) + 1.0), f) * 6.2831;
  vec3 sc = 0.72 + 0.56 * mix(rnd3(floor(k) + 40.0), rnd3(floor(k) + 41.0), f);
  float n = sin(p.x * 1.5 + ph.x) * sin(p.y * 1.8 + ph.y) * sin(p.z * 1.6 + ph.z);
  float facet = sin(p.x * 3.4 + ph.z) * sin(p.z * 3.9 + ph.x) * 0.5;
  p *= sc * (1.0 + n * 0.42 + facet * 0.16);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uScale * (1.2 + aSeed * 2.0 + n * 2.4) * (4.2 / -mv.z);
  vMix = clamp(smoothstep(-0.25, 0.45, n) * 0.9 + aSeed * 0.15, 0.0, 1.0);
  vAlpha = 0.25 + 0.6 * smoothstep(-6.2, -3.6, mv.z);
}`;

const fragment = `
varying float vMix;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  vec3 paper = vec3(0.969, 0.933, 0.929);
  vec3 ember = vec3(0.949, 0.714, 0.671);
  gl_FragColor = vec4(mix(paper, ember, vMix), vAlpha * smoothstep(0.5, 0.1, d));
}`;

function Globe({ reduced }) {
  const group = useRef();
  const target = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e) => target.current.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, []);

  const geometry = useMemo(() => {
    const n = 3400;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = golden * i;
      pos[i * 3] = Math.cos(a) * r * 1.55;
      pos[i * 3 + 1] = y * 1.55;
      pos[i * 3 + 2] = Math.sin(a) * r * 1.55;
      seed[i] = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      if (seed[i] < 0) seed[i] += 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uScale: { value: Math.min(window.devicePixelRatio, 2) } }), []);

  useFrame((_, dt) => {
    if (reduced) return;
    uniforms.uTime.value += dt;
    const g = group.current;
    g.rotation.y += dt * 0.11;
    g.rotation.x += (target.current.y * 0.35 - g.rotation.x) * 0.04;
    g.rotation.z += (-target.current.x * 0.18 - g.rotation.z) * 0.04;
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function Orb() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 42 }} gl={{ antialias: true, alpha: true }}>
      <Globe reduced={reduced} />
    </Canvas>
  );
}
