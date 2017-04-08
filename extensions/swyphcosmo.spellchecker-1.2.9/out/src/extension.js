'use strict';
var SpellCheckerProvider_1 = require('./features/SpellCheckerProvider');
function activate(context) {
    // Log activate function
    console.log('Spellchecker now active!');
    var spellchecker = new SpellCheckerProvider_1.default();
    spellchecker.activate(context);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map