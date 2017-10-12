import ko = require('knockout');
import { CategoryVm } from "./category.vm";


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

export class CatPickerVm {

    public categories: KnockoutComputed<CategoryVm[]>;

    public selectedCategory: KnockoutObservable<CategoryVm>;

    constructor() {

        this.selectedCategory = ko.observable();
        this.selectCategory('ng');
        this.categories = ko.pureComputed(() => {
            var selCat = this.selectedCategory();
            return tCats;
        });

        /*
                if (localStorage.getItem('sel-cat') === null) {
                    this.selectCategory(initialCatId);
                } else {
                    var storedCatId = localStorage.getItem('sel-cat');
                    this.selectCategory(storedCatId);
                }
                */

    }

    public syncSelectedCat(catVm) {
        //localStorage.setItem('sel-cat', catVm.catId);
    };

    public selectCategory(catId) {
        reorderCats(catId);
        this.selectedCategory(tCats[0]);
        this.syncSelectedCat(tCats[0]);
    };




}