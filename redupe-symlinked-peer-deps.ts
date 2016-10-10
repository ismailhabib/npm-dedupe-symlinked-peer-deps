import {exec} from "shelljs";
import {
    executeIn, getTopLevelSymlinkedPackagesPath, getRequirements
} from "./helpers";
import {Map} from "immutable";


export let redupeSymlinkedPeerDeps = () => {
    const topLevelPackagesPath = getTopLevelSymlinkedPackagesPath();

    const topLevelPackagesPathAndPeerDependencies = getRequirements(topLevelPackagesPath);

    console.log(topLevelPackagesPathAndPeerDependencies);

    topLevelPackagesPathAndPeerDependencies.entrySeq().forEach(([path, peerDependencies]: [string, Map<string, string>]) => {
        peerDependencies.entrySeq().forEach(([packageName, version]: [string, string]) => {
            console.log("---------------------");
            console.log("npm unlink " + packageName + " on " + path);
            console.log("---------------------");
            executeIn(path, () => exec("npm unlink " + packageName));
            console.log("---------------------");
            console.log("npm install " + packageName + "@" + version + " on " + path);
            console.log("---------------------");
            executeIn(path, () => exec("npm install " + packageName + "@" + version));
        });
    });
};
