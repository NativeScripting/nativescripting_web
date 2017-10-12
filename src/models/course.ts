import { Author } from './author';
import { Product } from './product';
import { Chapter } from './chapter';

export type Tag = 'NEW';
export type Level = 1 | 2 | 3;
export type CategoryEnum = 'core' | 'ng';

export interface Course {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    url: string;
    categories: CategoryEnum[];
    level: Level;
    tag: Tag;
    launchdate: Date;
    authors: Author[];
    products: Product[];
    chapters: Chapter[];
}