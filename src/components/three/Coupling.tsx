import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createFeaUniforms, createMaterials, type RenderMode } from "./materials";

/** Flanged rigid shaft coupling with keyed hubs and a bolted joint. */
export function Coupling({
  mode = "solid",
  fea = true,
  feaAmount,
  spin = 0.15,
  scale = 1,
}: {
  mode?: RenderMode;
  fea?: boolean;
  feaAmount?: RefObject<number>;
  spin?: number;
  scale?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const uniforms = useMemo(
    () =>
      fea
        ? createFeaUniforms(
            [
              new THREE.Vector4(0, 0, 0.0, 0.42),
              new THREE.Vector4(0.0, 0.42, 0.06, 0.35),
              new THREE.Vector4(0, -0.3, -0.7, 0.3),
              new THREE.Vector4(0, 0.15, 0.95, 0.28),
            ],
            new THREE.Vector3(0, 0, 1),
          )
        : undefined,
    [fea],
  );
  const m = useMemo(() => createMaterials(mode, uniforms), [mode, uniforms]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    if (root.current) root.current.rotation.y += d * spin;
    if (uniforms && root.current) {
      root.current.updateWorldMatrix(true, false);
      uniforms.uInvRoot.value.copy(root.current.matrixWorld).invert();
      const target = feaAmount?.current ?? 1;
      uniforms.uFea.value += (target - uniforms.uFea.value) * Math.min(1, d * 4);
    }
  });

  const bolts = 8;

  return (
    <group ref={root} scale={scale} rotation={[0.15, 0, 0]}>
      {/* shafts */}
      <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1.05]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.3, 48]} />
      </mesh>
      <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.05]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.3, 48]} />
      </mesh>
      {/* keyways */}
      <mesh material={m.dark} position={[0, 0.2, -1.2]}>
        <boxGeometry args={[0.08, 0.05, 0.6]} />
      </mesh>
      <mesh material={m.dark} position={[0, 0.2, 1.2]}>
        <boxGeometry args={[0.08, 0.05, 0.6]} />
      </mesh>
      {/* hubs */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0, 0, s * 0.42]}>
          <mesh material={m.cast} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.36, 0.4, 0.5, 48]} />
          </mesh>
          {/* fillet ring */}
          <mesh material={m.cast} position={[0, 0, -s * 0.24]}>
            <torusGeometry args={[0.4, 0.06, 12, 48]} />
          </mesh>
          {/* flange */}
          <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -s * 0.33]} castShadow>
            <cylinderGeometry args={[0.72, 0.72, 0.14, 72]} />
          </mesh>
          {/* set screw */}
          <mesh material={m.bolt} position={[0, 0.4, s * 0.1]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 6]} />
          </mesh>
        </group>
      ))}
      {/* pilot / orange gasket */}
      <mesh material={m.accent}>
        <torusGeometry args={[0.66, 0.012, 8, 72]} />
      </mesh>
      {/* bolts through both flanges */}
      {Array.from({ length: bolts }).map((_, i) => {
        const a = (i / bolts) * Math.PI * 2;
        const x = Math.cos(a) * 0.56;
        const y = Math.sin(a) * 0.56;
        return (
          <group key={i} position={[x, y, 0]}>
            <mesh material={m.bolt} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.5, 16]} />
            </mesh>
            <mesh material={m.bolt} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.27]}>
              <cylinderGeometry args={[0.07, 0.07, 0.07, 6]} />
            </mesh>
            <mesh material={m.bolt} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.27]}>
              <cylinderGeometry args={[0.07, 0.07, 0.07, 6]} />
            </mesh>
            <mesh material={m.machined} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.24]}>
              <cylinderGeometry args={[0.09, 0.09, 0.012, 24]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
