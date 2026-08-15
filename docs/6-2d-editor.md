# 2D editor

The easiest way to edit the cutout layout is with a top-down 2D editor.

Example:

```text
┌─────────────────────────────┐
│                             │
│       ○             ○       │
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

Users should be able to:

- click a shape
- drag it
- resize it
- rotate it
- duplicate it
- delete it
- align it
- center it

The editor should show measurements in millimeters.

Optional snapping:

```text
Snap

○ Off
○ 1 mm
○ 0.5 mm
○ 0.1 mm
```

## Shape selection UI

A compact toolbar could look like:

```text
Add Cutout

[ ○ Circle ]
[ ▭ Capsule ]
[ ▢ Rectangle ]
[ ▣ Rounded Rectangle ]
[ ⬆ Import SVG ]
```

Selecting a shape creates it in the center of the insert.
