import ko = require('knockout');

import { Chapter } from "../models/chapter";
import { LessonVm } from "./lesson.vm";
import { CourseVm } from './course.vm';

export class ChapterVm {
    course: CourseVm;
    lessons: KnockoutObservableArray<any>;
    name: string;
    id: number;

    constructor(course: CourseVm, chap: Chapter) {
        this.id = chap.id;
        this.name = chap.name;
        this.lessons = ko.observableArray([]);
        this.course = course;

        var tLessons = [];
        for (var i = 0; i < chap.lessons.length; i++) {
            tLessons.push(new LessonVm(this, chap.lessons[i]));
        }
        this.lessons(tLessons);
    }
}