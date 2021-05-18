const mockExec = jest.fn();
jest.mock('child_process', () => ({
  execFileSync: mockExec,
}));

import * as github from '@actions/github';
import * as git from '../src/git';

beforeAll(() => {
  process.env.GITHUB_REPOSITORY = 'owner/repo';
  github.context.payload = {};
});

describe('getFiles', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('fully defined PR', () => {
    github.context.payload = {
      pull_request: {
        number: 3141,
        base: { ref: 'main', sha: '0000' },
      },
    };
    mockExec.mockReturnValue(
      Buffer.from('A\tc1.js\nR100\taa.txt\ta1.txt\nM\tb1.py\nD\tdeleted.txt\n')
    );
    expect(git.getFiles()).toEqual(['a1.txt', 'b1.py', 'c1.js']);
  });

  test('missing PR data', () => {
    github.context.payload = { pull_request: { number: 3141 } };
    mockExec.mockReturnValue(Buffer.from('c2.js\na2.txt\nb2.py\n'));
    expect(git.getFiles()).toEqual(['a2.txt', 'b2.py', 'c2.js']);
  });

  test('not a PR', () => {
    mockExec.mockReturnValue(Buffer.from('c3.js\na3.txt\nb3.py\n'));
    expect(git.getFiles()).toEqual(['a3.txt', 'b3.py', 'c3.js']);
  });
});
