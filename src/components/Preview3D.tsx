import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { InsertParameters } from '../lib/types'

type WireMaterial = THREE.Material & { wireframe: boolean }

function applyWireframe(group: THREE.Object3D, wire: boolean) {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.isMesh) {
      const mat = mesh.material as THREE.Material | THREE.Material[]
      ;(Array.isArray(mat) ? mat : [mat]).forEach((m) => {
        ;(m as WireMaterial).wireframe = wire
      })
    }
  })
}

function Scene({ scene, wireframe }: { scene: THREE.Group; wireframe: boolean }) {
  useEffect(() => {
    applyWireframe(scene, wireframe)
  }, [scene, wireframe])

  return (
    <>
      <primitive object={scene} />
      <gridHelper args={[120, 12, 0x2a2f3a, 0x20242c]} position={[0, 0, 0]} />
    </>
  )
}

function fitCamera(camera: THREE.PerspectiveCamera, params: InsertParameters) {
  const size = Math.max(params.width, params.depth, 30)
  camera.position.set(size * 1.1, size * 1.3, size * 1.6)
  camera.lookAt(0, size / 2, 0)
}

export default function Preview3D({
  scene,
  params
}: {
  scene: THREE.Group
  params: InsertParameters
}) {
  const [wireframe, setWireframe] = useState(false)

  return (
    <div className="pane preview-pane" style={{ padding: 14, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2 className="pane-title" style={{ margin: 0 }}>
          3D Preview
        </h2>
        <label style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
          />
          Wireframe
        </label>
      </div>

      <div style={{ flex: 1, minHeight: 0, borderRadius: 8, overflow: 'hidden' }}>
        <Canvas
          camera={{ fov: 50, position: [50, 60, 60] }}
          onCreated={({ camera }) => fitCamera(camera as THREE.PerspectiveCamera, params)}
          style={{ background: 'linear-gradient(180deg,#171a21,#0f1115)' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[40, 60, 20]} intensity={1.1} />
          <directionalLight position={[-30, 20, -30]} intensity={0.4} />
          <Scene scene={scene} wireframe={wireframe} />
          <OrbitControls makeDefault enablePan enableZoom autoRotate autoRotateSpeed={1.2} />
        </Canvas>
      </div>
      <div className="editor-hint" style={{ marginTop: 8 }}>
        Drag to orbit · scroll to zoom · right-drag to pan
      </div>
    </div>
  )
}
