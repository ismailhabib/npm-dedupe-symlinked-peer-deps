# npm-dedupe-symlinked-peer-deps

## Installation

```
npm install @mendix/npm-dedupe-symlinked-peer-deps
```

## Usage

Deduplicating peer-dependencies package:
```
./node_modules/.bin/npm-dedupe-symlinked-peer-deps
```

To ignore packages from being deduplicated, use the flag `--exclude` or `-e`:
```
./node_modules/.bin/npm-dedupe-symlinked-peer-deps --exclude=mobx,mobx-react
```

Reverting back:
```
./node_modules/.bin/npm-dedupe-symlinked-peer-deps --redupe
```

## Why do we need this?

When a parent project depends on a child project which has a peer-dependency, the child project doesn't need to provide the peer-dependent package on its own but instead it will be able to use the package on the parent project. This work properly with the exception when the child project is linked with the `npm link` command which is a typical setup for development. In this situation NodeJS will use a package in child project's `node_modules` folder, which means that the package is duplicated and your application might behave differently.

For more elaborate information, see this issue in npm project: https://github.com/npm/npm/issues/7742.

## How npm-dedupe-symlinked-peer-deps solve this problem?

It deduplicates peer-dependent packages by creating a symbolic link on a package provided by the parent project and the child project will refer to it instead of having its own copy of the package.
