import ko = require('knockout');
import { Course } from "../models/course";
import { Author } from "../models/author";

export class CourseSummaryVm {
    authorNames: KnockoutComputed<string>;
    authors: Author[];
    level: number;
    title: string;
    id: string;
    tag: string;


    constructor(c: Course) {
        this.id = c.id;
        this.title = c.title;
        this.level = c.level;
        this.authors = c.authors;
        this.authorNames = ko.pureComputed(() => {
            var allNames = this.authors.map((author) => {
                return author.name;
            });
            return allNames.join(', ');
        });
        this.tag = c.tag;
    }


    public getLevelIcon(levelObj) {
        return levelObj['l' + this.level];
    };
}
