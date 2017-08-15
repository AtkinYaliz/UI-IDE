/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const os = require("os");
const util_1 = require("./util");
const debugInstall = require("./install");
const platform_1 = require("./../platform");
let _debugUtil = null;
let _reporter = null;
let _logger = null;
function activate(thisExtension, context, reporter, logger, channel) {
    _debugUtil = new util_1.CoreClrDebugUtil(context.extensionPath, logger);
    _reporter = reporter;
    _logger = logger;
    if (!util_1.CoreClrDebugUtil.existsSync(_debugUtil.debugAdapterDir())) {
        platform_1.PlatformInformation.GetCurrent().then((info) => {
            if (info.architecture !== "x86_64") {
                if (info.isWindows() && info.architecture === "x86") {
                    logger.appendLine(`[WARNING]: x86 Windows is not currently supported by the .NET Core debugger. Debugging will not be available.`);
                }
                else {
                    logger.appendLine(`[WARNING]: Processor architecture '${info.architecture}' is not currently supported by the .NET Core debugger. Debugging will not be available.`);
                }
            }
            else {
                logger.appendLine("[ERROR]: C# Extension failed to install the debugger package");
                showInstallErrorMessage(channel);
            }
        }, (err) => {
            // Somehow we couldn't figure out the platform we are on
            logger.appendLine("[ERROR]: C# Extension failed to install the debugger package");
            showInstallErrorMessage(channel);
        });
    }
    else if (!util_1.CoreClrDebugUtil.existsSync(_debugUtil.installCompleteFilePath())) {
        completeDebuggerInstall(logger, channel);
    }
}
exports.activate = activate;
function completeDebuggerInstall(logger, channel) {
    _debugUtil.checkDotNetCli()
        .then((dotnetInfo) => {
        if (os.platform() === "darwin" && !util_1.CoreClrDebugUtil.isMacOSSupported()) {
            logger.appendLine("[ERROR] The debugger cannot be installed. The debugger requires macOS 10.12 (Sierra) or newer.");
            channel.show();
            vscode.window.showErrorMessage("The .NET Core debugger cannot be installed. The debugger requires macOS 10.12 (Sierra) or newer.");
            return;
        }
        let installer = new debugInstall.DebugInstaller(_debugUtil);
        installer.finishInstall()
            .then(() => {
            vscode.window.setStatusBarMessage('Successfully installed .NET Core Debugger.', 5000);
        })
            .catch((err) => {
            logger.appendLine("[ERROR]: An error occured while installing the .NET Core Debugger:");
            logger.appendLine(err);
            showInstallErrorMessage(channel);
            // TODO: log telemetry?
        });
    }, (err) => {
        // Check for dotnet tools failed. pop the UI
        // err is a DotNetCliError but use defaults in the unexpected case that it's not
        showDotnetToolsWarning(err.ErrorMessage || _debugUtil.defaultDotNetCliErrorMessage());
        _logger.appendLine(err.ErrorString || err);
        // TODO: log telemetry?
    });
}
function showInstallErrorMessage(channel) {
    channel.show();
    vscode.window.showErrorMessage("An error occured during installation of the .NET Core Debugger. The C# extension may need to be reinstalled.");
}
function showDotnetToolsWarning(message) {
    const config = vscode.workspace.getConfiguration('csharp');
    if (!config.get('suppressDotnetInstallWarning', false)) {
        const getDotNetMessage = 'Get .NET CLI tools';
        const goToSettingsMessage = 'Disable this message in user settings';
        // Buttons are shown in right-to-left order, with a close button to the right of everything;
        // getDotNetMessage will be the first button, then goToSettingsMessage, then the close button.
        vscode.window.showErrorMessage(message, goToSettingsMessage, getDotNetMessage).then(value => {
            if (value === getDotNetMessage) {
                let open = require('open');
                let dotnetcoreURL = 'https://www.microsoft.com/net/core';
                // Windows redirects https://www.microsoft.com/net/core to https://www.microsoft.com/net/core#windowsvs2015
                if (process.platform == "win32") {
                    dotnetcoreURL = dotnetcoreURL + '#windowscmd';
                }
                open(dotnetcoreURL);
            }
            else if (value === goToSettingsMessage) {
                vscode.commands.executeCommand('workbench.action.openGlobalSettings');
            }
        });
    }
}
//# sourceMappingURL=activate.js.map