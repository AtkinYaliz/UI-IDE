'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const parse_engine_registry_1 = require('./parse-engines/parse-engine-registry');
class Fetcher {
    static findAllParseableDocuments() {
        return __awaiter(this, void 0, Promise, function* () {
            let include = parse_engine_registry_1.default.supportedLanguagesIds.reduce((previousValue, currentValue, currentIndex, array) => {
                previousValue += `**/*.${currentValue}`;
                if (currentIndex != array.length - 1) {
                    previousValue += `, `;
                }
                return previousValue;
            }, "");
            let exclude = 'node_modules/**/node_modules/**/*';
            let uris = yield vscode.workspace.findFiles(include, exclude);
            return uris;
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Fetcher;
//# sourceMappingURL=fetcher.js.map