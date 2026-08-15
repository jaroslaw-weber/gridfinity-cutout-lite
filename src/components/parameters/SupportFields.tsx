import type { InsertParameters } from '../../lib/types'
import { Num } from './fields'

interface Props {
  params: InsertParameters
  patch: (p: Partial<InsertParameters>) => void
}

export function SupportFields({ params, patch }: Props) {
  return (
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
  )
}
