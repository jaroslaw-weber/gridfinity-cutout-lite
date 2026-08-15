import type { Cutout } from '../../lib/types'
import CutoutIcon from '../CutoutIcon'
import { BTN_SM, CUTOUT_TYPES } from './CutoutTypePicker'
import { Num, SliderNum } from './fields'
import { ShapeFields } from './ShapeFields'

interface Props {
  cutouts: Cutout[]
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  onUpdate: (id: string, patch: Partial<Cutout>) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
}

export function CutoutList({
  cutouts,
  selectedId,
  setSelectedId,
  onUpdate,
  onRemove,
  onDuplicate
}: Props) {
  return (
    <>
      {cutouts.length === 0 && (
        <p className="text-[12px] text-muted">
          No cutouts yet. Add one above, or choose a preset below.
        </p>
      )}

      {cutouts.map((c) => {
        const sel = c.id === selectedId
        return (
          <div
            key={c.id}
            className={`mb-2 rounded-lg border bg-panel-2 p-2.5 ${
              sel ? 'border-accent' : 'border-border'
            }`}
            onClick={() => setSelectedId(c.id)}
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
                    onDuplicate(c.id)
                  }}
                  title="Duplicate"
                  className={BTN_SM}
                >
                  ⧉
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(c.id)
                  }}
                  title="Remove"
                  className={`${BTN_SM} hover:border-danger hover:text-danger`}
                >
                  ✕
                </button>
              </span>
            </div>

            <fieldset
              className="m-0 min-w-0 border-0 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ShapeFields cutout={c} onChange={(patch) => onUpdate(c.id, patch)} />
              <div className="flex gap-2">
                <Num
                  label="X (mm)"
                  value={c.x}
                  step={0.5}
                  min={-999}
                  onChange={(v) => onUpdate(c.id, { x: v })}
                />
                <Num
                  label="Y (mm)"
                  value={c.y}
                  step={0.5}
                  min={-999}
                  onChange={(v) => onUpdate(c.id, { y: v })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <SliderNum
                  label="Rotation (°)"
                  value={c.rotation}
                  min={0}
                  max={360}
                  step={5}
                  onChange={(v) => onUpdate(c.id, { rotation: v })}
                />
                <SliderNum
                  label="Clearance (mm)"
                  value={c.clearance}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) => onUpdate(c.id, { clearance: v })}
                />
              </div>
            </fieldset>
          </div>
        )
      })}

      {selectedId && (
        <p className="mt-2 text-[12px] text-muted">
          Tip: drag the shape in the 2D editor to position it.
        </p>
      )}
    </>
  )
}