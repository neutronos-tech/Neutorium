import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = [
  "uniform float uTime;",
  "uniform vec2 uMouse;",
  "uniform float uScale;",
  "varying float vAlpha;",
  "void main() {",
  "  vec3 p = position;",
  "  float t = uTime * 0.35;",
  "  float e = sin(p.x * 0.55 + t) * 0.35 + sin(p.z * 0.9 - t * 1.3) * 0.25 + sin((p.x + p.z) * 0.35 + t * 0.6) * 0.3;",
  "  vec2 m = vec2(uMouse.x * 6.0, -uMouse.y * 3.5);",
  "  float d = distance(p.xz, m);",
  "  e += exp(-d * d * 0.35) * 0.9;",
  "  p.y = e;",
  "  vec4 mv = modelViewMatrix * vec4(p, 1.0);",
  "  gl_Position = projectionMatrix * mv;",
  "  gl_PointSize = uScale * (2.0 + e * 1.2) * (6.0 / -mv.z);",
  "  float edge = 1.0 - smoothstep(2.0, 5.5, length(p.xz * vec2(0.55, 1.0)));",
  "  vAlpha = clamp(edge * (0.35 + e * 0.45), 0.0, 1.0);",
  "}",
].join("\n");

const fragment = [
  "varying float vAlpha;",
  "void main() {",
  "  vec2 c = gl_PointCoord - 0.5;",
  "  if (length(c) > 0.5) discard;",
  "  gl_FragColor = vec4(0.455, 0.082, 0.086, vAlpha);",
  "}",
].join("\n");

function Field({ reduced }) {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e) =>
      target.current.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, []);

  const geometry = useMemo(() => {
    const cols = 180, rows = 90, w = 14, h = 7;
    const pos = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        pos[k++] = (i / (cols - 1) - 0.5) * w;
        pos[k++] = 0;
        pos[k++] = (j / (rows - 1) - 0.5) * h;
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: mouse.current },
      uScale: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    []
  );

  useFrame((_, dt) => {
    if (!reduced) uniforms.uTime.value += dt;
    mouse.current.lerp(target.current, 0.06);
  });

  return (
    <points geometry={geometry} position={[0, -0.6, 0]}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function DotField() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 3, 7], fov: 38 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.5, 0)}
      gl={{ antialias: true, alpha: true }}
    >
      <Field reduced={reduced} />
    </Canvas>
  );
}
