<p align="center">
  <a href="https://github.com/pr-changed-files/workflows"><img alt="pr-changed-files status" src="https://github.com/sk-/pr-changed-files/workflows/build-test/badge.svg"></a>
</p>
# ARCHIVED
This was a good exercise, however, I ended up using [dorny/paths-filter](https://github.com/dorny/paths-filter).

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
    run: echo "${{ steps.changed-files.outputs.files }}" | xargs ls -lh
  - name: List Modified Files with spaces
    run:
      echo "${{ steps.changed-files.outputs.files }}" | tr '\n' '\0' | xargs -0
      ls -lh
```
