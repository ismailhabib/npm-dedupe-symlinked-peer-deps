#!/usr/bin/env node
import * as minimist from "minimist";
import {redupeSymlinkedPeerDeps} from "./redupe-symlinked-peer-deps";
import {dedupeSymlinkedPeerDeps} from "./dedupe-symlinked-peer-deps";
import {Options} from "./helpers";

const argv = minimist(process.argv.slice(2), {alias: {
    r: "redupe",
    e: "exclude",
    h: "help"
}});

if (argv["help"]) {
    const usage =
        `cmd {OPTIONS}

Dedupes/redupes symlinked peer-dependencies.

Options:

  -r --redupe   Reduplicates the symlinked peer-dependent packages
  -e --exclude  Excludes some package from being deduplicated. Example: dedupe-symlinked-peer-deps -e=mobx,mobx-react
  -h --help     Show this message.
`;

    console.log(usage);
    process.exit(0);
}

const excludes = argv["exclude"] ? argv["exclude"].split(",") : [];

const options: Options = {
    excludes: excludes
};

if (argv["redupe"]) {
    redupeSymlinkedPeerDeps();
} else {
    dedupeSymlinkedPeerDeps(options);
}