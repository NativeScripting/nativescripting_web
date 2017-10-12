import domino = require('domino');
import ko = require('knockout');
import fs = require("fs");
import { CourseData } from './models/coursedata';
import { DetailPageVm } from './vm/detail-page.vm';
import { replaceAttribute, removeAttribute } from './util/html-element-util';

const dataDir = 'src/data';
const templatesDir = 'src/templates';
const htmlOutDir = 'dist/out-html';

const coursesData = <CourseData>JSON.parse(fs.readFileSync(`${dataDir}/coursesdata.json`, 'utf8'));

const coursesDetailTemplate = fs.readFileSync(`${templatesDir}/detail.html`, 'utf8');

for (var i = 0; i < coursesData.courses.length; i++) {
    const currentCourse = coursesData.courses[i];
    const window = domino.createWindow(coursesDetailTemplate);
    const document = window.document;
    const rootElement = document.documentElement;

    const filename = currentCourse.url;

    replaceAttribute(rootElement.childNodes, 'data-bind', 'data-zko-replace');

    ko.applyBindings(new DetailPageVm(coursesData, filename), rootElement);

    replaceAttribute(rootElement.childNodes, 'data-zko-replace', 'data-bind');

    removeAttribute(rootElement.childNodes, 'data-bind');

    //console.log(rootElement.outerHTML);

    fs.writeFileSync(`${htmlOutDir}/course/${filename}.html`, '<!DOCTYPE html>\n' + rootElement.outerHTML);

}