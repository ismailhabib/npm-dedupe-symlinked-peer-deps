"use strict";
var shelljs_1 = require("shelljs");
var _ = require("lodash");
var path_1 = require("path");
var path_2 = require("path");
var immutable_1 = require("immutable");
var fs = require("fs");
exports.packageJsonRelPath = "package.json";
exports.nodeModulesRelPath = "node_modules";
exports.executeIn = function (path, cb) {
    var curDir = process.cwd();
    shelljs_1.cd(path);
    cb();
    shelljs_1.cd(curDir);
};
exports.getPackageJson = function (packagePath) {
    return JSON.parse(fs.readFileSync(path_2.join(packagePath, exports.packageJsonRelPath)));
};
exports.getFirstLevelPackagesPathWithNamespace = function () {
    return immutable_1.Set(shelljs_1.ls('-d', exports.nodeModulesRelPath + "/*")).map(function (relPath) {
        return [relPath, relPath.split("/")[1]];
    }).filter(function (path) {
        return _.startsWith(path[1], "@") && (path[1] !== "@types");
    }).map(function (path) {
        return path[0];
    });
};
exports.getTopLevelSymlinkedPackagesPath = function () {
    return immutable_1.Set([exports.nodeModulesRelPath])
        .union(exports.getFirstLevelPackagesPathWithNamespace()).map(function (path) {
        return path + "/*";
    }).flatMap(function (path) {
        return shelljs_1.ls('-d', path);
    }).filter(function (relPath) {
        return shelljs_1.test("-L", relPath);
    });
};
exports.getSymLinkedPackagesPath = function (packagePath) {
    return immutable_1.Set(shelljs_1.find(path_2.join(packagePath, exports.nodeModulesRelPath)))
        .filter(function (relPath) {
        return _.endsWith(relPath, exports.packageJsonRelPath);
    }).map(function (packageJsonRelPath) {
        return path_1.dirname(packageJsonRelPath);
    }).filter(function (relPath) {
        return shelljs_1.test("-L", relPath);
    });
};
exports.getRequirements = function (packagePaths) {
    return packagePaths.reduce(function (acc, packagePath) {
        return acc.set(packagePath, exports.getPeerDependencies(exports.getPackageJson(packagePath)));
    }, immutable_1.Map());
};
exports.getRequiredPackagesName = function (requirements) {
    return requirements.valueSeq()
        .reduce(function (acc, value) {
        return acc.merge(value);
    }, immutable_1.Map())
        .keySeq()
        .reduce(function (acc, value) {
        return acc.add(value);
    }, immutable_1.Set());
};
exports.getPeerDependencies = function (packageJson) {
    return immutable_1.Map(packageJson["peerDependencies"]);
};
