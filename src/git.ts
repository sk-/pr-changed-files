import * as cp from 'child_process';
import * as core from '@actions/core';
import * as github from '@actions/github';

export function trackedFiles(): string[] {
  const response = cp.execFileSync('git', [
    'ls-tree',
    'HEAD',
    '-r',
    '--name-only',
  ]);
  return response.toString().trim().split('\n').sort();
}

export function changedFiles(ref1: string, ref2: string): string[] {
  console.info(cp.execFileSync('git', ['log']).toString());
  cp.execFileSync('git', ['fetch', '--depth', '1', 'origin', ref1]);
  console.info(cp.execFileSync('git', ['log']).toString());
  const response = cp.execFileSync('git', [
    'diff',
    '--name-status',
    `origin/${ref1}`,
    'HEAD',
  ]);
  const lines = response.toString().trim().split('\n');
  const status = {
    MODIFIED: 'M',
    ADDED: 'A',
    RENAMED: 'R',
    DELETED: 'D',
  };
  const files = lines.map((l) => {
    const parts = l.split('\t');
    if (parts.length !== 2 && parts.length !== 3) {
      console.error(`Unexpected diff entry: '${l}'`);
      return { status: '?', file: '' };
    }
    return {
      status: parts[0][0] ?? '?',
      file: parts[parts.length - 1],
    };
  });
  return files
    .filter((f) => f.file && f.status !== status.DELETED)
    .map((f) => f.file)
    .sort();
}

export function getFiles(): string[] {
  const issue = github.context.issue;
  if (issue.number) {
    const base = github.context.payload?.pull_request?.base?.ref;
    const head = github.context.payload?.pull_request?.head?.sha;
    if (base && head) {
      core.info(`PR info base=${base} head=${head}`);
      return changedFiles(base, head);
    } else {
      core.warning(`Missing PR info base=${base} head=${head}`);
    }
  }
  core.info('Not a Pull Request: getting all files');
  return trackedFiles();
}
