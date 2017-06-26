"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const helpers = require("./../helpers");
const path = require("path");
const fs = require("fs");
const i18n = require("./../i18n");
const reload = require("./../messages/reload");
var FolderType;
(function (FolderType) {
    FolderType[FolderType["Specific"] = 0] = "Specific";
    FolderType[FolderType["Classic"] = 1] = "Classic";
    FolderType[FolderType["Blue"] = 2] = "Blue";
    FolderType[FolderType["None"] = 3] = "None";
})(FolderType = exports.FolderType || (exports.FolderType = {}));
/** Command to toggle the folder icons. */
exports.toggleFolderIcons = () => {
    return exports.checkFolderIconsStatus()
        .then(showQuickPickItems)
        .then(handleQuickPickActions);
};
/** Show QuickPick items to select prefered configuration for the folder icons. */
const showQuickPickItems = folderType => {
    const optionDefault = {
        description: i18n.translate('folders.specific.name'),
        detail: i18n.translate('folders.specific.description'),
        label: folderType === FolderType.Specific ? "\u2714" : "\u25FB"
    };
    const optionClassic = {
        description: i18n.translate('folders.classic.name'),
        detail: i18n.translate('folders.classic.description'),
        label: folderType === FolderType.Classic ? "\u2714" : "\u25FB"
    };
    const optionBlue = {
        description: i18n.translate('folders.blue.name'),
        detail: i18n.translate('folders.blue.description'),
        label: folderType === FolderType.Blue ? "\u2714" : "\u25FB"
    };
    const optionNone = {
        description: i18n.translate('folders.none.name'),
        detail: i18n.translate('folders.none.description'),
        label: folderType === FolderType.None ? "\u2714" : "\u25FB"
    };
    return vscode.window.showQuickPick([optionDefault, optionClassic, optionBlue, optionNone], {
        placeHolder: i18n.translate('folders.toggleIcons'),
        ignoreFocusOut: false
    });
};
/** Handle the actions from the QuickPick. */
const handleQuickPickActions = value => {
    if (!value || !value.description)
        return;
    switch (value.description) {
        case i18n.translate('folders.specific.name'): {
            exports.checkFolderIconsStatus().then(result => {
                helpers.setThemeConfig('folders.icons', "specific", true);
            });
            break;
        }
        case i18n.translate('folders.classic.name'): {
            exports.checkFolderIconsStatus().then(result => {
                helpers.setThemeConfig('folders.icons', "classic", true);
            });
            break;
        }
        case i18n.translate('folders.blue.name'): {
            exports.checkFolderIconsStatus().then(result => {
                helpers.setThemeConfig('folders.icons', "blue", true);
            });
            break;
        }
        case i18n.translate('folders.none.name'): {
            exports.checkFolderIconsStatus().then(result => {
                helpers.setThemeConfig('folders.icons', "none", true);
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
            return FolderType.None;
        }
        else if (config.folderNames && Object.keys(config.folderNames).length > 0) {
            return FolderType.Specific;
        }
        else if (config.folder === '_folder_blue') {
            return FolderType.Blue;
        }
        else {
            return FolderType.Classic;
        }
    });
};
/** Enable folder icons */
exports.enableSpecificFolderIcons = () => {
    return insertSpecificFolderIcons().then(() => {
        reload.showConfirmToReloadMessage().then(result => {
            if (result)
                helpers.reload();
        });
    });
};
exports.enableClassicFolderIcons = () => {
    return insertClassicFolderIcons().then(() => {
        reload.showConfirmToReloadMessage().then(result => {
            if (result)
                helpers.reload();
        });
    });
};
exports.enableBlueFolderIcons = () => {
    return insertBlueFolderIcons().then(() => {
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
const insertSpecificFolderIcons = () => {
    const iconJSONPath = path.join(helpers.getExtensionPath(), 'out', 'src', 'material-icons.json');
    return helpers.getMaterialIconsJSON().then(config => {
        fs.writeFileSync(iconJSONPath, JSON.stringify(exports.createConfigWithSpecificFolders(config), null, 2));
    });
};
exports.createConfigWithSpecificFolders = (config) => {
    return Object.assign({}, config, { folder: "_folder", folderExpanded: "_folder_open", folderNames: {
            "src": "_folder_src",
            "source": "_folder_src",
            "sources": "_folder_src",
            "css": "_folder_css",
            "stylesheet": "_folder_css",
            "style": "_folder_css",
            "styles": "_folder_css",
            "sass": "_folder_sass",
            "scss": "_folder_sass",
            "images": "_folder_images",
            "image": "_folder_images",
            "img": "_folder_images",
            "icons": "_folder_images",
            "icon": "_folder_images",
            "ico": "_folder_images",
            "script": "_folder_scripts",
            "scripts": "_folder_scripts",
            "node_modules": "_folder_node",
            "js": "_folder_js",
            "font": "_folder_font",
            "fonts": "_folder_font",
            "test": "_folder_test",
            "tests": "_folder_test",
            "__tests__": "_folder_test",
            "__test__": "_folder_test",
            "spec": "_folder_test",
            "specs": "_folder_test",
            "docs": "_folder_docs",
            ".github": "_folder_git",
            ".git": "_folder_git",
            "submodules": "_folder_git",
            ".submodules": "_folder_git",
            ".vscode": "_folder_vscode",
            "view": "_folder_views",
            "views": "_folder_views"
        }, folderNamesExpanded: {
            "src": "_folder_src_open",
            "source": "_folder_src_open",
            "sources": "_folder_src_open",
            "css": "_folder_css_open",
            "stylesheet": "_folder_css_open",
            "style": "_folder_css_open",
            "styles": "_folder_css_open",
            "sass": "_folder_sass_open",
            "scss": "_folder_sass_open",
            "images": "_folder_images_open",
            "image": "_folder_images_open",
            "img": "_folder_images_open",
            "icons": "_folder_images_open",
            "icon": "_folder_images_open",
            "ico": "_folder_images_open",
            "script": "_folder_scripts_open",
            "scripts": "_folder_scripts_open",
            "node_modules": "_folder_node_open",
            "js": "_folder_js_open",
            "font": "_folder_font_open",
            "fonts": "_folder_font_open",
            "test": "_folder_test_open",
            "tests": "_folder_test_open",
            "__tests__": "_folder_test_open",
            "__test__": "_folder_test_open",
            "spec": "_folder_test_open",
            "specs": "_folder_test_open",
            "docs": "_folder_docs_open",
            ".github": "_folder_git_open",
            ".git": "_folder_git_open",
            "submodules": "_folder_git_open",
            ".submodules": "_folder_git_open",
            ".vscode": "_folder_vscode_open",
            "view": "_folder_views_open",
            "views": "_folder_views_open"
        } });
};
const insertClassicFolderIcons = () => {
    const iconJSONPath = path.join(helpers.getExtensionPath(), 'out', 'src', 'material-icons.json');
    return helpers.getMaterialIconsJSON().then(config => {
        fs.writeFileSync(iconJSONPath, JSON.stringify(exports.createConfigWithClassicFoldersIcons(config), null, 2));
    });
};
exports.createConfigWithClassicFoldersIcons = (config) => {
    return Object.assign({}, config, { folder: "_folder", folderExpanded: "_folder_open", folderNames: {}, folderNamesExpanded: {} });
};
const insertBlueFolderIcons = () => {
    const iconJSONPath = path.join(helpers.getExtensionPath(), 'out', 'src', 'material-icons.json');
    return helpers.getMaterialIconsJSON().then(config => {
        fs.writeFileSync(iconJSONPath, JSON.stringify(exports.createConfigWithBlueFoldersIcons(config), null, 2));
    });
};
exports.createConfigWithBlueFoldersIcons = (config) => {
    return Object.assign({}, config, { folder: "_folder_blue", folderExpanded: "_folder_blue_open", folderNames: {}, folderNamesExpanded: {} });
};
/** Delete folder icons */
const deleteFolderIcons = () => {
    const iconJSONPath = path.join(helpers.getExtensionPath(), 'out', 'src', 'material-icons.json');
    return helpers.getMaterialIconsJSON().then(config => {
        fs.writeFileSync(iconJSONPath, JSON.stringify(exports.createConfigWithoutFolders(config), null, 2));
    });
};
exports.createConfigWithoutFolders = (config) => {
    return Object.assign({}, config, { folder: "", folderExpanded: "", folderNames: {}, folderNamesExpanded: {} });
};
//# sourceMappingURL=folders.js.map