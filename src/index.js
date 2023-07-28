/*
MIT License

Copyright (c) 2023 Inoka Suresh Geenath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import Context from './context.js';
import * as htmlparser2 from "htmlparser2";

export const htmlToPptxText = (html, options) => {
    options = options || {};

    let textItems = [];

    let contextStack = [new Context(options)];

    const currentContext = () => contextStack[contextStack.length - 1];

    const addText = text => {
        textItems.push({ text, options: currentContext().toPptxTextOptions() });

        contextStack.forEach(c => {
            c.bullet = null;
        });
    };

    const addBreak = () => {
        let context = currentContext();

        context.break = true;
        addText('');
        context.break = false;
    };

    const onopentag = (name, attr) => {
        let context = Object.create(currentContext());

        contextStack.push(context);

        switch (name) {
            case 'a':
                context.href = attr.href;
                context.href_title = attr.title;
                break;
            case 'b':
            case 'i':
            case 's':
            case 'sub':
            case 'sup':
            case 'u':
                context[name] = true;
                break;
            case 'em':
                context['i'] = true;
                break;
            case 'strong':
                context['b'] = true;
                break;
            case 'del':
            case 'strike':
                context.s = true;
                break;
            case 'br':
                addBreak();
                break;
            case 'p':
                context.paraSpaceBefore = options.paraSpaceBefore || context.fontSize;
                addBreak();
                context.paraSpaceBefore = 0;
                break;
            case 'ol':
                context.indent++;
                context.bulletOptions = { type: 'number' };
                break;
            case 'ul':
                context.indent++;
                context.bulletOptions = true;
                break;
            case 'li':
                context.bullet = true;
                break;
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                context.b = true;
                context.setFontSize(name);
                break;
            case 'pre':
                context.pre = true;
                context.setFontFace(options.preFontFace || 'Courier New');
                break;
            case 'font':
                context.setColor(attr.color);
                context.setFontFace(attr.face);
                context.setFontSize(attr.size);
                break;
        }

        attr.align && (context.align = attr.align);
        context.setClass(name, attr['class']);
        attr.style && context.setStyle(attr.style);
    };

    const ontext = text => {
        const context = currentContext();

        if (!context.pre) {
            text = text.replace(/\s+/g, ' ');
        }

        if(text) {
            addText(text);
        }
    };

    const onclosetag = name => {
        let context = currentContext();

        switch (name) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
            case 'pre':
                addBreak();
                break;
            case 'ol':
            case 'ul':
                if (context.indent == 0) {
                    context.bullet = false;
                    addText('');
                }
                break;
            case 'p':
                context.paraSpaceAfter = options.paraSpaceAfter || context.fontSize;
                addBreak();
                break;
        }

        if(context.align) {
            context.align = 'left';
            addText('');
        }

        contextStack.pop();
    };

    const parser = new htmlparser2.Parser({
        onopentag, ontext, onclosetag
    }, {
        decodeEntities: true
    });

    parser.write(html);

    parser.end();

    return textItems;
};
