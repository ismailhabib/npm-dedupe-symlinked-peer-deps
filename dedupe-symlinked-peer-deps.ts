import {exec} from "shelljs";
import {
    getRequirements,
    getSymLinkedPackagesPath, nodeModulesRelPath, getRequiredPackagesName, executeIn, Options
} from "./helpers";
import {join} from "path";
import {Set} from "immutable";

export let dedupeSymlinkedPeerDeps = (options?: Options | null | undefined) => {
    let blackListedPackages = Set<string>();

    if (options && options.excludes) {
        blackListedPackages = blackListedPackages.merge(options.excludes);
    }

    console.log("Blacklist: ", blackListedPackages);

    const symLinkedPackagesPath = getSymLinkedPackagesPath(".");
    console.log("SymLinked packages: ", symLinkedPackagesPath);

    const requirements = getRequirements(symLinkedPackagesPath);
    console.log("Requirements: ", requirements);

    const requiredPackagesName = getRequiredPackagesName(requirements);
    console.log("Required packages: ", requiredPackagesName);

    requiredPackagesName.filter((packageName) => !blackListedPackages.includes(packageName)).forEach(packageName => {
        const path = join(nodeModulesRelPath, packageName);
        console.log("---------------------");
        console.log("npm link on " + path);
        console.log("---------------------");
        executeIn(path, () => exec("npm link"));
    });

    requirements.entrySeq().forEach(([path, peerDependencies]) => {
        peerDependencies.entrySeq().filter(([packageName, version]: [string, string]) => {
            return !blackListedPackages.includes(packageName);
        }).forEach(([packageName, version]: [string, string]) => {
            console.log("---------------------");
            console.log("npm link " + packageName + " on " + path);
            console.log("---------------------");
            executeIn(path, () => exec("npm link " + packageName));
        });
    });
};
