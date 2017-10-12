import { Lesson } from './lesson';

export interface Chapter {
    id: number;
    name: string;
    lessons: Lesson[];
}