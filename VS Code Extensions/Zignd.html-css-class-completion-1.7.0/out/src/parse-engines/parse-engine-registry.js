"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const css_parse_engine_1 = require("./types/css-parse-engine");
const html_parse_engine_1 = require("./types/html-parse-engine");
class ParseEngineRegistry {
    static get supportedLanguagesIds() {
        if (!ParseEngineRegistry._supportedLanguagesIds) {
            ParseEngineRegistry._supportedLanguagesIds = ParseEngineRegistry._registry.map(parseEngine => parseEngine.languageId);
        }
        return ParseEngineRegistry._supportedLanguagesIds;
    }
    static getParseEngine(languageId) {
        let foundParseEngine = ParseEngineRegistry._registry.find(value => value.languageId === languageId);
        if (!foundParseEngine) {
            throw `Could not find a parse engine for the provided language id ("${languageId}").`;
        }
        return foundParseEngine;
    }
}
ParseEngineRegistry._registry = [
    new css_parse_engine_1.default(),
    new html_parse_engine_1.default()
];
exports.default = ParseEngineRegistry;
//# sourceMappingURL=parse-engine-registry.js.map