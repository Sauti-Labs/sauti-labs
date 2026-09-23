# Sauti Labs

**Speech & Language Intelligence — Technical Architecture**

[![CI](https://github.com/benardabuto081/sauti-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/benardabuto081/sauti-labs/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![Status](https://img.shields.io/badge/status-active%20development-brightgreen)

[Architecture](#architecture) · [Repository](#repository-structure) · [Frameworks](#frameworks) · [Language Programs](#language-programs) · [Development](#development) · [Documentation](#documentation)

---

## Table of Contents

* [Overview](#overview)
* [Architecture](#architecture)
* [Architectural Principles](#architectural-principles)
* [System Layers](#system-layers)
* [Repository Structure](#repository-structure)
* [Frameworks](#frameworks)
* [Language Programs](#language-programs)
* [Data Flow](#data-flow)
* [Model Lifecycle](#model-lifecycle)
* [Development](#development)
* [Validation](#validation)
* [Documentation](#documentation)
* [Licensing Architecture](#licensing-architecture)
* [Contributing](#contributing)

---

## Overview

This repository contains the technical systems, research infrastructure, language programs, models, tooling, and product foundations that make up Sauti Labs.

It is organised as a **capability-oriented AI stack** rather than as a collection of independent applications.

The repository is designed to support the complete progression from language resources to usable AI systems:

```text
LANGUAGE RESOURCES
        │
        ▼
      DATA
        │
        ▼
   SPEECH & LANGUAGE AI
        │
        ▼
      MODELS
        │
        ▼
 TRAINING & EVALUATION
        │
        ▼
 INFERENCE & SERVICES
        │
        ▼
     PLATFORM
        │
        ▼
    PRODUCTS
```

The layers are supported by shared frameworks, infrastructure, tooling, research, and governance.

---

# Architecture

## System Architecture

Sauti is structured around four primary technical concerns:

```text
                         SAUTI
                           │
          SPEECH & LANGUAGE INTELLIGENCE
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     RESEARCH          TECHNOLOGY       INFRASTRUCTURE
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                        PRODUCTS
```

These are not isolated departments or code silos.

Research produces knowledge and methods.

Technology implements intelligence capabilities.

Infrastructure makes those capabilities reusable and operational.

Products consume those capabilities to create user-facing systems.

---

## System Layers

The technical stack can be viewed from the lowest-level language resources to the highest-level products.

```text
┌─────────────────────────────────────────────┐
│                  PRODUCTS                   │
├─────────────────────────────────────────────┤
│             APPLICATION SYSTEMS             │
├─────────────────────────────────────────────┤
│                SERVICES / APIs               │
├─────────────────────────────────────────────┤
│              INFERENCE / RUNTIME             │
├─────────────────────────────────────────────┤
│                   MODELS                    │
├─────────────────────────────────────────────┤
│             TRAINING / EVALUATION            │
├─────────────────────────────────────────────┤
│           SPEECH / LANGUAGE AI               │
├─────────────────────────────────────────────┤
│                DATA SYSTEMS                 │
├─────────────────────────────────────────────┤
│             LANGUAGE RESOURCES              │
└─────────────────────────────────────────────┘

     ┌──────────────┐
     │   RESEARCH   │
     └──────┬───────┘
            │
     ┌──────▼───────┐
     │  GOVERNANCE  │
     └──────┬───────┘
            │
     ┌──────▼───────┐
     │   TOOLING    │
     └──────────────┘

Supporting capabilities span the entire stack.
```

### Language Resources

The foundation of the stack.

This layer contains language-specific resources, metadata, provenance, corpus definitions, and other information required to develop systems for a particular language.

### Data Systems

Systems for representing, validating, registering, tracking, and working with datasets, corpora, speech, speakers, and annotations.

### Speech & Language AI

Reusable technical capabilities for processing language and audio.

Examples include:

* automatic speech recognition
* speech synthesis
* language processing
* multilingual systems
* speech and audio processing
* language understanding and generation

### Training & Evaluation

The systems used to train models and determine whether they actually work.

Evaluation is treated as a first-class component rather than an afterthought to model development.

### Models

Model definitions, configurations, artifacts, metadata, and model-specific systems.

Models should remain connected to the data, training process, evaluation results, and provenance that produced them.

### Inference & Runtime

The execution layer responsible for turning trained models into usable capabilities.

### Services & APIs

Interfaces through which capabilities can be consumed by internal systems, developers, or products.

### Platform

Shared systems that make Sauti's capabilities easier to discover, integrate, operate, and reuse.

### Products

User-facing systems built from the underlying capabilities.

Products should consume reusable systems rather than duplicate core AI functionality.

---

# Architectural Principles

## 1. Framework First

When a capability is expected to be reused, it should become a framework or shared system rather than remain embedded inside a single implementation.

```text
ONE-OFF IMPLEMENTATION

application
    └── custom logic


REUSABLE CAPABILITY

framework
├── schema
├── registry
├── SDK
└── validation
        │
        ├── language program
        ├── research system
        ├── service
        └── product
```

This keeps architectural guarantees consistent across the repository.

See [`docs/architecture/ADR-0001.md`](docs/architecture/ADR-0001.md).

---

## 2. Registries Are System Boundaries

Important entities are represented through explicit registries.

Examples include:

* languages
* datasets
* corpora
* speech resources
* speakers
* models
* benchmarks
* annotations
* APIs

A registry provides a machine-readable contract for what exists in the system.

The general pattern is:

```text
SCHEMA
  │
  ▼
REGISTRY
  │
  ▼
SDK / ACCESS LAYER
  │
  ▼
SYSTEMS USING THE RESOURCE
```

---

## 3. Data Has Provenance

Data is not treated as an anonymous file.

A dataset or speech resource should be traceable to information such as:

```text
SOURCE
  │
  ├── ownership
  ├── licence
  ├── provenance
  ├── collection context
  ├── permitted use
  └── transformations
          │
          ▼
       DATASET
          │
          ▼
       MODEL / SYSTEM
```

This becomes particularly important for language and speaker data.

---

## 4. Privacy by Architecture

Sensitive information should not rely solely on developer discipline.

Where possible, privacy requirements should be represented through the architecture itself.

Speaker and speech systems therefore treat privacy, provenance, and access boundaries as system concerns.

See [`docs/architecture/ADR-0002.md`](docs/architecture/ADR-0002.md).

---

## 5. Documentation Is Part of the System

Architectural decisions are recorded as ADRs.

System boundaries are documented.

Data licensing is documented.

Development conventions are documented.

> **If something matters to the system, it should be documented.**

This makes the repository understandable independently of the person who originally implemented a component.

---

# Repository Structure

The repository is organised by technical capability.

```text
sauti-labs/
│
├── audio/
├── data/
├── docs/
├── evaluation/
├── frameworks/
├── governance/
├── inference/
├── infrastructure/
├── language_ai/
├── languages/
├── models/
├── platform/
├── products/
├── research/
├── scripts/
├── services/
├── speech/
├── tooling/
├── training/
│
├── .github/
├── .vscode/
│
├── LICENSE
├── NOTICE
├── package.json
└── package-lock.json
```

---

## `languages/`

Contains language-specific programs.

Each language is treated as a program with its own resources, data, and development trajectory while consuming shared infrastructure from the rest of the repository.

Current language programs include:

```text
languages/
├── dholuo/
└── kiswahili/
```

The language layer should answer questions such as:

* What resources exist for this language?
* Where did they come from?
* What licence governs them?
* What data is available?
* What speech resources exist?
* What models are being developed?
* What evaluation is available?
* What remains to be built?

---

## `data/`

Contains shared data infrastructure.

This is distinct from `languages/`.

`languages/` describes language-specific programs and resources.

`data/` contains the systems used to manage and work with those resources.

```text
languages/
     │
     ▼
language resources
     │
     ▼
data infrastructure
     │
     ├── datasets
     ├── corpora
     ├── speech
     ├── annotations
     └── provenance
```

---

## `audio/`

Audio-specific systems and resources.

This layer supports the speech stack independently from higher-level applications.

---

## `speech/`

Speech technology and speech-specific capabilities.

This is where reusable speech intelligence belongs rather than product-specific voice logic.

---

## `language_ai/`

Language intelligence systems.

This layer connects language resources and models to reusable language-processing capabilities.

---

## `models/`

Model systems and model metadata.

Models should be connected to the surrounding lifecycle:

```text
DATA
 │
 ▼
TRAINING
 │
 ▼
MODEL
 │
 ▼
EVALUATION
 │
 ├── pass ──► INFERENCE
 │
 └── fail ──► RESEARCH / ITERATION
```

---

## `training/`

Training infrastructure and model-development workflows.

The training layer should make model creation reproducible and connect training inputs to resulting model artifacts.

---

## `evaluation/`

Evaluation and benchmarking infrastructure.

Evaluation should provide measurable evidence about system behaviour.

```text
MODEL
  │
  ▼
BENCHMARK
  │
  ▼
RESULTS
  │
  ├── comparison
  ├── regression detection
  └── research feedback
```

---

## `inference/`

Systems for executing trained models.

Inference sits between models and the services or products that consume them.

---

## `services/`

Reusable backend services and APIs.

Services provide interfaces between underlying capabilities and higher-level systems.

---

## `platform/`

Shared platform capabilities.

This layer exists to make Sauti's technical capabilities easier to operate, integrate, and expose to other systems.

---

## `products/`

Product-specific systems.

Products sit above the reusable technical stack and should avoid embedding functionality that belongs in shared infrastructure.

---

## `frameworks/`

Reusable architectural components.

Frameworks provide the common contracts used across the repository.

The general structure is:

```text
framework/
├── schema/
├── registry/
├── sdk/
└── tests/
```

The exact structure varies by framework.

---

## `research/`

Research code, experiments, investigations, and technical work that informs the rest of the system.

Research may eventually graduate into:

```text
research
   ↓
validated method
   ↓
framework / infrastructure
   ↓
model / technology
   ↓
service
   ↓
product
```

Not every experiment needs to become production infrastructure.

---

## `infrastructure/`

Shared infrastructure supporting the repository and its technical systems.

This is distinct from the broader concept of Sauti's infrastructure architecture.

---

## `tooling/`

Developer tooling, internal utilities, and engineering support systems.

---

## `governance/`

Governance-related systems, policies, and controls.

This includes concerns such as data governance, licensing, provenance, and operational boundaries.

---

## `scripts/`

Repository automation and developer scripts.

Scripts should remain focused on repository operations rather than becoming an alternative architecture for core functionality.

---

# Frameworks

Frameworks are one of the repository's most important architectural mechanisms.

The current framework ecosystem includes components for areas such as:

```text
Language Programs
      │
Dataset Management
      │
Corpus Management
      │
Speech Resources
      │
Speaker Resources
      │
Model Management
      │
Benchmarking
      │
Annotation
      │
APIs
```

Each reusable framework is intended to establish a consistent contract around its domain.

A framework is not merely a folder containing helper functions.

The intended pattern is:

```text
JSON SCHEMA
     │
     ▼
DOMAIN REGISTRY
     │
     ▼
VALIDATION
     │
     ▼
SDK / PROGRAMMATIC ACCESS
     │
     ▼
CI ENFORCEMENT
```

This makes the architecture executable rather than purely descriptive.

---

# Language Programs

Sauti follows:

> **Multilingual by destination. Language-first by execution.**

A language program is not simply a folder containing a dataset.

It represents the complete technical progression required to develop meaningful AI capability for that language.

```text
RESOURCE DISCOVERY
       ↓
DATA ACQUISITION
       ↓
CORPUS DEVELOPMENT
       ↓
ANNOTATION
       ↓
DATASET VALIDATION
       ↓
BASELINE SYSTEMS
       ↓
EVALUATION
       ↓
MODEL DEVELOPMENT
       ↓
DEPLOYMENT
```

The shared infrastructure should make this progression increasingly repeatable.

The objective is that introducing Language 2 should not require rebuilding the architecture created for Language 1.

---

# Data Flow

A simplified data lifecycle looks like this:

```text
SOURCE
  │
  ▼
RESOURCE
  │
  ▼
PROVENANCE
  │
  ▼
DATASET / CORPUS
  │
  ▼
ANNOTATION
  │
  ▼
VALIDATION
  │
  ▼
TRAINING DATA
  │
  ▼
MODEL
```

At every stage, metadata and provenance should remain connected to the resource.

This is especially important when dealing with third-party datasets or human speech.

---

# Model Lifecycle

Models are not isolated artifacts.

The intended lifecycle is:

```text
DATA
 │
 ▼
EXPERIMENT
 │
 ▼
TRAINING
 │
 ▼
MODEL ARTIFACT
 │
 ▼
EVALUATION
 │
 ├───────────────┐
 │               │
 ▼               ▼
PASS            ITERATE
 │               │
 ▼               └──────► RESEARCH
INFERENCE
 │
 ▼
SERVICE
 │
 ▼
PRODUCT
```

Evaluation therefore forms a feedback loop into research and model development.

---

# Development

## Requirements

The repository currently uses Node.js tooling for its validation and framework infrastructure.

Install dependencies with:

```bash
npm install
```

---

## Validate the Repository

Run registry validation:

```bash
npm run validate:registries
```

Validate the licensing architecture:

```bash
node scripts/validate-licensing.js
```

Individual framework smoke tests can also be run where available.

For example:

```bash
node scripts/test-speech-registry-sdk.js
```

---

## CI

Repository validation is enforced through GitHub Actions.

The CI workflow is located at:

```text
.github/
└── workflows/
    └── ci.yml
```

The purpose of CI is not simply to check whether the code runs.

It also protects architectural guarantees such as:

* schema validity
* registry validity
* SDK behaviour
* licensing boundaries
* repository integrity

> **The architecture should be enforced by the system, not remembered by the developers.**

---

# Validation

Validation operates at several levels.

```text
                    CI
                     │
        ┌────────────┼────────────┐
        │            │            │
      SCHEMA       SDK         SYSTEM
        │            │            │
        ▼            ▼            ▼
    STRUCTURE    BEHAVIOUR    INTEGRATION
```

A valid repository therefore requires more than syntactically correct code.

The data contracts, registries, licensing boundaries, and system behaviour must also remain consistent.

---

# Documentation

Technical documentation is organised under `docs/`.

| Document                                                 | Purpose                                             |
| -------------------------------------------------------- | --------------------------------------------------- |
| [`docs/Architecture.md`](docs/Architecture.md)           | System architecture overview                        |
| [`docs/Development.md`](docs/Development.md)             | Development environment and conventions             |
| [`docs/Contributing.md`](docs/Contributing.md)           | Contribution workflow and expectations              |
| [`docs/Enhancements.md`](docs/Enhancements.md)           | Technical debt, improvements, and research findings |
| [`docs/architecture/`](docs/architecture/)               | Architectural Decision Records                      |
| [`docs/CODE_OF_CONDUCT.md`](docs/CODE_OF_CONDUCT.md)     | Community standards                                 |
| [`docs/SECURITY.md`](docs/SECURITY.md)                   | Security reporting                                  |
| [`languages/LICENSE-DATA.md`](languages/LICENSE-DATA.md) | Data licensing boundaries                           |

Architectural decisions are recorded as ADRs rather than existing only in code or discussion.

Current architectural decisions include:

```text
ADR-0001    Framework-first architecture
ADR-0002    Privacy by architecture
ADR-0003    Split licensing architecture
```

---

# Licensing Architecture

The repository deliberately separates code licensing from third-party data licensing.

```text
SAUTI CODE / INFRASTRUCTURE
        │
        └── Apache License 2.0


THIRD-PARTY DATA / CORPORA / SPEECH
        │
        └── Original source licence
```

The Apache 2.0 licence applies to the applicable Sauti code and infrastructure.

Third-party datasets, corpora, speech recordings, and other external resources retain their original licensing conditions.

See:

* [`LICENSE`](LICENSE)
* [`NOTICE`](NOTICE)
* [`languages/LICENSE-DATA.md`](languages/LICENSE-DATA.md)
* [`docs/architecture/ADR-0003.md`](docs/architecture/ADR-0003.md)

---

# Contributing

Before contributing, understand the architecture.

A contribution should answer at least one of these questions:

* What capability does this add?
* Which architectural layer does it belong to?
* Is it reusable?
* What contract does it expose?
* How is it tested?
* How is its data sourced and licensed?
* What documentation explains the design?

When a component is expected to be reused across languages, models, services, or products, consider whether it belongs in a shared framework or infrastructure layer.

See [`docs/Contributing.md`](docs/Contributing.md) before opening a contribution.

---

<div align="center">

**Research → Data → Technology → Infrastructure → Products**

*Build the capability. Document the system. Make it reusable.*

</div>
