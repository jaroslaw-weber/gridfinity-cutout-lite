import type { Cutout, CutoutType, InsertParameters } from '../lib/types'
import { CutoutList } from './parameters/CutoutList'
import CutoutTypePicker from './parameters/CutoutTypePicker'
import { PlateFields } from './parameters/PlateFields'
import { SupportFields } from './parameters/SupportFields'

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

export default function ParametersPanel(p: Props) {
  const { params, patch } = p

  return (
    <div className="overflow-auto bg-panel p-[14px]">
      <h2 className="mb-3 text-[12px] uppercase tracking-widest text-muted">
        Parameters
      </h2>

      <PlateFields params={params} patch={patch} />

      <SupportFields params={params} patch={patch} />

      <h2 className="mb-3 text-[12px] uppercase tracking-widest text-muted">
        Cutouts
      </h2>

      <CutoutTypePicker onAdd={p.onAdd} />

      <CutoutList
        cutouts={params.cutouts}
        selectedId={p.selectedId}
        setSelectedId={p.setSelectedId}
        onUpdate={p.onUpdate}
        onRemove={p.onRemove}
        onDuplicate={p.onDuplicate}
      />
    </div>
  )
}