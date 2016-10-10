#!/usr/bin/env node
import * as minimist from "minimist";
import {redupeSymlinkedPeerDeps} from "./redupe-symlinked-peer-deps";
import {dedupeSymlinkedPeerDeps} from "./dedupe-symlinked-peer-deps";
import {Options} from "./helpers";

const argv = minimist(process.argv.slice(2));

const excludes = argv["exclude"]?argv["exclude"].split(","):[];
const options: Options = {
    excludes: excludes
};

if (argv["redupe"]) {
    redupeSymlinkedPeerDeps();
} else {
    dedupeSymlinkedPeerDeps(options);
}