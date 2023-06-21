import {htmlToPptxText} from "html2pptxgenjs-converter";
import PptxGen from "pptxgenjs";

// Slides
const Slides = [
    `
    <h1>Text style</h1>
    
    <p>Normal, <i>italic</i>, <u>underline</u>, <b>bold</b>, <sup>superscript</sup>, 
    <sub>subscript</sub>, <s>strikethrough</s>, <b><i><u>combined</u></i></b>.
    
    <p>
        <font size="8" face="Calibri">Calibri size 8</font>
    <p>
        <font size="4" face="Helvetica">Helvetica size 4</font>
    
    <p>
        <span style="font-size:2em;font-weight:bold;">
            <span style="color:violet">R</span>
            <span style="color:indigo">A</span>
            <span style="color:blue">I</span>
            <span style="color:green">N</span>
            <span style="color:yellow">B</span>
            <span style="color:orange">O</span>
            <span style="color:red">W</span>
        </span>
    `,
    `
    <h1 style="font-family:Courier New;color:maroon;">List Example</h1>
    
    <ol>
        <li><span class="question">Drinks</span>
            <ul>
                <li>Coffee</li>
                <li>Tea</li>
                <li>Milk</li>
            </ul>
        <li><span class="question">Vegetables</span>
            <ul>
                <li>Beetroot</li>
                <li>Ginger</li>
                <li>Potato</li>
                <li>Radish</li>
            </ul>
        <li><span class="question">Fruits</span>
            <ul>
                <li>Apple</li>
                <li>Orange</li>
            </ul>
    </ol>
    <p>For more information visit <a href="https://github.com/inokasuresh/html2pptxgenjs-converter">html2pptxgenjs-converter</a>
    `
];

// Options
let options = {};

options.css = `
h1 {
    color: blue;
    text-align: center;
}
.question {
    color: red;
    font-size: 1.2em;
}
`;

// Create a sample presentation
let pres = new pptxgen();

Slides.forEach(text => {
    let slide = pres.addSlide();

    const items = htmlToPptxText(text, options);

    slide.addText(items, {x: 0.5, y: 0, w: 5, h: 3});

    return items;
});

pres.writeFile('html2pptxgenjs-test.pptx');
