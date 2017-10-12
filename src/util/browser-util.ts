export function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
export function isLocalDevEnvironment() {
    return window.location.href.indexOf('127.') > -1;
}
export function appendExistingQuery(url) {
    if (url.indexOf('?') > -1) {
        return url + window.location.search.replace(/\?/g, '&');
    }
    else {
        return url + window.location.search;
    }
}