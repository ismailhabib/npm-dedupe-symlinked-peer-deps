import {test, cd, find, ls} from "shelljs";
import * as _ from "lodash";
import {dirname} from "path";
import {join} from "path";
import {Set, Map} from "immutable";

var fs = require("fs");

export const packageJsonRelPath = "package.json";

export const nodeModulesRelPath = "node_modules";

export let executeIn = (path:string, cb:() => void) => {
    const curDir = process.cwd();
    cd(path);
    cb();
    cd(curDir);
};

export interface Options{
    excludes: string[]
}

export type PackageJson = {
    [key:string]:any;
}

export type PackagePathsAndDeps = Map<string, Map<string, string>>;

export let getPackageJson = (packagePath:string):PackageJson => {
    return JSON.parse(fs.readFileSync(join(packagePath, packageJsonRelPath)));
};

export let getFirstLevelPackagesPathWithNamespace = () => {
    return Set(ls('-d', nodeModulesRelPath + "/*")).map((relPath) => {
        return [relPath, relPath.split("/")[1]];
    }).filter((path:[string, string]) => {
        return _.startsWith(path[1], "@") && (path[1] !== "@types");
    }).map((path:[string, string]) => {
        return path[0];
    }) as Set<string>;
};

export let getTopLevelSymlinkedPackagesPath = () => {
    return Set([nodeModulesRelPath])
        .union(getFirstLevelPackagesPathWithNamespace()).map((path) => {
            return path + "/*";
        }).flatMap((path) => {
            return ls('-d', path);
        }).filter((relPath:string) => {
            return test("-L", relPath);
        }) as Set<string>;
};

export let getSymLinkedPackagesPath = (packagePath:string) => {
    return Set(find(join(packagePath, nodeModulesRelPath)))
        .filter((relPath) => {
            return _.endsWith(relPath, packageJsonRelPath);
        }).map((packageJsonRelPath) => {
            return dirname(packageJsonRelPath);
        }).filter((relPath) => {
            return test("-L", relPath);
        }) as Set<string>;
};

export let getRequirements = (packagePaths:Set<string>):PackagePathsAndDeps => {
    return packagePaths.reduce((acc: PackagePathsAndDeps, packagePath:string) => {
        return acc.set(packagePath, getPeerDependencies(getPackageJson(packagePath)));
    }, Map<string, Map<string, string>>());
};

export let getRequiredPackagesName = (requirements:Map<string, Map<string, string>>):Set<string> => {
    return requirements.valueSeq()
        .reduce((acc: Map<string, string>, value:Map<string, string>) => {
            return acc.merge(value); // TODO: not entirely correct in situation where two of the same package have different version
        }, Map<string, string>())
        .keySeq()
        .reduce((acc: Set<string>, value:string) => {
            return acc.add(value);
        }, Set<string>());
};

export let getPeerDependencies = (packageJson:PackageJson):Map<string, string> => {
    return Map<string, string>(packageJson["peerDependencies"]);
};
