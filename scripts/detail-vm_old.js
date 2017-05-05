var tBaseUrl = 'http://nativescripting.teachable.com';

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


function DetailPageVm(courseRaw) {
    this.course = new CourseVm(courseRaw);
}


$.getJSON("coursesdata.json", function (coursesData) {
    var url = window.location.href;
    var filename = getBaseName(url);

    var course = coursesData.courses.find(function (course) {
        return course.url === filename;
    });
    ko.applyBindings(new DetailPageVm(course));
});

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




