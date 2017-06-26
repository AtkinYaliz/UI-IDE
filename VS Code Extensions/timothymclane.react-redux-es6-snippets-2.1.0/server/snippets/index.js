"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loose_1 = require("./loose");
const strict_1 = require("./strict");
class SnippetData {
    constructor(snippet) {
        this.snippet = snippet;
        this.label = snippet.prefix;
        this.data = snippet.prefix;
    }
}
const snippetData = loose_1.default.map(element => {
    return new SnippetData(element);
});
exports.default = {
    loose: loose_1.default,
    strict: strict_1.default,
    snippets: snippetData
};
//# sourceMappingURL=index.js.map