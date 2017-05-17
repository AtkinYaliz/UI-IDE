"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const helpers = require("./../helpers");
const path = require("path");
const fs = require("fs");
const i18n = require("./../i18n");
const reload = require("./../messages/reload");
/** Command to toggle the folder icons. */
exports.toggleFolderIcons = () => {
    return exports.checkFolderIconsStatus()
        .then(showQuickPickItems)
        .then(handleQuickPickActions);
};
/** Show QuickPick items to select prefered configuration for the folder icons. */
const showQuickPickItems = isEnabled => {
    const on = {
        description: i18n.translate('toggleSwitch.on'),
        detail: i18n.translate('folders.enableIcons'),
        label: isEnabled ? "\u2714" : "\u25FB"
    };
    const off = {
        description: i18n.translate('toggleSwitch.off'),
        detail: i18n.translate('folders.disableIcons'),
        label: !isEnabled ? "\u2714" : "\u25FB"
    };
    return vscode.window.showQuickPick([on, off], {
        placeHolder: i18n.translate('folders.toggleIcons'),
        ignoreFocusOut: false
    });
};
/** Handle the actions from the QuickPick. */
const handleQuickPickActions = value => {
    if (!value || !value.description)
        return;
    switch (value.description) {
        case i18n.translate('toggleSwitch.on'): {
            exports.checkFolderIconsStatus().then(result => {
                if (!result) {
                    helpers.setThemeConfig('folders.iconsEnabled', true, true);
                }
            });
            break;
        }
        case i18n.translate('toggleSwitch.off'): {
            exports.checkFolderIconsStatus().then(result => {
                if (result) {
                    helpers.setThemeConfig('folders.iconsEnabled', false, true);
                }
            });
            break;
        }
        default:
            break;
    }
};
/** Are the folder icons enabled? */
exports.checkFolderIconsStatus = () => {
    return helpers.getMaterialIconsJSON().then((config) => {
        if (config.folder === '' && config.folderExpanded === '') {
            return false;
        }
        else {
            return true;
        }
    });
};
/** Enable folder icons */
exports.enableFolderIcons = () => {
    return insertFolderIcons().then(() => {
        reload.showConfirmToReloadMessage().then(result => {
            if (result)
                helpers.reload();
        });
    });
};
/** Disable folder icons */
exports.disableFolderIcons = () => {
    return deleteFolderIcons().then(() => {
        reload.showConfirmToReloadMessage().then(result => {
            if (result)
                helpers.reload();
        });
    });
};
/** Add folder icons */
const insertFolderIcons = () => {
    const iconJSONPath = path.join(helpers.getExtensionPath(), 'out', 'src', 'material-icons.json');
    return helpers.getMaterialIconsJSON().then(config => {
        fs.writeFileSync(iconJSONPath, JSON.stringify(exports.createConfigWithFolders(config), null, 2));
    });
};
exports.createConfigWithFolders = (config) => {
    return Object.assign({}, config, { folder: "_folder", folderExpanded: "_folder_open" });
};
/** Delete folder icons */
const deleteFolderIcons = () => {
    const iconJSONPath = path.join(helpers.getExtensionPath(), 'out', 'src', 'material-icons.json');
    return helpers.getMaterialIconsJSON().then(config => {
        fs.writeFileSync(iconJSONPath, JSON.stringify(exports.createConfigWithoutFolders(config), null, 2));
    });
};
exports.createConfigWithoutFolders = (config) => {
    return Object.assign({}, config, { folder: "", folderExpanded: "" });
};
//# sourceMappingURL=folders.js.map