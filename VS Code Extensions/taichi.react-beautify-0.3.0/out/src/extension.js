'use strict';
const vscode_1 = require('vscode');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const shaver = require('strip-json-comments');
const formatters = require('./formatters');
const supported_languages = ["javascript", "javascriptreact", "typescript", "typescriptreact"];
function activate(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand("react.beautify", () => {
        const a = vscode_1.window.activeTextEditor;
        if (a && a.document) {
            const r = allOf(a.document);
            return format(a.document, r, a.options)
                .then(txt => a.edit(editor => editor.replace(r, txt)))
                .catch(report);
        }
    }));
    _.each(supported_languages, l => registerFormatter(context, l));
    vscode_1.workspace.onWillSaveTextDocument(onWillSave);
}
exports.activate = activate;
function registerFormatter(context, languageId) {
    context.subscriptions.push(vscode_1.languages.registerDocumentFormattingEditProvider(languageId, {
        provideDocumentFormattingEdits: (document, options, token) => {
            const r = allOf(document);
            return format(document, r, options)
                .then(txt => [vscode_1.TextEdit.replace(r, txt)])
                .catch(report);
        }
    }));
    context.subscriptions.push(vscode_1.languages.registerDocumentRangeFormattingEditProvider(languageId, {
        provideDocumentRangeFormattingEdits: (document, range, options, token) => {
            let begin = new vscode_1.Position(range.start.line, 0);
            let end = range.end.translate(0, Number.MAX_VALUE);
            let r = document.validateRange(new vscode_1.Range(begin, end));
            return format(document, r, options)
                .then(txt => [vscode_1.TextEdit.replace(r, txt)])
                .catch(report);
        }
    }));
}
function onWillSave(event) {
    const doc = event.document;
    if (supports(doc.languageId) && getConfig("onSave", false)) {
        const r = allOf(doc);
        let editor = vscode_1.window.visibleTextEditors.find(ed => ed.document && ed.document.fileName === doc.fileName);
        let options = editor ? editor.options : vscode_1.workspace.getConfiguration('editor');
        event.waitUntil(format(doc, r, options)
            .then(txt => {
            let we = new vscode_1.WorkspaceEdit();
            we.replace(doc.uri, r, txt);
            return vscode_1.workspace.applyEdit(we);
        })
            .catch(report));
    }
}
function deactivate() {
}
exports.deactivate = deactivate;
function format(doc, range, defaults) {
    if (doc) {
        const langId = doc.languageId;
        if (langId && supports(langId)) {
            const root = vscode_1.workspace.rootPath;
            return loadOptions(root, defaults)
                .then(options => {
                let t = getConfig("formatter") || "prettydiff";
                return [options, formatters.make(root, t, langId)];
            }).then(optFmt => {
                let src = doc.getText(doc.validateRange(range));
                return optFmt[1](src, optFmt[0]);
            });
        }
        return Promise.reject(`Unsupported languageId ${doc.languageId}`);
    }
    return Promise.reject("Fail to get File Information. maybe too large.");
}
exports.format = format;
function loadOptions(root, defaults) {
    if (root) {
        let relpath = getConfig("configFilePath") || ".jsbeautifyrc";
        const conf = path.join(root, relpath);
        if (path.normalize(conf).startsWith(root) && fs.existsSync(conf)) {
            return new Promise((next, reject) => fs.readFile(conf, "utf8", (err, buffer) => {
                if (buffer) {
                    try {
                        let srcjson = shaver(buffer.toString());
                        next(_.defaultsDeep({}, JSON.parse(srcjson), defaults));
                    }
                    catch (e) {
                        reject(`incorrect config file. ${conf} can't parse correctly.`);
                    }
                }
                else {
                    next(defaults);
                }
            }));
        }
    }
    return Promise.resolve(defaults);
}
function getConfig(section, defaults) {
    const config = vscode_1.workspace.getConfiguration("react.beautify");
    return config.get(section, defaults);
}
function allOf(document) {
    return document.validateRange(new vscode_1.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));
}
function supports(languageId) {
    return -1 < supported_languages.indexOf(languageId);
}
function report(e) {
    if (e) {
        vscode_1.window.showErrorMessage(e);
        console.error("beautify ERROR:", e);
    }
    return [];
}
//# sourceMappingURL=extension.js.map