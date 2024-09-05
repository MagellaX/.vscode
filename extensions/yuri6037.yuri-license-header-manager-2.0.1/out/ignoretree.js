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
exports.isIgnored = exports.filter = void 0;
const path = require("path");
const util = require("util");
const fs = require("fs");
const vscode_1 = require("vscode");
const ignore_1 = require("ignore");
const readFile = util.promisify(fs.readFile);
class IgnoreTree {
    constructor(uri) {
        const config = vscode_1.workspace.getConfiguration("yuri-license-header-manager", uri);
        this.ignored = config.get("ignoredPaths") ?? [];
        this.parser = null;
        if (config.get("useGitignore") ?? false) {
            const root = vscode_1.workspace.getWorkspaceFolder(uri)?.uri.fsPath;
            if (!root) {
                this.workspace = null;
                return;
            }
            this.workspace = root;
        }
        else {
            this.workspace = null;
        }
    }
    async init() {
        if (this.workspace) {
            try {
                const content = await readFile(path.join(this.workspace, ".gitignore"), "utf8");
                this.parser = (0, ignore_1.default)().add(content);
            }
            catch {
                this.parser = null;
            }
        }
    }
    isIgnored(uri) {
        if (this.ignored.find(v => uri.fsPath.includes(v))) {
            return true;
        }
        if (this.workspace) {
            let p = uri.fsPath;
            if (p.startsWith(this.workspace)) {
                p = p.substring(this.workspace.length + 1);
            }
            if (this.parser) {
                return this.parser.ignores(p);
            }
        }
        return false;
    }
}
async function filter(uris) {
    let arr = [];
    for (const uri of uris) {
        if (!await isIgnored(uri)) {
            arr.push(uri);
        }
    }
    return arr;
}
exports.filter = filter;
async function isIgnored(uri) {
    const tree = new IgnoreTree(uri);
    await tree.init();
    return tree.isIgnored(uri);
}
exports.isIgnored = isIgnored;
//# sourceMappingURL=ignoretree.js.map