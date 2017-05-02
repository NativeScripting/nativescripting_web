//Go to teachable course page, ex: http://nativescripting.teachable.com/p/nativescript-with-angular-getting-started-guide
//Open console and paste and execute this code. Then copy the results

//Course rip code
var courseTitle = $('.course-title')[0].innerText;
var courseSubTitle = $('.course-subtitle')[0].innerText;
var courseDescription = $('.course-description')[0].innerText;
var courseId = $('#fedora-data').attr('data-course-id');
var courseUrl = courseTitle.toLocaleLowerCase().split(' ').join('-');
var chapters = [];
var chapCounter = 0;
$('.course-section').each((i, section) => {
    chapCounter += 10;
    var sectitleObj = $(section).find('.section-title');
    var sectitle = sectitleObj[0].innerText;
    var lessons = [];
    $(section).find('.section-item a').each((j, secitem) => {
        var secItemTitle = secitem.innerText.trim();
        var href = secitem.href;
        var id = href.substring(href.lastIndexOf('/') + 1);
        lessons.push({ chapterId: chapCounter, id: id, name: secItemTitle });
    });
    chapters.push({ id: chapCounter, name: sectitle, lessons: lessons });
});
var products = [];
$('.checkout-button-group').each((i, group) => {
    var prodId = $(group).find('input[type="radio"]')[0].value;
    var price = $(group).find('.default-product-price')[0].innerText;
    if (price == 'FREE') price = 0;
    var prodName = $(group).find('.product-name')[0].innerText;
    var prodDesc = $(group).find('.description')[0].innerText;
    var liccount = prodName.toLowerCase().indexOf('single') > -1 ? 1 : 2;
    var licensesMin = liccount === 1 ? 1 : 2;
    var licensesMax = liccount === 1 ? 1 : 10;
    products.push({ id: prodId, name: prodName, description: prodDesc, pricesale: price, pricereg: price, licensesMin: licensesMin, licensesMax: licensesMax });
});
var authors = [{
    "name": "Alex Ziskind",
    "picture": "alex_ziskind.png",
    "bio": "This is Alex's short bio",
    "title": "Trainer and Owner"
}];
var courseObj = { id: courseId, title: courseTitle, subtitle: courseSubTitle, description: courseDescription, url: courseUrl, categories: ['core', 'ng'], level: 1, tag: 'PRESALE', launchdate: '05/01/2017', authors: authors, products: products, chapters: chapters };
console.log(JSON.stringify(courseObj, null, 2));


///Bundle rip code
var bundleTitle = $('.course-title')[0].innerText;
var bundleSubTitle = $('.course-subtitle')[0].innerText;
var bundleDescription = $('.course-description')[0].innerText;
var bundleId = $('#fedora-data').attr('data-course-id');
var bundleUrl = bundleTitle.toLocaleLowerCase().split(' ').join('-');
var courseIds = [];
$('.course-listing.bundle').each((i, section) => {
    var idAttr = $(section).attr('data-course-url');
    var cId = idAttr.substring(idAttr.lastIndexOf('/') + 1);
    courseIds.push(cId);
});
var products = [];
$('.checkout-button-group').each((i, group) => {
    var prodId = $(group).find('input[type="radio"]')[0].value;
    var price = $(group).find('.default-product-price')[0].innerText;
    if (price == 'FREE') price = 0;
    var prodName = $(group).find('.product-name')[0].innerText;
    var prodDesc = $(group).find('.description')[0].innerText;
    var liccount = prodName.toLowerCase().indexOf('single') > -1 ? 1 : 2;
    var licensesMin = liccount === 1 ? 1 : 2;
    var licensesMax = liccount === 1 ? 1 : 10;
    products.push({ id: prodId, name: prodName, description: prodDesc, pricesale: price, pricereg: price, licensesMin: licensesMin, licensesMax: licensesMax });
});

var bundleObj = { id: bundleId, title: bundleTitle, subtitle: bundleSubTitle, description: bundleDescription, url: bundleUrl, promototal: 100, promoremaining: 100, bundleLevel: 1, products: products, courseIds: courseIds };
console.log(JSON.stringify(bundleObj, null, 2));