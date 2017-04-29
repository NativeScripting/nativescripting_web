function Author(a) {
    var self = this;
    self.name = a.name;
    self.bio = a.bio;
    self.title = a.title;
    self.picture = 'img/authors/' + a.picture;
}

function Product(p, tag) {
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

function Course(c) {
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
    self.chapters = c.chapters;
    self.numLessons = ko.observable(0);

    var tAuthors = [];
    var tProductsTeam = [];

    for (var i = 0; i < c.authors.length; i++) {
        tAuthors.push(new Author(c.authors[i]));
    }
    for (var i = 0; i < c.products.length; i++) {
        var newProd = new Product(c.products[i], c.tag);
        if (newProd.licensesMin === 1) {
            self.productSingle(newProd);
        } else {
            tProductsTeam.push(newProd);
        }
    }
    self.authors(tAuthors);
    self.productsTeam(tProductsTeam);

    var lessonCount = 0;
    for (var i = 0; i < self.chapters.length; i++) {
        //lessonCount += self.chapters[i].lessons.length;
        for (var j = 0; j < self.chapters[i].lessons.length; j++) {
            lessonCount++;
            self.chapters[i].lessons[j].lessonNumber = lessonCount;
        }
    }
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
}


function DetailViewModel(courseRaw) {
    this.course = new Course(courseRaw);
}


$.getJSON("courses.json", function (coursesData) {
    var url = window.location.href;
    var filename = getBaseName(url);

    var course = coursesData.courses.find(function (course) {
        return course.url === filename;
    });
    ko.applyBindings(new DetailViewModel(course));
});

function getBaseName(url) {
    if (!url || (url && url.length === 0)) {
        return "";
    }
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var basename = filenameWithExtension.split(/[.?&#]+/)[0];

    // Handle '/mypage/' type paths
    if (basename.length === 0) {
        url = url.substr(0, index - 1);
        basename = getBaseName(url);
    }
    return basename ? basename : "";
}




