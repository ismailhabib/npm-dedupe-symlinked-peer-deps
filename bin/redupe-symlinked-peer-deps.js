#!/usr/bin/env node
"use strict";
var shelljs_1 = require("shelljs");
var helpers_1 = require("./helpers");
exports.redupeSymlinkedPeerDeps = function () {
    var topLevelPackagesPath = helpers_1.getTopLevelSymlinkedPackagesPath();
    var topLevelPackagesPathAndPeerDependencies = helpers_1.getRequirements(topLevelPackagesPath);
    console.log(topLevelPackagesPathAndPeerDependencies);
    topLevelPackagesPathAndPeerDependencies.entrySeq().forEach(function (_a) {
        var path = _a[0], peerDependencies = _a[1];
        peerDependencies.entrySeq().forEach(function (_a) {
            var packageName = _a[0], version = _a[1];
            console.log("---------------------");
            console.log("npm unlink " + packageName + " on " + path);
            console.log("---------------------");
            helpers_1.executeIn(path, function () { return shelljs_1.exec("npm unlink " + packageName); });
            console.log("---------------------");
            console.log("npm install " + packageName + "@" + version + " on " + path);
            console.log("---------------------");
            helpers_1.executeIn(path, function () { return shelljs_1.exec("npm install " + packageName + "@" + version); });
        });
    });
};
