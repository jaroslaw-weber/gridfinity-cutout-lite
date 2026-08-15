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
    <div className="field">
      <label>{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  )
}

const CUTOUT_TYPES: Array<{ type: CutoutType; label: string }> = [
  { type: 'circle', label: 'Circle' },
  { type: 'capsule', label: 'Capsule' },
  { type: 'rounded-rect', label: 'Rounded Rect' },
  { type: 'rectangle', label: 'Rectangle' }
]

function shapeFields(c: Cutout, onChange: (p: Partial<Cutout>) => void) {
  switch (c.type) {
    case 'circle':
      return (
        <Num
          label="Diameter (mm)"
          value={c.diameter}
          step={0.1}
          onChange={(v) => onChange({ diameter: v })}
        />
      )
    case 'capsule':
      return (
        <div className="row">
          <Num
            label="Width (mm)"
            value={c.width}
            step={0.1}
            onChange={(v) => onChange({ width: v })}
          />
          <Num
            label="Height (mm)"
            value={c.height}
            step={0.1}
            onChange={(v) => onChange({ height: v })}
          />
        </div>
      )
    case 'rounded-rect':
      return (
        <>
          <div className="row">
            <Num
              label="Width (mm)"
              value={c.width}
              step={0.1}
              onChange={(v) => onChange({ width: v })}
            />
            <Num
              label="Height (mm)"
              value={c.height}
              step={0.1}
              onChange={(v) => onChange({ height: v })}
            />
          </div>
          <Num
            label="Radius (mm)"
            value={c.radius}
            step={0.1}
            onChange={(v) => onChange({ radius: v })}
          />
        </>
      )
    case 'rectangle':
      return (
        <div className="row">
          <Num
            label="Width (mm)"
            value={c.width}
            step={0.1}
            onChange={(v) => onChange({ width: v })}
          />
          <Num
            label="Height (mm)"
            value={c.height}
            step={0.1}
            onChange={(v) => onChange({ height: v })}
          />
        </div>
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
    <div className="pane">
      <h2 className="pane-title">Parameters</h2>

      <div className="row">
        <Num label="Grid X" value={params.gridX} step={1} onChange={onGridX} />
        <Num label="Grid Y" value={params.gridY} step={1} onChange={onGridY} />
      </div>

      <div className="row">
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

      <div className="field height-slider">
        <label>Height (U)</label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--panel-2)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '6px 8px'
          }}
        >
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={params.heightUnits}
            onChange={(e) =>
              patch({ heightUnits: parseFloat(e.target.value) || 1 })
            }
            style={{ flex: 1, accentColor: '#4f8cff' }}
          />
          <output
            style={{
              minWidth: 28,
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--accent-2)',
              fontWeight: 600
            }}
          >
            {params.heightUnits}
          </output>
        </div>
      </div>

      <div className="row">
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

      <h2 className="pane-title">Cutouts</h2>

      <div className="add-bar">
        {CUTOUT_TYPES.map((t) => (
          <button key={t.type} onClick={() => p.onAdd(t.type)} className="add-btn">
            <CutoutIcon type={t.type} size={16} /> + {t.label}
          </button>
        ))}
      </div>

      {params.cutouts.length === 0 && (
        <p style={{ color: 'var(--muted)', fontSize: 12 }}>
          No cutouts yet. Add one above, or choose a preset below.
        </p>
      )}

      {params.cutouts.map((c) => {
        const sel = c.id === p.selectedId
        return (
          <div
            key={c.id}
            className={`cutout${sel ? ' selected' : ''}`}
            onClick={() => p.setSelectedId(c.id)}
          >
            <div className="cutout-head">
              <span className="name">
                <CutoutIcon
                  type={c.type}
                  size={16}
                />
                {CUTOUT_TYPES.find((t) => t.type === c.type)?.label}
              </span>
              <span className="cutout-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    p.onDuplicate(c.id)
                  }}
                  title="Duplicate"
                >
                  ⧉
                </button>
                <button
                  className="danger"
                  onClick={(e) => {
                    e.stopPropagation()
                    p.onRemove(c.id)
                  }}
                  title="Remove"
                >
                  ✕
                </button>
              </span>
            </div>

            <fieldset className="cutout-fields" onClick={(e) => e.stopPropagation()}>
              {shapeFields(c, (patch) => p.onUpdate(c.id, patch))}
              <div className="row">
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
              <div className="row">
                <Num
                  label="Rotation (°)"
                  value={c.rotation}
                  step={5}
                  onChange={(v) => p.onUpdate(c.id, { rotation: v })}
                />
                <Num
                  label="Clearance (mm)"
                  value={c.clearance}
                  step={0.05}
                  onChange={(v) => p.onUpdate(c.id, { clearance: v })}
                />
              </div>
            </fieldset>
          </div>
        )
      })}

      {selected && (
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>
          Tip: drag the shape in the 2D editor to position it.
        </p>
      )}
    </div>
  )
}
