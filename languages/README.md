# languages

## Purpose

The multilingual control plane. Answers what languages Sauti Labs supports, their families, scripts, available resources, capabilities, datasets, and models.

## Boundary

Does not contain the actual datasets/corpora (see data/) or trained models (see models/) - only the registry and profile metadata connecting a language to those resources. Existing real content in languages/dholuo/ and languages/kiswahili/ is untouched in this step and will migrate in a later, separately authorized step.

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
