"use strict";
/*
 * Copyright 2023 Yuri6037
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy
 * of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS
 * IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const util_1 = require("./util");
const completion_1 = require("./completion");
const commands_1 = require("./commands");
function activate(context) {
    console.log("Activating License Header Manager...");
    context.subscriptions.push((0, util_1.registerEditorCommand)("add-license-header", commands_1.addLicenseHeader));
    context.subscriptions.push((0, util_1.registerEditorCommand)("remove-license-header", commands_1.removeLicenseHeader));
    context.subscriptions.push((0, util_1.registerEditorCommand)("add-template", commands_1.addTemplate));
    context.subscriptions.push((0, util_1.registerCommand)("global.add-license-header", commands_1.addAllLicenseHeaders));
    context.subscriptions.push((0, util_1.registerCommand)("global.remove-license-header", commands_1.removeAllLicenseHeaders));
    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument((e) => {
        const config = vscode.workspace.getConfiguration("yuri-license-header-manager", e.document.uri);
        const update = config.get("autoUpdate");
        if (!update) {
            //Auto-update is disabled.
            return;
        }
        vscode.commands.executeCommand("yuri-license-header-manager.add-license-header");
    }));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("ltf", new completion_1.LTFCompletionProvider()));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map