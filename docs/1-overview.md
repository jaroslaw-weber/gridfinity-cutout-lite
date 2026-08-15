# Overview

A parametric frontend tool for generating lightweight Gridfinity cutout inserts from simple dimensions or imported 2D shapes.

Instead of printing a full custom Gridfinity bin around an object, the generator creates a thin cutout plate with integrated minimal supports. The insert drops into a standard Gridfinity bin and can be generated at different heights.

The goal is to reduce filament usage, shorten print times, and make custom storage layouts easier to modify.

If a single cutout seems unstable (pencil moving around etc) you can stack multiple (2-4) cutouts for better horizontal stability.

## Core idea

Each generated insert has:

- a Gridfinity-compatible footprint
- a thin top plate
- one or more cutouts
- integrated L-shaped corner supports
- configurable height in Gridfinity units
- STL export directly in the browser

Example:

```text
             pen
              │
              │
      ┌───────○───────┐
      │               │
      │   cutout      │
      │               │
      └┐             ┌┘
       │             │
       │             │
       │             │
       └             ┘
        minimal supports
```

Multiple inserts can also be used at different heights to support the same object at several points.

## Main design principle

The generator should remain simple.

The user should be able to go from:

```text
I need two 11 mm pen holes
```

to:

```text
download STL
```

in less than a minute.

For custom objects:

```text
Import SVG
→ set real-world size
→ set height
→ export STL
```

The tool should hide most CAD complexity while keeping all measurements precise and editable in millimeters.

## See also

- [Default geometry](2-geometry.md)
- [Main parameters](3-parameters.md)
- [Cutout system](4-cutouts.md)
- [2D editor](5-2d-editor.md)
- [3D preview](6-3d-preview.md)
- [Geometry generation](7-geometry-generation.md)
- [Supports](8-supports.md)
- [Validation](9-validation.md)
- [Export & project file](10-export.md)
- [Frontend](11-frontend.md)
- [MVP](12-mvp.md)
