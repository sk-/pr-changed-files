import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

function runAction(results: string[] | Error): {
  status: number;
  output: string;
} {
  const actionPath = path.join(__dirname, '..', 'lib', 'src', 'main.js');
  const prPath = path.join(__dirname, '..', 'lib', 'src', 'pr.js');
  const mockModified =
    results instanceof Error
      ? `{ throw new Error("error")}`
      : JSON.stringify(results);
  try {
    const result = cp.execFileSync(
      process.execPath,
      [
        '-e',
        `
        const pr = require("${prPath}");
        pr.modifiedFiles = () => ${mockModified};
        require("${actionPath}");
        `,
      ],
      {
        env: process.env,
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

test('file with spaces', async () => {
  expect(runAction(['a b.js', 'b c.txt', 'valid.js'])).toEqual({
    status: 1,
    output: `::group::Modified Files
a b.js b c.txt valid.js
::endgroup::
::error::Cannot work with files with spaces.%0AOffending files: "a b.js" "b c.txt"
`,
  });
});

test('not a pr', async () => {
  expect(runAction(new Error('error'))).toEqual({
    status: 0,
    output: expect.stringMatching(`Not a Pull Request: getting all files
::group::Modified Files
.* action.yml .* package.json .*
::endgroup::

::set-output name=files::.* action.yml .* package.json .*
`),
  });
});
