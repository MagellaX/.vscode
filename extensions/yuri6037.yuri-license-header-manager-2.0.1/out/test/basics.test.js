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
const samples_1 = require("./samples");
const tool_1 = require("./tool");
(0, tool_1.addSuite)("Basics", (tool) => {
    test("rust", async () => {
        await tool.writeFile("test.rs", samples_1.SAMPLE_RS);
        await tool.writeFile("test.empty.rs", samples_1.SAMPLE_EMPTY);
        await tool.writeTemplate("test.rs");
        assert.strictEqual(await tool.writeHeader("test.rs"), samples_1.SAMPLE_RS_FILLED);
        assert.strictEqual(await tool.writeHeader("test.empty.rs"), samples_1.SAMPLE_EMPTY_FILLED);
    });
    test("xml", async () => {
        await tool.writeFile("test.xml", samples_1.SAMPLE_XML);
        await tool.writeFile("test.reserved.xml", samples_1.SAMPLE_XML_RESERVED);
        await tool.writeTemplate("test.xml");
        assert.strictEqual(await tool.writeHeader("test.xml"), samples_1.SAMPLE_XML_FILLED);
        assert.strictEqual(await tool.writeHeader("test.reserved.xml"), samples_1.SAMPLE_XML_RESERVED_FILLED);
    });
    test("toml", async () => {
        await tool.writeFile("test.toml", samples_1.SAMPLE_TOML);
        await tool.writeTemplate("test.toml");
        assert.strictEqual(await tool.writeHeader("test.toml"), samples_1.SAMPLE_TOML_FILLED);
    });
    test("shell", async () => {
        await tool.writeFile("test.reserved.sh", samples_1.SAMPLE_SHELL_RESERVED);
        await tool.writeTemplate("test.reserved.sh");
        assert.strictEqual(await tool.writeHeader("test.reserved.sh"), samples_1.SAMPLE_SHELL_RESERVED_FILLED);
    });
});
//# sourceMappingURL=basics.test.js.map