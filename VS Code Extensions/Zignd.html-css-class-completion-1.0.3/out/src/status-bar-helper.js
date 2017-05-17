'use strict';
var vscode = require('vscode');
var StatusBarItemHelper = (function () {
    function StatusBarItemHelper() {
    }
    StatusBarItemHelper.inform = function (icon, text) {
        StatusBarItemHelper.statusBarItem.text = "$(" + icon + ") " + text;
        setTimeout(function () {
            StatusBarItemHelper.statusBarItem.text = "$(" + icon + ")";
            StatusBarItemHelper.statusBarItem.tooltip = text;
        }, 5000);
    };
    return StatusBarItemHelper;
}());
StatusBarItemHelper.statusBarItem = vscode.window.createStatusBarItem();
StatusBarItemHelper.statusBarItem.show();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatusBarItemHelper;
//# sourceMappingURL=status-bar-helper.js.map