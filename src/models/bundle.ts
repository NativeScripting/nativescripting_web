import { Product } from './product';

export interface Bundle {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    url: string;
    promototal: number;
    promoremaining: number;
    bundleLevel: number;
    products: Product[];
    courseIds: string[];
}