# SVG cutout import

For custom tools, users should be able to import an SVG.

This allows someone to trace an object in:

* Inkscape
* Illustrator
* Affinity Designer
* Figma
* CAD software
* another tracing tool

and then use that outline directly as a cutout.

Recommended flow:

```text
Import SVG
    ↓
Extract paths
    ↓
Convert paths to 2D shape
    ↓
Scale in millimeters
    ↓
Position on insert
    ↓
Subtract from plate
```

SVG import should support:

```text
.svg
```

The editor should show the imported path alongside its real-world dimensions.

Example:

```text
Imported shape

Width:  23.4 mm
Height: 76.2 mm

Scale:
[ 100% ]

Position:
X [ 0.0 mm ]
Y [ 0.0 mm ]

Rotation:
[ 0° ]
```

## SVG sizing

This is important.

The tool should never guess physical dimensions silently.

After import, show the interpreted dimensions in millimeters.

If the SVG contains:

```text
width
height
viewBox
```

use those to calculate physical size.

Otherwise require the user to specify one known dimension.

Example:

```text
Imported SVG has no physical units.

Set width:
[ 24.5 mm ]

Height:
30.2 mm
```

The aspect ratio should remain locked by default.
