import type { CutoutType } from '../../lib/types'
import CutoutIcon from '../CutoutIcon'

export const BTN =
  'cursor-pointer rounded-md border border-border bg-panel-2 px-[11px] py-[7px] text-[13px] hover:border-accent-2 hover:text-accent-2'
export const BTN_SM = `${BTN} px-[7px] py-[3px] text-[12px] ml-1`

export const CUTOUT_TYPES: Array<{ type: CutoutType; label: string }> = [
  { type: 'circle', label: 'Circle' },
  { type: 'capsule', label: 'Capsule' },
  { type: 'rounded-rect', label: 'Rounded Rect' },
  { type: 'rectangle', label: 'Rectangle' },
  { type: 'triangle', label: 'Triangle' },
  { type: 'diamond', label: 'Diamond' },
  { type: 'hexagon', label: 'Hexagon' }
]

export default function CutoutTypePicker({
  onAdd
}: {
  onAdd: (type: CutoutType) => void
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {CUTOUT_TYPES.map((t) => (
        <button
          key={t.type}
          onClick={() => onAdd(t.type)}
          className={`${BTN} flex items-center gap-1`}
        >
          <CutoutIcon type={t.type} size={16} /> + {t.label}
        </button>
      ))}
    </div>
  )
}