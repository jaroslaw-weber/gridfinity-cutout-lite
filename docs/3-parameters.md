# Main parameters

The UI should expose a small number of important parameters.

```ts
interface InsertParameters {
  gridX: number
  gridY: number

  width: number
  depth: number

  heightUnits: number
  plateThickness: number

  supportThickness: number
  supportLength: number
  supportInset: number

  cutouts: CutoutShape[]
}
```

In normal usage, the user should mainly need:

```text
Grid size
Height
Cutout shape
Cutout size
Cutout position
Cutout rotation
```

Advanced support dimensions can live under an **Advanced** section.

## Grid size

Default:

```text
1 × 1
```

A 1×1 insert should currently use:

```text
38 × 38 mm
```

Future larger inserts can scale from the Gridfinity 42 mm grid pitch.

For example:

```ts
function insertDimension(units: number) {
  return units * 42 - 4
}
```

This would produce approximately:

```text
1×1 = 38 mm
1×2 = 80 mm
1×3 = 122 mm
2×2 = 80 × 80 mm
```

This formula should remain configurable while compatibility is being tested against different Gridfinity bins.

## Positioning

All shapes should use millimeter coordinates.

The origin should preferably be the center of the insert.

Example:

```text
X: 0 mm
Y: 0 mm
```

means centered.

This makes positioning easier than using coordinates from the lower-left corner.

For a 38×38 mm insert:

```text
x = -19 → 19
y = -19 → 19
```
