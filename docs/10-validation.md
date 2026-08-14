# Validation

The generator should warn users when geometry becomes too weak.

Example warnings:

```text
⚠ Only 1.2 mm of material remains between these cutouts.

⚠ Cutout is 0.8 mm from the outer edge.

⚠ Shape intersects a support.

⚠ Cutout extends outside the insert.
```

Suggested default minimum material thickness:

```text
2 mm
```

This should initially be a warning rather than a hard restriction.
