'use strict';
const css_parse_engine_1 = require('./types/css-parse-engine');
class ParseEngineRegistry {
    static get supportedLanguagesIds() {
        if (!ParseEngineRegistry._supportedLanguagesIds) {
            ParseEngineRegistry._supportedLanguagesIds = ParseEngineRegistry._registry.reduce((previousValue, currentValue, currentIndex, array) => {
                previousValue.push(currentValue.languageId);
                return previousValue;
            }, []);
        }
        return ParseEngineRegistry._supportedLanguagesIds;
    }
    static getParseEngine(languageId) {
        let foundParseEngine = ParseEngineRegistry._registry.find((value, index, obj) => {
            return value.languageId === languageId;
        });
        if (!foundParseEngine) {
            throw `Could not find a parse engine for the provided language id ("${languageId}").`;
        }
        return foundParseEngine;
    }
}
ParseEngineRegistry._registry = [
    new css_parse_engine_1.default()
];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParseEngineRegistry;
//# sourceMappingURL=parse-engine-registry.js.map