import type { Cutout, CutoutType, InsertParameters } from '../lib/types'
import { insertDimension } from '../lib/types'
import CutoutIcon from './CutoutIcon'

interface Props {
  params: InsertParameters
  patch: (p: Partial<InsertParameters>) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  onAdd: (type: CutoutType) => void
  onUpdate: (id: string, patch: Partial<Cutout>) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
}

function Num({
  label,
  value,
  onChange,
  step = 0.5,
  min = 0
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
}) {
  return (
    <div className="mb-3 min-w-0 flex-1">
      <label className="mb-1 block text-[12px] text-muted">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        className="w-full rounded-md border border-border bg-panel-2 px-2 py-[6px] text-[13px]"
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  )
}

function SliderNum({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 0.5
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max: number
  step?: number
}) {
  return (
    <div className="mb-3 min-w-0 flex-1">
      <label className="mb-1 block text-[12px] text-muted">{label}</label>
      <div className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-panel-2 px-2 py-[6px]">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          className="min-w-0 flex-1 accent-[#4f8cff]"
        />
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          className="w-[52px] min-w-[52px] rounded-md border border-border bg-panel-2 px-[6px] py-1 text-center text-[13px]"
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  )
}

const BTN =
  'cursor-pointer rounded-md border border-border bg-panel-2 px-[11px] py-[7px] text-[13px] hover:border-accent-2 hover:text-accent-2'
const BTN_SM = `${BTN} px-[7px] py-[3px] text-[12px] ml-1`

const CUTOUT_TYPES: Array<{ type: CutoutType; label: string }> = [
  { type: 'circle', label: 'Circle' },
  { type: 'capsule', label: 'Capsule' },
  { type: 'rounded-rect', label: 'Rounded Rect' },
  { type: 'rectangle', label: 'Rectangle' },
  { type: 'triangle', label: 'Triangle' },
  { type: 'diamond', label: 'Diamond' },
  { type: 'hexagon', label: 'Hexagon' }
]

function shapeFields(c: Cutout, onChange: (p: Partial<Cutout>) => void) {
  switch (c.type) {
    case 'circle':
      return (
        <SliderNum
          label="Diameter (mm)"
          value={c.diameter}
          min={2}
          max={100}
          step={0.5}
          onChange={(v) => onChange({ diameter: v })}
        />
      )
    case 'capsule':
      return (
        <>
          <SliderNum
            label="Width (mm)"
            value={c.width}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ width: v })}
          />
          <SliderNum
            label="Height (mm)"
            value={c.height}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ height: v })}
          />
        </>
      )
    case 'rounded-rect':
      return (
        <>
          <SliderNum
            label="Width (mm)"
            value={c.width}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ width: v })}
          />
          <SliderNum
            label="Height (mm)"
            value={c.height}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ height: v })}
          />
          <SliderNum
            label="Radius (mm)"
            value={c.radius}
            min={0}
            max={50}
            step={0.5}
            onChange={(v) => onChange({ radius: v })}
          />
        </>
      )
    case 'rectangle':
    case 'triangle':
    case 'diamond':
    case 'hexagon':
      return (
        <>
          <SliderNum
            label="Width (mm)"
            value={c.width}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ width: v })}
          />
          <SliderNum
            label="Height (mm)"
            value={c.height}
            min={2}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ height: v })}
          />
        </>
      )
  }
}

