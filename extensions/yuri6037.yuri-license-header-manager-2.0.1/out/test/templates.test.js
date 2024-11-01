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
const assert = require("assert");
const vscode = require("vscode");
const tool_1 = require("./tool");
const samples_1 = require("./samples");
(0, tool_1.addSuite)("Templates", (tool) => {
    test("basic", async () => {
        await tool.writeFile("test.empty.rs", samples_1.SAMPLE_EMPTY);
        await vscode.commands.executeCommand("vscode.open", tool.getUri("test.empty.rs"));
        await vscode.commands.executeCommand("yuri-license-header-manager.add-template");
        const text = await tool.writeHeader("test.empty.rs");
        assert.doesNotMatch(text, /{File}/gm);
        assert.doesNotMatch(text, /{Username}/gm);
        assert.doesNotMatch(text, /{CurrentYear}/gm);
    });
});
//# sourceMappingURL=templates.test.js.map