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
exports.TEST_TEMPLATE_TEXT = exports.SAMPLE_SHELL_RESERVED_FILLED = exports.SAMPLE_SHELL_RESERVED = exports.SAMPLE_TOML_FILLED = exports.SAMPLE_TOML = exports.SAMPLE_XML_RESERVED_FILLED = exports.SAMPLE_XML_RESERVED = exports.SAMPLE_XML_FILLED = exports.SAMPLE_XML = exports.SAMPLE_EMPTY_FILLED = exports.SAMPLE_EMPTY = exports.SAMPLE_RS_FILLED = exports.SAMPLE_RS = void 0;
exports.SAMPLE_RS = `fn main() {}`;
exports.SAMPLE_RS_FILLED = `/*
 * This is the default test license template.
 */

fn main() {}`;
exports.SAMPLE_EMPTY = ``;
exports.SAMPLE_EMPTY_FILLED = `/*
 * This is the default test license template.
 */

`;
exports.SAMPLE_XML = `<xml>
    <param>value</param>
</xml>`;
exports.SAMPLE_XML_FILLED = `<!--
This is the default test license template.
-->

<xml>
    <param>value</param>
</xml>`;
exports.SAMPLE_XML_RESERVED = `<?xml version="1.0" encoding="UTF-8" ?>
<xml>
    <param>value</param>
</xml>`;
exports.SAMPLE_XML_RESERVED_FILLED = `<?xml version="1.0" encoding="UTF-8" ?>
<!--
This is the default test license template.
-->

<xml>
    <param>value</param>
</xml>`;
exports.SAMPLE_TOML = `key = true`;
exports.SAMPLE_TOML_FILLED = `# This is the default test license template.

key = true`;
exports.SAMPLE_SHELL_RESERVED = `#!/bin/bash
key = true`;
exports.SAMPLE_SHELL_RESERVED_FILLED = `#!/bin/bash
# This is the default test license template.

key = true`;
exports.TEST_TEMPLATE_TEXT = "This is the default test license template.";
//# sourceMappingURL=samples.js.map