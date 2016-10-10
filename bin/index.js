#!/usr/bin/env node
"use strict";
var minimist = require("minimist");
var redupe_symlinked_peer_deps_1 = require("./redupe-symlinked-peer-deps");
var dedupe_symlinked_peer_deps_1 = require("./dedupe-symlinked-peer-deps");
var argv = minimist(process.argv.slice(2));
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
