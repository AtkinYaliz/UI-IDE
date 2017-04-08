'use strict';
const vscode = require('vscode');
class StatusBarItemHelper {
    constructor(alignment, priority) {
        this.statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
    }
    inform(icon, text) {
        this.statusBarItem.text = `$(${icon}) ${text}`;
        // TODO: Add clever logic to hide text after a period of time, the code below is almost there, there just little bug in it
        // setTimeout(function () {
        //     StatusBarItemHelper.statusBarItem.text = `$(${icon})`;
        //     StatusBarItemHelper.statusBarItem.tooltip = text;
        // }, 5000);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatusBarItemHelper;
//# sourceMappingURL=status-bar-item-helper.js.map