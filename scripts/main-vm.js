var tBaseUrl = 'http://nativescripting.teachable.com';

function CategoryVm(c) {
    var self = this;
    self.type = c.type;
    self.name = c.name;
}


function AuthorVm(a) {
    var self = this;
    self.name = a.name;
    self.bio = a.bio;
    self.title = a.title;
    self.picture = 'img/authors/' + a.picture;
}

function ProductVm(p, tag) {
    var self = this;
    self.id = p.id;
    self.type = p.type;
    self.licensesMin = p.licensesMin;
    self.licensesMax = p.licensesMax;
    self.pricereg = p.pricereg;
    self.pricesale = p.pricesale;
    self.tag = tag;

    self.priceRegDisp = ko.pureComputed(function () {
        return self.pricereg === 0 ? 'FREE' : '$' + self.pricereg;
    });

    self.priceSaleDisp = ko.pureComputed(function () {
        return self.pricesale === 0 ? 'FREE' : '$' + self.pricesale;
    });

    self.usersDisp = ko.pureComputed(function () {
        if (self.licensesMin === 1 && self.tag === 'NEW') {
            return 'Launch';
        } else {
            return self.licensesMin + '-' + self.licensesMax + ' users';
        }
    });
}

function LessonVm(chap, less) {
    var self = this;
    self.chapterId = chap.id;
    self.id = less.id;
    self.name = less.name;
    self.lessonNumber = less.lessonNumber;
    self.chapter = chap;

    self.startLesson = function () {
        window.location = tBaseUrl + '/courses/' + self.chapter.course.url + '/lectures/2543888';
    };
}

function ChapterVm(course, chap) {
    var self = this;
    self.id = chap.id;
    self.name = chap.name;
    self.lessons = ko.observableArray([]);
    self.course = course;

    var tLessons = [];
    for (var i = 0; i < chap.lessons.length; i++) {
        tLessons.push(new LessonVm(self, chap.lessons[i]));
    }
    self.lessons(tLessons);
}

function CourseVm(c) {
    var self = this;
    self.id = c.id;
    self.title = c.title;
    self.subtitle = c.subtitle;
    self.description = c.description;
    self.type = c.type;
    self.tag = c.tag;
    self.level = c.level;
    self.launchdate = c.launchdate;
    self.url = c.url;
    self.authors = ko.observableArray([]);
    self.productSingle = ko.observable(null);
    self.productsTeam = ko.observableArray([]);
    self.chapters = ko.observableArray([]);
    self.numLessons = ko.observable(0);

    var tAuthors = [];
    var tProductsTeam = [];
    var tChapters = [];

    for (var i = 0; i < c.authors.length; i++) {
        tAuthors.push(new AuthorVm(c.authors[i]));
    }
    for (var i = 0; i < c.products.length; i++) {
        var newProd = new ProductVm(c.products[i], c.tag);
        if (newProd.licensesMin === 1) {
            self.productSingle(newProd);
        } else {
            tProductsTeam.push(newProd);
        }
    }

    var lessonCount = 0;
    for (var i = 0; i < c.chapters.length; i++) {
        for (var j = 0; j < c.chapters[i].lessons.length; j++) {
            lessonCount++;
            c.chapters[i].lessons[j].lessonNumber = lessonCount;
        }
        tChapters.push(new ChapterVm(self, c.chapters[i]));
    }
    self.authors(tAuthors);
    self.productsTeam(tProductsTeam);
    self.chapters(tChapters);
    self.numLessons(lessonCount);

    self.courseIcon = ko.pureComputed(function () {
        if (self.type === 'ng') {
            return 'img/nativescript_angular.svg';
        } else if (self.type === 'core') {
            return 'img/nativescript_white.svg';
        } else {
            return 'img/logo.svg';
        }
    });

    self.getLevelIcon = function (levelObj) {
        return levelObj['l' + self.level];
    };

    //Changed values
    self.selectedProduct = ko.observable(null);

    self.selectProduct = function (prod) {
        if (typeof prod === 'string' && prod === 'single') {
            self.selectedProduct(self.productSingle());
        } else {
            self.selectedProduct(prod);
        }
    };

    self.goToCoursePage = function () {
        if (self.selectedProduct()) {
            window.location = self.url + '.html';
        } else {
            return false;
        }
    };

    self.getCourseUrl = ko.pureComputed(function () {
        if (self.selectedProduct()) {
            var url = 'https://sso.teachable.com/secure/89912/checkout/confirmation?product_id=' +
                self.selectedProduct().id +
                '&course_id=' + self.id;
            return url;
        } else {
            return '#';
        }
    });

    self.getCourse = function () {
        console.log('gc');
        var url = self.getCourseUrl();
        if (url !== '#') {
            window.location = url;
        }
        else {
            return false;
        }
    }
}


