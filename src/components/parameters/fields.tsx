export function Num({
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

export function SliderNum({
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