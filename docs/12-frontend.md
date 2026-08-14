# Suggested frontend

The application could have three main areas.

```text
┌──────────────────────────────────────────────────────┐
│ Gridfinity Cutout Lite                               │
├───────────────┬──────────────────────┬───────────────┤
│               │                      │               │
│ PARAMETERS    │      2D EDITOR       │  3D PREVIEW   │
│               │                      │               │
│ Grid  1×1     │      ○      ○        │               │
│ Height 3U     │                      │               │
│ Plate 2.4     │                      │               │
│               │                      │               │
│ CUTOUTS       │                      │               │
│ Circle        │                      │               │
│ Capsule       │                      │               │
│ Rect          │                      │               │
│ SVG           │                      │               │
│               │                      │               │
│ [Export STL]  │                      │               │
└───────────────┴──────────────────────┴───────────────┘
```

On smaller screens, these can become tabs:

```text
Design | 2D | 3D
```

# Suggested stack

A simple frontend-only implementation could use:

```text
Astro
Bun
React
TypeScript

Three.js
@react-three/fiber
@react-three/drei

three-stdlib
```

For SVG/path manipulation:

```text
SVGPathElement
Three.Shape
Three.ShapePath
```

For more complex polygon offsetting and boolean operations, a dedicated geometry library may eventually be useful.
