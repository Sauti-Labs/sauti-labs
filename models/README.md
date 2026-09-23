# models

## Purpose

Model definitions and model lifecycle metadata - what models exist, their architecture family, and registry information.

## Boundary

Training happens in training/. Serving/execution happens in inference/. Measurement happens in evaluation/. Do not collapse these responsibilities here. Large model checkpoints are not committed to Git without deliberate reason.

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
