"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const _ = require("lodash");
const vscode = require("vscode");
const fetcher_1 = require("./fetcher");
const notifier_1 = require("./notifier");
const parse_engine_gateway_1 = require("./parse-engine-gateway");
let notifier = new notifier_1.default('html-css-class-completion.cache');
let uniqueDefinitions;
const completionTriggerChars = ['"', '\'', ' '];
function cache() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            notifier.notify('eye', 'Looking for CSS classes on the workspace...');
            console.log('Looking for parseable documents...');
            let uris = yield fetcher_1.default.findAllParseableDocuments();
            if (!uris) {
                console.log("Found no documents");
                notifier.statusBarItem.hide();
                return;
            }
            console.log('Found all parseable documents.');
            let definitions = [];
            let failedLogs = '';
            let failedLogsCount = 0;
            console.log('Parsing documents and looking for CSS class definitions...');
            return async.each(uris, (uri, callback) => __awaiter(this, void 0, void 0, function* () {
                try {
                    Array.prototype.push.apply(definitions, yield parse_engine_gateway_1.default.callParser(uri));
                    callback();
                }
                catch (error) {
                    failedLogs += `${uri.path}\n`;
                    failedLogsCount++;
                    callback();
                }
            }), (error) => {
                if (error) {
                    console.error('Failed to parse the documents: ', error);
                    return reject(error);
                }
                uniqueDefinitions = _.uniqBy(definitions, def => def.className);
                console.log('Summary:');
                console.log(uris.length, 'parseable documents found');
                console.log(definitions.length, 'CSS class definitions found');
                console.log(uniqueDefinitions.length, 'unique CSS class definitions found');
                console.log(failedLogsCount, 'failed attempts to parse. List of the documents:');
                console.log(failedLogs);
                notifier.notify('zap', 'CSS classes cached (click to cache again)');
                return resolve();
            });
        }
        catch (error) {
            console.error('Failed while looping through the documents to cache the classes definitions:', error);
            notifier.notify('alert', 'Failed to cache the CSS classes on the workspace (click for another attempt)');
            return reject(error);
        }
    }));
}
function provideCompletionItemsGenerator(languageSelector, classMatchRegex) {
    return vscode.languages.registerCompletionItemProvider(languageSelector, {
        provideCompletionItems(document, position) {
            const start = new vscode.Position(position.line, 0);
            const range = new vscode.Range(start, position);
            const text = document.getText(range);
            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            const rawClasses = text.match(classMatchRegex);
            if (rawClasses.length === 1) {
                return [];
            }
            // Will store the classes found on the class attribute
            let classesOnAttribute = rawClasses[1].split(' ');
            // Creates a collection of CompletionItem based on the classes already cached
            let completionItems = uniqueDefinitions.map(definition => {
                return new vscode.CompletionItem(definition.className, vscode.CompletionItemKind.Variable);
            });
            // Removes from the collection the classes already specified on the class attribute
            for (let i = 0; i < classesOnAttribute.length; i++) {
                for (let j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].label === classesOnAttribute[i]) {
                        completionItems.splice(j, 1);
                    }
                }
            }
            return completionItems;
        }
    }, ...completionTriggerChars);
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.subscriptions.push(vscode.commands.registerCommand('html-css-class-completion.cache', () => __awaiter(this, void 0, void 0, function* () {
            yield cache();
        })));
        const htmlRegex = /class=["|']([\w- ]*$)/;
        const jsxRegex = /className=["|']([\w- ]*$)/;
        const html = provideCompletionItemsGenerator('html', htmlRegex);
        const razor = provideCompletionItemsGenerator('razor', htmlRegex);
        const php = provideCompletionItemsGenerator('php', htmlRegex);
        const vue = provideCompletionItemsGenerator('vue', htmlRegex);
        const twig = provideCompletionItemsGenerator('twig', htmlRegex);
        const md = provideCompletionItemsGenerator('markdown', htmlRegex);
        const tsReact = provideCompletionItemsGenerator('typescriptreact', jsxRegex);
        const js = provideCompletionItemsGenerator('javascript', jsxRegex);
        const jsReact = provideCompletionItemsGenerator('javascriptreact', jsxRegex);
        context.subscriptions.push(html);
        context.subscriptions.push(razor);
        context.subscriptions.push(php);
        context.subscriptions.push(vue);
        context.subscriptions.push(twig);
        context.subscriptions.push(md);
        context.subscriptions.push(tsReact);
        context.subscriptions.push(js);
        context.subscriptions.push(jsReact);
        yield cache();
    });
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
// TODO: Look for CSS class definitions automatically in case a new file is added to the workspace. I think the API does not provide and event for that. Maybe I should consider opening a PR.
//# sourceMappingURL=extension.js.map