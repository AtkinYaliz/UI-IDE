"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const vscode = require("vscode");
const common_1 = require("../common");
const fs = require("fs-extra");
const path = require("path");
const child_process = require("child_process");
const platform_1 = require("../platform");
class AttachPicker {
    constructor(attachItemsProvider) {
        this.attachItemsProvider = attachItemsProvider;
    }
    ShowAttachEntries() {
        return this.attachItemsProvider.getAttachItems()
            .then(processEntries => {
            let attachPickOptions = {
                matchOnDescription: true,
                matchOnDetail: true,
                placeHolder: "Select the process to attach to"
            };
            return vscode.window.showQuickPick(processEntries, attachPickOptions)
                .then(chosenProcess => {
                return chosenProcess ? chosenProcess.id : null;
            });
        });
    }
}
exports.AttachPicker = AttachPicker;
class RemoteAttachPicker {
    static get commColumnTitle() { return Array(PsOutputParser.secondColumnCharacters).join("a"); }
    static get linuxPsCommand() { return `ps -axww -o pid=,comm=${RemoteAttachPicker.commColumnTitle},args=`; }
    static get osxPsCommand() { return `ps -axww -o pid=,comm=${RemoteAttachPicker.commColumnTitle},args= -c`; }
    static get debuggerCommand() { return "${debuggerCommand}"; }
    ;
    static get scriptShellCmd() { return "sh -s"; }
    ;
    static ValidateAndFixPipeProgram(program) {
        return platform_1.PlatformInformation.GetCurrent().then(platformInfo => {
            // Check if we are on a 64 bit Windows
            if (platformInfo.isWindows() && platformInfo.architecture === "x86_64") {
                let sysRoot = process.env.SystemRoot;
                let oldPath = path.join(sysRoot, 'System32');
                let newPath = path.join(sysRoot, 'sysnative');
                // Escape backslashes, replace and ignore casing
                let regex = RegExp(oldPath.replace(/\\/g, '\\\\'), "ig");
                // Replace System32 with sysnative
                let newProgram = program.replace(regex, newPath);
                // Check if program strong contains System32 directory.
                // And if the program does not exist in System32, but it does in sysnative.
                // Return sysnative program
                if (program.toLowerCase().startsWith(oldPath.toLowerCase()) &&
                    !fs.existsSync(program) && fs.existsSync(newProgram)) {
                    return newProgram;
                }
            }
            // Return original program and let it fall through
            return program;
        });
    }
    // Note: osPlatform is passed as an argument for testing.
    static getPipeTransportOptions(pipeTransport, osPlatform) {
        let pipeProgram = pipeTransport.pipeProgram;
        let pipeArgs = pipeTransport.pipeArgs;
        let quoteArgs = pipeTransport.quoteArgs != null ? pipeTransport.quoteArgs : true; // default value is true
        let platformSpecificPipeTransportOptions = this.getPlatformSpecificPipeTransportOptions(pipeTransport, osPlatform);
        if (platformSpecificPipeTransportOptions) {
            pipeProgram = platformSpecificPipeTransportOptions.pipeProgram || pipeProgram;
            pipeArgs = platformSpecificPipeTransportOptions.pipeArgs || pipeArgs;
            quoteArgs = platformSpecificPipeTransportOptions.quoteArgs != null ? platformSpecificPipeTransportOptions.quoteArgs : quoteArgs;
        }
        return {
            pipeProgram: pipeProgram,
            pipeArgs: pipeArgs,
            quoteArgs: quoteArgs
        };
    }
    // If the current process is on a current operating system and a specific pipe transport
    // is included, then use that specific pipe transport configuration.
    //
    // Note: osPlatform is passed as an argument for testing.
    static getPlatformSpecificPipeTransportOptions(config, osPlatform) {
        if (osPlatform === "darwin" && config.osx) {
            return config.osx;
        }
        else if (osPlatform === "linux" && config.linux) {
            return config.linux;
        }
        else if (osPlatform === "win32" && config.windows) {
            return config.windows;
        }
        return null;
    }
    // Creates a pipe command string based on the type of pipe args.
    static createPipeCmd(pipeProgram, pipeArgs, quoteArgs) {
        return this.ValidateAndFixPipeProgram(pipeProgram).then(fixedPipeProgram => {
            if (typeof pipeArgs === "string") {
                return Promise.resolve(this.createPipeCmdFromString(fixedPipeProgram, pipeArgs, quoteArgs));
            }
            else if (pipeArgs instanceof Array) {
                return Promise.resolve(this.createPipeCmdFromArray(fixedPipeProgram, pipeArgs, quoteArgs));
            }
            else {
                // Invalid args type
                return Promise.reject(new Error("pipeArgs must be a string or a string array type"));
            }
        });
    }
    static createPipeCmdFromString(pipeProgram, pipeArgs, quoteArgs) {
        // Quote program if quoteArgs is true.
        let pipeCmd = this.quoteArg(pipeProgram);
        // If ${debuggerCommand} exists in pipeArgs, replace. No quoting is applied to the command here.
        if (pipeArgs.indexOf(this.debuggerCommand) >= 0) {
            pipeCmd = pipeCmd.concat(" ", pipeArgs.replace(/\$\{debuggerCommand\}/g, this.scriptShellCmd));
        }
        else {
            pipeCmd = pipeCmd.concat(" ", pipeArgs.concat(" ", this.quoteArg(this.scriptShellCmd, quoteArgs)));
        }
        return pipeCmd;
    }
    static createPipeCmdFromArray(pipeProgram, pipeArgs, quoteArgs) {
        let pipeCmdList = [];
        // Add pipeProgram to the start. Quoting is handeled later.
        pipeCmdList.push(pipeProgram);
        // If ${debuggerCommand} exists, replace it.
        if (pipeArgs.filter(arg => arg.indexOf(this.debuggerCommand) >= 0).length > 0) {
            for (let arg of pipeArgs) {
                while (arg.indexOf(this.debuggerCommand) >= 0) {
                    arg = arg.replace(this.debuggerCommand, RemoteAttachPicker.scriptShellCmd);
                }
                pipeCmdList.push(arg);
            }
        }
        else {
            pipeCmdList = pipeCmdList.concat(pipeArgs);
            pipeCmdList.push(this.scriptShellCmd);
        }
        // Quote if enabled.
        return quoteArgs ? this.createArgumentList(pipeCmdList) : pipeCmdList.join(' ');
    }
    // Quote the arg if the flag is enabled and there is a space.
    static quoteArg(arg, quoteArg = true) {
        if (quoteArg && arg.includes(' ')) {
            return `"${arg}"`;
        }
        return arg;
    }
    // Converts an array of string arguments to a string version. Always quotes any arguments with spaces.
    static createArgumentList(args) {
        return args.map(arg => this.quoteArg(arg)).join(" ");
    }
    static ShowAttachEntries(args) {
        // Create remote attach output channel for errors.
        if (!RemoteAttachPicker._channel) {
            RemoteAttachPicker._channel = vscode.window.createOutputChannel('remote-attach');
        }
        else {
            RemoteAttachPicker._channel.clear();
        }
        // Grab selected name from UI
        // Args may be null if ran with F1
        let name = args ? args.name : null;
        if (!name) {
            // Config name not found. 
            return Promise.reject(new Error("Name not defined in current configuration."));
        }
        if (!args.pipeTransport || !args.pipeTransport.debuggerPath) {
            // Missing PipeTransport and debuggerPath, prompt if user wanted to just do local attach.
            return Promise.reject(new Error("Configuration \"" + name + "\" in launch.json does not have a " +
                "pipeTransport argument with debuggerPath for pickRemoteProcess. Use pickProcess for local attach."));
        }
        else {
            let pipeTransport = this.getPipeTransportOptions(args.pipeTransport, os.platform());
            return RemoteAttachPicker.createPipeCmd(pipeTransport.pipeProgram, pipeTransport.pipeArgs, pipeTransport.quoteArgs)
                .then(pipeCmd => RemoteAttachPicker.getRemoteOSAndProcesses(pipeCmd))
                .then(processes => {
                let attachPickOptions = {
                    matchOnDescription: true,
                    matchOnDetail: true,
                    placeHolder: "Select the process to attach to"
                };
                return vscode.window.showQuickPick(processes, attachPickOptions);
            })
                .then(item => { return item ? item.id : Promise.reject(new Error("Could not find a process id to attach.")); });
        }
    }
    static getRemoteOSAndProcesses(pipeCmd) {
        const scriptPath = path.join(common_1.getExtensionPath(), 'scripts', 'remoteProcessPickerScript');
        return execChildProcessAndOutputErrorToChannel(`${pipeCmd} < ${scriptPath}`, null, RemoteAttachPicker._channel).then(output => {
            // OS will be on first line
            // Processess will follow if listed
            let lines = output.split(/\r?\n/);
            if (lines.length == 0) {
                return Promise.reject(new Error("Pipe transport failed to get OS and processes."));
            }
            else {
                let remoteOS = lines[0].replace(/[\r\n]+/g, '');
                if (remoteOS != "Linux" && remoteOS != "Darwin") {
                    return Promise.reject(new Error(`Operating system "${remoteOS}"" not supported.`));
                }
                // Only got OS from uname
                if (lines.length == 1) {
                    return Promise.reject(new Error("Transport attach could not obtain processes list."));
                }
                else {
                    let processes = lines.slice(1);
                    return sortProcessEntries(PsOutputParser.parseProcessFromPsArray(processes), remoteOS);
                }
            }
        });
    }
}
RemoteAttachPicker._channel = null;
exports.RemoteAttachPicker = RemoteAttachPicker;
class Process {
    constructor(name, pid, commandLine) {
        this.name = name;
        this.pid = pid;
        this.commandLine = commandLine;
    }
    toAttachItem() {
        return {
            label: this.name,
            description: this.pid,
            detail: this.commandLine,
            id: this.pid
        };
    }
}
class DotNetAttachItemsProviderFactory {
    static Get() {
        if (os.platform() === 'win32') {
            return new WmicAttachItemsProvider();
        }
        else {
            return new PsAttachItemsProvider();
        }
    }
}
exports.DotNetAttachItemsProviderFactory = DotNetAttachItemsProviderFactory;
class DotNetAttachItemsProvider {
    getAttachItems() {
        return this.getInternalProcessEntries().then(processEntries => {
            return sortProcessEntries(processEntries, os.platform());
        });
    }
}
function sortProcessEntries(processEntries, osPlatform) {
    // localeCompare is significantly slower than < and > (2000 ms vs 80 ms for 10,000 elements)
    // We can change to localeCompare if this becomes an issue
    let dotnetProcessName = (osPlatform === 'win32') ? 'dotnet.exe' : 'dotnet';
    processEntries = processEntries.sort((a, b) => {
        if (a.name.toLowerCase() === dotnetProcessName && b.name.toLowerCase() === dotnetProcessName) {
            return a.commandLine.toLowerCase() < b.commandLine.toLowerCase() ? -1 : 1;
        }
        else if (a.name.toLowerCase() === dotnetProcessName) {
            return -1;
        }
        else if (b.name.toLowerCase() === dotnetProcessName) {
            return 1;
        }
        else {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        }
    });
    let attachItems = processEntries.map(p => p.toAttachItem());
    return attachItems;
}
class PsAttachItemsProvider extends DotNetAttachItemsProvider {
    getInternalProcessEntries() {
        // the BSD version of ps uses '-c' to have 'comm' only output the executable name and not
        // the full path. The Linux version of ps has 'comm' to only display the name of the executable
        // Note that comm on Linux systems is truncated to 16 characters:
        // https://bugzilla.redhat.com/show_bug.cgi?id=429565
        // Since 'args' contains the full path to the executable, even if truncated, searching will work as desired.
        const psCommand = os.platform() === 'darwin' ? RemoteAttachPicker.osxPsCommand : RemoteAttachPicker.linuxPsCommand;
        return execChildProcess(psCommand, null).then(processes => {
            return PsOutputParser.parseProcessFromPs(processes);
        });
    }
}
exports.PsAttachItemsProvider = PsAttachItemsProvider;
class PsOutputParser {
    // Perf numbers:
    // OS X 10.10
    // | # of processes | Time (ms) |
    // |----------------+-----------|
    // |            272 |        52 |
    // |            296 |        49 |
    // |            384 |        53 |
    // |            784 |       116 |
    //
    // Ubuntu 16.04
    // | # of processes | Time (ms) |
    // |----------------+-----------|
    // |            232 |        26 |
    // |            336 |        34 |
    // |            736 |        62 |
    // |           1039 |       115 |
    // |           1239 |       182 |
    // ps outputs as a table. With the option "ww", ps will use as much width as necessary.
    // However, that only applies to the right-most column. Here we use a hack of setting
    // the column header to 50 a's so that the second column will have at least that many
    // characters. 50 was chosen because that's the maximum length of a "label" in the
    // QuickPick UI in VSCode.
    static get secondColumnCharacters() { return 50; }
    // Only public for tests.
    static parseProcessFromPs(processes) {
        let lines = processes.split(os.EOL);
        let processEntries = [];
        // lines[0] is the header of the table
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            if (!line) {
                continue;
            }
            let process = this.parseLineFromPs(line);
            if (process) {
                processEntries.push(process);
            }
        }
        return processEntries;
    }
    static parseProcessFromPsArray(lines) {
        let processEntries = [];
        // lines[0] is the header of the table
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            if (!line) {
                continue;
            }
            let process = this.parseLineFromPs(line);
            if (process) {
                processEntries.push(process);
            }
        }
        return processEntries;
    }
    static parseLineFromPs(line) {
        // Explanation of the regex:
        //   - any leading whitespace
        //   - PID
        //   - whitespace
        //   - executable name --> this is PsAttachItemsProvider.secondColumnCharacters - 1 because ps reserves one character
        //     for the whitespace separator
        //   - whitespace
        //   - args (might be empty)
        const psEntry = new RegExp(`^\\s*([0-9]+)\\s+(.{${PsOutputParser.secondColumnCharacters - 1}})\\s+(.*)$`);
        const matches = psEntry.exec(line);
        if (matches && matches.length === 4) {
            const pid = matches[1].trim();
            const executable = matches[2].trim();
            const cmdline = matches[3].trim();
            return new Process(executable, pid, cmdline);
        }
    }
}
exports.PsOutputParser = PsOutputParser;
class WmicAttachItemsProvider extends DotNetAttachItemsProvider {
    getInternalProcessEntries() {
        const wmicCommand = 'wmic process get Name,ProcessId,CommandLine /FORMAT:list';
        return execChildProcess(wmicCommand, null).then(processes => {
            return WmicOutputParser.parseProcessFromWmic(processes);
        });
    }
}
exports.WmicAttachItemsProvider = WmicAttachItemsProvider;
class WmicOutputParser {
    // Perf numbers on Win10:
    // | # of processes | Time (ms) |
    // |----------------+-----------|
    // |            309 |       413 |
    // |            407 |       463 |
    // |            887 |       746 |
    // |           1308 |      1132 |
    static get wmicNameTitle() { return 'Name'; }
    static get wmicCommandLineTitle() { return 'CommandLine'; }
    static get wmicPidTitle() { return 'ProcessId'; }
    // Only public for tests.
    static parseProcessFromWmic(processes) {
        let lines = processes.split(os.EOL);
        let currentProcess = new Process(null, null, null);
        let processEntries = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (!line) {
                continue;
            }
            this.parseLineFromWmic(line, currentProcess);
            // Each entry of processes has ProcessId as the last line
            if (line.startsWith(WmicOutputParser.wmicPidTitle)) {
                processEntries.push(currentProcess);
                currentProcess = new Process(null, null, null);
            }
        }
        return processEntries;
    }
    static parseLineFromWmic(line, process) {
        let splitter = line.indexOf('=');
        if (splitter >= 0) {
            let key = line.slice(0, line.indexOf('='));
            let value = line.slice(line.indexOf('=') + 1);
            if (key === WmicOutputParser.wmicNameTitle) {
                process.name = value.trim();
            }
            else if (key === WmicOutputParser.wmicPidTitle) {
                process.pid = value.trim();
            }
            else if (key === WmicOutputParser.wmicCommandLineTitle) {
                const extendedLengthPath = '\\??\\';
                if (value.startsWith(extendedLengthPath)) {
                    value = value.slice(extendedLengthPath.length).trim();
                }
                process.commandLine = value.trim();
            }
        }
    }
}
exports.WmicOutputParser = WmicOutputParser;
function execChildProcess(process, workingDirectory) {
    return new Promise((resolve, reject) => {
        child_process.exec(process, { cwd: workingDirectory, maxBuffer: 500 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr && stderr.length > 0) {
                reject(new Error(stderr));
                return;
            }
            resolve(stdout);
        });
    });
}
// VSCode cannot find the path "c:\windows\system32\bash.exe" as bash.exe is only available on 64bit OS. 
// It can be invoked from "c:\windows\sysnative\bash.exe", so adding "c:\windows\sysnative" to path if we identify
// VSCode is running in windows and doesn't have it in the path.
function GetSysNativePathIfNeeded() {
    return platform_1.PlatformInformation.GetCurrent().then(platformInfo => {
        let env = process.env;
        if (platformInfo.isWindows() && platformInfo.architecture === "x86_64") {
            let sysnative = process.env.WINDIR + "\\sysnative";
            env.Path = process.env.PATH + ";" + sysnative;
        }
        return env;
    });
}
function execChildProcessAndOutputErrorToChannel(process, workingDirectory, channel) {
    channel.appendLine(`Executing: ${process}`);
    return new Promise((resolve, reject) => {
        return GetSysNativePathIfNeeded().then(newEnv => {
            child_process.exec(process, { cwd: workingDirectory, env: newEnv, maxBuffer: 500 * 1024 }, (error, stdout, stderr) => {
                let channelOutput = "";
                if (stdout && stdout.length > 0) {
                    channelOutput = channelOutput.concat(stdout);
                }
                if (stderr && stderr.length > 0) {
                    channelOutput = channelOutput.concat("stderr: " + stderr);
                }
                if (error) {
                    channelOutput = channelOutput.concat("Error Message: " + error.message);
                }
                if (error || (stderr && stderr.length > 0)) {
                    channel.append(channelOutput);
                    channel.show();
                    reject(new Error("See remote-attach output"));
                    return;
                }
                resolve(stdout);
            });
        });
    });
}
//# sourceMappingURL=processPicker.js.map