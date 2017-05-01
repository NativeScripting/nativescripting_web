var tBaseUrl = 'http://nativescripting.teachable.com';

function CategoryVm(c) {
    var self = this;
    self.catId = c.catId;
    self.name = c.name;
}

function BundleVm(b, allCourses) {
    var self = this;
    self.id = b.id;
    self.title = b.title;
    self.subtitle = b.subtitle;
    self.url = b.url;
    self.promototal = b.promototal;
    self.promoremaining = b.promoremaining;
    self.bundleLevel = b.bundleLevel;
    self.courseIds = b.courseIds;
    self.productSingle = ko.observable(null);
    self.productsTeam = ko.observableArray([]);

    self.courseSummaries = ko.observableArray([]);

    var tProductsTeam = [];


    for (var i = 0; i < b.products.length; i++) {
        var newProd = new ProductVm(b.products[i], b.tag);
        if (newProd.licensesMin === 1) {
            self.productSingle(newProd);
        } else {
            tProductsTeam.push(newProd);
        }
    }
    self.productsTeam(tProductsTeam);

    var tCourseSummaries = [];
    var matchingCourses = allCourses.filter(function (course) {
        return self.courseIds.indexOf(course.id) > -1;
    });
    for (var i = 0; i < matchingCourses.length; i++) {
        tCourseSummaries.push(new CourseSummaryVm(matchingCourses[i]));
    }

    self.courseSummaries(tCourseSummaries);

    //Changed values
    self.selectedProduct = ko.observable(null);

    self.selectProduct = function (prod) {
        if (typeof prod === 'string' && prod === 'single') {
            self.selectedProduct(self.productSingle());
        } else {
            self.selectedProduct(prod);
        }
    };
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

function CourseSummaryVm(c) {
    var self = this;
    self.id = c.id;
    self.title = c.title;
    self.level = c.level;
    self.authors = c.authors;

    self.authorNames = ko.pureComputed(function () {
        var allNames = self.authors.map(function (author) {
            return author.name;
        });
        return allNames.join(', ');
    });

    self.getLevelIcon = function (levelObj) {
        return levelObj['l' + self.level];
    };
}

function CourseVm(c) {
    var self = this;
    self.id = c.id;
    self.title = c.title;
    self.subtitle = c.subtitle;
    self.description = c.description;
    self.categories = c.categories;
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


    self.courseIcons = ko.pureComputed(function () {
        var ret = [];
        if (self.categories.indexOf('core') > -1) {
            ret.push('img/nativescript_white.svg');
        }
        if (self.categories.indexOf('ng') > -1) {
            ret.push('img/nativescript_angular.svg');
        }
        return ret;
    });

    self.courseIcon = ko.pureComputed(function () {
        var icons = self.courseIcons();
        return icons[0];
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


function CoursesPageVm(coursesData) {
    var self = this;

    self.courses = ko.observableArray([]);
    self.bundles = ko.observableArray([]);

    self.categories = ko.observableArray([]);
    self.selectedCategory = ko.observable();

    self.selectedType = ko.pureComputed(function () {
        var theCat = self.selectedCategory();
        if (theCat) {
            return theCat.catId;
        } else {
            return '';
        }
    });

    self.allCourses = [];

    for (var i = 0; i < coursesData.courses.length; i++) {
        self.allCourses.push(new CourseVm(coursesData.courses[i]));
    }

    var tBundles = [];
    for (var i = 0; i < coursesData.bundles.length; i++) {
        self.bundles.push(new BundleVm(coursesData.bundles[i], coursesData.courses));
    }

    self.selectCategory = function (catId) {
        if (self.selectedCategory().catId !== catId) {
            var newCat = self.categories().find(function (cat) {
                return cat.catId === catId;
            });
            self.selectedCategory(newCat);
            localStorage.setItem('cat-value', catId);
            self.filterCoursesByCategory();

            var tCats = self.categories();
            var tCat1 = tCats[1];
            tCats[1] = tCats[0];
            tCats[0] = tCat1;
            self.categories(tCats);
        }
    }

    self.filterCoursesByCategory = function () {
        var selectedCat = self.selectedCategory();
        var filteredCourses = self.allCourses.filter(function (course) {
            return course.categories.indexOf(selectedCat.catId) > -1;
        });

        self.courses(filteredCourses);
    };

    var tCats = [
        new CategoryVm({ catId: 'core', name: 'NativeScript Core' }),
        new CategoryVm({ catId: 'ng', name: 'NativeScript with Angular' }),
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
    self.filterCoursesByCategory();
}

function DetailPageVm(coursesData, filename) {
    var self = this;

    var courseRaw = coursesData.courses.find(function (course) {
        return course.url === filename;
    });

    self.course = new CourseVm(courseRaw);
    self.bundles = ko.observableArray([]);

    var tBundles = [];
    for (var i = 0; i < coursesData.bundles.length; i++) {
        self.bundles.push(new BundleVm(coursesData.bundles[i], coursesData.courses));
    }

}

function bootstrapCoursesPage() {
    $.getJSON("courses.json", function (coursesData) {
        ko.applyBindings(new CoursesPageVm(coursesData));
    });
}

function bootstrapDetailsPage() {
    $.getJSON("courses.json", function (coursesData) {
        var url = window.location.href;
        var filename = getBaseName(url);
        ko.applyBindings(new DetailPageVm(coursesData, filename));
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

