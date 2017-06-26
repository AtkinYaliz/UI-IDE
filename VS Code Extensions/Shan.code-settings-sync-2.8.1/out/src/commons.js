"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const environmentPath_1 = require("./environmentPath");
const fileManager_1 = require("./fileManager");
const setting_1 = require("./setting");
const fs = require("fs");
const openurl = require('opn');
const chokidar = require('chokidar');
const lockfile = require('proper-lockfile');
class Commons {
    constructor(en, context) {
        this.en = en;
        this.context = context;
        this.ERROR_MESSAGE = "Sync : Error Logged In Console (Help menu > Toggle Developer Tools).";
    }
    static LogException(error, message, msgBox, callback) {
        if (error) {
            console.error(error);
            if (error.code == 500) {
                message = "Sync : Internet Not Connected or Unable to Connect to Github. Exception Logged in Console";
                msgBox = false;
            }
            else if (error.code == 4) {
                message = "Sync : Unable to Save Settings. Please make sure you have valid JSON settings.json file. ( e.g : No trailing commas )";
            }
            else if (error.message) {
                try {
                    message = JSON.parse(error.message).message;
                    if (message.toLowerCase() == 'bad credentials') {
                        msgBox = true;
                        message = "Sync : Invalid / Expired Github Token. Please generate new token with scopes mentioned in readme. Exception Logged in Console.";
                        openurl("https://github.com/settings/tokens");
                    }
                }
                catch (error) {
                    //message = error.message;
                }
            }
        }
        if (msgBox == true) {
            vscode.window.showErrorMessage(message);
            vscode.window.setStatusBarMessage("").dispose();
        }
        else {
            vscode.window.setStatusBarMessage(message, 5000);
        }
        if (callback) {
            callback.apply(this);
        }
    }
    StartWatch() {
        return __awaiter(this, void 0, void 0, function* () {
            let lockExist = yield fileManager_1.FileManager.FileExists(this.en.FILE_SYNC_LOCK);
            if (!lockExist) {
                fs.closeSync(fs.openSync(this.en.FILE_SYNC_LOCK, 'w'));
            }
            let self = this;
            let locked = lockfile.checkSync(this.en.FILE_SYNC_LOCK);
            if (locked) {
                lockfile.unlockSync(this.en.FILE_SYNC_LOCK);
            }
            let uploadStopped = true;
            Commons.extensionWatcher = chokidar.watch(this.en.ExtensionFolder, { depth: 0, ignoreInitial: true });
            Commons.configWatcher = chokidar.watch(this.en.PATH + "/User/", { depth: 2, ignoreInitial: true });
            //TODO : Uncomment the following lines when code allows feature to update Issue in github code repo - #14444
            // Commons.extensionWatcher.on('addDir', (path, stat)=> {
            //     if (uploadStopped) {
            //         uploadStopped = false;
            //         this.InitiateAutoUpload().then((resolve) => {
            //             uploadStopped = resolve;
            //         }, (reject) => {
            //             uploadStopped = reject;
            //         });
            //     }
            //     else {
            //         vscode.window.setStatusBarMessage("");
            //         vscode.window.setStatusBarMessage("Sync : Updating In Progres... Please Wait.", 3000);
            //     }
            // });
            // Commons.extensionWatcher.on('unlinkDir', (path)=> {
            //     if (uploadStopped) {
            //         uploadStopped = false;
            //         this.InitiateAutoUpload().then((resolve) => {
            //             uploadStopped = resolve;
            //         }, (reject) => {
            //             uploadStopped = reject;
            //         });
            //     }
            //     else {
            //         vscode.window.setStatusBarMessage("");
            //         vscode.window.setStatusBarMessage("Sync : Updating In Progres... Please Wait.", 3000);
            //     }
            // });
            Commons.configWatcher.on('change', (path) => __awaiter(this, void 0, void 0, function* () {
                let locked = lockfile.checkSync(this.en.FILE_SYNC_LOCK);
                if (locked) {
                    uploadStopped = false;
                }
                if (uploadStopped) {
                    uploadStopped = false;
                    lockfile.lockSync(self.en.FILE_SYNC_LOCK);
                    let settings = this.GetSettings();
                    let customSettings = yield this.GetCustomSettings();
                    if (customSettings == null) {
                        return;
                    }
                    let requiredFileChanged = false;
                    if (customSettings.ignoreUploadFolders.indexOf("workspaceStorage") == -1) {
                        requiredFileChanged = (path.indexOf(self.en.FILE_SYNC_LOCK_NAME) == -1) && (path.indexOf(".DS_Store") == -1) && (path.indexOf(this.en.APP_SUMMARY_NAME) == -1) && (path.indexOf(this.en.FILE_CUSTOMIZEDSETTINGS_NAME) == -1);
                    }
                    else {
                        requiredFileChanged = (path.indexOf(self.en.FILE_SYNC_LOCK_NAME) == -1) && (path.indexOf("workspaceStorage") == -1) && (path.indexOf(".DS_Store") == -1) && (path.indexOf(this.en.APP_SUMMARY_NAME) == -1) && (path.indexOf(this.en.FILE_CUSTOMIZEDSETTINGS_NAME) == -1);
                    }
                    console.log("Sync : File Change Detected On : " + path);
                    if (requiredFileChanged) {
                        if (settings.autoUpload) {
                            if (customSettings.ignoreUploadFolders.indexOf("workspaceStorage") > -1) {
                                let fileType = path.substring(path.lastIndexOf('.'), path.length);
                                if (fileType.indexOf('json') == -1) {
                                    console.log("Sync : Cannot Initiate Auto-upload on This File (Not JSON).");
                                    uploadStopped = true;
                                    return;
                                }
                            }
                            console.log("Sync : Initiating Auto-upload For File : " + path);
                            this.InitiateAutoUpload(path).then((resolve) => {
                                uploadStopped = resolve;
                                lockfile.unlockSync(self.en.FILE_SYNC_LOCK);
                            }, (reject) => {
                                lockfile.unlockSync(self.en.FILE_SYNC_LOCK);
                                uploadStopped = true;
                            });
                        }
                    }
                    else {
                        uploadStopped = true;
                        lockfile.unlockSync(self.en.FILE_SYNC_LOCK);
                    }
                }
                else {
                    vscode.window.setStatusBarMessage("").dispose();
                    vscode.window.setStatusBarMessage("Sync : Updating In Progress ... Please Wait.", 3000);
                }
            }));
        });
    }
    InitiateAutoUpload(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                vscode.window.setStatusBarMessage("").dispose();
                vscode.window.setStatusBarMessage("Sync : Auto Upload Initiating In 5 Seconds.", 5000);
                setTimeout(function () {
                    vscode.commands.executeCommand('extension.updateSettings', "forceUpdate", path).then((res) => {
                        resolve(true);
                    });
                }, 3000);
            }));
        });
    }
    CloseWatch() {
        if (Commons.configWatcher != null) {
            Commons.configWatcher.close();
        }
        if (Commons.extensionWatcher != null) {
            Commons.extensionWatcher.close();
        }
    }
    InitalizeSettings(askToken, askGist) {
        return __awaiter(this, void 0, void 0, function* () {
            let me = this;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var settings = new setting_1.LocalConfig();
                var extSettings = me.GetSettings();
                var cusSettings = yield me.GetCustomSettings();
                if (cusSettings.token == "") {
                    if (askToken == true) {
                        askToken = !extSettings.anonymousGist;
                    }
                    if (askToken) {
                        openurl("https://github.com/settings/tokens");
                        let tokTemp = yield me.GetTokenAndSave(cusSettings);
                        if (!tokTemp) {
                            vscode.window.showErrorMessage("Sync : Token Not Saved.");
                            reject(false);
                        }
                        cusSettings.token = tokTemp;
                    }
                }
                if (extSettings.gist == "") {
                    if (askGist) {
                        let gistTemp = yield me.GetGistAndSave(extSettings);
                        if (!gistTemp) {
                            vscode.window.showErrorMessage("Sync : Gist Not Saved.");
                            reject(false);
                        }
                        extSettings.gist = gistTemp;
                    }
                }
                settings.customConfig = cusSettings;
                settings.extConfig = extSettings;
                resolve(settings);
            }));
        });
    }
    GetCustomSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let me = this;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let customSettings = new setting_1.CustomSettings();
                try {
                    let customExist = yield fileManager_1.FileManager.FileExists(me.en.FILE_CUSTOMIZEDSETTINGS);
                    if (customExist) {
                        let customSettingStr = yield fileManager_1.FileManager.ReadFile(me.en.FILE_CUSTOMIZEDSETTINGS);
                        let tempObj = JSON.parse(customSettingStr);
                        if (!Array.isArray(tempObj["ignoreUploadSettings"])) {
                            tempObj["ignoreUploadSettings"] = new Array();
                        }
                        Object.assign(customSettings, tempObj);
                        resolve(customSettings);
                    }
                }
                catch (e) {
                    Commons.LogException(e, "Sync : Unable to read " + this.en.FILE_CUSTOMIZEDSETTINGS_NAME + ". Make sure its Valid JSON.", true);
                    openurl("http://shanalikhan.github.io/2017/02/19/Option-to-ignore-settings-folders-code-settings-sync.html");
                    customSettings = null;
                    resolve(customSettings);
                }
            }));
        });
    }
    SetCustomSettings(setting) {
        return __awaiter(this, void 0, void 0, function* () {
            let me = this;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let json = Object.assign(setting);
                    delete json["ignoreUploadSettings"];
                    yield fileManager_1.FileManager.WriteFile(me.en.FILE_CUSTOMIZEDSETTINGS, JSON.stringify(json));
                    resolve(true);
                }
                catch (e) {
                    Commons.LogException(e, "Sync : Unable to write " + this.en.FILE_CUSTOMIZEDSETTINGS_NAME, true);
                    resolve(false);
                }
            }));
        });
    }
    StartMigrationProcess() {
        let me = this;
        let settingKeys = Object.keys(new setting_1.ExtensionConfig());
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let settings = yield me.GetSettings();
            let fileExist = yield fileManager_1.FileManager.FileExists(me.en.FILE_CUSTOMIZEDSETTINGS);
            let customSettings = null;
            let firstTime = true;
            if (fileExist) {
                customSettings = yield me.GetCustomSettings();
                firstTime = false;
            }
            else {
                firstTime = true;
                customSettings = new setting_1.CustomSettings();
            }
            vscode.workspace.getConfiguration().update("sync.version", undefined, true);
            if (firstTime) {
                vscode.window.showInformationMessage("Sync : Settings Created. Thank You for Installing !");
                vscode.window.showInformationMessage("Sync : Need Help regarding configuring this extension ?", "Open Extension Page").then(function (val) {
                    if (val == "Open Extension Page") {
                        openurl("https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync");
                    }
                });
                vscode.window.showInformationMessage("Sync : You can exclude any file / folder for upload and settings for download.", "Open Tutorial").then(function (val) {
                    if (val == "Open Tutorial") {
                        openurl("http://shanalikhan.github.io/2017/02/19/Option-to-ignore-settings-folders-code-settings-sync.html");
                    }
                });
            }
            else if (customSettings.version == 0 || customSettings.version < environmentPath_1.Environment.CURRENT_VERSION) {
                if (this.context.globalState.get('synctoken')) {
                    let token = this.context.globalState.get('synctoken');
                    if (token != "") {
                        customSettings.token = String(token);
                        this.context.globalState.update("synctoken", "");
                        vscode.window.showInformationMessage("Sync : Now You can set your Github token manually in `syncLocalSettings.json`");
                    }
                }
                me.DonateMessage();
                vscode.window.showInformationMessage("Sync : Settings Sync Updated to v" + environmentPath_1.Environment.getVersion(), "View Release Notes").then(function (val) {
                    if (val == "View Release Notes") {
                        openurl("http://shanalikhan.github.io/2016/05/14/Visual-studio-code-sync-settings-release-notes.html");
                    }
                });
                vscode.window.showInformationMessage("Sync : Do you want to open summary page in background so you can keep working. Vote Here ! :-)", "Open URL").then(function (val) {
                    if (val == "Open URL") {
                        openurl("https://github.com/Microsoft/vscode/issues/11247");
                    }
                });
            }
            customSettings.version = environmentPath_1.Environment.CURRENT_VERSION;
            let done = yield me.SetCustomSettings(customSettings);
            resolve(true);
        }));
    }
    SaveSettings(setting) {
        return __awaiter(this, void 0, void 0, function* () {
            let me = this;
            let config = vscode.workspace.getConfiguration('sync');
            let allKeysUpdated = new Array();
            return new Promise((resolve, reject) => {
                let keys = Object.keys(setting);
                keys.forEach((keyName) => __awaiter(this, void 0, void 0, function* () {
                    if ((keyName == "lastDownload" || keyName == "lastUpload") && setting[keyName]) {
                        try {
                            let zz = new Date(setting[keyName]);
                            setting[keyName] = zz;
                        }
                        catch (e) {
                            setting[keyName] = new Date();
                        }
                    }
                    if (setting[keyName] == null) {
                        setting[keyName] = "";
                    }
                    if (keyName.toLowerCase() == "token") {
                        allKeysUpdated.push(me.context.globalState.update("synctoken", setting[keyName]));
                    }
                    else {
                        allKeysUpdated.push(config.update(keyName, setting[keyName], true));
                    }
                }));
                Promise.all(allKeysUpdated).then(function (a) {
                    if (me.context.globalState.get('syncCounter')) {
                        let counter = me.context.globalState.get('syncCounter');
                        let count = parseInt(String(counter));
                        if (count % 450 == 0) {
                            me.DonateMessage();
                        }
                        count = count + 1;
                        me.context.globalState.update("syncCounter", count);
                    }
                    else {
                        me.context.globalState.update("syncCounter", 1);
                    }
                    resolve(true);
                }, function (b) {
                    Commons.LogException(b, me.ERROR_MESSAGE, true);
                    reject(false);
                });
            });
        });
    }
    DonateMessage() {
        vscode.window.showInformationMessage("Sync : Do you like this extension ? How about writing a review or send me some donation ;) ", "Donate Now", "Write Review").then((res) => {
            if (res == "Donate Now") {
                openurl("https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4W3EWHHBSYMM8&lc=IE&item_name=Code%20Settings%20Sync&item_number=visual%20studio%20code%20settings%20sync&currency_code=USD&bn=PP-DonationsBF:btn_donate_SM.gif:NonHosted");
            }
            else if (res == "Write Review") {
                openurl("https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync#review-details");
            }
        });
    }
    GetSettings() {
        var me = this;
        let settings = new setting_1.ExtensionConfig();
        let keys = Object.keys(settings);
        keys.forEach(key => {
            if (key != 'token') {
                settings[key] = vscode.workspace.getConfiguration("sync")[key];
            }
        });
        return settings;
    }
    GetTokenAndSave(sett) {
        return __awaiter(this, void 0, void 0, function* () {
            var me = this;
            var opt = Commons.GetInputBox(true);
            return new Promise((resolve, reject) => {
                (function getToken() {
                    vscode.window.showInputBox(opt).then((token) => __awaiter(this, void 0, void 0, function* () {
                        if (token && token.trim()) {
                            token = token.trim();
                            if (token != 'esc') {
                                sett.token = token;
                                yield me.SetCustomSettings(sett).then(function (saved) {
                                    if (saved) {
                                        vscode.window.setStatusBarMessage("Sync : Token Saved", 1000);
                                    }
                                    resolve(token);
                                }, function (err) {
                                    reject(err);
                                });
                            }
                        }
                    }));
                }());
            });
        });
    }
    GetGistAndSave(sett) {
        return __awaiter(this, void 0, void 0, function* () {
            var me = this;
            var opt = Commons.GetInputBox(false);
            return new Promise((resolve, reject) => {
                (function getGist() {
                    vscode.window.showInputBox(opt).then((gist) => __awaiter(this, void 0, void 0, function* () {
                        if (gist && gist.trim()) {
                            gist = gist.trim();
                            if (gist != 'esc') {
                                sett.gist = gist.trim();
                                yield me.SaveSettings(sett).then(function (saved) {
                                    if (saved) {
                                        vscode.window.setStatusBarMessage("Sync : Gist Saved", 1000);
                                    }
                                    resolve(gist);
                                }, function (err) {
                                    reject(err);
                                });
                            }
                        }
                    }));
                })();
            });
        });
    }
    static GetInputBox(token) {
        if (token) {
            let options = {
                placeHolder: "Enter Github Personal Access Token",
                password: false,
                prompt: "Link opened to get the GitHub token. Enter token and press [Enter] or press / type 'esc' to cancel.",
                ignoreFocusOut: true
            };
            return options;
        }
        else {
            let options = {
                placeHolder: "Enter Gist Id",
                password: false,
                prompt: "Enter Gist Id from previously uploaded settings and press [Enter] or press / type 'esc' to cancel.",
                ignoreFocusOut: true
            };
            return options;
        }
    }
    ;
    /**
     * IgnoreSettings
     */
    GetIgnoredSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            let ignoreSettings = new Object();
            return new Promise((resolve, reject) => {
                let config = vscode.workspace.getConfiguration();
                let keysUpdated = new Array();
                settings.forEach((key, index) => __awaiter(this, void 0, void 0, function* () {
                    let keyValue = null;
                    keyValue = config.get(key, null);
                    if (keyValue != null) {
                        ignoreSettings[key] = keyValue;
                        keysUpdated.push(config.update(key, undefined, true));
                    }
                }));
                Promise.all(keysUpdated).then((a => {
                    resolve(ignoreSettings);
                }), (rej) => {
                    rej(null);
                });
            });
        });
    }
    /**
     * RestoreIgnoredSettings
     */
    SetIgnoredSettings(ignoredSettings) {
        let config = vscode.workspace.getConfiguration();
        let keysUpdated = new Array();
        Object.keys(ignoredSettings).forEach((key, index) => __awaiter(this, void 0, void 0, function* () {
            keysUpdated.push(config.update(key, ignoredSettings[key], true));
        }));
    }
    GenerateSummmaryFile(upload, files, removedExtensions, addedExtensions, syncSettings) {
        var header = null;
        var downloaded = "Download";
        var updated = "Upload";
        var status = null;
        if (upload) {
            status = updated;
        }
        else {
            status = downloaded;
        }
        header = "\r\nFiles " + status + ".\r\n";
        var deletedExtension = "\r\nEXTENSIONS REMOVED :\r\n";
        var addedExtension = "\r\nEXTENSIONS ADDED :\r\n";
        var tempURI = this.en.APP_SUMMARY;
        console.log("Sync : " + "File Path For Summary Page : " + tempURI);
        var setting = vscode.Uri.file(tempURI);
        fs.openSync(setting.fsPath, 'w');
        vscode.workspace.openTextDocument(setting).then((a) => {
            vscode.window.showTextDocument(a, vscode.ViewColumn.One, true).then((e) => {
                e.edit(edit => {
                    edit.insert(new vscode.Position(0, 0), "VISUAL STUDIO CODE SETTINGS SYNC \r\nVersion: " + environmentPath_1.Environment.getVersion() + "\r\n\r\n" + status + " Summary\r\n\r\n");
                    edit.insert(new vscode.Position(1, 0), "--------------------\r\n");
                    let tokenPlaceHolder = "Anonymous";
                    if (syncSettings.customConfig.token != "") {
                        tokenPlaceHolder = syncSettings.customConfig.token;
                    }
                    edit.insert(new vscode.Position(2, 0), "GITHUB TOKEN: " + tokenPlaceHolder + "\r\n");
                    edit.insert(new vscode.Position(3, 0), "GITHUB GIST: " + syncSettings.extConfig.gist + "\r\n");
                    var type = (syncSettings.publicGist == true) ? "Public" : "Secret";
                    edit.insert(new vscode.Position(4, 0), "GITHUB GIST TYPE: " + type + "\r\n\r\n");
                    edit.insert(new vscode.Position(5, 0), "--------------------\r\n\r\n");
                    if (syncSettings.customConfig.token == "") {
                        edit.insert(new vscode.Position(5, 0), "Anonymous Gist Cant be edited, extension will always create new one during upload.\r\n\r\n");
                    }
                    edit.insert(new vscode.Position(5, 0), "If current theme / file icon extension is not installed. Restart will be Required to Apply Theme and File Icon.\r\n\r\n");
                    edit.insert(new vscode.Position(6, 0), header + "\r\n");
                    var row = 6;
                    for (var i = 0; i < files.length; i++) {
                        var element = files[i];
                        if (element.fileName.indexOf(".") > 0) {
                            let fileName = element.fileName;
                            if (fileName != element.gistName) {
                                if (upload) {
                                    fileName += " > " + element.gistName;
                                }
                                else {
                                    fileName = element.gistName + " > " + fileName;
                                }
                            }
                            edit.insert(new vscode.Position(row, 0), fileName + "\r\n");
                            row += 1;
                        }
                    }
                    if (removedExtensions) {
                        edit.insert(new vscode.Position(row, 0), deletedExtension + "\r\n");
                        row += 1;
                        if (removedExtensions.length > 0) {
                            removedExtensions.forEach(ext => {
                                edit.insert(new vscode.Position(row, 0), ext.name + " - Version :" + ext.version + "\r\n");
                                row += 1;
                            });
                        }
                        else {
                            edit.insert(new vscode.Position(row, 0), "No Extension needs to be removed.\r\n");
                        }
                    }
                    if (addedExtensions) {
                        row += 1;
                        edit.insert(new vscode.Position(row, 0), "\r\n" + addedExtension + "\r\n");
                        row += 1;
                        if (addedExtensions.length > 0) {
                            addedExtensions.forEach(ext => {
                                edit.insert(new vscode.Position(row, 0), ext.name + " - Version :" + ext.version + "\r\n");
                                row += 1;
                            });
                        }
                        else {
                            edit.insert(new vscode.Position(row, 0), "No Extension needs to install.\r\n");
                        }
                    }
                });
                e.document.save();
                //vscode.commands.executeCommand("workbench.action.nextEditorInGroup");
            });
        }, (error) => {
            console.error(error);
            return;
        });
    }
    ;
}
Commons.configWatcher = null;
Commons.extensionWatcher = null;
exports.Commons = Commons;
//# sourceMappingURL=commons.js.map