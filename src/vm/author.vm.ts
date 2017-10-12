import { Author } from '../models/author';

export class AuthorVm {

    public name: string;
    public bio: string;
    public title: string;
    public picture: string;

    constructor(a: Author) {
        this.name = a.name;
        this.bio = a.bio;
        this.title = a.title;
        this.picture = '/img/authors/' + a.picture;
    }
}
