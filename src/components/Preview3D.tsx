import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { ViewMode } from "../lib/types";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type WireMaterial = THREE.Material & { wireframe: boolean };

function applyWireframe(group: THREE.Object3D, wire: boolean) {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      const mat = mesh.material as THREE.Material | THREE.Material[];
      (Array.isArray(mat) ? mat : [mat]).forEach((m) => {
        (m as WireMaterial).wireframe = wire;
      });
    }
  });
}

function Scene({
  scene,
  wireframe,
}: {
  scene: THREE.Group;
  wireframe: boolean;
}) {
  useEffect(() => {
    applyWireframe(scene, wireframe);
  }, [scene, wireframe]);

  return (
    <>
      <primitive object={scene} />
      <gridHelper args={[120, 12, 0x2a2f3a, 0x20242c]} position={[0, 0, 0]} />
    </>
  );
}

function fitCamera(
  camera: THREE.PerspectiveCamera,
  scene: THREE.Object3D,
  centerRef: { current: THREE.Vector3 },
) {
  const box = new THREE.Box3().setFromObject(scene);
  if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3());
  const radius = box.getBoundingSphere(new THREE.Sphere()).radius;

  const fov = (camera.fov * Math.PI) / 180;
  const dist = (radius * 1.5) / Math.sin(fov / 2);

  const dir = new THREE.Vector3(0.5, 0.45, 0.7).normalize();
  camera.position.copy(center).add(dir.multiplyScalar(dist));
  camera.lookAt(center);
  centerRef.current.copy(center);
}

const MODES: Array<{ value: ViewMode; label: string }> = [
  { value: "print", label: "Print" },
  { value: "preview", label: "Preview" },
];

export default function Preview3D({
  scene,
  mode,
  onModeChange,
}: {
  scene: THREE.Group;
  mode: ViewMode;
  onModeChange: (m: ViewMode) => void;
}) {
  const [wireframe, setWireframe] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const centerRef = useRef(new THREE.Vector3());

  useEffect(() => {
    controlsRef.current?.target.copy(centerRef.current);
    controlsRef.current?.update();
  }, []);

  return (
    <div
      className="pane preview-pane"
      style={{ padding: 14, display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <h2 className="pane-title" style={{ margin: 0 }}>
          3D Preview
        </h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            className="mode-toggle"
            style={{
              display: "inline-flex",
              border: "1px solid var(--border, #333)",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => onModeChange(m.value)}
                style={{
                  padding: "3px 10px",
                  fontSize: 12,
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                  background:
                    mode === m.value ? "var(--accent, #3b82f6)" : "transparent",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <label
            style={{
              fontSize: 12,
              color: "var(--muted)",
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              checked={wireframe}
              onChange={(e) => setWireframe(e.target.checked)}
            />
            Wireframe
          </label>
        </div>

        <div
          style={{ flex: 1, minHeight: 0, borderRadius: 8, overflow: "hidden" }}
        >
          <Canvas
            camera={{ fov: 50, position: [50, 60, 60] }}
            onCreated={({ camera }) =>
              fitCamera(camera as THREE.PerspectiveCamera, scene, centerRef)
            }
            style={{ background: "linear-gradient(180deg,#171a21,#0f1115)" }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[40, 60, 20]} intensity={1.1} />
            <directionalLight position={[-30, 20, -30]} intensity={0.4} />
            <Scene scene={scene} wireframe={wireframe} />
            <OrbitControls
              ref={controlsRef}
              makeDefault
              enablePan
              enableZoom
              autoRotate
              autoRotateSpeed={0.35}
            />
          </Canvas>
        </div>
        <div className="editor-hint" style={{ marginTop: 8 }}>
          Drag to orbit · scroll to zoom · right-drag to pan
        </div>
      </div>
    </div>
  );
}
