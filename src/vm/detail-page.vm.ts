import ko = require('knockout');
import { CourseData } from "../models/coursedata";
import { MainNavVm } from './main-nav.vm';
import { CourseVm } from './course.vm';
import { BundleVm } from './bundle.vm';


export class DetailPageVm {
    bundles: KnockoutObservableArray<any>;
    course: CourseVm;
    mainNav: MainNavVm;


    constructor(coursesData: CourseData, filename: string) {
        this.mainNav = new MainNavVm();

        var courseRaw = coursesData.courses.find((course) => {
            return course.url === filename;
        });

        this.course = new CourseVm(courseRaw);
        this.bundles = ko.observableArray([]);

        var tBundles = [];
        for (var i = 0; i < coursesData.bundles.length; i++) {
            this.bundles.push(new BundleVm(coursesData.bundles[i], coursesData.courses, this.deselectAllBundles));
        }
        //window.document.title += ': ' + courseRaw.title;
    }

    public deselectAllBundles() {
        var bundles = this.bundles();
        for (var i = 0; i < bundles.length; i++) {
            bundles[i].deselectBundle();
        }
    };
}
