"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const elegantSpinner = require("elegant-spinner");
const appGlobals_1 = require("./appGlobals");
// The bottom status bar
const statusBarCommand = `${appGlobals_1.extensionName}.show-output`;
const statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
statusBarItem.show();
statusBarItem.command = statusBarCommand;
const statusKey = 'Jest:';
const frame = elegantSpinner();
let statusBarSpinner;
function registerStatusBar(channel) {
    return vscode_1.commands.registerCommand(statusBarCommand, () => channel.show());
}
exports.registerStatusBar = registerStatusBar;
function initial() {
    updateStatus('...');
}
exports.initial = initial;
function running() {
    clearInterval(statusBarSpinner);
    statusBarSpinner = setInterval(() => {
        statusBarItem.text = `${statusKey} ${frame()}`;
    }, 100);
}
exports.running = running;
function success() {
    updateStatus('$(check)');
}
exports.success = success;
function failed() {
    updateStatus('$(alert)');
}
exports.failed = failed;
function stopped() {
    updateStatus('stopped');
    setTimeout(() => initial(), 2000);
}
exports.stopped = stopped;
function updateStatus(message) {
    clearInterval(statusBarSpinner);
    statusBarItem.text = `${statusKey} ${message}`;
}
//# sourceMappingURL=statusBar.js.map