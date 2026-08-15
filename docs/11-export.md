# STL export

The entire generator should run client-side.

The final mesh can be exported as:

```text
STL
```

Suggested filenames:

```text
gmci_1x1_3u_circle_12mm.stl
```

Multiple holes:

```text
gmci_1x1_3u_2x_circle_10mm.stl
```

Custom SVG:

```text
gmci_1x1_3u_custom_pen.stl
```

# Project file

It would also be useful to save the editable design separately from the STL.

A simple JSON format is enough.

Example:

```json
{
  "version": 1,

  "grid": {
    "x": 1,
    "y": 1
  },

  "heightUnits": 3,

  "plateThickness": 2.4,

  "supports": {
    "type": "l-wall",
    "thickness": 1.4,
    "length": 7,
    "inset": 0
  },

  "cutouts": [
    {
      "type": "circle",
      "diameter": 10,
      "x": -6,
      "y": 0,
      "rotation": 0
    },
    {
      "type": "circle",
      "diameter": 10,
      "x": 6,
      "y": 0,
      "rotation": 0
    }
  ]
}
```

Files could use:

```text
.gmci.json
```
