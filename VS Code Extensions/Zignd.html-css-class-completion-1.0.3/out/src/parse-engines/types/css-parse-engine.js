'use strict';
const css = require('css');
const css_class_definition_1 = require('../../common/css-class-definition');
class CssParseEngine {
    constructor() {
        this.languageId = 'css';
    }
    parse(textDocument) {
        let definitions = [];
        let code = textDocument.getText();
        let codeAst = css.parse(code);
        // go through each of the rules...
        codeAst.stylesheet.rules.forEach((rule) => {
            // ...of type rule
            if (rule.type === 'rule') {
                // go through each of the selectors of the current rule 
                rule.selectors.forEach((selector) => {
                    let classNameRegex = /[.]([\w-]+)/g;
                    var item = null;
                    while (item = classNameRegex.exec(selector)) {
                        definitions.push(new css_class_definition_1.default(item[1]));
                    }
                });
            }
        });
        return definitions;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CssParseEngine;
//# sourceMappingURL=css-parse-engine.js.map