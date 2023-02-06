# changelogithub

**This is forked from [changelogithub](https://github.com/antfu/changelogithub) and modified for our use.**

[![NPM version](https://img.shields.io/npm/v/@jict/changelogithub?color=a1b858&label=@jict/changelogithub)](https://www.npmjs.com/package/@jict/changelogithub)

Generate changelog for GitHub releases from [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), powered by [changelogen](https://github.com/unjs/changelogen).

[👉 Changelog example](https://github.com/unocss/unocss/releases/tag/v0.39.0)

## Features

- Pull requests based changelog generation
- Support exclamation mark as breaking change, e.g. `chore!: drop node v10`
- Grouped scope in changelog
- Create the release note, or update the existing one
- List contributors

## Usage

In GitHub Actions:

```yml
# .github/workflows/release.yml

name: Release

permissions:
  contents: write

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set node version
        uses: actions/setup-node@v3
        with:
          node-version-file: .nvmrc

      - run: npx @jict/changelogithub
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

It will be trigged whenever you push a tag to GitHub that starts with `v`.

## Configuration

You can put a configuration file in the project root, named as `changelogithub.config.{json,ts,js,mjs,cjs}`, `.changelogithubrc` or use the `changelogithub` field in `package.json`.

## Preview Locally

```bash
npx @jict/changelogithub --dry
```

## License

[MIT](./LICENSE) License © 2023 [justInCase, Inc.](https://github.com/justincase-jp)
