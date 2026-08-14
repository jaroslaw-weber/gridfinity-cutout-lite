# Geometry generation

The model can be generated conceptually in three stages.

## 1. Generate plate

```text
38 × 38 × 2.4 mm
```

## 2. Subtract cutouts

All shapes are converted into 2D paths.

Those paths are then extruded through the plate.

Conceptually:

```ts
plateGeometry - cutoutGeometry
```

## 3. Add supports

Four L-shaped supports are added at the corners.

Top view:

```text
┌─┐                         ┌─┐
│ │                         │ │
└                             ┘


┌                             ┐
│ │                         │ │
└─┘                         └─┘
```

Each corner contains two perpendicular walls.

Default:

```text
wall thickness: 1.4 mm
wall length:    7 mm
edge inset:     0.8 mm
```

These supports provide stability while using much less material than solid legs.
