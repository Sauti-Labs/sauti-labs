# platform

## Purpose

The foundational, highly stable layer defining common primitives used across all of Sauti Labs: identifiers, shared schemas, metadata structures, resource registration conventions, configuration conventions, and API contracts.

## Boundary

Higher-level domains (languages, data, speech, models, etc.) may depend on platform/. Platform must never depend on products/, services/, or any specific product feature.

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
