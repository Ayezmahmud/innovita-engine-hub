import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SceneFrame } from "./SceneFrame";
import { Gearbox } from "./Gearbox";
import { Coupling } from "./Coupling";
import svcConcept from "@/assets/svc-concept.jpg";
import svcSimulation from "@/assets/svc-simulation.jpg";
import svcPrototyping from "@/assets/svc-prototyping.jpg";

type P = RefObject<number>;

/** Camera that eases toward a target driven by scroll progress + mouse. */
function ScrollCamera({
  progress,
  base,
  arc = 0.9,
  mouse = true,
  lookAt = [0, 0, 0] as [number, number, number],
}: {
  progress: P;
  base: [number, number, number];
  arc?: number;
  mouse?: boolean;
  lookAt?: [number, number, number];
}) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(...lookAt));
  const desired = useRef(new THREE.Vector3(...base));
  useFrame((_, dt) => {
    const p = progress.current ?? 0;
    const a = p * arc;
    const r = Math.hypot(base[0], base[2]);
    const a0 = Math.atan2(base[0], base[2]);
    desired.current.set(
      Math.sin(a0 + a) * r + (mouse ? pointer.x * 0.35 : 0),
      base[1] - p * 0.6 + (mouse ? pointer.y * 0.25 : 0),
      Math.cos(a0 + a) * r,
    );
    camera.position.lerp(desired.current, Math.min(1, dt * 3));
    camera.lookAt(target.current);
  });
  return null;
}

function Fallback({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} loading="lazy" className="h-full w-full object-contain" />;
}

/* ---------- HERO ---------- */
export function HeroSceneFrame({ progress }: { progress: P }) {
  const explode = useRef(0);
  return (
    <SceneFrame
      camera={{ position: [4.4, 2.2, 5.0], fov: 30 }}
      mobileCamera={{ position: [5.4, 2.6, 6.4], fov: 34 }}
      fallback={<Fallback src={svcConcept} alt="Industrial gearbox assembly" />}
      shadowY={-1.02}
    >
      <ScrollCamera progress={progress} base={[4.4, 2.2, 5.0]} arc={1.1} />
      <ExplodeDriver progress={progress} out={explode} curve={(p) => THREE.MathUtils.smoothstep(p, 0.25, 0.9)} />
      <Gearbox explode={explode} spin={0.1} scale={0.8} />
    </SceneFrame>
  );
}

function ExplodeDriver({ progress, out, curve }: { progress: P; out: RefObject<number>; curve: (p: number) => number }) {
  useFrame((_, dt) => {
    const t = curve(progress.current ?? 0);
    (out as { current: number }).current += (t - (out.current ?? 0)) * Math.min(1, dt * 4);
  });
  return null;
}

/* ---------- CAPABILITIES: FEA gearbox ---------- */
export function FeaGearboxScene({ progress }: { progress: P }) {
  const fea = useRef(0);
  const explode = useRef(0);
  return (
    <SceneFrame
      camera={{ position: [4.6, 2.3, 4.6], fov: 30 }}
      mobileCamera={{ position: [5.6, 2.8, 5.8], fov: 34 }}
      fallback={<Fallback src={svcSimulation} alt="FEA stress analysis of a gearbox housing" />}
      shadowY={-1.02}
    >
      <ScrollCamera progress={progress} base={[4.6, 2.3, 4.6]} arc={0.7} mouse={false} />
      <ExplodeDriver progress={progress} out={fea} curve={(p) => THREE.MathUtils.smoothstep(p, 0.2, 0.62)} />
      <ExplodeDriver progress={progress} out={explode} curve={(p) => THREE.MathUtils.smoothstep(p, 0.55, 0.95) * 0.45} />
      <Gearbox fea feaAmount={fea} explode={explode} spin={0.14} scale={0.95} />
    </SceneFrame>
  );
}

/* ---------- TECHNICAL ANALYSIS: FEA coupling ---------- */
export function FeaCouplingScene({ progress }: { progress: P }) {
  const fea = useRef(0);
  return (
    <SceneFrame
      camera={{ position: [3.6, 1.6, 4.2], fov: 30 }}
      mobileCamera={{ position: [4.4, 2, 5.2], fov: 34 }}
      fallback={<Fallback src={svcSimulation} alt="FEA stress analysis of a shaft coupling" />}
      shadowY={-1.0}
    >
      <ScrollCamera progress={progress} base={[3.6, 1.6, 4.2]} arc={0.6} mouse={false} />
      <ExplodeDriver progress={progress} out={fea} curve={(p) => THREE.MathUtils.smoothstep(p, 0.15, 0.6)} />
      <Coupling feaAmount={fea} spin={0.16} scale={1.05} />
    </SceneFrame>
  );
}

/* ---------- PROCESS: CAD wireframe & solid part ---------- */
export function ProcessWireScene() {
  return (
    <SceneFrame
      camera={{ position: [4.6, 2.4, 4.8], fov: 30 }}
      fallback={<Fallback src={svcConcept} alt="CAD model" />}
      shadow={false}
    >
      <Gearbox mode="wire" spin={0.25} scale={0.9} />
    </SceneFrame>
  );
}

export function ProcessSolidScene({ progress }: { progress: P }) {
  const fea = useRef(0);
  return (
    <SceneFrame
      camera={{ position: [4.6, 2.4, 4.8], fov: 30 }}
      fallback={<Fallback src={svcPrototyping} alt="Machined component" />}
      shadowY={-1.0}
    >
      <ExplodeDriver progress={progress} out={fea} curve={(p) => THREE.MathUtils.smoothstep(p, 0.45, 0.85)} />
      <Gearbox fea feaAmount={fea} spin={0.25} scale={0.9} />
    </SceneFrame>
  );
}
