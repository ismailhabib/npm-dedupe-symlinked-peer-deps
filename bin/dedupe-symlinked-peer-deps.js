#!/usr/bin/env node
"use strict";
var shelljs_1 = require("shelljs");
var helpers_1 = require("./helpers");
var path_1 = require("path");
var immutable_1 = require("immutable");
exports.dedupeSymlinkedPeerDeps = function (options) {
    var blackListedPackages = immutable_1.Set();
    if (options && options.excludes) {
        blackListedPackages = blackListedPackages.merge(options.excludes);
    }
    console.log("Blacklist: ", blackListedPackages);
    var symLinkedPackagesPath = helpers_1.getSymLinkedPackagesPath(".");
    console.log("SymLinked packages: ", symLinkedPackagesPath);
    var requirements = helpers_1.getRequirements(symLinkedPackagesPath);
    console.log("Requirements: ", requirements);
    var requiredPackagesName = helpers_1.getRequiredPackagesName(requirements);
    console.log("Required packages: ", requiredPackagesName);
    requiredPackagesName.filter(function (packageName) { return !blackListedPackages.includes(packageName); }).forEach(function (packageName) {
        var path = path_1.join(helpers_1.nodeModulesRelPath, packageName);
        console.log("---------------------");
        console.log("npm link on " + path);
        console.log("---------------------");
        helpers_1.executeIn(path, function () { return shelljs_1.exec("npm link"); });
    });
    requirements.entrySeq().forEach(function (_a) {
        var path = _a[0], peerDependencies = _a[1];
        peerDependencies.entrySeq().filter(function (_a) {
            var packageName = _a[0], version = _a[1];
            return !blackListedPackages.includes(packageName);
        }).forEach(function (_a) {
            var packageName = _a[0], version = _a[1];
            console.log("---------------------");
            console.log("npm link " + packageName + " on " + path);
            console.log("---------------------");
            helpers_1.executeIn(path, function () { return shelljs_1.exec("npm link " + packageName); });
        });
    });
};
