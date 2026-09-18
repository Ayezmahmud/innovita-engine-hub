import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export type SceneFrameProps = {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  mobileCamera?: { position: [number, number, number]; fov?: number };
  fallback: ReactNode;
  shadow?: boolean;
  shadowY?: number;
  className?: string;
  intensity?: number;
};

/**
 * Lazily mounts a WebGL canvas when the section approaches the viewport,
 * pauses rendering while off-screen, and falls back to a static render
 * when WebGL is unavailable.
 */
export function SceneFrame({
  children,
  camera = { position: [4.2, 2.4, 5.2], fov: 32 },
  mobileCamera,
  fallback,
  shadow = true,
  shadowY = -1.05,
  className = "",
  intensity = 1,
}: SceneFrameProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setWebgl(hasWebGL());
    const mq = window.matchMedia("(max-width: 768px)");
    const upd = () => setMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          near.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    const vis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "80px 0px" });
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, []);

  const cam = mobile && mobileCamera ? mobileCamera : camera;

  return (
    <div ref={holder} className={`relative h-full w-full ${className}`}>
      {webgl === false && fallback}
      {webgl && mounted && (
        <Canvas
          shadows
          dpr={[1, 1.5]}
          frameloop={visible ? "always" : "never"}
          camera={{ position: cam.position, fov: cam.fov ?? 32, near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.25 * intensity} />
            <directionalLight
              position={[5, 8, 4]}
              intensity={1.6 * intensity}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0004}
            />
            <directionalLight position={[-6, 3, -4]} intensity={0.5 * intensity} color="#dfe7f5" />
            <Environment resolution={128}>
              <Lightformer intensity={2.2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
              <Lightformer intensity={1.4} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
              <Lightformer intensity={1.0} position={[6, 1, -2]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} color="#f7e9dc" />
              <Lightformer intensity={0.6} position={[0, -3, 5]} scale={[8, 2, 1]} color="#dde6f4" />
            </Environment>
            {children}
            {shadow && (
              <ContactShadows position={[0, shadowY, 0]} opacity={0.42} scale={9} blur={2.4} far={3} resolution={512} color="#1e2a44" />
            )}
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
