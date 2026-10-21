/**
 * Tests for scripts/validate-licensing.js.
 *
 * Each case builds a throwaway repository layout in the OS temp directory,
 * copies the REAL validator script into it (the validator resolves the
 * repository root from its own location, so the copy validates the fixture),
 * runs it, and checks the exit code and output. No real language data or
 * registry is modified.
 *
 * One final case runs the validator against the real repository to prove the
 * existing Dholuo and Kiswahili programs still pass Check 1.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const REAL_ROOT = path.resolve(__dirname, '..');
const VALIDATOR_SOURCE = path.join(REAL_ROOT, 'scripts', 'validate-licensing.js');

const fixtureRoots = [];

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
  console.log(`  PASS: ${message}`);
}

function writeFile(root, relPath, content) {
  const full = path.join(root, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

function makeDir(root, relPath) {
  fs.mkdirSync(path.join(root, relPath), { recursive: true });
}

function writeJson(root, relPath, data) {
  writeFile(root, relPath, JSON.stringify(data, null, 2));
}

/**
 * Builds a minimal valid fixture repository: empty-but-well-formed registries
 * and a languages/ directory. Optional overrides let a case supply its own
 * registry contents.
 */
function createFixture({ corpusSources = [], speechSources = [], datasets = [] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sauti-licensing-test-'));
  fixtureRoots.push(root);
  makeDir(root, 'languages');
  writeJson(root, 'frameworks/corpus-registry/registry/sources.json', { sources: corpusSources });
  writeJson(root, 'frameworks/speech-registry/registry/sources.json', { sources: speechSources });
  writeJson(root, 'frameworks/dataset-framework/registry/datasets.json', { datasets });
  writeFile(root, 'scripts/validate-licensing.js', fs.readFileSync(VALIDATOR_SOURCE, 'utf8'));
  return root;
}

function addProgram(root, name, { withNotice }) {
  writeJson(root, `languages/${name}/language.meta.json`, { language_name: name });
  if (withNotice) {
    writeFile(root, `languages/${name}/NOTICE.md`, '# Licensing & Provenance Notice\n');
  }
}

function runValidator(root) {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts', 'validate-licensing.js')], {
    encoding: 'utf8'
  });
  return {
    code: result.status,
    output: `${result.stdout}\n${result.stderr}`
  };
}

function cleanup() {
  for (const root of fixtureRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  console.log('Cleanup complete: temporary fixtures removed.');
}

try {
  console.log('Test 1: language program with language.meta.json and NOTICE.md passes');
  {
    const root = createFixture();
    addProgram(root, 'alpha', { withNotice: true });
    const r = runValidator(root);
    assert(r.code === 0, 'validator exits 0');
    assert(r.output.includes('languages/alpha/NOTICE.md exists'), 'reports the notice as present');
  }

  console.log('Test 2: language program with language.meta.json but no NOTICE.md fails');
  {
    const root = createFixture();
    addProgram(root, 'alpha', { withNotice: false });
    const r = runValidator(root);
    assert(r.code === 1, 'validator exits 1');
    assert(r.output.includes('languages/alpha/NOTICE.md is MISSING'), 'names the affected directory');
  }

  for (const [n, sub] of [[3, 'corpus'], [4, 'speech'], [5, 'lexicon'], [6, 'benchmarks']]) {
    console.log(`Test ${n}: directory containing ${sub}/ but no language.meta.json fails`);
    const root = createFixture();
    makeDir(root, `languages/unmarked/${sub}`);
    const r = runValidator(root);
    assert(r.code === 1, 'validator exits 1');
    assert(r.output.includes('languages/unmarked/ appears to contain language-program data'), 'explains the directory looks like an unmarked program');
    assert(r.output.includes(`${sub}/`), `mentions the ${sub}/ indicator`);
    assert(r.output.includes('language.meta.json'), 'mentions the missing language.meta.json marker');
  }

  console.log('Test 7: shared-infrastructure directory (no marker, no indicators) is skipped');
  {
    const root = createFixture();
    writeFile(root, 'languages/shared-infra/README.md', '# scaffold\n');
    const r = runValidator(root);
    assert(r.code === 0, 'validator exits 0');
    assert(r.output.includes('SKIP: languages/shared-infra/'), 'reports the directory as skipped');
    assert(!fs.existsSync(path.join(root, 'languages', 'shared-infra', 'NOTICE.md')), 'no NOTICE.md was required or created');
  }

  console.log('Test 8: existing Dholuo and Kiswahili programs still pass Check 1 in the real repository');
  {
    const r = runValidator(REAL_ROOT);
    assert(r.output.includes('PASS: languages/dholuo/NOTICE.md exists'), 'Dholuo passes');
    assert(r.output.includes('PASS: languages/kiswahili/NOTICE.md exists'), 'Kiswahili passes');
    assert(!r.output.includes('is MISSING'), 'no missing-notice errors in the real repository');
    assert(r.code === 0, 'validator exits 0 on the real repository');
  }

  console.log('Test 9a: Check 2 still fails for a "licensed" corpus source with empty license_details');
  {
    const root = createFixture({
      corpusSources: [{ source_id: 'bad-corpus', copyright_status: 'licensed', license_details: '   ' }]
    });
    const r = runValidator(root);
    assert(r.code === 1, 'validator exits 1');
    assert(r.output.includes('bad-corpus: copyright_status is "licensed" but license_details is empty'), 'reports the corpus source');
  }

  console.log('Test 9b: Check 2b still fails for a "licensed" speech source with empty license_details');
  {
    const root = createFixture({
      speechSources: [{ source_id: 'bad-speech', copyright_status: 'licensed', license_details: '' }]
    });
    const r = runValidator(root);
    assert(r.code === 1, 'validator exits 1');
    assert(r.output.includes('bad-speech: copyright_status is "licensed" but license_details is empty'), 'reports the speech source');
  }

  console.log('Test 9c: Check 3 still fails when an unresolved source is linked to a READY dataset');
  {
    const root = createFixture({
      corpusSources: [{ source_id: 'unresolved-src', copyright_status: 'unknown_pending_review', linked_dataset_ids: ['ready-ds'] }],
      datasets: [{ dataset_id: 'ready-ds', status: 'ready' }]
    });
    const r = runValidator(root);
    assert(r.code === 1, 'validator exits 1');
    assert(r.output.includes('unresolved-src') && r.output.includes('READY dataset'), 'reports the unresolved source');
  }

  console.log('Test 9d: Checks 2, 2b and 3 still pass on valid data');
  {
    const root = createFixture({
      corpusSources: [
        { source_id: 'ok-corpus', copyright_status: 'licensed', license_details: 'CC-BY' },
        { source_id: 'pending-src', copyright_status: 'unknown_pending_review', linked_dataset_ids: ['draft-ds'] }
      ],
      speechSources: [{ source_id: 'ok-speech', copyright_status: 'licensed', license_details: 'CC0-1.0' }],
      datasets: [{ dataset_id: 'draft-ds', status: 'draft' }]
    });
    const r = runValidator(root);
    assert(r.code === 0, 'validator exits 0');
    assert(r.output.includes('ok-corpus: has license_details'), 'Check 2 passes');
    assert(r.output.includes('ok-speech: has license_details'), 'Check 2b passes');
    assert(r.output.includes('pending-src: unresolved copyright, correctly not linked to any ready dataset'), 'Check 3 passes');
  }

  console.log('');
  console.log('All licensing validator tests passed.');
  cleanup();
  process.exit(0);
} catch (err) {
  console.error('');
  console.error('LICENSING VALIDATOR TEST FAILED:', err.message);
  cleanup();
  process.exit(1);
}
