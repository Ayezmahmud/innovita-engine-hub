import * as THREE from "three";

/** Fine machining-noise texture used as roughness + bump variation. */
export function makeMachiningTexture(brushed = true) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    const row = brushed ? 0.82 + Math.random() * 0.18 : 1;
    for (let x = 0; x < size; x++) {
      const n = 0.86 + Math.random() * 0.14;
      const v = Math.round(255 * Math.min(1, n * row));
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 4;
  return tex;
}

export type FeaUniforms = {
  uFea: { value: number };
  uInvRoot: { value: THREE.Matrix4 };
  uHot: { value: THREE.Vector4[] };
  uAxis: { value: THREE.Vector3 };
};

export function createFeaUniforms(hot: THREE.Vector4[], axis = new THREE.Vector3(1, 0, 0)): FeaUniforms {
  return {
    uFea: { value: 0 },
    uInvRoot: { value: new THREE.Matrix4() },
    uHot: { value: hot },
    uAxis: { value: axis },
  };
}

/**
 * Patches a MeshStandardMaterial so a Von Mises style stress field can be
 * blended over the PBR shading. Stress is evaluated in assembly space
 * (root-inverse), so it stays attached to the part while the model rotates.
 */
export function applyFea(mat: THREE.MeshStandardMaterial, u: FeaUniforms) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms['uFea'] = u.uFea;
    shader.uniforms['uInvRoot'] = u.uInvRoot;
    shader.uniforms['uHot'] = u.uHot;
    shader.uniforms['uAxis'] = u.uAxis;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform mat4 uInvRoot;
         varying vec3 vAsmPos;`,
      )
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
         vAsmPos = (uInvRoot * modelMatrix * vec4(transformed, 1.0)).xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform float uFea;
         uniform vec4 uHot[4];
         uniform vec3 uAxis;
         varying vec3 vAsmPos;
         float feaMix = 0.0;
         vec3 jet(float t){
           t = clamp(t, 0.0, 1.0);
           float r = clamp(1.5 - abs(4.0*t - 3.0), 0.0, 1.0);
           float g = clamp(1.5 - abs(4.0*t - 2.0), 0.0, 1.0);
           float b = clamp(1.5 - abs(4.0*t - 1.0), 0.0, 1.0);
           return vec3(r, g, b);
         }
         float gauss(vec3 p, vec4 h){
           float d = length(p - h.xyz) / h.w;
           return exp(-d*d);
         }
         float stressField(vec3 p){
           float s = 0.06;
           for (int i = 0; i < 4; i++) s += gauss(p, uHot[i]);
           s += 0.05 * sin(p.x*9.0) * sin(p.y*7.0 + p.z*5.0);
           return clamp(s, 0.0, 1.0);
         }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
         {
           float s = stressField(vAsmPos);
           float c = clamp(dot(vAsmPos, uAxis) * 0.28 + 0.5, 0.0, 1.0);
           feaMix = smoothstep(c - 0.28, c + 0.04, uFea * 1.32);
           diffuseColor.rgb = mix(diffuseColor.rgb, jet(s), feaMix);
         }`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
         roughnessFactor = mix(roughnessFactor, 0.55, feaMix);`,
      )
      .replace(
        "#include <metalnessmap_fragment>",
        `#include <metalnessmap_fragment>
         metalnessFactor = mix(metalnessFactor, 0.12, feaMix);`,
      );
  };
  mat.customProgramCacheKey = () => "innovita-fea";
  return mat;
}

export type MaterialSet = {
  cast: THREE.MeshStandardMaterial;
  machined: THREE.MeshStandardMaterial;
  bolt: THREE.MeshStandardMaterial;
  gear: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  all: THREE.MeshStandardMaterial[];
};

export type RenderMode = "solid" | "wire";

export function createMaterials(mode: RenderMode, fea?: FeaUniforms): MaterialSet {
  const wire = mode === "wire";
  const tex = wire ? null : makeMachiningTexture(true);
  const texCast = wire ? null : makeMachiningTexture(false);

  const base = (opts: THREE.MeshStandardMaterialParameters, t: THREE.Texture | null, bump: number) => {
    const m = new THREE.MeshStandardMaterial({
      ...opts,
      ...(wire
        ? { wireframe: true, color: "#2b3a5c", metalness: 0, roughness: 1, transparent: true, opacity: 0.55 }
        : {}),
      roughnessMap: t,
      bumpMap: t,
      bumpScale: bump,
      envMapIntensity: 1.15,
    });
    if (fea && !wire) applyFea(m, fea);
    return m;
  };

  const cast = base({ color: "#8e949b", metalness: 0.72, roughness: 0.58 }, texCast, 0.004);
  const machined = base({ color: "#c9cdd2", metalness: 0.96, roughness: 0.3 }, tex, 0.0015);
  const gear = base({ color: "#b3b0a6", metalness: 0.92, roughness: 0.36 }, tex, 0.002);
  const bolt = base({ color: "#4b5057", metalness: 0.9, roughness: 0.45 }, texCast, 0.002);
  const dark = base({ color: "#2d3138", metalness: 0.8, roughness: 0.6 }, null, 0);
  const accent = new THREE.MeshStandardMaterial({
    color: "#f2711c",
    metalness: 0.35,
    roughness: 0.42,
    ...(wire ? { wireframe: true, transparent: true, opacity: 0.8 } : {}),
  });

  return { cast, machined, bolt, gear, dark, accent, all: [cast, machined, bolt, gear, dark, accent] };
}
