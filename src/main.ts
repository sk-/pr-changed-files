import * as core from '@actions/core';
import * as git from './git';

function run(): void {
  try {
    const files = git.getFiles();
    core.startGroup('Modified Files');
    core.info(files.join('\n'));
    core.endGroup();
    core.setOutput('files', files.join('\n'));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
