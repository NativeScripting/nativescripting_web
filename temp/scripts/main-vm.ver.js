var ko = ko || {};
var $ = $ || {};
var tBaseUrl = 'http://nativescripting.teachable.com';
var coursesDataUrl = '/coursesdata.json?v=1.3.0';
var tCats = [
    new CategoryVm({ catId: 'core', name: 'NativeScript Core' }),
    new CategoryVm({ catId: 'ng', name: 'NativeScript with Angular' }),
];
var initialCatId = 'ng';

function reorderCats(firstCatId) {
    tCats.unshift(
        tCats.splice(
            tCats.findIndex(cat => cat.catId === firstCatId), 1)[0]
    );
}

function appendExistingQuery(url) {
    if (url.indexOf('?') > -1) {
        return url + window.location.search.replace(/\?/g, '&');
    } else {
        return url + window.location.search;
    }
}

function CategoryVm(c) {
    var self = this;
    self.catId = c.catId;
    self.name = c.name;
}

function BundleVm(b, allCourses, deselectAllBundlesCallback) {
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
    self.deselectAllBundlesCallback = deselectAllBundlesCallback;

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
    tProductsTeam.push(new ProductVm({ type: 'contact' }, b.tag));
    self.productsTeam(tProductsTeam);

    var tCourseSummaries = [];
    var matchingCourses = allCourses.filter(function (course) {
        return self.courseIds.indexOf(course.id) > -1;
    });
    for (var j = 0; j < matchingCourses.length; j++) {
        tCourseSummaries.push(new CourseSummaryVm(matchingCourses[j]));
    }

    self.courseSummaries(tCourseSummaries);


    self.showMessage = ko.observable(false);

    self.singleSelected = ko.pureComputed(function () {
        var selProd = self.selectedProduct();
        if (selProd) {
            return selProd.licensesMin === 1;
        } else {
            return false;
        }
    });

    self.toggleTeamSelecting = function () {
        self.teamSelecting(!self.teamSelecting());
    };

    self.teamSelected = ko.pureComputed(function () {
        var selProd = self.selectedProduct();
        if (selProd) {
            return selProd.licensesMin > 1 || selProd.type === 'contact';
        } else {
            return false;
        }
    });

    self.toggleCoursesShowing = function () {
        self.coursesShowing(!self.coursesShowing());
    };

    self.teamSelecting = ko.observable(false);
    self.coursesShowing = ko.observable(false);
    self.bundleSelected = ko.observable(false);

    //Changed values
    self.selectedProduct = ko.observable(null);

    self.selectProduct = function (prod) {
        self.deselectAllBundlesCallback();
        if (typeof prod === 'string' && prod === 'single') {
            self.selectedProduct(self.productSingle());
        } else if (prod.type === 'contact') {
            self.selectedProduct(prod);
        } else {
            self.selectedProduct(prod);
        }
        self.bundleSelected(true);
        self.showMessage(false);
    };

    self.teamTop = ko.pureComputed(function () {
        if (self.teamSelected()) {
            return self.selectedProduct();
        } else {
            return self.productsTeam()[0];
        }
    });

    self.teamTopIsContact = ko.pureComputed(function () {
        return self.teamTop().type === 'contact';
    });

    self.teamUsersTop = ko.pureComputed(function () {
        return self.teamTop().usersDisp();
    });

    self.teamPriceSaleTop = ko.pureComputed(function () {
        var psDisp = self.teamTop().priceSaleDisp();
        return psDisp;
    });

    self.teamPriceRegTop = ko.pureComputed(function () {
        return self.teamTop().priceRegDisp();
    });

    self.deselectBundle = function () {
        self.bundleSelected(false);
        self.selectedProduct(null);
        self.showMessage(false);
    };

    self.getBundleUrl = ko.pureComputed(function () {
        var url = 'https://sso.teachable.com/secure/89912/checkout/confirmation?product_id=' +
            self.selectedProduct().id +
            '&course_id=' + self.id;
        return url;
    });

    self.buyBundle = function () {
        if (self.selectedProduct()) {
            window.location = appendExistingQuery(self.getBundleUrl());
        } else {
            self.deselectAllBundlesCallback();
            self.showMessage(true);
            return false;
        }
    };
}

