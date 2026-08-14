# TODO — Rename project to "Gridfinity Cutout Lite"

Slug: `gridfinity-cutout-lite`

## Done (code identifiers & display names)
- [x] `README.md:1` — title → `Gridfinity Cutout Lite`
- [x] `docs/12-frontend.md:7` — UI mock title → `Gridfinity Cutout Lite`
- [x] `package.json:2` — `"name"` → `gridfinity-cutout-lite`
- [x] `astro.config.mjs:8` — `base` → `/gridfinity-cutout-lite/`
- [x] `src/pages/index.astro:11` — page `<title>` → `Gridfinity Cutout Lite`
- [x] `bun.lock` — package `name` → `gridfinity-cutout-lite`

## Manual steps (user)
- [ ] Rename GitHub repo `jaroslaw-weber/gridfinity-minimal-cutout-insert-generator` → `gridfinity-cutout-lite`
      (breaks old Pages URL; GitHub redirects the old repo URL for a while, but the Pages
      base path must match the new repo name)
- [ ] Update git remote locally (or reclone):
      `git remote set-url origin git@github.com:jaroslaw-weber/gridfinity-cutout-lite.git`
- [ ] Rename local folder `gridfinity-minimal-cutout-insert-generator` → `gridfinity-cutout-lite`
- [ ] Verify deploy: `bun run build` + preview; confirm Pages path `/gridfinity-cutout-lite/` resolves
- [ ] Grep for any remaining old name: `rg "minimal-cutout|gridfinity-minimal" --hidden -g '!.git'`
