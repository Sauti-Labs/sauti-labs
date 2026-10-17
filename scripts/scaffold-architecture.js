/**
 * Master Domain Scaffolding Generator — Step 1 of the architecture migration.
 *
 * Creates the 16 top-level domains and their agreed subdirectories per the
 * Sauti Labs Master Monorepo Architecture Specification, each with a
 * README.md documenting Purpose, Boundary, and Status.
 *
 * This script creates ONLY new architectural boundaries. It does not touch
 * frameworks/, docs/, .github/, scripts/, or the existing languages/dholuo
 * and languages/kiswahili directories.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

const STATUS_TEXT = `## Status

This is an architectural scaffold. This directory currently contains no
implementation. Its existence defines an intended ownership boundary within
the Sauti Labs master architecture; it does not imply that this capability
has been built. See the AI CTO Constitution and \`docs/Enhancements.md\` for
how real work is tracked as it actually happens.`;

function readme(title, purpose, boundary) {
  return `# ${title}\n\n## Purpose\n\n${purpose}\n\n## Boundary\n\n${boundary}\n\n${STATUS_TEXT}\n`;
}

const tree = {
  platform: {
    purpose: 'The foundational, highly stable layer defining common primitives used across all of Sauti Labs: identifiers, shared schemas, metadata structures, resource registration conventions, configuration conventions, and API contracts.',
    boundary: 'Higher-level domains (languages, data, speech, models, etc.) may depend on platform/. Platform must never depend on products/, services/, or any specific product feature.',
    children: {
      core: { purpose: 'Core shared primitives and conventions used throughout the platform.', boundary: 'No domain-specific logic (e.g. no ASR code, no dataset-specific handling).' },
      schemas: { purpose: 'Shared JSON Schema / contract definitions used across multiple domains.', boundary: 'Domain-specific schemas belong inside their owning domain, not here.' },
      contracts: { purpose: 'API and interface contracts shared across services and SDKs.', boundary: 'Actual service implementations belong in services/, not here.' },
      registry: { purpose: 'Shared registry primitives/patterns reused by domain-specific registries.', boundary: 'Actual populated registries (models, datasets, etc.) live in their own domains.' },
      metadata: { purpose: 'Shared metadata structures and conventions.', boundary: 'Domain-specific metadata schemas belong in their owning domain.' },
      configuration: { purpose: 'Shared configuration conventions and primitives.', boundary: 'Environment-specific or deployment configuration belongs in infrastructure/.' },
      sdk: { purpose: 'Shared SDK functionality reused across multiple domain-specific SDKs.', boundary: 'Domain-specific SDKs (e.g. for a single framework) remain in their own domain until/unless promoted here.' }
    }
  },
  languages: {
    purpose: 'The multilingual control plane. Answers what languages Sauti Labs supports, their families, scripts, available resources, capabilities, datasets, and models.',
    boundary: 'Does not contain the actual datasets/corpora (see data/) or trained models (see models/) - only the registry and profile metadata connecting a language to those resources. Existing real content in languages/dholuo/ and languages/kiswahili/ is untouched in this step and will migrate in a later, separately authorized step.',
    children: {
      registry: { purpose: 'Authoritative language registry metadata: languages.yaml, families.yaml, regions.yaml.', boundary: 'Per-language detail belongs in profiles/, not here.' },
      profiles: { purpose: 'Per-language profiles (e.g. profiles/dholuo/) covering orthography, phonology, normalization, and resource pointers.', boundary: 'Does not duplicate the full technology stack per language - only language-specific configuration and metadata.' },
      resources: { purpose: 'Pointers to language-specific linguistic resources.', boundary: 'Raw corpora/datasets live in data/, not here.' },
      phonology: { purpose: 'Shared phonological processing resources and conventions across languages.', boundary: 'Per-language phonology detail belongs in profiles/<language>/.' },
      orthography: { purpose: 'Shared orthography/writing-system processing resources.', boundary: 'Per-language orthography detail belongs in profiles/<language>/.' },
      normalization: { purpose: 'Shared text/speech normalization logic across languages.', boundary: 'Per-language normalization rules belong in profiles/<language>/.' },
      tokenization: { purpose: 'Shared tokenization resources and conventions.', boundary: 'Per-language tokenizer configuration belongs in profiles/<language>/.' },
      multilingual: { purpose: 'Cross-language resources spanning more than one language (e.g. parallel corpora metadata, transfer-learning configuration).', boundary: 'Single-language resources belong in profiles/ or resources/.' }
    }
  },
  data: {
    purpose: 'The complete data lifecycle: ingestion, processing, annotation, quality, validation, provenance, and licensing, from raw source through to a trained-model-ready dataset.',
    boundary: 'Large datasets and audio must not be committed directly to Git - this domain holds manifests, schemas, metadata, and processing code, not large binary artifacts. Data provenance and licensing are first-class, not an afterthought.',
    children: {
      ingestion: { purpose: 'Source acquisition logic - pulling raw material from external sources into the platform.', boundary: 'Does not include processing/transformation logic (see processing/).' },
      connectors: { purpose: 'Reusable connectors to specific external data sources/platforms.', boundary: 'One-off acquisition scripts for a single dataset belong in tooling/data/, not here.' },
      corpora: { purpose: 'Raw and lightly-processed language corpora, organized by language.', boundary: 'Fully processed, versioned, training-ready datasets belong in datasets/.' },
      datasets: {
        purpose: 'Versioned, training-ready datasets with manifests describing their contents and splits.',
        boundary: 'Raw, unprocessed source material belongs in corpora/, not here.',
        children: {
          manifests: { purpose: 'Dataset manifest files describing contents, provenance, and structure.', boundary: 'The actual dataset content/files are not stored here - only the manifest describing them.' },
          versions: { purpose: 'Version history and version-specific metadata for datasets.', boundary: 'Does not contain the dataset content itself.' },
          splits: { purpose: 'Train/validation/test split definitions.', boundary: 'Does not contain the underlying data, only split definitions.' }
        }
      },
      processing: { purpose: 'Data transformation and processing pipelines.', boundary: 'Raw ingestion belongs in ingestion/; annotation-specific processing belongs in annotation/.' },
      annotation: { purpose: 'Annotation infrastructure - tasks, records, and annotation pipelines.', boundary: 'Model training that consumes annotated data belongs in training/, not here.' },
      quality: { purpose: 'Data quality measurement and quality-control logic.', boundary: 'Model evaluation belongs in evaluation/, not here - this is about data quality specifically.' },
      validation: { purpose: 'Data validation logic and schema conformance checks.', boundary: 'Model validation/evaluation belongs in evaluation/.' },
      provenance: { purpose: 'Source tracking and provenance records for data assets.', boundary: 'Licensing terms specifically belong in licensing/, though closely related.' },
      licensing: { purpose: 'Licensing and rights-tracking infrastructure for data assets, per the Sauti Labs data governance principles.', boundary: 'Code/infrastructure licensing (Apache 2.0) belongs in governance/licensing/, not here - this is specifically about data asset rights.' }
    }
  },
  audio: {
    purpose: 'Audio-specific infrastructure shared by speech systems: codecs, formats, preprocessing, augmentation, segmentation, denoising, and feature extraction.',
    boundary: 'Does not contain ASR/TTS model implementations - those belong under speech/. This handles the audio signal itself, not what a model does with it.',
    children: {
      codecs: { purpose: 'Audio codec handling.', boundary: 'Model architectures belong in speech/.' },
      formats: { purpose: 'Audio format conversion and handling.', boundary: 'Model architectures belong in speech/.' },
      preprocessing: { purpose: 'Audio preprocessing shared across speech systems.', boundary: 'Model-specific preprocessing belongs alongside that model in speech/.' },
      augmentation: { purpose: 'Audio data augmentation techniques.', boundary: 'Training orchestration belongs in training/.' },
      segmentation: { purpose: 'Audio segmentation logic (splitting audio into usable units).', boundary: 'Speaker diarization belongs in speech/diarization/.' },
      denoising: { purpose: 'Audio denoising/cleanup logic.', boundary: 'Model-specific speech enhancement belongs in speech/enhancement/.' },
      feature_extraction: { purpose: 'Audio feature extraction (e.g. spectrograms, MFCCs).', boundary: 'Model architectures that consume these features belong in speech/ or models/.' }
    }
  },
  speech: {
    purpose: "Sauti Labs' core speech intelligence domain: ASR, TTS, speaker identification, diarization, VAD, enhancement, separation, voice cloning, and voice conversion.",
    boundary: 'Audio-signal-level processing shared across these belongs in audio/, not here. Model training belongs in training/; model serving belongs in inference/.',
    children: {
      asr: {
        purpose: 'Automatic speech recognition.',
        boundary: 'Model weights/artifacts belong in models/speech/; training recipes belong in training/recipes/asr/.',
        children: {
          architectures: { purpose: 'ASR model architecture definitions.', boundary: 'Trained weights belong in models/speech/, not here.' },
          decoding: { purpose: 'ASR decoding logic.', boundary: 'Model architecture definitions belong in architectures/.' },
          language_adaptation: { purpose: 'Language-specific ASR adaptation logic.', boundary: 'Language metadata itself belongs in languages/profiles/.' },
          pipelines: { purpose: 'End-to-end ASR processing pipelines.', boundary: 'Production serving belongs in inference/, not here.' }
        }
      },
      tts: {
        purpose: 'Text-to-speech.',
        boundary: 'Model weights belong in models/speech/; training recipes belong in training/recipes/tts/.',
        children: {
          architectures: { purpose: 'TTS model architecture definitions.', boundary: 'Trained weights belong in models/speech/.' },
          voices: { purpose: 'Voice definitions/configuration for TTS output.', boundary: 'Voice cloning logic belongs in speech/voice_cloning/.' },
          synthesis: { purpose: 'Speech synthesis logic.', boundary: 'Model architecture belongs in architectures/.' },
          language_adaptation: { purpose: 'Language-specific TTS adaptation logic.', boundary: 'Language metadata itself belongs in languages/profiles/.' }
        }
      },
      speaker: {
        purpose: 'Speaker identification, verification, and embeddings.',
        boundary: 'This is model/algorithm logic. The speaker registry (pseudonymous speaker records, consent) will migrate into data/ in a later, separately authorized step - this directory does not hold that registry.',
        children: {
          identification: { purpose: 'Speaker identification logic.', boundary: 'Speaker records themselves belong in data/ once migrated, not here.' },
          verification: { purpose: 'Speaker verification logic.', boundary: 'Speaker records themselves belong in data/ once migrated, not here.' },
          embeddings: { purpose: 'Speaker embedding models.', boundary: 'General-purpose embeddings belong in models/embeddings/.' }
        }
      },
      diarization: { purpose: 'Determining who spoke when in multi-speaker audio.', boundary: 'Speaker identity resolution belongs in speech/speaker/.' },
      vad: { purpose: 'Voice activity detection.', boundary: 'Segmentation of confirmed speech belongs in audio/segmentation/.' },
      enhancement: { purpose: 'Speech enhancement and noise reduction at the model/algorithm level.', boundary: 'General audio denoising belongs in audio/denoising/.' },
      separation: { purpose: 'Separating overlapping speakers/sources.', boundary: 'Diarization (who spoke when, post-separation) belongs in diarization/.' },
      voice_cloning: { purpose: 'Voice replication technologies.', boundary: 'Voice conversion (transforming one voice to another) belongs in voice_conversion/.' },
      voice_conversion: { purpose: 'Transforming one voice into another.', boundary: 'Voice replication from scratch belongs in voice_cloning/.' }
    }
  },
  language_ai: {
    purpose: 'Language intelligence beyond raw speech: NLP, translation, text generation, embeddings, classification, information extraction, multilingual processing.',
    boundary: 'Speech recognition itself belongs in speech/asr/, not here - this is text/language-level intelligence.',
    children: {
      nlp: { purpose: 'General natural language processing logic.', boundary: 'Translation-specific logic belongs in translation/.' },
      translation: { purpose: 'Machine translation logic.', boundary: 'Speech-to-speech translation composition belongs in products/dubbing/ or services/translation/.' },
      text_generation: { purpose: 'Text generation logic.', boundary: 'Model weights belong in models/language/.' },
      embeddings: { purpose: 'Text/language embedding logic.', boundary: 'Speaker embeddings belong in speech/speaker/embeddings/.' },
      classification: { purpose: 'Text classification logic.', boundary: 'Audio classification belongs in audio/ or speech/.' },
      information_extraction: { purpose: 'Information extraction from text.', boundary: 'Annotation infrastructure for producing training data belongs in data/annotation/.' },
      multilingual: { purpose: 'Cross-language NLP logic.', boundary: 'Language metadata itself belongs in languages/.' },
      language_adaptation: { purpose: 'Language-specific NLP adaptation logic.', boundary: 'Language metadata itself belongs in languages/profiles/.' }
    }
  },
  models: {
    purpose: 'Model definitions and model lifecycle metadata - what models exist, their architecture family, and registry information.',
    boundary: 'Training happens in training/. Serving/execution happens in inference/. Measurement happens in evaluation/. Do not collapse these responsibilities here. Large model checkpoints are not committed to Git without deliberate reason.',
    children: {
      speech: { purpose: 'Speech model artifacts and metadata.', boundary: 'Training code belongs in training/; serving belongs in inference/.' },
      language: { purpose: 'Language model artifacts and metadata.', boundary: 'Training code belongs in training/; serving belongs in inference/.' },
      multimodal: { purpose: 'Multimodal model artifacts and metadata.', boundary: 'Training code belongs in training/; serving belongs in inference/.' },
      acoustic: { purpose: 'Acoustic model artifacts and metadata.', boundary: 'Training code belongs in training/.' },
      semantic: { purpose: 'Semantic model artifacts and metadata.', boundary: 'Training code belongs in training/.' },
      embeddings: { purpose: 'General-purpose embedding model artifacts.', boundary: 'Speaker-specific embeddings belong in speech/speaker/embeddings/.' },
      codecs: { purpose: 'Learned audio/speech codec models.', boundary: 'Non-learned codec handling belongs in audio/codecs/.' },
      adapters: { purpose: 'Model adapter artifacts (e.g. for language adaptation, fine-tuning deltas).', boundary: 'Full model weights belong in the modality-specific subdirectory above.' },
      model_registry: { purpose: 'The model registry: what models exist, their metadata, and lifecycle status. This is where frameworks/model-registry/ will migrate in a later, separately authorized step.', boundary: 'This currently holds no content - existing model-registry framework code is untouched in this step.' }
    }
  },
  training: {
    purpose: 'The model production engine: recipes, pipelines, fine-tuning, distributed training, and orchestration. Consumes data + language configuration + model architecture + a training recipe, and produces model artifacts.',
    boundary: 'Must be reproducible. Does not contain the data itself (see data/) or the resulting model registry entries (see models/model_registry/).',
    children: {
      recipes: {
        purpose: 'Training recipe definitions per task type.',
        boundary: 'Actual training execution/orchestration belongs in pipelines/ or orchestration/.',
        children: {
          asr: { purpose: 'ASR training recipes.', boundary: 'Model architecture definitions belong in speech/asr/architectures/.' },
          tts: { purpose: 'TTS training recipes.', boundary: 'Model architecture definitions belong in speech/tts/architectures/.' },
          translation: { purpose: 'Translation training recipes.', boundary: 'Model architecture definitions belong in language_ai/translation/.' },
          multilingual: { purpose: 'Multilingual training recipes.', boundary: 'Language metadata itself belongs in languages/.' }
        }
      },
      pipelines: { purpose: 'Training pipeline execution logic.', boundary: 'Recipe definitions belong in recipes/.' },
      preprocessing: { purpose: 'Training-specific data preprocessing.', boundary: 'General data processing belongs in data/processing/.' },
      fine_tuning: { purpose: 'Fine-tuning specific logic.', boundary: 'Full training-from-scratch logic belongs in pipelines/.' },
      distributed: { purpose: 'Distributed training infrastructure.', boundary: 'Underlying compute infrastructure belongs in infrastructure/compute/.' },
      language_adaptation: { purpose: 'Language-adaptation-specific training logic.', boundary: 'Language metadata itself belongs in languages/profiles/.' },
      orchestration: { purpose: 'Training job orchestration.', boundary: 'Underlying infrastructure belongs in infrastructure/.' }
    }
  },
  research: {
    purpose: 'The experimental layer: experiments, hypotheses, reproductions, prototypes, ablations, notebooks, and publications. Scientific investigation happens here.',
    boundary: 'Research prototypes may be unstable. Production systems should not depend directly on arbitrary notebooks - there must be a clear path from research to validated implementation to model to evaluation to production.',
    children: {
      experiments: { purpose: 'Individual research experiments.', boundary: 'Validated, production-bound implementations belong in the relevant domain (speech/, language_ai/, etc.), not here.' },
      hypotheses: { purpose: 'Research hypotheses and questions under investigation.', boundary: 'Experiment results/logs belong in experiments/.' },
      reproductions: { purpose: 'Reproductions of external research relevant to Sauti Labs.', boundary: 'Novel Sauti Labs research belongs in experiments/.' },
      prototypes: { purpose: 'Early-stage prototype implementations.', boundary: 'Once validated, implementations move to their production domain.' },
      ablations: { purpose: 'Ablation study logic and results.', boundary: 'Full benchmark results belong in evaluation/.' },
      notebooks: { purpose: 'Research notebooks.', boundary: 'Production code must not depend directly on notebooks here.' },
      publications: { purpose: 'Research writeups and publication drafts.', boundary: 'Operational documentation belongs in docs/.' }
    }
  },
  evaluation: {
    purpose: 'The scientific and engineering measurement layer: benchmarks, metrics, harnesses, regression testing, language-aware evaluation, and reports.',
    boundary: 'Must cover model quality, language quality, speech quality, regression, latency, and multilingual performance. Does not contain the models being evaluated (see models/) or training logic (see training/).',
    children: {
      benchmarks: {
        purpose: 'Benchmark suite definitions, multilingual and language-specific.',
        boundary: 'Benchmark execution/measurement harnesses belong in harnesses/.',
        children: {
          asr: { purpose: 'ASR-specific benchmark definitions.', boundary: 'ASR model code belongs in speech/asr/.' },
          tts: { purpose: 'TTS-specific benchmark definitions.', boundary: 'TTS model code belongs in speech/tts/.' },
          translation: { purpose: 'Translation-specific benchmark definitions.', boundary: 'Translation model code belongs in language_ai/translation/.' },
          multilingual: { purpose: 'Cross-language benchmark definitions.', boundary: 'Language metadata itself belongs in languages/.' }
        }
      },
      metrics: { purpose: 'Metric calculation logic (WER, CER, BLEU, MOS, etc.).', boundary: 'Benchmark suite definitions belong in benchmarks/.' },
      harnesses: { purpose: 'Evaluation execution harnesses.', boundary: 'Metric definitions themselves belong in metrics/.' },
      regression: { purpose: 'Regression testing to catch quality degradation over time.', boundary: 'One-off benchmark runs belong in benchmarks/ and harnesses/.' },
      language: { purpose: 'Language-specific evaluation considerations.', boundary: 'Language metadata itself belongs in languages/.' },
      reports: { purpose: 'Evaluation result reports.', boundary: 'Raw benchmark result data belongs alongside the benchmark-framework migration target here once authorized.' }
    }
  },
  inference: {
    purpose: 'The production model execution layer: runtimes, optimization, quantization, batching, streaming, routing, and serving.',
    boundary: 'Training code must not be placed here. Does not contain the models themselves (see models/) - only the logic that executes them.',
    children: {
      runtimes: { purpose: 'Inference runtime implementations.', boundary: 'Model weights belong in models/.' },
      optimization: { purpose: 'Inference-time model optimization logic.', boundary: 'Training-time optimization belongs in training/.' },
      quantization: { purpose: 'Model quantization logic.', boundary: 'Training-time logic belongs in training/.' },
      batching: { purpose: 'Request batching logic for inference.', boundary: 'Service-level request handling belongs in services/.' },
      streaming: { purpose: 'Streaming inference logic.', boundary: 'Streaming API endpoints belong in services/realtime/.' },
      routing: { purpose: 'Inference request routing logic.', boundary: 'Service-level orchestration belongs in services/orchestration/.' },
      serving: { purpose: 'Model serving infrastructure.', boundary: 'Underlying compute infrastructure belongs in infrastructure/.' }
    }
  },
  services: {
    purpose: 'Infrastructure exposed as running services, consuming inference and platform capabilities. This is where frameworks/api-framework/ will migrate in a later, separately authorized step.',
    boundary: 'A service is not itself a model. Model logic belongs in models/, speech/, or language_ai/; execution belongs in inference/.',
    children: {
      api: { purpose: 'API service definitions - the eventual home of the api-framework registry and SDK.', boundary: 'This currently holds no content - existing api-framework code is untouched in this step.' },
      realtime: { purpose: 'Real-time/streaming service endpoints.', boundary: 'Underlying streaming inference logic belongs in inference/streaming/.' },
      transcription: { purpose: 'Transcription service composition.', boundary: 'ASR model logic belongs in speech/asr/.' },
      translation: { purpose: 'Translation service composition.', boundary: 'Translation model logic belongs in language_ai/translation/.' },
      speech: { purpose: 'General speech service composition.', boundary: 'Speech model logic belongs in speech/.' },
      orchestration: { purpose: 'Service-level orchestration across multiple capabilities.', boundary: 'Training orchestration belongs in training/orchestration/.' },
      internal: { purpose: 'Internal-only services not exposed externally.', boundary: 'Externally-facing services belong in the other services/ subdirectories.' }
    }
  },
  products: {
    purpose: 'User-facing compositions of Sauti capabilities: transcription, translation, dubbing, voice, speech agents, and the developer platform.',
    boundary: 'Products should not contain duplicated ML infrastructure - they compose lower-level capabilities from speech/, language_ai/, services/, and inference/.',
    children: {
      transcription: { purpose: 'The transcription product.', boundary: 'Underlying ASR logic belongs in speech/asr/; service composition belongs in services/transcription/.' },
      translation: { purpose: 'The translation product.', boundary: 'Underlying translation logic belongs in language_ai/translation/.' },
      dubbing: { purpose: 'The dubbing product (composes ASR + translation + TTS + voice).', boundary: 'Individual capability logic belongs in speech/ and language_ai/, not here.' },
      voice: { purpose: 'Voice-focused product features.', boundary: 'Underlying TTS/voice logic belongs in speech/.' },
      speech_agents: { purpose: 'Conversational speech agent products.', boundary: 'Underlying model logic belongs in speech/ and language_ai/.' },
      developer_platform: { purpose: 'The developer-facing platform product.', boundary: 'Underlying API/SDK infrastructure belongs in platform/sdk/ and services/api/.' }
    }
  },
  infrastructure: {
    purpose: 'The physical/cloud execution environment: cloud resources, compute, GPU, storage, databases, Kubernetes, networking, and observability.',
    boundary: 'This domain enables other domains to run - it does not contain application logic itself.',
    children: {
      cloud: { purpose: 'Cloud provider configuration and resources.', boundary: 'Application-level deployment configuration belongs alongside the relevant service.' },
      compute: { purpose: 'General compute resource configuration.', boundary: 'GPU-specific configuration belongs in gpu/.' },
      gpu: { purpose: 'GPU infrastructure configuration.', boundary: 'General compute belongs in compute/.' },
      storage: { purpose: 'Storage infrastructure configuration.', boundary: 'Data schemas/manifests belong in data/, not here - this is the underlying storage layer.' },
      databases: { purpose: 'Database infrastructure configuration.', boundary: 'Application-level data models belong in the relevant domain.' },
      kubernetes: { purpose: 'Kubernetes configuration and manifests.', boundary: 'Application code itself belongs in the relevant domain.' },
      networking: { purpose: 'Networking infrastructure configuration.', boundary: 'API contracts belong in platform/contracts/.' },
      observability: { purpose: 'Monitoring, logging, and observability infrastructure.', boundary: 'Application-level logging logic may live alongside the relevant service, with shared conventions here.' }
    }
  },
  tooling: {
    purpose: 'Developer and engineering tooling: CLI, developer bootstrap, data tooling, training utilities, evaluation runners, and release tooling. This is the eventual home of scripts/ content once migrated.',
    boundary: 'Tooling should make engineers faster - it is not application logic. Existing scripts/ directory is untouched in this step.',
    children: {
      cli: { purpose: 'The Sauti Labs CLI, if/when one is built.', boundary: 'No CLI currently exists.' },
      developer: { purpose: 'Developer bootstrap and productivity tooling.', boundary: 'Onboarding documentation belongs in docs/onboarding/.' },
      data: { purpose: 'Data acquisition and processing tooling - the eventual home of scripts like fetch-storybook-corpus.js.', boundary: 'This currently holds no content - existing scripts/ is untouched in this step.' },
      training: { purpose: 'Training utility tooling.', boundary: 'Training recipes themselves belong in training/recipes/.' },
      evaluation: { purpose: 'Evaluation runner tooling.', boundary: 'Benchmark definitions themselves belong in evaluation/benchmarks/.' },
      release: { purpose: 'Release tooling - the eventual home of scripts like validate-registries.js and validate-licensing.js.', boundary: 'This currently holds no content - existing scripts/ is untouched in this step.' }
    }
  },
  governance: {
    purpose: 'Technology governance: licensing, data governance, provenance, security, privacy, and policies. Especially important given Sauti Labs works with human speech, datasets, language communities, and third-party licensed resources.',
    boundary: 'This is governance and policy - not the systems being governed. governance/privacy/ specifically covers privacy, consent, retention, and access-control rules; it is not the speaker registry itself, which will migrate into data/ in a later, separately authorized step.',
    children: {
      licensing: { purpose: 'Code/infrastructure licensing governance - the eventual home of the split-licensing architecture (ADR-0003, LICENSE, NOTICE reasoning).', boundary: 'The root LICENSE and NOTICE files themselves remain at the repository root, not here, since GitHub license detection requires this.' },
      data_governance: { purpose: 'Data governance principles and rules - e.g. the restriction/redistribution/investigation rules established for the Dholuo Resource Census.', boundary: 'Individual source rights tracking belongs in data/provenance/ and data/licensing/.' },
      provenance: { purpose: 'Provenance governance principles (distinct from data/provenance/, which tracks actual per-source provenance records).', boundary: 'Actual per-source provenance records belong in data/provenance/.' },
      security: { purpose: 'Security policy - the eventual home of SECURITY.md reasoning.', boundary: 'The actual SECURITY.md file remains in docs/ for GitHub community-standards detection.' },
      privacy: { purpose: 'Privacy, consent, retention, and access-control governance rules, per ADR-0002\'s privacy-by-architecture principle.', boundary: 'This is governance and policy, not the speaker registry itself - the speaker-registry framework (actual pseudonymous speaker records and consent data) will migrate into data/ in a later, separately authorized step.' },
      policies: { purpose: 'General organizational policies.', boundary: 'Code of conduct remains in docs/ for GitHub community-standards detection.' }
    }
  }
};

let created = 0;

function build(nodeName, nodeData, currentPath, parentTitle) {
  const dirPath = path.join(currentPath, nodeName);
  fs.mkdirSync(dirPath, { recursive: true });

  const title = parentTitle ? `${parentTitle} / ${nodeName}` : nodeName;
  const content = readme(title, nodeData.purpose, nodeData.boundary);
  fs.writeFileSync(path.join(dirPath, 'README.md'), content, 'utf8');
  created++;

  if (nodeData.children) {
    for (const [childName, childData] of Object.entries(nodeData.children)) {
      build(childName, childData, dirPath, title);
    }
  }
}

for (const [domainName, domainData] of Object.entries(tree)) {
  build(domainName, domainData, REPO_ROOT, null);
}

console.log(`Scaffold complete. ${created} directories created, each with a README.md.`);