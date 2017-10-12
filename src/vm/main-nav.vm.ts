import { isProdBuild } from "../util/environment-util";
import { isLocalDevEnvironment, appendExistingQuery } from "../util/browser-util";

export class MainNavVm {
    public goToAboutPage() {
        if (isLocalDevEnvironment()) {
            (<any>window).location = appendExistingQuery('/about.html');
        } else {
            (<any>window).location = appendExistingQuery('/about');
        }
    };

    public getAboutPageUrl() {
        if (isProdBuild) {
            return '/about';
        } else {
            return '/about.html';
        }
    }
}