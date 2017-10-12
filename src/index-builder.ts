import domino = require('domino');
import ko = require('knockout');
import fs = require("fs");
import { CourseData } from './models/coursedata';
import { CoursesPageVm } from './vm/courses-page.vm';
import { replaceAttribute, removeAttribute } from './util/html-element-util';

const dataDir = 'src/data';
const templatesDir = 'src/templates';
const htmlOutDir = 'dist/out-html';

const coursesData = <CourseData>JSON.parse(fs.readFileSync(`${dataDir}/coursesdata.json`, 'utf8'));

const coursesIndexTemplate = fs.readFileSync(`${templatesDir}/index.html`, 'utf8');

const window = domino.createWindow(coursesIndexTemplate);
const document = window.document;


const rootElement = document.documentElement;

replaceAttribute(rootElement.childNodes, 'data-bind', 'data-zko-replace');

ko.applyBindings(new CoursesPageVm(coursesData), rootElement);

//console.log(rootElement.outerHTML);

replaceAttribute(rootElement.childNodes, 'data-zko-replace', 'data-bind');

//const newStr = rootElement.outerHTML.replace(new RegExp('foreach:', 'g'), 'foreachInit:');

removeAttribute(rootElement.childNodes, 'data-bind');

fs.writeFileSync(`${htmlOutDir}/index.html`, '<!DOCTYPE html>\n' + rootElement.outerHTML);
