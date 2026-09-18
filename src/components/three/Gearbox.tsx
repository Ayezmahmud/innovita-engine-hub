import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { createFeaUniforms, createMaterials, type FeaUniforms, type RenderMode } from "./materials";

/* ---------- geometry helpers ---------- */

function makeGearGeometry(teeth: number, rOuter: number, thickness: number, bore: number) {
  const rRoot = rOuter * 0.86;
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: [number, number][] = [
      [a, rRoot],
      [a + step * 0.18, rOuter * 0.97],
      [a + step * 0.32, rOuter],
      [a + step * 0.5, rOuter],
      [a + step * 0.64, rOuter * 0.97],
      [a + step * 0.78, rRoot],
    ];
    pts.forEach(([ang, r], j) => {
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r;
      if (i === 0 && j === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, bore, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  // lightening holes
  if (rOuter > 0.4) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const h = new THREE.Path();
      h.absarc(Math.cos(a) * rOuter * 0.55, Math.sin(a) * rOuter * 0.55, rOuter * 0.11, 0, Math.PI * 2, true);
      shape.holes.push(h);
    }
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 6,
  });
  geo.translate(0, 0, -thickness / 2);
  geo.computeVertexNormals();
  return geo;
}

/* ---------- sub parts ---------- */

type M = ReturnType<typeof createMaterials>;

function HexBolt({ m, size = 0.045, ...props }: { m: M; size?: number } & JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <mesh material={m.bolt} position={[0, size * 0.55, 0]} castShadow>
        <cylinderGeometry args={[size, size, size * 1.1, 6]} />
      </mesh>
      <mesh material={m.machined} position={[0, 0.006, 0]}>
        <cylinderGeometry args={[size * 1.45, size * 1.45, 0.012, 32]} />
      </mesh>
    </group>
  );
}

function BoltCircle({ m, count, radius, size }: { m: M; count: number; radius: number; size?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <HexBolt
            key={i}
            m={m}
            size={size}
            position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
            rotation={[0, -a, 0]}
          />
        );
      })}
    </>
  );
}

