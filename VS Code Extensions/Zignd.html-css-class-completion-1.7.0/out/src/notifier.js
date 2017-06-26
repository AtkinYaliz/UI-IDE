"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Notifier {
    constructor(command, alignment, priority) {
        this.statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
        this.statusBarItem.command = command;
        this.statusBarItem.show();
    }
    notify(icon, text) {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }
        this.statusBarItem.text = `$(${icon}) ${text}`;
        this.statusBarItem.tooltip = null;
        this._timeoutId = setTimeout(() => {
            this.statusBarItem.text = `$(${icon})`;
            this.statusBarItem.tooltip = text;
        }, 5000);
    }
}
exports.default = Notifier;
//# sourceMappingURL=notifier.js.map