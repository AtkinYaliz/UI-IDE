'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const SpellCheckerProvider_1 = require("./features/SpellCheckerProvider");
function activate(context) {
    let spellchecker = new SpellCheckerProvider_1.default();
    spellchecker.activate(context);
    // Log activate function
    console.log('Spellchecker now active!');
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map