function AuthorVm(a) {
    var self = this;
    self.name = a.name;
    self.bio = a.bio;
    self.title = a.title;
    self.picture = '/img/authors/' + a.picture;
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
        return self.pricereg === 0 ? 'FREE' : self.pricereg;
    });

    self.priceSaleDisp = ko.pureComputed(function () {
        return self.pricesale === 0 ? 'FREE' : self.pricesale;
    });

    self.usersDisp = ko.pureComputed(function () {
        if (self.licensesMin === 1 && (self.tag === 'NEW' || self.tag === 'PRESALE')) {
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
        var url = tBaseUrl + '/courses/' + self.chapter.course.url + '/lectures/' + self.id;
        url = appendExistingQuery(url);
        window.location = url;
    };

    self.getLessonStartUrl = function () {
        var url = tBaseUrl + '/courses/' + self.chapter.course.url + '/lectures/' + self.id;
        url = appendExistingQuery(url);
        return url;
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
    for (var j = 0; j < c.products.length; j++) {
        var newProd = new ProductVm(c.products[j], c.tag);
        if (newProd.licensesMin === 1) {
            self.productSingle(newProd);
        } else {
            tProductsTeam.push(newProd);
        }
    }
    tProductsTeam.push(new ProductVm({ type: 'contact' }, c.tag));

    var lessonCount = 0;
    for (var i1 = 0; i1 < c.chapters.length; i1++) {
        for (var j1 = 0; j1 < c.chapters[i1].lessons.length; j1++) {
            lessonCount++;
            c.chapters[i1].lessons[j1].lessonNumber = lessonCount;
        }
        tChapters.push(new ChapterVm(self, c.chapters[i1]));
    }
    self.authors(tAuthors);
    self.productsTeam(tProductsTeam);
    self.chapters(tChapters);
    self.numLessons(lessonCount);


    self.courseIcons = ko.pureComputed(function () {
        var ret = [];
        if (self.categories.indexOf('core') > -1) {
            ret.push('/img/nativescript_white.svg');
        }
        if (self.categories.indexOf('ng') > -1) {
            ret.push('/img/nativescript_angular.svg');
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

    self.singleSelected = ko.pureComputed(function () {
        var selProd = self.selectedProduct();
        if (selProd) {
            return selProd.licensesMin === 1;
        } else {
            return false;
        }
    });

    self.toggleTeamSelecting = function () {
        self.teamSelecting(!self.teamSelecting());
    };

    self.teamSelected = ko.pureComputed(function () {
        var selProd = self.selectedProduct();
        if (selProd) {
            return selProd.licensesMin > 1 || selProd.type === 'contact';
        } else {
            return false;
        }
    });

    self.teamSelecting = ko.observable(false);

    //Changed values
    self.selectedProduct = ko.observable(null);
    self.contactSelected = ko.observable(null);

    self.selectProduct = function (prod) {
        if (typeof prod === 'string' && prod === 'single') {
            self.selectedProduct(self.productSingle());
        } else if (prod.type === 'contact') {
            self.selectedProduct(prod);
        } else {
            self.selectedProduct(prod);
        }
        self.showMessage(false);
    };

    self.teamTop = ko.pureComputed(function () {
        if (self.teamSelected()) {
            return self.selectedProduct();
        } else {
            return self.productsTeam()[0];
        }
    });

    self.teamTopIsContact = ko.pureComputed(function () {
        return self.teamTop().type === 'contact';
    });

    self.teamUsersTop = ko.pureComputed(function () {
        return self.teamTop().usersDisp();
    });

    self.teamPriceSaleTop = ko.pureComputed(function () {
        var psDisp = self.teamTop().priceSaleDisp();
        return psDisp;
    });

    self.teamPriceRegTop = ko.pureComputed(function () {
        return self.teamTop().priceRegDisp();
    });

    self.goToCourseDetailPage = function () {
        var currentPageUrl = window.location.href;
        if (isLocalDevEnvironment()) {
            window.location = appendExistingQuery('detail.html?id=' + self.url);
        } else {
            window.location = appendExistingQuery('course/' + self.url);
        }
    };

    self.getCourseDetailPageUrl = function () {
        if (isLocalDevEnvironment()) {
            return appendExistingQuery('course/' + self.url + '.html');
        } else {
            return appendExistingQuery('course/' + self.url);
        }
    }

    self.courseUrl = ko.pureComputed(function () {
        var url = 'https://sso.teachable.com/secure/89912/checkout/confirmation?product_id=' +
            self.selectedProduct().id +
            '&course_id=' + self.id;
        return url;
    });

    self.showMessage = ko.observable(false);

    self.getCourse = function () {
        var selProd = self.selectedProduct();
        if (selProd) {
            if (selProd.type === 'contact') {
                self.showMessage(true);
                return false;
            } else {
                window.location = appendExistingQuery(self.courseUrl());
            }
        }
        else {
            self.showMessage(true);
            return false;
        }
    }
}

function MainNavVm() {
    var self = this;

    self.goToAboutPage = function () {
        if (isLocalDevEnvironment()) {
            window.location = appendExistingQuery('/about.html');
        } else {
            window.location = appendExistingQuery('/about');
        }
    };
}

function CatPickerVm() {
    var self = this;

    self.selectedCategory = ko.observable();

    self.categories = ko.pureComputed(function () {
        var selCat = self.selectedCategory();
        return tCats;
    });

    self.syncSelectedCat = function (catVm) {
        localStorage.setItem('sel-cat', catVm.catId);
    };

    self.selectCategory = function (catId) {
        reorderCats(catId);
        self.selectedCategory(tCats[0]);
        self.syncSelectedCat(tCats[0]);
    };

    if (localStorage.getItem('sel-cat') === null) {
        self.selectCategory(initialCatId);
    } else {
        var storedCatId = localStorage.getItem('sel-cat');
        self.selectCategory(storedCatId);
    }
}

function CoursesPageVm(coursesData) {
    var self = this;

    self.mainNav = new MainNavVm();
    self.catPicker = new CatPickerVm();
    self.catPicker.selectedCategory.subscribe(function () {
        self.filterCoursesByCategory();
    });

    self.catSelectorActive = ko.observable(false);

    //self.courses = ko.observableArray([]);
    self.bundles = ko.observableArray([]);


    self.deselectAllBundles = function () {
        var bundles = self.bundles();
        for (var i = 0; i < bundles.length; i++) {
            bundles[i].deselectBundle();
        }
    }

    //self.allCourses = [];

    /*
    for (var i = 0; i < coursesData.courses.length; i++) {
        self.allCourses.push(new CourseVm(coursesData.courses[i]));
    }
    */

    var tBundles = [];
    for (var j = 0; j < coursesData.bundles.length; j++) {
        self.bundles.push(new BundleVm(coursesData.bundles[j], coursesData.courses, self.deselectAllBundles));
    }


    self.toggleCatSelectorActive = function () {
        self.catSelectorActive(!self.catSelectorActive());
    };

    self.selectCategoryParent = function (catId) {
        if (self.catSelectorActive()) {
            self.selectCategoryDirect(catId);
        }
    }

    self.selectCategoryDirect = function (catId) {
        self.catPicker.selectCategory(catId);
    }

    self.filterCoursesByCategory = function () {
        var selectedCat = self.catPicker.selectedCategory();
        console.log('filter courses by cat ' + selectedCat.name);

        if (selectedCat.catId === 'ng') {
            $("[data-zko-hook~='core']").hide();
            $("[data-zko-hook~='ng']").show();
        } else if (selectedCat.catId === 'core') {
            $("[data-zko-hook~='ng']").hide();
            $("[data-zko-hook~='core']").show();
        }

        //var filteredCourses = self.allCourses.filter(function (course) {
        //    return course.categories.indexOf(selectedCat.catId) > -1;
        //});

        //self.courses(filteredCourses);
    };

    self.filterCoursesByCategory();
}

function DetailPageVm(coursesData, filename) {
    var self = this;

    self.mainNav = new MainNavVm();

    var courseRaw = coursesData.courses.find(function (course) {
        return course.url === filename;
    });

    self.course = new CourseVm(courseRaw);
    self.bundles = ko.observableArray([]);

    self.deselectAllBundles = function () {
        var bundles = self.bundles();
        for (var i = 0; i < bundles.length; i++) {
            bundles[i].deselectBundle();
        }
    }

    var tBundles = [];
    for (var i = 0; i < coursesData.bundles.length; i++) {
        self.bundles.push(new BundleVm(coursesData.bundles[i], coursesData.courses, self.deselectAllBundles));
    }

    window.document.title += ': ' + courseRaw.title;

}

function bootstrapCoursesPage() {
    $.getJSON(coursesDataUrl, function (coursesData) {
        ko.applyBindings(new CoursesPageVm(coursesData));
    });
    fixEnvironmentUrls();
}

function bootstrapDetailsPage() {
    $.getJSON(coursesDataUrl, function (coursesData) {
        var currentPageUrl = window.location.href;
        var filename = getBaseName(currentPageUrl);
        ko.applyBindings(new DetailPageVm(coursesData, filename));
    });
    fixEnvironmentUrls();
}
