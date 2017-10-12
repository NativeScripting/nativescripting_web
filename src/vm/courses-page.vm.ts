import ko = require('knockout');
import { CourseData } from '../models/coursedata';
import { BundleVm } from './bundle.vm';
import { CourseVm } from './course.vm';
import { MainNavVm } from './main-nav.vm';
import { CatPickerVm } from './cat-picker.vm';
import { Course } from '../models/course';


export class CoursesPageVm {

    public mainNav = new MainNavVm();
    public catPicker = new CatPickerVm();


    public catSelectorActive = ko.observable(false);
    public courses = ko.observableArray([]);
    public bundles = ko.observableArray([]);



    public allCourses: CourseVm[] = [];

    constructor(private coursesData: CourseData) {

        this.catPicker.selectedCategory.subscribe(() => {
            this.filterCoursesByCategory();
        });

        for (var i = 0; i < coursesData.courses.length; i++) {
            this.allCourses.push(new CourseVm(coursesData.courses[i]));
        }

        var tBundles = [];

        for (var j = 0; j < coursesData.bundles.length; j++) {
            this.bundles.push(new BundleVm(coursesData.bundles[j], coursesData.courses, this.deselectAllBundles));
        }

        this.courses(this.allCourses);
        //this.filterCoursesByCategory();
    }

    public deselectAllBundles() {
        var bundles = this.bundles();
        for (var i = 0; i < bundles.length; i++) {
            bundles[i].deselectBundle();
        }
    }

    public toggleCatSelectorActive() {
        this.catSelectorActive(!this.catSelectorActive());
    }

    public selectCategoryParent(catId) {
        if (this.catSelectorActive()) {
            this.selectCategoryDirect(catId);
        }
    }

    public selectCategoryDirect(catId) {
        this.catPicker.selectCategory(catId);
    }

    public filterCoursesByCategory() {
        let selectedCat = this.catPicker.selectedCategory();
        let filteredCourses = [];
        filteredCourses = this.allCourses.filter((course: CourseVm) => {
            if (selectedCat) {
                return course.categories.indexOf(selectedCat.catId) > -1;
            }
        });
        this.courses(filteredCourses);
    }

}