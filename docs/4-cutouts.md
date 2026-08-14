# Cutout system

Cutouts should be represented as editable 2D shapes.

```ts
interface BaseCutout {
  id: string

  x: number
  y: number

  rotation: number
}
```

Each shape extends this interface.

## Shape presets

The first version should support a small set of common presets.

### Circle

Useful for:

* pens
* screwdrivers
* markers
* cylindrical tools

```ts
interface CircleCutout extends BaseCutout {
  type: "circle"
  diameter: number
}
```

Example:

```ts
{
  type: "circle",
  diameter: 12,
  x: 19,
  y: 19,
  rotation: 0
}
```

### Capsule

Useful for:

* pens laying sideways
* screwdrivers
* elongated handles
* tweezers
* small hand tools

```ts
interface CapsuleCutout extends BaseCutout {
  type: "capsule"

  width: number
  height: number
}
```

Example:

```text
10 × 28 mm
```

### Rounded rectangle

Useful for:

* USB drives
* electronics
* small cases
* rectangular tools
* batteries

```ts
interface RoundedRectCutout extends BaseCutout {
  type: "rounded-rect"

  width: number
  height: number
  radius: number
}
```

### Rectangle

```ts
interface RectangleCutout extends BaseCutout {
  type: "rectangle"

  width: number
  height: number
}
```

## Multiple cutouts

An insert should support any number of cutouts.

Example:

```ts
cutouts: [
  {
    type: "circle",
    diameter: 10,
    x: 13,
    y: 19
  },
  {
    type: "circle",
    diameter: 10,
    x: 25,
    y: 19
  }
]
```

This generates a two-pen insert.

The editor should allow:

```text
+ Add Cutout
```

Each cutout can then be independently moved, resized, rotated, duplicated, or removed.

## Cutout clearance

Each cutout should support a clearance offset.

```ts
clearance: number
```

Example:

```text
Original pen diameter: 11.4 mm

Clearance: 0.3 mm

Generated opening:
12.0 mm
```

For outlines, clearance expands the complete shape.

Suggested default:

```text
0.25 mm
```

UI:

```text
Cutout clearance

[ 0.25 mm ]
```

This should be editable per cutout or globally.

## Preset layouts

The generator should include convenient layout presets.

Examples:

```text
Single circle

2 circles

3 circles

4 circles

Single capsule

2 capsules

Rounded rectangle

Circle + capsule

Mixed circles
```

Example preset:

```ts
const doublePenPreset = [
  {
    type: "circle",
    diameter: 10,
    x: 13,
    y: 19
  },
  {
    type: "circle",
    diameter: 10,
    x: 25,
    y: 19
  }
]
```

Presets should simply populate the cutout editor.

After selecting a preset, all shapes remain editable.
