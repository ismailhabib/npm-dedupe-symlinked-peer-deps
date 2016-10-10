#!/usr/bin/env node
"use strict";
var minimist = require("minimist");
var redupe_symlinked_peer_deps_1 = require("./redupe-symlinked-peer-deps");
var dedupe_symlinked_peer_deps_1 = require("./dedupe-symlinked-peer-deps");
var argv = minimist(process.argv.slice(2), { alias: {
        r: "redupe",
        e: "exclude",
        h: "help"
    } });
if (argv["help"]) {
    var usage = "cmd {OPTIONS}\n\nDedupes/redupes symlinked peer-dependencies.\n\nOptions:\n\n  -r --redupe   Reduplicates the symlinked peer-dependent packages\n  -e --exclude  Excludes some package from being deduplicated. Example: dedupe-symlinked-peer-deps -e=mobx,mobx-react\n  -h --help     Show this message.\n";
    console.log(usage);
    process.exit(0);
}
var excludes = argv["exclude"] ? argv["exclude"].split(",") : [];
var options = {
    excludes: excludes
};
if (argv["redupe"]) {
    redupe_symlinked_peer_deps_1.redupeSymlinkedPeerDeps();
}
else {
    dedupe_symlinked_peer_deps_1.dedupeSymlinkedPeerDeps(options);
}
