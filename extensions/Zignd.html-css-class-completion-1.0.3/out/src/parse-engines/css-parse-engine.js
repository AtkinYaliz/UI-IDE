'use strict';
var vscode = require('vscode');
var css_class_definition_1 = require('../common/css-class-definition');
var CssParseEngine = (function () {
    function CssParseEngine() {
        this.languageId = 'css';
    }
    CssParseEngine.prototype.parse = function (textDocument) {
        // TODO: Look for CSS classes defined on the `textDocument` and return them
        var definitions = [
            new css_class_definition_1.CssClassDefinition('btn', new vscode.Location(vscode.Uri.file('qwe.css'), new vscode.Position(1, 1))),
            new css_class_definition_1.CssClassDefinition('btn-primary', new vscode.Location(vscode.Uri.file('qwe.css'), new vscode.Position(1, 1))),
            new css_class_definition_1.CssClassDefinition('btn-large', new vscode.Location(vscode.Uri.file('qwe.css'), new vscode.Position(1, 1)))
        ];
        return definitions;
    };
    return CssParseEngine;
}());
exports.CssParseEngine = CssParseEngine;
//# sourceMappingURL=css-parse-engine.js.map