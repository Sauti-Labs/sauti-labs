# training

## Purpose

The model production engine: recipes, pipelines, fine-tuning, distributed training, and orchestration. Consumes data + language configuration + model architecture + a training recipe, and produces model artifacts.

## Boundary

Must be reproducible. Does not contain the data itself (see data/) or the resulting model registry entries (see models/model_registry/).

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