function CoursesPageVm(coursesRaw) {
    var self = this;

    self.courses = ko.observableArray([]);

    self.categories = ko.observableArray([]);
    self.selectedCategory = ko.observable();

    self.selectedType = ko.pureComputed(function () {
        var theCat = self.selectedCategory();
        if (theCat) {
            return theCat.type;
        } else {
            return '';
        }
    });

    self.allCourses = [];

    for (var i = 0; i < coursesRaw.length; i++) {
        self.allCourses.push(new CourseVm(coursesRaw[i]));
    }

    self.selectCategory = function (type) {

        if (self.selectedCategory().type !== type) {
            var newCat = self.categories().find(function (cat) {
                return cat.type === type;
            });
            self.selectedCategory(newCat);
            localStorage.setItem('cat-value', type);
            self.filterCoursesByType();

            var tCats = self.categories();
            var tCat1 = tCats[1];
            tCats[1] = tCats[0];
            tCats[0] = tCat1;
            self.categories(tCats);
        }
    }

    self.showNativeScriptCore = function () {
        if (self.selectedCategory().type === 'ng') {
            var newCat = self.categories().find(function (cat) {
                return cat.type === 'core';
            });
            self.selectedCategory(newCat);
            localStorage.setItem('cat-value', 'core');
            self.filterCoursesByType();
        }
    };
    self.showNativeScriptAngular = function () {
        if (self.selectedCategory().type === 'core') {
            var newCat = self.categories().find(function (cat) {
                return cat.type === 'ng';
            });
            self.selectedCategory(newCat);
            localStorage.setItem('cat-value', 'ng');
            self.filterCoursesByType();
        }
    };

    self.filterCoursesByType = function () {
        var selectedCat = self.selectedCategory();
        var filteredCourses = self.allCourses.filter(function (course) {
            return course.type === selectedCat.type;
        });

        self.courses(filteredCourses);
    };

    var tCats = [
        new CategoryVm({ type: 'core', name: 'NativeScript Core' }),
        new CategoryVm({ type: 'ng', name: 'NativeScript with Angular' }),
    ];

    if (localStorage.getItem('cat-value') === undefined) {
        localStorage.setItem('cat-value', 'core');
    } else if (localStorage.getItem('cat-value') === 'ng') {
        var tCat1 = tCats[1];
        tCats[1] = tCats[0];
        tCats[0] = tCat1;
    }

    self.categories(tCats);
    self.selectedCategory(tCats[0]);
    self.filterCoursesByType();
}

function DetailPageVm(courseRaw) {
    var self = this;
    self.course = new CourseVm(courseRaw);
}

function bootstrapCoursesPage() {
    $.getJSON("courses.json", function (coursesData) {
        ko.applyBindings(new CoursesPageVm(coursesData.courses));
    });
}

function bootstrapDetailsPage() {
    $.getJSON("courses.json", function (coursesData) {
        var url = window.location.href;
        var filename = getBaseName(url);

        var course = coursesData.courses.find(function (course) {
            return course.url === filename;
        });
        ko.applyBindings(new DetailPageVm(course));
    });
}

function getBaseName(url) {
    if (!url || (url && url.length === 0)) {
        return "";
    }
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var basename = filenameWithExtension.split(/[.?&#]+/)[0];

    if (basename.length === 0) {
        url = url.substr(0, index - 1);
        basename = getBaseName(url);
    }
    return basename ? basename : "";
}

