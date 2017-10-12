import ko = require('knockout');
import { Bundle } from '../models/bundle';
import { Course } from '../models/course';
import { ProductVm } from './product.vm';
import { CourseSummaryVm } from './course-summary.vm';
import { appendExistingQuery } from '../util/browser-util';

export class BundleVm {
    getBundleUrl: KnockoutComputed<string>;
    teamPriceRegTop: KnockoutComputed<any>;
    teamPriceSaleTop: KnockoutComputed<any>;
    teamUsersTop: KnockoutComputed<any>;
    teamTopIsContact: KnockoutComputed<boolean>;
    bundleSelected: any;
    coursesShowing: any;
    teamSelected: KnockoutComputed<boolean>;
    teamSelecting: any;
    teamTop: KnockoutComputed<any>;
    selectedProduct: any;
    singleSelected: KnockoutComputed<boolean>;
    showMessage: KnockoutObservable<boolean>;
    courseSummaries: KnockoutObservableArray<any>;
    deselectAllBundlesCallback: any;
    productsTeam: KnockoutObservableArray<any>;
    productSingle: KnockoutObservable<any>;

    public id: string;
    public title: string;
    public subtitle: string;
    public url: string;
    public promototal: number;
    public promoremaining: number;
    public bundleLevel: number;
    public courseIds: string[];


    constructor(b: Bundle, allCourses: Course[], deselectAllBundlesCallback) {
        this.id = b.id;
        this.title = b.title;
        this.subtitle = b.subtitle;
        this.url = b.url;
        this.promototal = b.promototal;
        this.promoremaining = b.promoremaining;
        this.bundleLevel = b.bundleLevel;
        this.courseIds = b.courseIds;



        this.productSingle = ko.observable(null);
        this.productsTeam = ko.observableArray([]);
        this.deselectAllBundlesCallback = deselectAllBundlesCallback;

        this.courseSummaries = ko.observableArray([]);

        var tProductsTeam = [];
        for (var i = 0; i < b.products.length; i++) {
            var newProd = new ProductVm(b.products[i]);
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
        }));

        this.productsTeam(tProductsTeam);
        var tCourseSummaries = [];
        var matchingCourses = [];

        if (this.courseIds) {
            matchingCourses = allCourses.filter((course) => {
                return this.courseIds.indexOf(course.id) > -1;
            });
        }
        for (var j = 0; j < matchingCourses.length; j++) {
            tCourseSummaries.push(new CourseSummaryVm(matchingCourses[j]));
        }

        this.courseSummaries(tCourseSummaries);
        this.showMessage = ko.observable(false);
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
        this.coursesShowing = ko.observable(false);
        this.bundleSelected = ko.observable(false);
        //Changed values
        this.selectedProduct = ko.observable(null);

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

        this.getBundleUrl = ko.pureComputed(() => {
            var url = 'https://sso.teachable.com/secure/89912/checkout/confirmation?product_id=' +
                this.selectedProduct().id +
                '&course_id=' + this.id;
            return url;
        });

    }

    public toggleTeamSelecting() {
        this.teamSelecting(!this.teamSelecting());
    };

    public toggleCoursesShowing() {
        this.coursesShowing(!this.coursesShowing());
    };

    public selectProduct(prod) {
        this.deselectAllBundlesCallback();
        if (typeof prod === 'string' && prod === 'single') {
            this.selectedProduct(this.productSingle());
        }
        else if (prod.type === 'contact') {
            this.selectedProduct(prod);
        }
        else {
            this.selectedProduct(prod);
        }
        this.bundleSelected(true);
        this.showMessage(false);
    };

    public deselectBundle() {
        this.bundleSelected(false);
        this.selectedProduct(null);
        this.showMessage(false);
    };

    public buyBundle() {
        if (this.selectedProduct()) {
            (<any>window).location = appendExistingQuery(this.getBundleUrl());
        }
        else {
            this.deselectAllBundlesCallback();
            this.showMessage(true);
            return false;
        }
    };
}
