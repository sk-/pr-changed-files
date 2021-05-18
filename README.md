<p align="center">
  <a href="https://github.com/pr-changed-files/workflows"><img alt="pr-changed-files status" src="https://github.com/sk-/pr-changed-files/workflows/build-test/badge.svg"></a>
</p>

# Pr Changed Files Action

An action that returns the changed files that are still present in the repo,
i.e. removed files are not reported. For Pull Requests it will compare the base
branch against the current state, for any other type of events it will list of
all the git tracked files.

## Usage

Add the following step to your workflow:

```yml
steps:
  - name: Changed Files
    id: changed-files
    uses: sk-/pr-changed-files
  - name: List Modified Files
    run: 'ls -lh ${{ steps.changed-files.outputs.files }}'
```
