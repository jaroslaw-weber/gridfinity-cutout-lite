# Project Rules

## Styling

This project uses Tailwind CSS v4 (via `@tailwindcss/vite`). Keep `src/styles/global.css` minimal and stable:

- What belongs in `global.css`: theme tokens (`:root` / `--color-*`, `@theme inline`, `@layer base` resets) and anything truly global (dark mode, fonts, radius).
- What does NOT belong in `global.css`:
  - Component-specific layout, spacing, or responsive rules.
  - Media queries targeting specific component classes.
- Own styles in the component that renders the element. Prefer Tailwind utilities directly in `className`.
- For responsive layout, use Tailwind breakpoints (`sm:`, `md:`, `lg:`, etc.) in the component, not new `@media` blocks in `global.css`.
- For repeated non-utility layout that must be shared, define it in the component using Tailwind utilities / `cn()` helper, or a small local CSS module — not `global.css`.
- Identify components by file: `src/components/App.tsx` (`layout` shell), `src/components/Preview3D.tsx` (`preview-pane`), `src/components/ParametersPanel.tsx` and `src/components/parameters/*`.

If layout styling currently lives in `global.css`, migrate it into the owning component rather than extending it.

## Verification

- `bun run typecheck` (astro check)
- `bun run lint`
- `bun run build`

Never skip these when changing code. When done, you may stop — do not commit unless asked.
