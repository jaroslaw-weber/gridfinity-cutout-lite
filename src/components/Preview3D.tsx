import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
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

export default function Preview3D({ scene }: { scene: THREE.Group }) {
  const [wireframe, setWireframe] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const centerRef = useRef(new THREE.Vector3());

  useEffect(() => {
    controlsRef.current?.target.copy(centerRef.current);
    controlsRef.current?.update();
  }, []);

  return (
    <div className="preview-pane flex min-h-0 flex-col overflow-auto bg-panel p-[14px]">
      <div className="mb-[10px] flex items-center justify-between">
        <h2 className="m-0 text-[12px] uppercase tracking-widest text-muted">
          3D Preview
        </h2>
        <label className="flex items-center gap-[6px] text-[12px] text-muted">
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
          />
          Wireframe
        </label>
      </div>

      <div
        className="min-h-0 flex-1 overflow-hidden rounded-lg"
      >
        <Canvas
          shadows
          camera={{ fov: 50, position: [50, 60, 60] }}
          onCreated={({ camera }) =>
            fitCamera(camera as THREE.PerspectiveCamera, scene, centerRef)
          }
          style={{ background: "linear-gradient(180deg,#171a21,#0f1115)" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[30, 50, 30]}
            intensity={1.6}
            castShadow
          />
          <directionalLight position={[-40, 20, -40]} intensity={0.5} />
          <Scene scene={scene} wireframe={wireframe} />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.6}
            scale={120}
            blur={2}
            far={120}
            resolution={512}
          />
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
      <div className="mt-2 text-center text-[11px] text-muted">
        Drag to orbit · scroll to zoom · right-drag to pan
      </div>
    </div>
  );
}
