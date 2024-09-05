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
exports.addSuite = exports.TestTool = void 0;
const assert = require("assert");
const vscode = require("vscode");
const util = require("util");
const fs = require("fs");
const path = require("path");
const samples_1 = require("./samples");
const readdir = util.promisify(fs.readdir);
const rm = util.promisify(fs.rm);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
class TestTool {
    constructor() {
        this.dir = "";
    }
    async setup() {
        this.dir = path.join(path.resolve(__dirname, "..", ".."), "test-workspace");
        await this.cleanup();
    }
    async cleanup() {
        const files = await readdir(this.dir);
        for (const file of files) {
            if (file !== ".gitkeep") {
                await rm(this.getPath(file), { recursive: true });
            }
        }
    }
    getPath(p) {
        return path.join(this.dir, p);
    }
    getUri(p) {
        return vscode.Uri.file(this.getPath(p));
    }
    async writeFile(p, data) {
        await writeFile(this.getPath(p), data);
    }
    async readFile(p) {
        return await readFile(this.getPath(p), "utf8");
    }
    async writeTemplate(p) {
        await vscode.commands.executeCommand("vscode.open", this.getUri(p));
        await vscode.commands.executeCommand("yuri-license-header-manager.add-template");
        assert.notStrictEqual(vscode.window.activeTextEditor, undefined);
        await writeFile(vscode.window.activeTextEditor.document.uri.fsPath, samples_1.TEST_TEMPLATE_TEXT);
    }
    async writeHeader(p) {
        await vscode.commands.executeCommand("vscode.open", this.getUri(p));
        await vscode.commands.executeCommand("yuri-license-header-manager.add-license-header");
        await vscode.commands.executeCommand("workbench.action.files.saveAll");
        return await readFile(this.getPath(p), "utf8");
    }
    async removeHeader(p) {
        await vscode.commands.executeCommand("vscode.open", this.getUri(p));
        await vscode.commands.executeCommand("yuri-license-header-manager.remove-license-header");
        await vscode.commands.executeCommand("workbench.action.files.saveAll");
        return await readFile(this.getPath(p), "utf8");
    }
}
exports.TestTool = TestTool;
function addSuite(name, callback) {
    suite(name, () => {
        const tool = new TestTool();
        setup(async () => {
            await tool.setup();
        });
        teardown(async () => {
            await tool.cleanup();
        });
        callback(tool);
    });
}
exports.addSuite = addSuite;
//# sourceMappingURL=tool.js.map