var tBaseUrl = 'http://nativescripting.teachable.com';

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
    for (var i = 0; i < matchingCourses.length; i++) {
        tCourseSummaries.push(new CourseSummaryVm(matchingCourses[i]));
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
        console.log('bundle toggleTeamSelecting');
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
        console.log('bundle toggleCoursesShowing');
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

    /*
        self.goToCourseDetailPage = function () {
            window.location = self.url + '.html';
        };
        */

    self.deselectBundle = function () {
        console.log('deselecting bundle: ' + self.title);
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
            var url = self.getBundleUrl();
            window.location = url;
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
        window.location = tBaseUrl + '/courses/' + self.chapter.course.url + '/lectures/' + self.id;
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
    tProductsTeam.push(new ProductVm({ type: 'contact' }, c.tag));

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
        console.log('selectProduct');
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
            window.location = 'detail.html?id=' + self.url;
        } else {
            window.location = 'course/' + self.url;
            //window.location = self.url;
        }
    };

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
                var url = self.courseUrl();
                window.location = url;
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
            window.location = '/about.html';
        } else {
            window.location = '/about';
        }
    };
}

function CoursesPageVm(coursesData) {
    var self = this;

    self.mainNav = new MainNavVm();

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

    self.deselectAllBundles = function () {
        var bundles = self.bundles();
        for (var i = 0; i < bundles.length; i++) {
            bundles[i].deselectBundle();
        }
    }

    self.allCourses = [];

    for (var i = 0; i < coursesData.courses.length; i++) {
        self.allCourses.push(new CourseVm(coursesData.courses[i]));
    }

    var tBundles = [];
    for (var i = 0; i < coursesData.bundles.length; i++) {
        self.bundles.push(new BundleVm(coursesData.bundles[i], coursesData.courses, self.deselectAllBundles));
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

    self.mainNav = new MainNavVm();

    var courseRaw = coursesData.courses.find(function (course) {
        return course.url === filename;
    });

    self.course = new CourseVm(courseRaw);
    self.bundles = ko.observableArray([]);

    self.deselectAllBundles = function () {
        console.log('details deseleccting all bundles');
        var bundles = self.bundles();
        for (var i = 0; i < bundles.length; i++) {
            bundles[i].deselectBundle();
        }
    }

    var tBundles = [];
    for (var i = 0; i < coursesData.bundles.length; i++) {
        self.bundles.push(new BundleVm(coursesData.bundles[i], coursesData.courses, self.deselectAllBundles));
    }

}

function bootstrapCoursesPage() {
    $.getJSON("coursesdata.json?ts=1495801899", function (coursesData) {
        ko.applyBindings(new CoursesPageVm(coursesData));
    });
}

function bootstrapDetailsPage() {
    $.getJSON("coursesdata.json?ts=1495801899", function (coursesData) {
        var currentPageUrl = window.location.href;
        var filename = getBaseName(currentPageUrl);
        if (isLocalDevEnvironment()) {
            filename = getParameterByName('id');
        }
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

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function isLocalDevEnvironment() {
    return window.location.href.indexOf('127.') > -1;
}