export default function ParametersPanel(p: Props) {
  const { params, patch } = p

  const onGridX = (gridX: number) =>
    patch({ gridX, width: insertDimension(gridX) })
  const onGridY = (gridY: number) =>
    patch({ gridY, depth: insertDimension(gridY) })

  const selected = params.cutouts.find((c) => c.id === p.selectedId) ?? null

  return (
    <div className="overflow-auto bg-panel p-[14px]">
      <h2 className="mb-3 text-[12px] uppercase tracking-widest text-muted">
        Parameters
      </h2>

      <div className="flex gap-2">
        <Num label="Grid X" value={params.gridX} step={1} onChange={onGridX} />
        <Num label="Grid Y" value={params.gridY} step={1} onChange={onGridY} />
      </div>

      <div className="flex gap-2">
        <Num
          label="Width (mm)"
          value={params.width}
          step={1}
          onChange={(w) => patch({ width: w })}
        />
        <Num
          label="Depth (mm)"
          value={params.depth}
          step={1}
          onChange={(d) => patch({ depth: d })}
        />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-[12px] text-muted">Height (U)</label>
        <div className="flex items-center gap-2 rounded-md border border-border bg-panel-2 px-2 py-[6px]">
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={params.heightUnits}
            onChange={(e) =>
              patch({ heightUnits: parseFloat(e.target.value) || 1 })
            }
            className="min-w-0 flex-1 accent-[#4f8cff]"
          />
          <output
            className="w-7 text-center text-[13px] font-semibold text-accent-2"
          >
            {params.heightUnits}
          </output>
        </div>
      </div>

      <div className="flex gap-2">
        <Num
          label="Plate Thickness (mm)"
          value={params.plateThickness}
          step={0.1}
          onChange={(t) => patch({ plateThickness: t })}
        />
        <Num
          label="Support Width (mm)"
          value={params.supportThickness}
          step={0.1}
          onChange={(v) => patch({ supportThickness: v })}
        />
      </div>

      <details style={{ margin: '4px 0 14px' }}>
        <summary style={{ color: 'var(--muted)', cursor: 'pointer' }}>
          Advanced — Supports
        </summary>
        <Num
          label="Wall Thickness (mm)"
          value={params.supportThickness}
          step={0.1}
          onChange={(v) => patch({ supportThickness: v })}
        />
        <Num
          label="Wall Length (mm)"
          value={params.supportLength}
          step={0.1}
          onChange={(v) => patch({ supportLength: v })}
        />
        <Num
          label="Edge Inset (mm)"
          value={params.supportInset}
          step={0.1}
          min={0}
          onChange={(v) => patch({ supportInset: v })}
        />
      </details>

      <h2 className="mb-3 text-[12px] uppercase tracking-widest text-muted">
        Cutouts
      </h2>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {CUTOUT_TYPES.map((t) => (
          <button
            key={t.type}
            onClick={() => p.onAdd(t.type)}
            className={`${BTN} flex items-center gap-1`}
          >
            <CutoutIcon type={t.type} size={16} /> + {t.label}
          </button>
        ))}
      </div>

      {params.cutouts.length === 0 && (
        <p className="text-[12px] text-muted">
          No cutouts yet. Add one above, or choose a preset below.
        </p>
      )}

      {params.cutouts.map((c) => {
        const sel = c.id === p.selectedId
        return (
          <div
            key={c.id}
            className={`mb-2 rounded-lg border bg-panel-2 p-[10px]${
              sel ? ' border-accent' : ' border-border'
            }`}
            onClick={() => p.setSelectedId(c.id)}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[13px] font-semibold">
                <CutoutIcon
                  cutout={c}
                  size={16}
                />
                {CUTOUT_TYPES.find((t) => t.type === c.type)?.label}
              </span>
              <span className="flex">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    p.onDuplicate(c.id)
                  }}
                  title="Duplicate"
                  className={BTN_SM}
                >
                  ⧉
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    p.onRemove(c.id)
                  }}
                  title="Remove"
                  className={`${BTN_SM} hover:border-danger hover:text-danger`}
                >
                  ✕
                </button>
              </span>
            </div>

            <fieldset
              className="m-0 border-0 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              {shapeFields(c, (patch) => p.onUpdate(c.id, patch))}
              <div className="flex gap-2">
                <Num
                  label="X (mm)"
                  value={c.x}
                  step={0.5}
                  min={-999}
                  onChange={(v) => p.onUpdate(c.id, { x: v })}
                />
                <Num
                  label="Y (mm)"
                  value={c.y}
                  step={0.5}
                  min={-999}
                  onChange={(v) => p.onUpdate(c.id, { y: v })}
                />
              </div>
              <div className="flex gap-2">
                <SliderNum
                  label="Rotation (°)"
                  value={c.rotation}
                  min={0}
                  max={360}
                  step={5}
                  onChange={(v) => p.onUpdate(c.id, { rotation: v })}
                />
                <SliderNum
                  label="Clearance (mm)"
                  value={c.clearance}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) => p.onUpdate(c.id, { clearance: v })}
                />
              </div>
            </fieldset>
          </div>
        )
      })}

      {selected && (
        <p className="mt-2 text-[12px] text-muted">
          Tip: drag the shape in the 2D editor to position it.
        </p>
      )}
    </div>
  )
}
