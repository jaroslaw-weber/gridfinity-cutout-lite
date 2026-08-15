import { useCallback, useMemo, useState } from 'react'

import { buildScene, defaultFilename, exportSTL } from '../lib/geometry'
import type { Cutout, CutoutType, InsertParameters } from '../lib/types'
import { defaults, makeCutout } from '../lib/types'
import Editor2D from './Editor2D'
import ParametersPanel from './ParametersPanel'
import Preview3D from './Preview3D'
import { Button } from './ui/button'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.633 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.712-4.042-1.582-4.042-1.582-.546-1.367-1.335-1.731-1.335-1.731-1.09-.733.082-.718.082-.718 1.205.083 1.84 1.218 1.84 1.218 1.07 1.804 2.809 1.283 3.495.982.108-.763.418-1.283.761-1.578-2.665-.298-5.466-1.31-5.466-5.828 0-1.287.468-2.339 1.235-3.164-.123-.298-.535-1.497.117-3.122 0 0 1.007-.317 3.3 1.209a11.62 11.62 0 0 1 3-.397c1.02.005 2.047.137 3.006.397 2.292-1.526 3.297-1.209 3.297-1.209.653 1.625.241 2.824.118 3.122.768.825 1.233 1.877 1.233 3.164 0 4.53-2.805 5.526-5.476 5.818.43.363.812 1.082.812 2.181 0 1.575-.015 2.843-.015 3.229 0 .315.219.683.825.567C20.565 21.923 24 17.503 24 12.292 24 5.78 18.627.5 12 .5z" />
    </svg>
  )
}

const GITHUB_URL = 'https://github.com/jaroslaw-weber/gridfinity-cutout-lite'

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
    cutouts: [c1],
  }
}

export default function App() {
  const [params, setParams] = useState<InsertParameters>(initialParams)
  const [selectedId, setSelectedId] = useState<string | null>(
    () => initialParams().cutouts[0]?.id ?? null,
  )

  const patch = useCallback((p: Partial<InsertParameters>) => {
    setParams((prev) => ({ ...prev, ...p }))
  }, [])

  const addCutout = useCallback((type: CutoutType) => {
    let id: string | null = null
    setParams((prev) => {
      const c = makeCutout(type, prev.cutouts.length)
      id = c.id
      return { ...prev, cutouts: [...prev.cutouts, c] }
    })
    setSelectedId(id)
  }, [])

  const updateCutout = useCallback((id: string, patch: Partial<Cutout>) => {
    setParams((prev) => ({
      ...prev,
      cutouts: prev.cutouts.map((c) =>
        c.id === id ? ({ ...c, ...patch } as Cutout) : c,
      ),
    }))
  }, [])

  const removeCutout = useCallback((id: string) => {
    setParams((prev) => ({
      ...prev,
      cutouts: prev.cutouts.filter((c) => c.id !== id),
    }))
    setSelectedId(null)
  }, [])

  const duplicateCutout = useCallback((id: string) => {
    let newId: string | null = null
    setParams((prev) => {
      const src = prev.cutouts.find((c) => c.id === id)
      if (!src) return prev
      const copy = {
        ...src,
        id: `${Date.now()}_dup`,
        x: src.x + 5,
        y: src.y + 5,
      } as Cutout
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
    <div className="app flex h-full flex-col">
      <header className="border-border bg-panel flex items-baseline justify-between border-b px-[18px] py-3">
        <h1 className="m-0 text-base font-semibold">Gridfinity Cutout Lite</h1>
        <span className="text-muted text-xs">
          {params.gridX}×{params.gridY} · {params.heightUnits}U · {params.width}
          ×{params.depth} mm
        </span>
        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-foreground text-xs"
            aria-label="GitHub repository"
          >
            Support the project
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository">
            <Button variant="outline" className="gap-2">
              <GithubIcon className="h-4 w-4" /> GitHub
            </Button>
          </a>
        </div>
      </header>

      <p className="border-border bg-panel text-muted m-0 border-b px-[18px] py-[10px] text-[13px]">
        Design lightweight Gridfinity cutout inserts: pick a grid size, drop
        cutout shapes onto the plate, then export an STL to print.
      </p>

      <div className="border-border bg-panel border-b px-[18px] py-3 md:hidden">
        <p className="text-accent m-0 text-center text-lg font-semibold">
          This tool is best experienced in desktop view — please switch to a
          larger screen for the best experience.
        </p>
      </div>

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

        <Preview3D scene={scene} />
      </div>

      <div className="border-border bg-panel flex gap-2 border-t px-[14px] py-3">
        <Button onClick={onExport}>Export STL</Button>
        <span className="text-muted m-auto text-xs">
          Client-side only · STL: {defaultFilename(params)}
        </span>
      </div>
    </div>
  )
}
