"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
function updatePackageDependencies() {
    const urlsIndex = process.argv.indexOf("--urls");
    const newPrimaryUrls = urlsIndex >= 0 ? process.argv[urlsIndex + 1] : undefined;
    const fallbackUrlsIndex = process.argv.indexOf("--fallbackUrls");
    const newFallbackUrls = fallbackUrlsIndex >= 0 ? process.argv[fallbackUrlsIndex + 1] : undefined;
    if (newPrimaryUrls === undefined || newPrimaryUrls === "-?" || newPrimaryUrls === "-h") {
        console.log("This command will update the URLs for package dependencies in package.json");
        console.log();
        console.log("Syntax: updatePackageDependencies --urls \"<url1>,<url2>,...\" [--fallbackUrls \"<fallback-url-1>,<fallback-url-2>...\"]");
        console.log();
        return;
    }
    if (newPrimaryUrls.length === 0) {
        throw new Error("Invalid first argument to updatePackageDependencies. URL string argument expected.");
    }
    let packageJSON = JSON.parse(fs.readFileSync('package.json').toString());
    // map from lowercase filename to Package
    const mapFileNameToDependency = {};
    // First build the map
    packageJSON.runtimeDependencies.forEach(dependency => {
        let fileName = getLowercaseFileNameFromUrl(dependency.url);
        let existingDependency = mapFileNameToDependency[fileName];
        if (existingDependency !== undefined) {
            throw new Error(`Multiple dependencies found with filename '${fileName}': '${existingDependency.url}' and '${dependency.url}'.`);
        }
        mapFileNameToDependency[fileName] = dependency;
    });
    let findDependencyToUpdate = (url) => {
        let fileName = getLowercaseFileNameFromUrl(url);
        let dependency = mapFileNameToDependency[fileName];
        if (dependency === undefined) {
            throw new Error(`Unable to update item for url '${url}'. No 'runtimeDependency' found with filename '${fileName}'.`);
        }
        console.log(`Updating ${url}`);
        return dependency;
    };
    newPrimaryUrls.split(',').forEach(urlToUpdate => {
        let depedency = findDependencyToUpdate(urlToUpdate);
        depedency.url = urlToUpdate;
    });
    if (newFallbackUrls !== undefined) {
        newFallbackUrls.split(',').forEach(urlToUpdate => {
            let depedency = findDependencyToUpdate(urlToUpdate);
            depedency.fallbackUrl = urlToUpdate;
        });
    }
    let content = JSON.stringify(packageJSON, null, 2);
    if (os.platform() === 'win32') {
        content = content.replace(/\n/gm, "\r\n");
    }
    fs.writeFileSync('package.json', content);
}
exports.updatePackageDependencies = updatePackageDependencies;
function getLowercaseFileNameFromUrl(url) {
    if (!url.startsWith("https://")) {
        throw new Error(`Unexpected URL '${url}'. URL expected to start with 'https://'.`);
    }
    if (!url.endsWith(".zip")) {
        throw new Error(`Unexpected URL '${url}'. URL expected to end with '.zip'.`);
    }
    let index = url.lastIndexOf("/");
    return url.substr(index + 1).toLowerCase();
}
//# sourceMappingURL=UpdatePackageDependencies.js.map