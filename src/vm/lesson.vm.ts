import { Lesson } from "../models/lesson";
import { ChapterVm } from "./chapter.vm";
import { appendExistingQuery } from "../util/browser-util";

var tBaseUrl = 'http://nativescripting.teachable.com';

export class LessonVm {
    chapter: ChapterVm;
    lessonNumber: any;
    name: string;
    id: string;
    chapterId: number;
    btnText: string;


    constructor(chap: ChapterVm, less: Lesson) {
        this.chapterId = chap.id;
        this.id = less.id;
        this.name = less.name;
        this.lessonNumber = less.lessonNumber;
        this.chapter = chap;
        this.btnText = less.btnText ? less.btnText : 'Start';
    }

    public startLesson() {
        var url = tBaseUrl + '/courses/' + this.chapter.course.url + '/lectures/' + this.id;
        url = appendExistingQuery(url);
        (<any>window).location = url;
    }

    public getLessonStartUrl() {
        var url = tBaseUrl + '/courses/' + this.chapter.course.url + '/lectures/' + this.id;
        return url;
    };
}
