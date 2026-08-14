import { useCallback, useMemo, useState } from 'react'
import type { Cutout, CutoutType, InsertParameters } from '../lib/types'
import { defaults, makeCutout } from '../lib/types'
import { buildScene, defaultFilename, exportSTL } from '../lib/geometry'
import ParametersPanel from './ParametersPanel'
import Editor2D from './Editor2D'
import Preview3D from './Preview3D'

function initialParams(): InsertParameters {
  const c1 = makeCutout('circle', 1)
  return {
    gridX: defaults.gridX,
    gridY: defaults.gridY,
    width: defaults.width,
    depth: defaults.depth,
    heightUnits: defaults.heightUnits,
    plateThickness: defaults.plateThickness,
    supportThickness: defaults.supportThickness,
    supportLength: defaults.supportLength,
    supportInset: defaults.supportInset,
    cutouts: [c1]
  }
}

export default function App() {
  const [params, setParams] = useState<InsertParameters>(initialParams)
  const [selectedId, setSelectedId] = useState<string | null>(
    () => initialParams().cutouts[0]?.id ?? null
  )

  const patch = useCallback((p: Partial<InsertParameters>) => {
    setParams((prev) => ({ ...prev, ...p }))
  }, [])

  const addCutout = useCallback(
    (type: CutoutType) => {
      let id: string | null = null
      setParams((prev) => {
        const c = makeCutout(type, prev.cutouts.length)
        id = c.id
        return { ...prev, cutouts: [...prev.cutouts, c] }
      })
      setSelectedId(id)
    },
    []
  )

  const updateCutout = useCallback((id: string, patch: Partial<Cutout>) => {
    setParams((prev) => ({
      ...prev,
      cutouts: prev.cutouts.map((c) =>
        c.id === id ? ({ ...c, ...patch } as Cutout) : c
      )
    }))
  }, [])

  const removeCutout = useCallback((id: string) => {
    setParams((prev) => ({
      ...prev,
      cutouts: prev.cutouts.filter((c) => c.id !== id)
    }))
    setSelectedId(null)
  }, [])

  const duplicateCutout = useCallback((id: string) => {
    let newId: string | null = null
    setParams((prev) => {
      const src = prev.cutouts.find((c) => c.id === id)
      if (!src) return prev
      const copy = { ...src, id: `${Date.now()}_dup`, x: src.x + 5, y: src.y + 5 } as Cutout
      newId = copy.id
      return { ...prev, cutouts: [...prev.cutouts, copy] }
    })
    setSelectedId(newId)
  }, [])

  const onExport = useCallback(() => {
    const group = buildScene(params)
    const blob = exportSTL(group)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = defaultFilename(params)
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [params])

  const scene = useMemo(() => buildScene(params), [params])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gridfinity Cutout Lite</h1>
        <span className="sub">
          {params.gridX}×{params.gridY} · {params.heightUnits}U ·{' '}
          {params.width}×{params.depth} mm
        </span>
      </header>

      <div className="layout">
        <ParametersPanel
          params={params}
          patch={patch}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onAdd={addCutout}
          onUpdate={updateCutout}
          onRemove={removeCutout}
          onDuplicate={duplicateCutout}
        />

        <Editor2D
          params={params}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onUpdate={updateCutout}
        />

        <Preview3D scene={scene} params={params} />
      </div>

      <div className="footer-actions">
        <button className="primary" onClick={onExport}>
          Export STL
        </button>
        <span style={{ margin: 'auto 0', color: 'var(--muted)', fontSize: 12 }}>
          Client-side only · STL: {defaultFilename(params)}
        </span>
      </div>
    </div>
  )
}