function Bearing({ m, r, balls = 12 }: { m: M; r: number; balls?: number }) {
  const tube = r * 0.14;
  return (
    <group>
      <mesh material={m.machined}>
        <torusGeometry args={[r, tube, 12, 48]} />
      </mesh>
      <mesh material={m.machined}>
        <torusGeometry args={[r * 0.66, tube, 12, 48]} />
      </mesh>
      {Array.from({ length: balls }).map((_, i) => {
        const a = (i / balls) * Math.PI * 2;
        return (
          <mesh key={i} material={m.gear} position={[Math.cos(a) * r * 0.83, Math.sin(a) * r * 0.83, 0]}>
            <sphereGeometry args={[r * 0.12, 14, 14]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Shaft({ m, r, len, key_ = true }: { m: M; r: number; len: number; key_?: boolean }) {
  return (
    <group>
      <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, len / 2]} castShadow>
        <cylinderGeometry args={[r, r, len - 0.06, 48]} />
      </mesh>
      {/* chamfered end */}
      <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, len - 0.02]}>
        <cylinderGeometry args={[r * 0.9, r, 0.04, 48]} />
      </mesh>
      {/* shoulder */}
      <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.08]}>
        <cylinderGeometry args={[r * 1.25, r * 1.25, 0.16, 48]} />
      </mesh>
      {key_ && (
        <mesh material={m.dark} position={[0, r, len * 0.68]}>
          <boxGeometry args={[r * 0.35, r * 0.25, len * 0.34]} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- assembly ---------- */

export type GearboxProps = {
  mode?: RenderMode;
  fea?: boolean;
  /** 0..1 explode amount (mutable ref, no re-render) */
  explode?: RefObject<number>;
  /** 0..1 FEA sweep (mutable ref) */
  feaAmount?: RefObject<number>;
  spin?: number;
  scale?: number;
};

const HOT = [
  new THREE.Vector4(0.25, 0.05, 0.62, 0.55),
  new THREE.Vector4(1.15, -0.1, 0.0, 0.5),
  new THREE.Vector4(-0.95, -0.66, 0.45, 0.32),
  new THREE.Vector4(0.95, -0.66, -0.45, 0.32),
];

export function Gearbox({ mode = "solid", fea = false, explode, feaAmount, spin = 0.12, scale = 1 }: GearboxProps) {
  const root = useRef<THREE.Group>(null);
  const cover = useRef<THREE.Group>(null);
  const frontFlange = useRef<THREE.Group>(null);
  const frontBearing = useRef<THREE.Group>(null);
  const inShaft = useRef<THREE.Group>(null);
  const sideFlange = useRef<THREE.Group>(null);
  const outShaft = useRef<THREE.Group>(null);
  const gearBig = useRef<THREE.Mesh>(null);
  const gearSmall = useRef<THREE.Mesh>(null);
  const gearGroup = useRef<THREE.Group>(null);

  const uniforms = useMemo<FeaUniforms | undefined>(() => (fea ? createFeaUniforms(HOT) : undefined), [fea]);
  const m = useMemo(() => createMaterials(mode, uniforms), [mode, uniforms]);
  const bigGeo = useMemo(() => makeGearGeometry(34, 0.56, 0.22, 0.14), []);
  const smallGeo = useMemo(() => makeGearGeometry(15, 0.27, 0.22, 0.1), []);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const e = explode?.current ?? 0;
    if (root.current) root.current.rotation.y += d * spin;
    if (cover.current) cover.current.position.y = 0.7 + e * 0.95;
    if (frontFlange.current) frontFlange.current.position.z = 0.66 + e * 0.75;
    if (frontBearing.current) frontBearing.current.position.z = 0.5 + e * 0.4;
    if (inShaft.current) inShaft.current.position.z = 0.2 + e * 1.15;
    if (sideFlange.current) sideFlange.current.position.x = 1.17 + e * 0.8;
    if (outShaft.current) outShaft.current.position.x = 1.1 + e * 1.25;
    if (gearGroup.current) gearGroup.current.position.z = e * 0.25;
    if (gearBig.current) gearBig.current.rotation.z += d * 0.5;
    if (gearSmall.current) gearSmall.current.rotation.z -= d * 0.5 * (34 / 15);
    if (uniforms && root.current) {
      root.current.updateWorldMatrix(true, false);
      uniforms.uInvRoot.value.copy(root.current.matrixWorld).invert();
      const target = feaAmount?.current ?? 1;
      uniforms.uFea.value += (target - uniforms.uFea.value) * Math.min(1, d * 4);
    }
  });

  return (
    <group ref={root} scale={scale}>
      {/* ---- main casting ---- */}
      <RoundedBox args={[2.2, 1.3, 1.2]} radius={0.06} smoothness={4} material={m.cast} castShadow receiveShadow />
      {/* ribs */}
      {[-0.65, 0, 0.65].map((x) => (
        <mesh key={x} material={m.cast} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.07, 1.34, 1.26]} />
        </mesh>
      ))}
      <mesh material={m.cast} position={[0, -0.25, 0]}>
        <boxGeometry args={[2.26, 0.07, 1.26]} />
      </mesh>
      {/* feet */}
      {[
        [-0.95, 0.45],
        [0.95, 0.45],
        [-0.95, -0.45],
        [0.95, -0.45],
      ].map(([x, z], i) => (
        <group key={i} position={[x, -0.7, z]}>
          <RoundedBox args={[0.5, 0.12, 0.42]} radius={0.02} material={m.cast} castShadow receiveShadow />
          <HexBolt m={m} position={[x > 0 ? 0.14 : -0.14, 0.06, 0]} size={0.05} />
        </group>
      ))}

      {/* ---- top inspection cover ---- */}
      <group ref={cover} position={[0, 0.7, 0]}>
        <RoundedBox args={[1.5, 0.1, 0.82]} radius={0.02} material={m.machined} castShadow />
        <mesh material={m.dark} position={[0, -0.06, 0]}>
          <boxGeometry args={[1.42, 0.02, 0.74]} />
        </mesh>
        {[-0.6, 0, 0.6].flatMap((x) =>
          [-0.32, 0.32].map((z) => <HexBolt key={`${x}${z}`} m={m} position={[x, 0.05, z]} size={0.038} />),
        )}
        {/* nameplate */}
        <mesh material={m.accent} position={[0.05, 0.06, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.42, 0.012, 0.2]} />
        </mesh>
        {/* breather */}
        <mesh material={m.bolt} position={[-0.45, 0.13, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.16, 24]} />
        </mesh>
      </group>

      {/* ---- front (input) flange + bearing + shaft ---- */}
      <group ref={frontFlange} position={[0, 0.05, 0.66]}>
        <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.52, 0.52, 0.12, 64]} />
        </mesh>
        <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.3, 0.34, 0.1, 48]} />
        </mesh>
        <mesh material={m.dark} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.14]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 48]} />
        </mesh>
        {/* orange shaft seal */}
        <mesh material={m.accent} position={[0, 0, 0.16]}>
          <torusGeometry args={[0.215, 0.018, 10, 48]} />
        </mesh>
        <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]}>
          <BoltCircle m={m} count={8} radius={0.42} size={0.04} />
        </group>
      </group>
      <group ref={frontBearing} position={[0, 0.05, 0.5]}>
        <Bearing m={m} r={0.3} />
      </group>
      <group ref={inShaft} position={[0, 0.05, 0.2]}>
        <Shaft m={m} r={0.13} len={1.35} />
      </group>

      {/* ---- side (output) flange + shaft ---- */}
      <group ref={sideFlange} position={[1.17, -0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.14, 64]} />
        </mesh>
        <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.36, 0.42, 0.12, 48]} />
        </mesh>
        <mesh material={m.accent} position={[0, 0, 0.19]}>
          <torusGeometry args={[0.26, 0.02, 10, 48]} />
        </mesh>
        <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.07]}>
          <BoltCircle m={m} count={10} radius={0.49} size={0.042} />
        </group>
      </group>
      <group ref={outShaft} position={[1.1, -0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Shaft m={m} r={0.18} len={1.0} />
      </group>

      {/* ---- internal gear train (revealed on explode) ---- */}
      <group ref={gearGroup}>
        <mesh ref={gearBig} geometry={bigGeo} material={m.gear} position={[-0.25, 0.05, 0]} castShadow />
        <mesh ref={gearSmall} geometry={smallGeo} material={m.gear} position={[0.56, 0.16, 0]} castShadow />
        <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[-0.25, 0.05, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
        </mesh>
      </group>
    </group>
  );
}
