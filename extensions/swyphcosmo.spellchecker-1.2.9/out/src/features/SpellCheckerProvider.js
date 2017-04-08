'use strict';
var path = require('path');
var fs = require('fs');
var vscode = require('vscode');
var mkdirp = require('mkdirp');
var sc = require('../../../lib/hunspell-spellchecker/lib/index.js');
var jsonMinify = require('jsonminify');
// Toggle debug output
var DEBUG = false;
var SpellCheckerProvider = (function () {
    function SpellCheckerProvider() {
        this.problemCollection = {};
        this.diagnosticMap = {};
        this.DICT = undefined;
        this.SpellChecker = new sc();
        this.lastcheck = -1;
        this.timer = null;
    }
    SpellCheckerProvider.prototype.activate = function (context) {
        var _this = this;
        var subscriptions = context.subscriptions;
        this.extensionRoot = context.extensionPath;
        this.settings = this.getSettings();
        this.setLanguage(this.settings.language);
        vscode.commands.registerCommand('spellchecker.createSettingsFile', this.createSettingsFile, this);
        vscode.commands.registerCommand('spellchecker.showDocumentType', this.showDocumentType, this);
        // vscode.commands.registerCommand( 'spellchecker.setLanguage', SetLanguage );
        this.suggestCommand = vscode.commands.registerCommand(SpellCheckerProvider.suggestCommandId, this.fixSuggestionCodeAction, this);
        this.ignoreCommand = vscode.commands.registerCommand(SpellCheckerProvider.ignoreCommandId, this.ignoreCodeAction, this);
        this.alwaysIgnoreCommand = vscode.commands.registerCommand(SpellCheckerProvider.alwaysIgnoreCommandId, this.alwaysIgnoreCodeAction, this);
        subscriptions.push(this);
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('Spelling');
        vscode.workspace.onDidOpenTextDocument(this.doSpellCheck, this, subscriptions);
        vscode.workspace.onDidCloseTextDocument(function (textDocument) {
            _this.diagnosticCollection.delete(textDocument.uri);
        }, null, subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.doSpellCheck, this, subscriptions);
        vscode.workspace.onDidChangeTextDocument(this.doDiffSpellCheck, this, subscriptions);
        // Spell check all open documents
        vscode.workspace.textDocuments.forEach(this.doSpellCheck, this);
        // register code actions provider
        for (var i = 0; i < this.settings.documentTypes.length; i++)
            vscode.languages.registerCodeActionsProvider(this.settings.documentTypes[i], this);
    };
    SpellCheckerProvider.prototype.dispose = function () {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
        this.suggestCommand.dispose();
        this.ignoreCommand.dispose();
        this.alwaysIgnoreCommand.dispose();
    };
    SpellCheckerProvider.prototype.createSettingsFile = function () {
        if (SpellCheckerProvider.CONFIGFILE.length > 0 && !fs.existsSync(SpellCheckerProvider.CONFIGFILE)) {
            console.log('Spell checker configuration file not found');
            console.log('Creating file \'' + SpellCheckerProvider.CONFIGFILE + '\'');
            var defaultSettings = {
                language: 'en_US',
                ignoreWordsList: [],
                documentTypes: ['markdown', 'latex', 'plaintext'],
                ignoreRegExp: [],
                ignoreFileExtensions: [],
                checkInterval: 5000
            };
            this.saveWorkspaceSettings(defaultSettings);
        }
        else if (fs.existsSync(SpellCheckerProvider.CONFIGFILE)) {
            console.log('Spell checker configuration file already exists');
            console.log('Contents of \'' + SpellCheckerProvider.CONFIGFILE + '\'');
            console.log(fs.readFileSync(SpellCheckerProvider.CONFIGFILE, 'utf-8'));
        }
        else {
            console.log('Invalid Spell checker configuration file name: \'' + +SpellCheckerProvider.CONFIGFILE + '\'');
        }
    };
    SpellCheckerProvider.prototype.showDocumentType = function () {
        if (vscode.workspace.textDocuments.length > 0) {
            vscode.window.showInformationMessage('The documentType for the current file is \'' + vscode.workspace.textDocuments[0].languageId + '\'.');
        }
        else {
            vscode.window.showErrorMessage('documentType not found.');
        }
    };
    SpellCheckerProvider.prototype.doDiffSpellCheck = function (event) {
        // Is this a document type that we should check?
        if (this.settings.documentTypes.indexOf(event.document.languageId) < 0) {
            return;
        }
        // Is this a file extension that we should ignore?
        if (this.settings.ignoreFileExtensions.indexOf(path.extname(event.document.fileName)) >= 0) {
            return;
        }
        if (Date.now() - this.lastcheck > this.settings.checkInterval) {
            clearTimeout(this.timer);
            this.doSpellCheck(event.document);
        }
        else {
            clearTimeout(this.timer);
            this.timerTextDocument = event.document;
            this.timer = setTimeout(this.doSpellCheck.bind(this), 2 * this.settings.checkInterval);
        }
    };
    SpellCheckerProvider.prototype.doSpellCheck = function (textDocument) {
        if (textDocument == null) {
            textDocument = this.timerTextDocument;
        }
        if (DEBUG)
            console.log("documentType for " + textDocument.fileName + " is " + textDocument.languageId);
        if (DEBUG)
            console.log(textDocument);
        // Is this a private URI? (VSCode started having "private:" versions of non-plaintext documents with languageId = 'plaintext')
        if (textDocument.uri.scheme != "file") {
            return;
        }
        // Is this a document type that we should check?
        if (this.settings.documentTypes.indexOf(textDocument.languageId) < 0) {
            return;
        }
        // Is this a file extension that we should ignore?
        if (this.settings.ignoreFileExtensions.indexOf(path.extname(textDocument.fileName)) >= 0) {
            return;
        }
        var startTime = new Date().getTime();
        var lastSeconds = 0;
        if (DEBUG)
            console.log('Starting spell check on ' + textDocument.fileName);
        var diagnostics = [];
        var textoriginal = textDocument.getText();
        // change to common line endings
        textoriginal = textoriginal.replace(/\r?\n/g, '\n');
        var text = textoriginal;
        text = this.processUserIgnoreRegex(text);
        // remove pandoc yaml header
        text = text.replace(/---(.|\n)*\.\.\./g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove '&nbsp;'
        text = text.replace(/&nbsp;/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove citations
        text = text.replace(/\[-?@[A-Za-z:0-9\-]*\]/g, ' ');
        text = text.replace(/\{(\#|\.)[A-Za-z:0-9]+\}/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove code blocks
        text = text.replace(/^(```\s*)(\w+)?(\s*[\w\W]+?\n*)(```\s*)\n*$/gm, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove inline code blocks
        text = text.replace(/`[\w\W]+?`/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove image links
        // text = text.replace( /\]\([a-zA-Z0-9\/\\\.]+\)/g, ' ' );
        text = text.replace(/\(.*\.(jpg|jpeg|png|md|gif|pdf|svg)\)/gi, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove web links
        text = text.replace(/(http|https|ftp|git)\S*/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove email addresses 
        text = text.replace(/[a-zA-Z.\-0-9]+@[a-z.]+/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove non-letter characters
        text = text.replace(/[`\"!#$%&()*+,.\/:;<=>?@\[\]\\^_{|}\n\r\-~]/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove numbers:
        text = text.replace(/ [0-9]+/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove leading quotations
        text = text.replace(/[\s ]['"]([a-zA-Z0-9])/g, ' $1');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove trailing quotations
        text = text.replace(/' /g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // convert tabs to spaces
        text = text.replace(/\t/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        // remove LaTeX commands
        text = text.replace(/\\\w*\{.*?\}/g, ' ');
        if (DEBUG) {
            console.log(text);
            console.log('------------------------------------------');
        }
        var lastposition = 0;
        var position = 0;
        var linenumber = 0;
        var colnumber = 0;
        var lastline = 0;
        var tokens = text.split(' ');
        var lines = textoriginal.split('\n');
        if (DEBUG)
            console.log('Num tokens: ' + String(tokens.length));
        for (var i in tokens) {
            if (DEBUG) {
                var currTime = new Date().getTime();
                var seconds = Math.floor((currTime - startTime) / 1000);
                if (seconds % 10 == 0 && lastSeconds != seconds) {
                    lastSeconds = seconds;
                    console.log("Elapsed time: " + seconds + " seconds");
                }
            }
            var token = tokens[i];
            if (token.length > 3) {
                // find line number and column number
                position = lines[linenumber].indexOf(token, lastposition);
                while (position < 0) {
                    lastposition = 0;
                    linenumber++;
                    if (linenumber < lines.length)
                        position = lines[linenumber].indexOf(token, lastposition);
                    else
                        console.log('Error text not found: ' + token);
                }
                colnumber = position;
                lastposition = position;
                if (token.indexOf('’') >= 0) {
                    token = token.replace(/’/, '\'');
                }
                if (!this.SpellChecker.check(token)) {
                    if (DEBUG)
                        console.log('Error: \'' + token + '\', line ' + String(linenumber + 1) + ', col ' + String(colnumber + 1));
                    var lineRange = new vscode.Range(linenumber, colnumber, linenumber, colnumber + token.length);
                    // Make sure word isn't in the ignore list
                    if (this.settings.ignoreWordsList.indexOf(token) < 0) {
                        if (token in this.problemCollection) {
                            var diag = new vscode.Diagnostic(lineRange, this.problemCollection[token], vscode.DiagnosticSeverity.Error);
                            diag.source = 'Spell Checker';
                            diagnostics.push(diag);
                        }
                        else {
                            var message = 'Spelling [ ' + token + ' ]: suggestions [ ';
                            var containsNumber = token.match(/[0-9]+/g);
                            if (token.length < 50 && containsNumber == null) {
                                var suggestions = this.SpellChecker.suggest(token);
                                for (var _i = 0, suggestions_1 = suggestions; _i < suggestions_1.length; _i++) {
                                    var s = suggestions_1[_i];
                                    message += s + ', ';
                                }
                                if (suggestions.length > 0)
                                    message = message.slice(0, message.length - 2);
                            }
                            message += ' ]';
                            if (DEBUG)
                                console.log(message);
                            var diag = new vscode.Diagnostic(lineRange, message, vscode.DiagnosticSeverity.Error);
                            diag.source = 'Spell Checker';
                            diagnostics.push(diag);
                            if (diagnostics.length > 250) {
                                vscode.window.setStatusBarMessage("Over 250 spelling errors found!", 5000);
                                break;
                            }
                            this.problemCollection[token] = message;
                        }
                    }
                }
            }
        }
        this.diagnosticCollection.set(textDocument.uri, diagnostics);
        // create local copy so it can be updated
        this.diagnosticMap[textDocument.uri.toString()] = diagnostics;
        var endTime = new Date().getTime();
        var minutes = (endTime - startTime) / 1000;
        if (DEBUG) {
            console.log('Check completed in ' + String(minutes));
            console.log('Found ' + String(diagnostics.length) + ' errors');
        }
        this.lastcheck = Date.now();
    };
    SpellCheckerProvider.prototype.processUserIgnoreRegex = function (text) {
        for (var i = 0; i < this.settings.ignoreRegExp.length; i++) {
            // Convert the JSON of regExp Strings into a real RegExp
            var flags = this.settings.ignoreRegExp[i].replace(/.*\/([gimy]*)$/, '$1');
            var pattern = this.settings.ignoreRegExp[i].replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
            pattern = pattern.replace(/\\\\/g, '\\');
            if (DEBUG) {
                console.log(this.settings.ignoreRegExp[i]);
                console.log(pattern);
                console.log(flags);
            }
            var regex = new RegExp(pattern, flags);
            if (DEBUG)
                console.log(text.match(regex));
            text = text.replace(regex, ' ');
        }
        return text;
    };
    SpellCheckerProvider.prototype.provideCodeActions = function (document, range, context, token) {
        var diagnostic = context.diagnostics[0];
        if (!diagnostic)
            return null;
        // Get word
        var match = diagnostic.message.match(/^Spelling \[\ (.+)\ \]\:/);
        if (DEBUG && match) {
            console.log('Code action: match word');
            match.forEach(function (m) {
                console.log(m);
            });
        }
        var word = '';
        // should always be true
        if (match.length >= 2)
            word = match[1];
        if (word.length == 0)
            return undefined;
        // Get suggestions
        match = diagnostic.message.match(/suggestions \[\ (.+)\ \]$/);
        if (DEBUG && match) {
            console.log('Code action: match suggestions');
            match.forEach(function (m) {
                console.log(m);
            });
        }
        var suggestionstring = '';
        var commands = [];
        if (match && match.length >= 2) {
            suggestionstring = match[1];
            var suggestions = suggestionstring.split(/\,\ /g);
            // Add suggestions to command list
            suggestions.forEach(function (suggestion) {
                commands.push({
                    title: 'Replace with \'' + suggestion + '\'',
                    command: SpellCheckerProvider.suggestCommandId,
                    arguments: [document, diagnostic, word, suggestion]
                });
            });
        }
        commands.push({
            title: 'Add \'' + word + '\' to dictionary',
            command: SpellCheckerProvider.ignoreCommandId,
            arguments: [document, word]
        });
        commands.push({
            title: 'Always ignore \'' + word + '\'',
            command: SpellCheckerProvider.alwaysIgnoreCommandId,
            arguments: [document, word]
        });
        return commands;
    };
    SpellCheckerProvider.prototype.fixSuggestionCodeAction = function (document, diagnostic, word, suggestion) {
        var docWord = document.getText(diagnostic.range);
        if (word == docWord) {
            // Remove diagnostic from list
            var diagnostics = this.diagnosticMap[document.uri.toString()];
            var index = diagnostics.indexOf(diagnostic);
            diagnostics.splice(index, 1);
            // Update with new diagnostics
            this.diagnosticMap[document.uri.toString()] = diagnostics;
            this.diagnosticCollection.set(document.uri, diagnostics);
            // Insert the new text
            var edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, diagnostic.range, suggestion);
            return vscode.workspace.applyEdit(edit);
        }
        else {
            vscode.window.showErrorMessage('The suggestion was not applied because it is out of date. You might have tried to apply the same edit twice.');
        }
    };
    SpellCheckerProvider.prototype.ignoreCodeAction = function (document, word) {
        if (this.addWordToIgnoreList(word, true)) {
            this.doSpellCheck(document);
        }
        else {
            vscode.window.showWarningMessage('The word has already been added to the ignore list. You might have tried to add the same word twice.');
        }
    };
    SpellCheckerProvider.prototype.alwaysIgnoreCodeAction = function (document, word) {
        if (DEBUG) {
            console.log(word);
            console.log(document);
            console.log(Object.keys(document));
        }
        if (this.addWordToAlwaysIgnoreList(word)) {
            this.doSpellCheck(document);
        }
        else {
            vscode.window.showWarningMessage('The word has already been added to the ignore list. You might have tried to add the same word twice.');
        }
    };
    SpellCheckerProvider.prototype.addWordToIgnoreList = function (word, save) {
        // Only add the word if it's not already in the list
        if (this.settings.ignoreWordsList.indexOf(word) < 0) {
            this.settings.ignoreWordsList.push(word);
            this.saveWorkspaceSettings(this.settings);
            return true;
        }
        return false;
    };
    SpellCheckerProvider.prototype.addWordToAlwaysIgnoreList = function (word) {
        if (this.addWordToIgnoreList(word, false)) {
            var userSettingsData = this.getUserSettings();
            if (Object.keys(userSettingsData).indexOf('spellchecker.ignoreWordsList') > 0) {
                if (userSettingsData['spellchecker.ignoreWordsList'].indexOf(word) < 0) {
                    userSettingsData['spellchecker.ignoreWordsList'].push(word);
                    this.saveUserSettings(userSettingsData);
                    return true;
                }
                else
                    return false;
            }
            else {
                userSettingsData['spellchecker.ignoreWordsList'] = [word];
                this.saveUserSettings(userSettingsData);
                return true;
            }
        }
        return false;
    };
    SpellCheckerProvider.prototype.setLanguage = function (language) {
        if (language === void 0) { language = 'en_US'; }
        // console.log( path.join( extensionRoot, 'languages', settings.language + '.aff' ) )
        this.settings.language = language;
        this.DICT = this.SpellChecker.parse({
            aff: fs.readFileSync(path.join(this.extensionRoot, 'languages', this.settings.language + '.aff')),
            dic: fs.readFileSync(path.join(this.extensionRoot, 'languages', this.settings.language + '.dic'))
        });
        this.SpellChecker.use(this.DICT);
    };
    SpellCheckerProvider.prototype.getDocumentTypes = function () {
        return this.settings.documentTypes;
    };
    SpellCheckerProvider.prototype.getUniqueArray = function (array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    };
    SpellCheckerProvider.prototype.getUserSettingsFilename = function () {
        var codeFolder = 'Code';
        if (vscode.version.indexOf('insider') >= 0)
            codeFolder = 'Code - Insiders';
        if (process.platform == 'win32')
            return path.join(process.env.APPDATA, codeFolder, 'User', 'settings.json');
        else if (process.platform == 'darwin')
            return path.join(process.env.HOME, 'Library', 'Application Support', codeFolder, 'User', 'settings.json');
        else if (process.platform == 'linux')
            return path.join(process.env.HOME, '.config', codeFolder, 'User', 'settings.json');
        else
            return "";
    };
    SpellCheckerProvider.prototype.getUserSettings = function () {
        // Check user settings
        var userSettingsFilename = this.getUserSettingsFilename();
        if (userSettingsFilename.length > 0) {
            if (fs.existsSync(userSettingsFilename)) {
                var userSettingsFile = fs.readFileSync(userSettingsFilename, 'utf-8');
                // parse and remove any comment lines in the settings file
                return JSON.parse(jsonMinify(userSettingsFile));
            }
        }
        return null;
    };
    SpellCheckerProvider.prototype.saveUserSettings = function (settings) {
        var userSettingsFilename = this.getUserSettingsFilename();
        if (userSettingsFilename.length > 0) {
            var data = "// Place your settings in this file to overwrite the default settings\n" + JSON.stringify(settings, null, 4);
            fs.writeFileSync(userSettingsFilename, data);
            return true;
        }
        else
            return false;
    };
    SpellCheckerProvider.prototype.saveWorkspaceSettings = function (settings) {
        if (SpellCheckerProvider.CONFIGFILE.length > 0) {
            console.log('Saving spell check configuration');
            console.log(path.dirname(SpellCheckerProvider.CONFIGFILE));
            try {
                mkdirp.sync(path.dirname(SpellCheckerProvider.CONFIGFILE));
                fs.writeFileSync(SpellCheckerProvider.CONFIGFILE, JSON.stringify(settings, null, 4));
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    SpellCheckerProvider.prototype.getSettings = function () {
        var returnSettings = {
            language: 'en_US',
            ignoreWordsList: [],
            documentTypes: ['markdown', 'latex', 'plaintext'],
            ignoreRegExp: [],
            ignoreFileExtensions: [],
            checkInterval: 5000
        };
        // Check user settings
        var userSettingsData = this.getUserSettings();
        if (userSettingsData) {
            Object.keys(returnSettings).forEach(function (key) {
                if (userSettingsData['spellchecker.' + key]) {
                    returnSettings[key] = userSettingsData['spellchecker.' + key];
                }
            });
        }
        if (SpellCheckerProvider.CONFIGFILE.length == 0 && vscode.workspace.rootPath) {
            SpellCheckerProvider.CONFIGFILE = path.join(vscode.workspace.rootPath, '.vscode', 'spellchecker.json');
        }
        if (SpellCheckerProvider.CONFIGFILE.length > 0 && fs.existsSync(SpellCheckerProvider.CONFIGFILE)) {
            var settings_1 = JSON.parse(jsonMinify(fs.readFileSync(SpellCheckerProvider.CONFIGFILE, 'utf-8')));
            if (DEBUG) {
                console.log('Found configuration file');
                console.log(settings_1);
            }
            Object.keys(returnSettings).forEach(function (key) {
                if (Array.isArray(returnSettings[key]))
                    returnSettings[key] = this.getUniqueArray(returnSettings[key].concat(settings_1[key]));
                else
                    returnSettings[key] = settings_1[key];
            }, this);
        }
        else {
            if (DEBUG)
                console.log('Configuration file not found: ' + SpellCheckerProvider.CONFIGFILE);
        }
        return returnSettings;
    };
    SpellCheckerProvider.suggestCommandId = 'SpellChecker.fixSuggestionCodeAction';
    SpellCheckerProvider.ignoreCommandId = 'SpellChecker.ignoreCodeAction';
    SpellCheckerProvider.alwaysIgnoreCommandId = 'SpellChecker.alwaysIgnoreCodeAction';
    SpellCheckerProvider.CONFIGFILE = '';
    return SpellCheckerProvider;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpellCheckerProvider;
//# sourceMappingURL=SpellCheckerProvider.js.map