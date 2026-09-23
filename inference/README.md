# inference

## Purpose

The production model execution layer: runtimes, optimization, quantization, batching, streaming, routing, and serving.

## Boundary

Training code must not be placed here. Does not contain the models themselves (see models/) - only the logic that executes them.

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
