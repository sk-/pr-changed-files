<p align="center">
  <a href="https://github.com/pr-changed-files/workflows"><img alt="pr-changed-files status" src="https://github.com/sk-/pr-changed-files/workflows/build-test/badge.svg"></a>
</p>

# Pr Changed Files Action

An action that returns the changed files that ar still existing in the repo.
For Pull Requests it uses the Github Rest API, for any other type of event it will list of all the git tracked files.

## Usage

Add the following step to your workflow:

```yml
    steps:
      - name: Changed Files
        id: changed-files
        uses: sk-/pr-changed-files
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: List Modified Files
        run: 'ls -lh ${{ steps.changed-files.outputs.files }}'
```
