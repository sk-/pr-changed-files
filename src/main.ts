import * as core from '@actions/core';
import * as git from './git';

function run(): void {
  try {
    const files = git.getFiles();
    core.startGroup('Modified Files');
    core.info(files.join(' '));
    core.endGroup();
    const filesWithSpaces = files.filter((f) => f.includes(' '));
    if (filesWithSpaces.length > 0) {
      const fileDetails = filesWithSpaces
        .map((f) => `"${f}"`)
        .sort()
        .join(' ');
      core.setFailed(
        `Files with spaces are not supported.\nOffending files: ${fileDetails}`
      );
    } else {
      core.setOutput('files', files.join('\0'));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
