import * as core from '@actions/core';
import * as github from '@actions/github';

export async function modifiedFiles(): Promise<string[]> {
  const octokit = github.getOctokit(core.getInput('token'));
  const issue = github.context.issue;
  const pr = {
    owner: issue.owner,
    repo: issue.repo,
    pull_number: issue.number,
  };
  if (pr.pull_number === undefined) {
    throw new Error('Not in a Pull Request');
  }
  core.info(`Processing PR # ${pr.pull_number}`);
  octokit.rest.pulls.listFiles(pr);
  const response = await octokit.paginate(octokit.rest.pulls.listFiles, pr);
  const files = response
    .filter((r) => r.status !== 'removed')
    .map((r) => r.filename);
  return files;
}
