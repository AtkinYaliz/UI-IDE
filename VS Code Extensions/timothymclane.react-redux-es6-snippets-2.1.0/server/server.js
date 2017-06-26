'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const snippets_1 = require("./snippets");
let connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
let documents = new vscode_languageserver_1.TextDocuments();
documents.listen(connection);
let workspaceRoot;
connection.onInitialize((params) => {
    workspaceRoot = params.rootPath;
    return {
        capabilities: {
            completionProvider: {
                resolveProvider: true
            }
        }
    };
});
let linterRules;
let es6Snippets;
connection.onDidChangeConfiguration((change) => {
    let settings = change.settings;
    linterRules = settings.reactReduxSnippets.LinterRules;
    if (linterRules == "Loose") {
        es6Snippets = snippets_1.default.loose;
    }
    else if (linterRules == "Strict") {
        es6Snippets = snippets_1.default.strict;
    }
});
connection.onCompletion((textDocumentPosition) => {
    return snippets_1.default.snippets.map(item => {
        return {
            label: item.label,
            kind: vscode_languageserver_1.CompletionItemKind.Snippet,
            data: item.data
        };
    });
});
function getSnippet(snippet) {
    return snippet.body.join("\n");
}
connection.onCompletionResolve((item) => {
    const es6Snippet = es6Snippets.filter(snippet => snippet.prefix == item.data);
    if (es6Snippet.length > 0) {
        item.insertText = getSnippet(es6Snippet[0]);
        item.insertTextFormat = 2;
        item.documentation = es6Snippet[0].description;
    }
    return item;
});
connection.listen();
//# sourceMappingURL=server.js.map