"use strict";
const vscode = require("vscode");
const jest_editor_support_1 = require("jest-editor-support");
const helpers_1 = require("./helpers");
const JestExt_1 = require("./JestExt");
let extensionInstance;
function activate(context) {
    // To make us VS Code agnostic outside of this file
    const workspaceConfig = vscode.workspace.getConfiguration('jest');
    const pluginSettings = {
        autoEnable: workspaceConfig.get('autoEnable'),
        pathToConfig: workspaceConfig.get('pathToConfig'),
        pathToJest: workspaceConfig.get('pathToJest'),
        rootPath: vscode.workspace.rootPath
    };
    const jestPath = helpers_1.pathToJest(pluginSettings);
    const configPath = helpers_1.pathToConfig(pluginSettings);
    const currentJestVersion = 18;
    const workspace = new jest_editor_support_1.ProjectWorkspace(pluginSettings.rootPath, jestPath, configPath, currentJestVersion);
    // Create our own console
    const channel = vscode.window.createOutputChannel('Jest');
    // We need a singleton to represent the extension
    extensionInstance = new JestExt_1.JestExt(workspace, channel, pluginSettings);
    // Register for commands   
    vscode.commands.registerCommand('io.orta.show-jest-output', () => {
        channel.show();
    });
    vscode.commands.registerTextEditorCommand('io.orta.jest.start', () => {
        vscode.window.showInformationMessage('Started Jest, press escape to hide this message.');
        extensionInstance.startProcess();
    });
    vscode.commands.registerTextEditorCommand('io.orta.jest.stop', () => {
        extensionInstance.stopProcess();
    });
    // Setup the file change watchers
    let activeEditor = vscode.window.activeTextEditor;
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        extensionInstance.triggerUpdateDecorations(activeEditor);
    }, null, context.subscriptions);
    vscode.workspace.onDidSaveTextDocument(document => {
        if (document) {
            extensionInstance.triggerUpdateDecorations(activeEditor);
        }
    });
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            extensionInstance.triggerUpdateDecorations(activeEditor);
        }
    }, null, context.subscriptions);
}
exports.activate = activate;
function deactivate() {
    extensionInstance.deactivate();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map