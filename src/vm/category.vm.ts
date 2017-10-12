import { Category } from "../models/category";
import { CategoryEnum } from "../models/course";



export class CategoryVm {
    name: string;
    catId: CategoryEnum;


    constructor(c: Category) {
        this.catId = c.catId;
        this.name = c.name;
    }
}