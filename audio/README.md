# audio

## Purpose

Audio-specific infrastructure shared by speech systems: codecs, formats, preprocessing, augmentation, segmentation, denoising, and feature extraction.

## Boundary

Does not contain ASR/TTS model implementations - those belong under speech/. This handles the audio signal itself, not what a model does with it.

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
