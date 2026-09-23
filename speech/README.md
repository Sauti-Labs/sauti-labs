# speech

## Purpose

Sauti Labs' core speech intelligence domain: ASR, TTS, speaker identification, diarization, VAD, enhancement, separation, voice cloning, and voice conversion.

## Boundary

Audio-signal-level processing shared across these belongs in audio/, not here. Model training belongs in training/; model serving belongs in inference/.

## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and `docs/Enhancements.md` for
how real work is tracked as it actually happens.
