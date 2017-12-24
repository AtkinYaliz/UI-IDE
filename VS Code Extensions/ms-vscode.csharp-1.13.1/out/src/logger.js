"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(writer, prefix) {
        this._indentLevel = 0;
        this._indentSize = 4;
        this._atLineStart = false;
        this._writer = writer;
        this._prefix = prefix;
    }
    _appendCore(message) {
        if (this._atLineStart) {
            if (this._indentLevel > 0) {
                const indent = " ".repeat(this._indentLevel * this._indentSize);
                this._writer(indent);
            }
            if (this._prefix) {
                this._writer(`[${this._prefix}] `);
            }
            this._atLineStart = false;
        }
        this._writer(message);
    }
    increaseIndent() {
        this._indentLevel += 1;
    }
    decreaseIndent() {
        if (this._indentLevel > 0) {
            this._indentLevel -= 1;
        }
    }
    append(message) {
        message = message || "";
        this._appendCore(message);
    }
    appendLine(message) {
        message = message || "";
        this._appendCore(message + '\n');
        this._atLineStart = true;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map