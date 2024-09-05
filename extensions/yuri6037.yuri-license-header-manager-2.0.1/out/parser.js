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
exports.Parser = void 0;
const vscode_1 = require("vscode");
/**
 * Minimalistic parser intended to get the start and the end of the header comment block.
 */
class Parser {
    constructor(config, editor) {
        this.config = config;
        this.editor = editor;
    }
    getCommentBlockRange() {
        let startPos = new vscode_1.Position(0, 0);
        if (this.config.reserved) {
            let id = 0;
            let text = "";
            let m = null;
            while (id < this.config.reserved.numLines) {
                const line = this.editor.document.lineAt(id++);
                text += line.text + "\n";
                m = this.config.reserved.regex.exec(text);
                if (m) {
                    break;
                }
            }
            if (m) {
                startPos = this.editor.document.positionAt(m.index + m[0].length + 1);
            }
        }
        let id = 0;
        let endPos = null;
        while (id < this.editor.document.lineCount) {
            const line = this.editor.document.lineAt(id++);
            if (line.text === this.config.endComment) {
                endPos = line.rangeIncludingLineBreak.end;
                break;
            }
            const flag1 = this.config.middleComment !== null && !line.text.startsWith(this.config.middleComment.trimEnd());
            if (flag1) {
                const flag = this.config.startComment !== null && line.text === this.config.startComment;
                if (flag) {
                    continue;
                }
                break;
            }
        }
        return {
            start: startPos,
            end: endPos
        };
    }
    withEol(line) {
        switch (this.editor.document.eol) {
            case vscode_1.EndOfLine.LF:
                return line + "\n";
            case vscode_1.EndOfLine.CRLF:
                return line + "\r\n";
        }
    }
    genLicenseBlock(range, license, existing) {
        let text = "";
        if (this.config.startComment) {
            text += this.withEol(this.config.startComment);
        }
        for (let i = 0; i !== license.length; ++i) {
            let full = "";
            if (this.config.middleComment) {
                full += this.config.middleComment;
            }
            const line = license[i].replace(/{__LINE_CONTENT__}/g, (_, offset) => {
                if (!existing) {
                    return "";
                }
                const existingLine = existing[i + (this.config.startComment ? 1 : 0)];
                if (!existingLine) {
                    return "";
                }
                const content = existingLine.substring(offset + this.config.middleComment?.length);
                return content;
            });
            full += line;
            full = full.trimEnd();
            text += this.withEol(full);
        }
        text += this.withEol(this.config.endComment);
        if (range.end === null && this.config.endComment.length > 0) {
            text += this.withEol("");
        }
        return text;
    }
    getLicenseBlockRange() {
        const range = this.getCommentBlockRange();
        if (!range.end) {
            return null;
        }
        if (this.config.endComment.length > 0) {
            range.end = new vscode_1.Position(range.end.line + 1, range.end.character);
        }
        return new vscode_1.Range(range.start, range.end);
    }
    needsCommentBlockUpdate(license) {
        const range = this.getCommentBlockRange();
        const editorText = range.end ? this.editor.document.getText(new vscode_1.Range(range.start, range.end)) : null;
        const text = this.genLicenseBlock(range, license, editorText?.split("\n"));
        if (range.end === null || editorText === null) {
            return true;
        }
        return editorText !== text;
    }
    addOrUpdateCommentBlock(edit, license) {
        const range = this.getCommentBlockRange();
        let editorText = null;
        if (range.end !== null) {
            editorText = this.editor.document.getText(new vscode_1.Range(range.start, range.end));
            edit.delete(new vscode_1.Range(range.start, range.end));
        }
        const text = this.genLicenseBlock(range, license, editorText?.split("\n"));
        edit.insert(range.start, text);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map