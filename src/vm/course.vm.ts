import ko = require('knockout');
import { Course, Tag } from '../models/course';
import { AuthorVm } from './author.vm';
import { ProductVm } from './product.vm';
import { ChapterVm } from './chapter.vm';
import { isLocalDevEnvironment, appendExistingQuery } from '../util/browser-util';
import { isProdBuild } from '../util/environment-util';

export class CourseVm {
    showMessage: KnockoutObservable<boolean>;
    courseUrl: KnockoutComputed<string>;
    teamPriceRegTop: KnockoutComputed<any>;
    teamPriceSaleTop: KnockoutComputed<any>;
    teamUsersTop: KnockoutComputed<any>;
    teamTopIsContact: KnockoutComputed<boolean>;
    teamTop: KnockoutComputed<any>;
    contactSelected: KnockoutObservable<any>;
    teamSelecting: KnockoutObservable<boolean>;
    teamSelected: KnockoutComputed<boolean>;
    selectedProduct: any;
    singleSelected: KnockoutComputed<boolean>;
    courseIcon: KnockoutComputed<any>;
    courseIcons: KnockoutComputed<any[]>;
    numLessons: KnockoutObservable<number>;
    chapters: KnockoutObservableArray<any>;
    productsTeam: KnockoutObservableArray<any>;
    productSingle: KnockoutObservable<any>;
    authors: KnockoutObservableArray<any>;
    url: string;
    launchdate: Date;
    level: number;
    tag: Tag;
    categories: ("core" | "ng")[];
    description: string;
    subtitle: string;
    title: string;
    id: string;

    constructor(c: Course) {
        this.id = c.id;
        this.title = c.title;
        this.subtitle = c.subtitle;
        this.description = c.description;
        this.categories = c.categories;
        this.tag = c.tag;
        this.level = c.level;
        this.launchdate = c.launchdate;
        this.url = c.url;
        this.authors = ko.observableArray([]);
        this.productSingle = ko.observable(null);
        this.productsTeam = ko.observableArray([]);
        this.chapters = ko.observableArray([]);
        this.numLessons = ko.observable(0);


        var tAuthors = [];
        var tProductsTeam = [];
        var tChapters = [];
        for (var i = 0; i < c.authors.length; i++) {
            tAuthors.push(new AuthorVm(c.authors[i]));
        }
        for (var j = 0; j < c.products.length; j++) {
            var newProd = new ProductVm(c.products[j], c.tag);
            if (newProd.licensesMin === 1) {
                this.productSingle(newProd);
            }
            else {
                tProductsTeam.push(newProd);
            }
        }

        tProductsTeam.push(new ProductVm({
            type: 'contact', id: '', name: '', description: '', pricesale: 0, pricereg: 0, licensesMin: 0,
            licensesMax: 0
        }, c.tag));

        var lessonCount = 0;
        for (var i1 = 0; i1 < c.chapters.length; i1++) {
            for (var j1 = 0; j1 < c.chapters[i1].lessons.length; j1++) {
                lessonCount++;
                c.chapters[i1].lessons[j1].lessonNumber = lessonCount;
            }
            tChapters.push(new ChapterVm(this, c.chapters[i1]));
        }
        this.authors(tAuthors);
        this.productsTeam(tProductsTeam);
        this.chapters(tChapters);
        this.numLessons(lessonCount);
        this.courseIcons = ko.pureComputed(() => {
            var ret = [];
            if (this.categories.indexOf('core') > -1) {
                ret.push('/img/nativescript_white.svg');
            }
            if (this.categories.indexOf('ng') > -1) {
                ret.push('/img/nativescript_angular.svg');
            }
            return ret;
        });
        this.courseIcon = ko.pureComputed(() => {
            var icons = this.courseIcons();
            return icons[0];
        });

        this.singleSelected = ko.pureComputed(() => {
            var selProd = this.selectedProduct();
            if (selProd) {
                return selProd.licensesMin === 1;
            }
            else {
                return false;
            }
        });

        this.teamSelected = ko.pureComputed(() => {
            var selProd = this.selectedProduct();
            if (selProd) {
                return selProd.licensesMin > 1 || selProd.type === 'contact';
            }
            else {
                return false;
            }
        });
        this.teamSelecting = ko.observable(false);
        //Changed values
        this.selectedProduct = ko.observable(null);
        this.contactSelected = ko.observable(null);

        this.teamTop = ko.pureComputed(() => {
            if (this.teamSelected()) {
                return this.selectedProduct();
            }
            else {
                return this.productsTeam()[0];
            }
        });
        this.teamTopIsContact = ko.pureComputed(() => {
            return this.teamTop().type === 'contact';
        });
        this.teamUsersTop = ko.pureComputed(() => {
            return this.teamTop().usersDisp();
        });
        this.teamPriceSaleTop = ko.pureComputed(() => {
            var psDisp = this.teamTop().priceSaleDisp();
            return psDisp;
        });
        this.teamPriceRegTop = ko.pureComputed(() => {
            return this.teamTop().priceRegDisp();
        });

        this.courseUrl = ko.pureComputed(() => {
            var url = 'https://sso.teachable.com/secure/89912/checkout/confirmation?product_id=' +
                this.selectedProduct().id +
                '&course_id=' + this.id;
            return url;
        });
        this.showMessage = ko.observable(false);

    }

    public getLevelIcon(levelObj) {
        return levelObj['l' + this.level];
    }

    public toggleTeamSelecting() {
        this.teamSelecting(!this.teamSelecting());
    }

    public selectProduct(prod) {
        if (typeof prod === 'string' && prod === 'single') {
            this.selectedProduct(this.productSingle());
        }
        else if (prod.type === 'contact') {
            this.selectedProduct(prod);
        }
        else {
            this.selectedProduct(prod);
        }
        this.showMessage(false);
    }

    public goToCourseDetailPage() {
        var currentPageUrl = window.location.href;
        if (isLocalDevEnvironment()) {
            (<any>window).location = appendExistingQuery('detail.html?id=' + this.url);
        }
        else {
            (<any>window).location = appendExistingQuery('course/' + this.url);
        }
    }

    public getCourseDetailPageUrl() {
        return 'course/' + this.url;
    }

    public getCourse() {
        var selProd = this.selectedProduct();
        if (selProd) {
            if (selProd.type === 'contact') {
                this.showMessage(true);
                return false;
            }
            else {
                (<any>window).location = appendExistingQuery(this.courseUrl());
            }
        }
        else {
            this.showMessage(true);
            return false;
        }
    }
}