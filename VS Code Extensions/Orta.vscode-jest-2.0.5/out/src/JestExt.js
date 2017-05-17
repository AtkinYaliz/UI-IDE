"use strict";
const vscode = require("vscode");
const path = require("path");
const jest_editor_support_1 = require("jest-editor-support");
const decorations = require("./decorations");
const status = require("./statusBar");
const TestReconcilationState = {
    Unknown: 'Unknown',
    KnownSuccess: 'KnownSuccess',
    KnownFail: 'KnownFail',
};
class JestExt {
    constructor(workspace, outputChannel, pluginSettings) {
        this.parsingTestFile = false;
        this.parseResults = {
            expects: [],
            itBlocks: []
        };
        this.workspace = workspace;
        this.channel = outputChannel;
        this.failingAssertionDecorators = [];
        this.failDiagnostics = vscode.languages.createDiagnosticCollection('Jest');
        this.clearOnNextInput = true;
        this.reconciler = new jest_editor_support_1.TestReconciler();
        this.jestSettings = new jest_editor_support_1.Settings(workspace);
        this.pluginSettings = pluginSettings;
        this.getSettings();
    }
    startProcess() {
        // The Runner is an event emitter that handles taking the Jest
        // output and converting it into different types of data that
        // we can handle here differently.
        if (this.jestProcess) {
            this.jestProcess.closeProcess();
            delete this.jestProcess;
        }
        this.jestProcess = new jest_editor_support_1.Runner(this.workspace);
        this.jestProcess.on('debuggerComplete', () => {
            this.channel.appendLine('Closed Jest');
        }).on('executableJSON', (data) => {
            this.updateWithData(data);
        }).on('executableOutput', (output) => {
            if (!output.includes('Watch Usage')) {
                this.channel.appendLine(output);
            }
        }).on('executableStdErr', (error) => {
            // The "tests are done" message comes through stdErr
            // We want to use this as a marker that the console should
            // be cleared, as the next input will be from a new test run.
            if (this.clearOnNextInput) {
                this.clearOnNextInput = false;
                this.parsingTestFile = false;
                this.testsHaveStartedRunning();
            }
            const message = error.toString();
            // thanks Qix, http://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings
            const noANSI = message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            if (noANSI.includes('snapshot test failed')) {
                this.detectedSnapshotErrors();
            }
            this.channel.appendLine(noANSI);
        }).on('nonTerminalError', (error) => {
            this.channel.appendLine(`Recieved an error from Jest Runner: ${error.toString()}`);
        }).on('exception', result => {
            this.channel.appendLine(`\nException raised: [${result.type}]: ${result.message}\n`);
        }).on('terminalError', (error) => {
            this.channel.appendLine('\nException raised: ' + error);
        });
        // The theme stuff
        this.setupDecorators();
        // The bottom bar thing
        this.setupStatusBar();
        // Go!
        this.jestProcess.start();
    }
    stopProcess() {
        this.channel.appendLine('Closing Jest jest_runner.');
        this.jestProcess.closeProcess();
        delete this.jestProcess;
        status.stopped();
    }
    getSettings() {
        this.jestSettings.getConfig(() => {
            if (this.jestSettings.jestVersionMajor < 18) {
                vscode.window.showErrorMessage('This extension relies on Jest 18+ features, it will work, but the highlighting may not work correctly.');
            }
            this.workspace.localJestMajorVersion = this.jestSettings.jestVersionMajor;
            // If we should start the process by default, do so
            if (this.pluginSettings.autoEnable) {
                this.startProcess();
            }
            else {
                this.channel.appendLine('Skipping initial Jest runner process start.');
            }
        });
    }
    detectedSnapshotErrors() {
        vscode.window.showInformationMessage('Would you like to update your Snapshots?', { title: 'Replace them' }).then((response) => {
            // No response == cancel
            if (response) {
                this.jestProcess.runJestWithUpdateForSnapshots(() => {
                    vscode.window.showInformationMessage('Updated Snapshots. It will show in your next test run.');
                });
            }
        });
    }
    triggerUpdateDecorations(editor) {
        if (!this.canUpdateDecorators(editor)) {
            return;
        }
        // OK - lets go
        this.parsingTestFile = true;
        // This makes it cheaper later down the line
        let successes = [];
        const fails = [];
        let unknowns = [];
        // Parse the current JS file
        this.parseResults = jest_editor_support_1.parse(editor.document.uri.fsPath);
        // Use the parsers it blocks for references
        const { itBlocks } = this.parseResults;
        // Loop through our it/test references, then ask the reconciler ( the thing 
        // that reads the JSON from Jest ) whether it has passed/failed/not ran.
        const filePath = editor.document.uri.fsPath;
        const fileState = this.reconciler.stateForTestFile(filePath);
        switch (fileState) {
            // If the file failed, then it can contain passes, fails and unknowns
            case TestReconcilationState.KnownFail:
                itBlocks.forEach(it => {
                    const state = this.reconciler.stateForTestAssertion(filePath, it.name);
                    if (state !== null) {
                        switch (state.status) {
                            case TestReconcilationState.KnownSuccess:
                                successes.push(it);
                                break;
                            case TestReconcilationState.KnownFail:
                                fails.push(it);
                                break;
                            case TestReconcilationState.Unknown:
                                unknowns.push(it);
                                break;
                        }
                    }
                    else {
                        unknowns.push(it);
                    }
                });
                break;
            // Test passed, all it's must be green
            case TestReconcilationState.KnownSuccess:
                successes = itBlocks;
                break;
            // We don't know, not ran probably
            case TestReconcilationState.Unknown:
                unknowns = itBlocks;
                break;
        }
        ;
        // Create a map for the states and styles to show inline.
        // Note that this specifically is only for dots.
        const styleMap = [
            { data: successes, decorationType: this.passingItStyle, state: TestReconcilationState.KnownSuccess },
            { data: fails, decorationType: this.failingItStyle, state: TestReconcilationState.KnownFail },
            { data: unknowns, decorationType: this.unknownItStyle, state: TestReconcilationState.Unknown }
        ];
        styleMap.forEach(style => {
            const decorators = this.generateDotsForItBlocks(style.data, style.state);
            editor.setDecorations(style.decorationType, decorators);
        });
        // Now we want to handle adding the error message after the failing assertion
        // so first we need to clear all assertions, this is a bit of a shame as it can flash
        // however, the API for a style in this case is not built to handle different inline texts 
        // as easily as it handles inline dots
        // Remove all of the existing line decorators
        this.failingAssertionDecorators.forEach(element => {
            editor.setDecorations(element, []);
        });
        this.failingAssertionDecorators = [];
        // We've got JSON data back from Jest about a failing test run.
        // We don't want to handle the decorators (inline dots/messages here)
        // but we can handle creating "problems" for the workspace here.
        // For each failed file
        this.reconciler.failedStatuses().forEach(fail => {
            // Generate a uri, and pull out the failing it/tests
            const uri = vscode.Uri.file(fail.file);
            const asserts = fail.assertions.filter(a => a.status === TestReconcilationState.KnownFail);
            asserts.forEach((assertion) => {
                const decorator = {
                    range: new vscode.Range(assertion.line - 1, 0, assertion.line - 1, 0),
                    hoverMessage: assertion.terseMessage
                };
                // We have to make a new style for each unique message, this is
                // why we have to remove off of them beforehand
                const style = decorations.failingAssertionStyle(assertion.terseMessage);
                this.failingAssertionDecorators.push(style);
                editor.setDecorations(style, [decorator]);
            });
            // Loop through each individual fail and create an diagnostic
            // to pass back to VS Code.
            this.failDiagnostics.set(uri, asserts.map(assertion => {
                const expect = this.expectAtLine(assertion.line);
                const start = expect ? expect.start.column - 1 : 0;
                const daig = new vscode.Diagnostic(new vscode.Range(assertion.line - 1, start, assertion.line - 1, start + 6), assertion.terseMessage, vscode.DiagnosticSeverity.Error);
                daig.source = 'Jest';
                return daig;
            }));
        });
        this.parsingTestFile = false;
    }
    canUpdateDecorators(editor) {
        const atEmptyScreen = !editor;
        if (atEmptyScreen) {
            return false;
        }
        const inSettings = !editor.document;
        if (inSettings) {
            return false;
        }
        if (this.parsingTestFile) {
            return false;
        }
        const isATestFile = this.wouldJestRunURI(editor.document.uri);
        return isATestFile;
    }
    wouldJestRunURI(uri) {
        const testRegex = new RegExp(this.jestSettings.settings.testRegex);
        const root = this.pluginSettings.rootPath;
        const filePath = uri.fsPath;
        let relative = path.normalize(path.relative(root, filePath));
        // replace windows path separator with normal slash
        if (path.sep === '\\') {
            relative = relative.replace(/\\/g, '/');
        }
        const matches = relative.match(testRegex);
        return matches && matches.length > 0;
    }
    setupStatusBar() {
        if (this.pluginSettings.autoEnable) {
            this.testsHaveStartedRunning();
        }
        else {
            status.initial();
        }
    }
    setupDecorators() {
        this.passingItStyle = decorations.passingItName();
        this.failingItStyle = decorations.failingItName();
        this.unknownItStyle = decorations.notRanItName();
    }
    testsHaveStartedRunning() {
        this.channel.clear();
        status.running();
    }
    updateWithData(data) {
        this.reconciler.updateFileWithJestStatus(data);
        this.failDiagnostics.clear();
        if (data.success) {
            status.success();
        }
        else {
            status.failed();
        }
        this.triggerUpdateDecorations(vscode.window.activeTextEditor);
        this.clearOnNextInput = true;
    }
    generateDotsForItBlocks(blocks, state) {
        const nameForState = (_name, state) => {
            switch (state) {
                case TestReconcilationState.KnownSuccess:
                    return 'Passed';
                case TestReconcilationState.KnownFail:
                    return 'Failed';
                case TestReconcilationState.Unknown:
                    return 'Test has not run yet, due to Jest only running tests related to changes.';
            }
        };
        return blocks.map(it => {
            return {
                // VS Code is indexed starting at 0
                // jest-editor-support is indexed starting at 1
                range: new vscode.Range(it.start.line - 1, it.start.column - 1, it.start.line - 1, it.start.column + 1),
                hoverMessage: nameForState(it.name, state),
            };
        });
    }
    // When we want to show an inline assertion, the only bit of
    // data to work with is the line number from the stack trace.
    // So we need to be able to go from that to the real
    // expect data.
    expectAtLine(line) {
        return this.parseResults.expects.find((e) => e.start.line === line);
    }
    deactivate() {
        this.jestProcess.closeProcess();
    }
}
exports.JestExt = JestExt;
//# sourceMappingURL=JestExt.js.map