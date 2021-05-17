import * as core from '@actions/core';
import * as git from './git';
import * as pr from './pr';

async function run(): Promise<void> {
  try {
    const files = await getFiles();
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
        `Cannot work with files with spaces.\nOffending files: ${fileDetails}`
      );
    } else {
      core.setOutput('files', files.join(' '));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function getFiles(): Promise<string[]> {
  try {
    return await pr.modifiedFiles();
  } catch (error) {
    // Trying below
  }
  try {
    core.info('Not a Pull Request: getting all files');
    return git.files();
  } catch (error) {
    throw error;
  }
}

run();
