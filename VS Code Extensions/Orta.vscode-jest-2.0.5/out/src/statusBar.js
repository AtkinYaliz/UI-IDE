"use strict";
const vscode_1 = require("vscode");
const elegantSpinner = require("elegant-spinner");
// The bottom status bar
const statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
statusBarItem.show();
statusBarItem.command = 'io.orta.show-jest-output';
const statusKey = 'Jest:';
const frame = elegantSpinner();
let statusBarSpinner;
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