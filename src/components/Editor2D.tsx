import { type PointerEvent, useRef, useState } from 'react'

import { cutoutPoints, plateRect } from '../lib/geometry'
import type { Cutout, InsertParameters } from '../lib/types'

interface Props {
  params: InsertParameters
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  onUpdate: (id: string, patch: Partial<Cutout>) => void
}

function ptsToPath(pts: Array<{ x: number; y: number }>): string {
  const reversed = pts.map((p) => `${p.x.toFixed(2)},${(-p.y).toFixed(2)}`)
  return `M ${reversed.join(' L ')} Z`
}

export default function Editor2D({
  params,
  selectedId,
  setSelectedId,
  onUpdate,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{
    id: string
    startSvgX: number
    startSvgY: number
    startX: number
    startY: number
  } | null>(null)
  const [cursor, setCursor] = useState('grab')

  const pad = 36
  const halfX = params.width / 2 + pad
  const halfY = params.depth / 2 + pad

  const toSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current!
    const ctm = svg.getScreenCTM()!
    const pt = new DOMPoint(clientX, clientY)
    const p = pt.matrixTransform(ctm.inverse())
    return { x: p.x, y: -p.y }
  }

  const beginDrag = (e: PointerEvent, cutout: Cutout) => {
    e.stopPropagation()
    setSelectedId(cutout.id)
    const s = toSvg(e.clientX, e.clientY)
    dragRef.current = {
      id: cutout.id,
      startSvgX: s.x,
      startSvgY: s.y,
      startX: cutout.x,
      startY: cutout.y,
    }
  }

  const onMove = (e: PointerEvent) => {
    if (!dragRef.current) return
    const s = toSvg(e.clientX, e.clientY)
    const d = dragRef.current
    onUpdate(d.id, {
      x: d.startX + (s.x - d.startSvgX),
      y: d.startY + (s.y - d.startSvgY),
    })
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const plate = plateRect(params)
  const platePath = ptsToPath(plate)

  return (
    <div className="bg-panel flex h-full flex-col overflow-auto p-[14px]">
      <h2 className="text-muted mb-3 text-[12px] tracking-widest uppercase">
        2D Editor
      </h2>
      <div
        className="flex flex-1 items-center justify-center rounded-lg"
        style={{
          minHeight: 0,
          background:
            'radial-gradient(circle at 40% 40%, #1b1f27 0, #15181f 100%)',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`${-halfX} ${-halfY} ${halfX * 2} ${halfY * 2}`}
          style={{ cursor, touchAction: 'none' }}
          className="max-h-full max-w-full"
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <line
            className="stroke-border"
            strokeWidth={1}
            x1={-params.width / 2}
            y1={0}
            x2={params.width / 2}
            y2={0}
          />
          <line
            className="stroke-border"
            strokeWidth={1}
            x1={0}
            y1={-params.depth / 2}
            x2={0}
            y2={params.depth / 2}
          />
          <path
            className="stroke-muted fill-[rgba(79,140,255,0.04)]"
            strokeWidth={1}
            strokeDasharray="4 4"
            d={platePath}
          />

          {params.cutouts.map((c) => {
            const pts = cutoutPoints(c)
            const sel = c.id === selectedId
            return (
              <path
                key={c.id}
                className={`fill-none ${
                  sel ? 'stroke-[#ffd166]' : 'stroke-accent'
                }`}
                strokeWidth={sel ? 2.5 : 1.5}
                d={ptsToPath(pts)}
                onPointerDown={(e) => beginDrag(e, c)}
                onPointerEnter={() => setCursor('move')}
                onPointerLeave={() => setCursor('grab')}
              />
            )
          })}
        </svg>
      </div>
      <div className="text-muted mt-2 text-center text-[11px]">
        Drag shapes to position · X/Y = {params.width}×{params.depth} mm ·
        center = (0, 0)
      </div>
    </div>
  )
}
