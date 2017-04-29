function Author(a) {
    var self = this;
    self.name = a.name;
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
            if (window.location.href.indexOf('127') > 0) {
                window.location = self.url + '.html';
            } else {
                window.location = self.url;
            }
        } else {
            return false;
        }
    };
}


function AppViewModel(coursesRaw) {
    this.courses = ko.observableArray([]);

    var tempCourses = [];
    for (var i = 0; i < coursesRaw.length; i++) {
        tempCourses.push(new Course(coursesRaw[i]));
    }

    this.courses(tempCourses);

}

$.getJSON("courses.json", function (coursesData) {
    ko.applyBindings(new AppViewModel(coursesData.courses));
});




