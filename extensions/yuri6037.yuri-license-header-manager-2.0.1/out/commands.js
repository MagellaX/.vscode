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
exports.removeAllLicenseHeaders = exports.addAllLicenseHeaders = exports.removeLicenseHeader = exports.addTemplate = exports.addLicenseHeader = void 0;
const vscode_1 = require("vscode");
const ltf_1 = require("./ltf");
const langmap_1 = require("./langmap");
const parser_1 = require("./parser");
const ignoretree_1 = require("./ignoretree");
async function addLicenseHeader(editor) {
    try {
        if (await (0, ignoretree_1.isIgnored)(editor.document.uri)) {
            return;
        }
        const mgr = new ltf_1.LTFManager(editor.document.uri);
        const ext = mgr.getTemplateExt(editor.document.uri.fsPath);
        const info = {
            filePath: editor.document.uri.fsPath,
            eol: editor.document.eol
        };
        if (ext === null) {
            return;
        }
        const map = new langmap_1.LangMap(editor.document.uri);
        const config = map.getConfig(ext);
        if (config === null) { //The language has been disabled.
            return;
        }
        if (config === undefined) {
            await vscode_1.window.showErrorMessage(`No language configuration found for '${ext}' files`);
            return;
        }
        if (!await mgr.hasTemplate(ext)) {
            const option = await vscode_1.window.showInformationMessage(`No template found for '${ext}' files, would you like to create one?`, "Yes", "No");
            if (option === "Yes") {
                await vscode_1.commands.executeCommand("yuri-license-header-manager.add-template");
            }
            return;
        }
        const template = await mgr.loadTemplate(ext, info);
        const parser = new parser_1.Parser(config, editor);
        if (parser.needsCommentBlockUpdate(template)) {
            editor.edit((edit) => {
                parser.addOrUpdateCommentBlock(edit, template);
            });
            await editor.document.save();
        }
    }
    catch (ex) {
        await vscode_1.window.showErrorMessage(`Failed to apply template: ${ex}`);
    }
}
exports.addLicenseHeader = addLicenseHeader;
async function addTemplate(editor) {
    try {
        const mgr = new ltf_1.LTFManager(editor.document.uri);
        const ext = mgr.getTemplateExt(editor.document.uri.fsPath);
        if (ext === null) {
            return;
        }
        const path = await mgr.newTemplate(ext);
        await vscode_1.commands.executeCommand("vscode.open", vscode_1.Uri.file(path));
    }
    catch (ex) {
        await vscode_1.window.showErrorMessage(`Error accessing LTFManager: ${ex}`);
    }
}
exports.addTemplate = addTemplate;
async function removeLicenseHeader(editor) {
    try {
        if (await (0, ignoretree_1.isIgnored)(editor.document.uri)) {
            return;
        }
        const mgr = new ltf_1.LTFManager(editor.document.uri);
        const ext = mgr.getTemplateExt(editor.document.uri.fsPath);
        if (ext === null) {
            return;
        }
        const map = new langmap_1.LangMap(editor.document.uri);
        const config = map.getConfig(ext);
        if (config === null) { //The language has been disabled.
            return;
        }
        if (config === undefined) {
            await vscode_1.window.showErrorMessage(`No language configuration found for '${ext}' files`);
            return;
        }
        const parser = new parser_1.Parser(config, editor);
        const range = parser.getLicenseBlockRange();
        if (range) {
            editor.edit(edit => {
                edit.delete(range);
            });
        }
    }
    catch (ex) {
        await vscode_1.window.showErrorMessage(`Failed to remove license header: ${ex}`);
    }
}
exports.removeLicenseHeader = removeLicenseHeader;
async function listAllSupportedFiles() {
    if (!vscode_1.workspace.workspaceFolders) {
        return null;
    }
    let arr = [];
    for (const folder of vscode_1.workspace.workspaceFolders) {
        const mgr = new ltf_1.LTFManager(folder.uri);
        const exts = await mgr.listSupportedExtensions();
        if (exts.length <= 0) {
            continue;
        }
        const pattern = new vscode_1.RelativePattern(folder, `**/*.{${exts.join(",")}}`);
        const files = await vscode_1.workspace.findFiles(pattern);
        arr = arr.concat(files);
    }
    return (0, ignoretree_1.filter)(arr);
}
async function addAllLicenseHeaders() {
    await vscode_1.window.withProgress({ cancellable: false, title: "Add/Update All License Headers", location: vscode_1.ProgressLocation.Notification }, async (progress) => {
        progress.report({ message: "Loading file list...", increment: 0 });
        const files = await listAllSupportedFiles();
        if (!files) {
            progress.report({ increment: 100 });
            return;
        }
        progress.report({ message: "Updating all license headers...", increment: 0 });
        let current = 0;
        const total = files.length;
        let count = 0;
        for (const f of files) {
            const doc = await vscode_1.workspace.openTextDocument(f);
            const editor = await vscode_1.window.showTextDocument(doc);
            await addLicenseHeader(editor);
            if (await editor.document.save()) {
                await vscode_1.commands.executeCommand('workbench.action.closeActiveEditor');
            }
            count += 1;
            const value = count / total;
            const inc = (value - current) * 100;
            current = value;
            if (inc > 0) {
                progress.report({ message: "Updating all license headers...", increment: inc });
            }
        }
    });
}
exports.addAllLicenseHeaders = addAllLicenseHeaders;
async function removeAllLicenseHeaders() {
    await vscode_1.window.withProgress({ cancellable: false, title: "Remove All License Headers", location: vscode_1.ProgressLocation.Notification }, async (progress) => {
        progress.report({ message: "Loading file list...", increment: 0 });
        const files = await listAllSupportedFiles();
        if (!files) {
            progress.report({ increment: 100 });
            return;
        }
        progress.report({ message: "Removing all license headers...", increment: 0 });
        let current = 0;
        const total = files.length;
        let count = 0;
        for (const f of files) {
            const doc = await vscode_1.workspace.openTextDocument(f);
            const editor = await vscode_1.window.showTextDocument(doc);
            await removeLicenseHeader(editor);
            if (await editor.document.save()) {
                await vscode_1.commands.executeCommand('workbench.action.closeActiveEditor');
            }
            count += 1;
            const value = count / total;
            const inc = (value - current) * 100;
            current = value;
            if (inc > 0) {
                progress.report({ message: "Removing all license headers...", increment: inc });
            }
        }
    });
}
exports.removeAllLicenseHeaders = removeAllLicenseHeaders;
//# sourceMappingURL=commands.js.map