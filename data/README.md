# data

## Purpose

The complete data lifecycle: ingestion, processing, annotation, quality, validation, provenance, and licensing, from raw source through to a trained-model-ready dataset.

## Boundary

Large datasets and audio must not be committed directly to Git - this domain holds manifests, schemas, metadata, and processing code, not large binary artifacts. Data provenance and licensing are first-class, not an afterthought.

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
