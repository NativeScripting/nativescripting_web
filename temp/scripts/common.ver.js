function getBaseName(url) {
    if (!url || (url && url.length === 0)) {
        return "";
    }
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var basename = filenameWithExtension.split(/[.?&#]+/)[0];

    if (basename.length === 0) {
        url = url.substr(0, index - 1);
        basename = getBaseName(url);
    }
    return basename ? basename : "";
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function appendExistingQuery(url) {
    if (url.indexOf('?') > -1) {
        return url + window.location.search.replace(/\?/g, '&');
    } else {
        return url + window.location.search;
    }
}

function isLocalDevEnvironment() {
    return window.location.href.indexOf('127.') > -1;
}

function fixEnvironmentUrls() {
    if (isLocalDevEnvironment()) {
        var linksToBeFixed = $('[data-z-url-fix]');
        for (var i = 0; i < linksToBeFixed.length; i++) {
            var linkObj = $(linksToBeFixed[i]);
            linkObj.attr('href', linkObj.attr('href') + '.html');
        }
    }
}

function bootstrapCommonPage() {
    $(function () {
        fixEnvironmentUrls();
    });
}