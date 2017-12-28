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
const Bluebird = require("bluebird");
const _ = require("lodash");
const vscode = require("vscode");
const fetcher_1 = require("./fetcher");
const notifier_1 = require("./notifier");
const parse_engine_gateway_1 = require("./parse-engine-gateway");
let notifier = new notifier_1.default('html-css-class-completion.cache');
let uniqueDefinitions = [];
const completionTriggerChars = ['"', '\'', ' ', '.'];
let caching = false;
function cache() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            notifier.notify('eye', 'Looking for CSS classes in the workspace...');
            console.log('Looking for parseable documents...');
            let uris = yield fetcher_1.default.findAllParseableDocuments();
            if (!uris) {
                console.log("Found no documents");
                notifier.statusBarItem.hide();
                return;
            }
            console.log('Found all parseable documents.');
            let definitions = [];
            let filesParsed = 0;
            let failedLogs = '';
            let failedLogsCount = 0;
            console.log('Parsing documents and looking for CSS class definitions...');
            try {
                yield Bluebird.map(uris, (uri) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        Array.prototype.push.apply(definitions, yield parse_engine_gateway_1.default.callParser(uri));
                    }
                    catch (error) {
                        failedLogs += `${uri.path}\n`;
                        failedLogsCount++;
                    }
                    filesParsed++;
                    notifier.notify('eye', 'Looking for CSS classes in the workspace... (' + ((filesParsed / uris.length) * 100).toFixed(2) + '%)', false);
                }), { concurrency: 30 });
            }
            catch (err) {
                console.error('Failed to parse the documents: ', err);
                notifier.notify('alert', 'Failed to cache the CSS classes in the workspace (click for another attempt)');
                return reject(err);
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
        }
        catch (error) {
            console.error('Failed to cache the class definitions during the iterations over the documents that were found:', error);
            notifier.notify('alert', 'Failed to cache the CSS classes in the workspace (click for another attempt)');
            return reject(error);
        }
    }));
}
function provideCompletionItemsGenerator(languageSelector, classMatchRegex, classPrefix = '') {
    return vscode.languages.registerCompletionItemProvider(languageSelector, {
        provideCompletionItems(document, position) {
            const start = new vscode.Position(position.line, 0);
            const range = new vscode.Range(start, position);
            const text = document.getText(range);
            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            const rawClasses = text.match(classMatchRegex);
            if (!rawClasses || rawClasses.length === 1) {
                return [];
            }
            // Will store the classes found on the class attribute
            let classesOnAttribute = rawClasses[1].split(' ');
            // Creates a collection of CompletionItem based on the classes already cached
            let completionItems = uniqueDefinitions.map(definition => {
                const completionItem = new vscode.CompletionItem(definition.className, vscode.CompletionItemKind.Variable);
                const completionClassName = `${classPrefix}${definition.className}`;
                completionItem.filterText = completionClassName;
                completionItem.insertText = completionClassName;
                return completionItem;
            });
            // Removes from the collection the classes already specified on the class attribute
            for (let i = 0; i < classesOnAttribute.length; i++) {
                for (let j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].insertText === classesOnAttribute[i]) {
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
            if (caching)
                return;
            caching = true;
            try {
                yield cache();
            }
            finally {
                caching = false;
            }
        })));
        // Javascript based extensions
        ['typescriptreact', 'javascript', 'javascriptreact'].forEach((extension) => {
            context.subscriptions.push(provideCompletionItemsGenerator(extension, /className=["|']([\w- ]*$)/));
        });
        // HTML based extensions
        ['html', 'razor', 'php', 'blade', 'vue', 'twig', 'markdown', 'erb', 'handlebars', 'ejs'].forEach((extension) => {
            context.subscriptions.push(provideCompletionItemsGenerator(extension, /class=["|']([\w- ]*$)/));
        });
        // CSS based extensions
        ['css', 'sass', 'scss'].forEach((extension) => {
            // Support for Tailwind CSS
            context.subscriptions.push(provideCompletionItemsGenerator(extension, /@apply ([\.\w- ]*$)/, '.'));
        });
        caching = true;
        try {
            yield cache();
        }
        finally {
            caching = false;
        }
    });
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map