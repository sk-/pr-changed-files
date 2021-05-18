import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

function runAction(results: string[] | Error): {
  status: number;
  output: string;
} {
  const actionPath = path.join(__dirname, '..', 'lib', 'src', 'main.js');
  const prPath = path.join(__dirname, '..', 'lib', 'src', 'git.js');
  const mockModified =
    results instanceof Error
      ? `{ throw new Error("unexpected error")}`
      : JSON.stringify(results);
  try {
    const result = cp.execFileSync(
      process.execPath,
      [
        '-e',
        `
        const git = require("${prPath}");
        git.getFiles = () => ${mockModified};
        require("${actionPath}");
        `,
      ],
      {
        env: { ...process.env, GITHUB_REPOSITORY: 'owner/repo' },
      }
    );
    return { status: 0, output: result.toString() };
  } catch (error) {
    return { status: error.status ?? 1, output: error.stdout.toString() };
  }
}

test('valid files', async () => {
  expect(runAction(['a.js', 'b.txt', 'c.js'])).toEqual({
    status: 0,
    output: `::group::Modified Files
a.js b.txt c.js
::endgroup::

::set-output name=files::a.js b.txt c.js
`,
  });
});

test('error', async () => {
  expect(runAction(new Error('error'))).toEqual({
    status: 1,
    output: '::error::unexpected error\n',
  });
});
