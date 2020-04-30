const core = require('@actions/core');
const lintAllFiles = require('./linters/all-files');
const lintAddedFiles = require('./linters/added-files');
const lintModifiedFiles = require('./linters/modified-files');
const combineByFile = require('./utils/combine-by-file');
const logOutput = require('./utils/log-output');

async function run() {
  try {
    const added = core.getInput('added').split(' ');
    const modified = core.getInput('modified').split(' ');
    const all = [...added, ...modified];

    const results = [
      ...(await lintAllFiles(all)),
      ...(await lintAddedFiles(added)),
      ...(await lintModifiedFiles(modified)),
    ];

    // Merge all results into a Object keyed by the file names.
    logOutput(combineByFile(results));
  } catch (err) {
    console.error(err);
    core.setFailed();
  }
}

run();
