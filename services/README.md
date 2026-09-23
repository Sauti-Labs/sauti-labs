# services

## Purpose

Infrastructure exposed as running services, consuming inference and platform capabilities. This is where frameworks/api-framework/ will migrate in a later, separately authorized step.

## Boundary

A service is not itself a model. Model logic belongs in models/, speech/, or language_ai/; execution belongs in inference/.

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
