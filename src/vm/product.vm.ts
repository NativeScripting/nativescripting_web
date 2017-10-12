import ko = require('knockout');
import { Product } from "../models/product";
import { Tag } from "../models/course";

export class ProductVm {
    usersDisp: KnockoutComputed<string>;
    priceSaleDisp: KnockoutComputed<string>;
    priceRegDisp: KnockoutComputed<string>;
    tag: Tag;
    pricesale: number;
    pricereg: number;
    licensesMin: number;
    type: any;
    id: string;
    licensesMax: number;

    constructor(p: Product, tag?: Tag) {
        this.id = p.id;
        this.type = p.type;
        this.licensesMin = p.licensesMin;
        this.licensesMax = p.licensesMax;
        this.pricereg = p.pricereg;
        this.pricesale = p.pricesale;
        this.tag = tag;


        this.priceRegDisp = ko.pureComputed(() => {
            return this.pricereg === 0 ? 'FREE' : this.pricereg.toString();
        });
        this.priceSaleDisp = ko.pureComputed(() => {
            return this.pricesale === 0 ? 'FREE' : this.pricesale.toString();
        });
        this.usersDisp = ko.pureComputed(() => {
            if (this.licensesMin === 1 && (this.tag === 'NEW' || this.tag === 'PRESALE')) {
                return 'Launch';
            }
            else {
                return this.licensesMin + '-' + this.licensesMax + ' users';
            }
        });
    }
}


