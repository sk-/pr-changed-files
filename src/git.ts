import * as cp from 'child_process';

export function files(): string[] {
  const response = cp.execFileSync('git', [
    'ls-tree',
    'HEAD',
    '-r',
    '--name-only',
  ]);
  return response.toString().trim().split('\n');
}
