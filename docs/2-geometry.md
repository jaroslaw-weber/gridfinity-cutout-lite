# Default geometry

The initial implementation should use the dimensions from the current prototypes.

```ts
const defaults = {
  width: 38,
  depth: 38,

  gridX: 1,
  gridY: 1,

  heightUnits: 3,
  gridfinityUnitHeight: 7,

  plateThickness: 2.4,

  supportThickness: 1.4,
  supportLength: 7,
  supportInset: 0
}
```

For a 3U insert:

```text
total height = 3 × 7 mm
             = 21 mm
```

The support height is:

```ts
supportHeight =
  heightUnits * gridfinityUnitHeight
  - plateThickness
```

For the default:

```text
21 - 2.4 = 18.6 mm
```
