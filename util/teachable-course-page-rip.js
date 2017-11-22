//Go to teachable course page, ex: http://nativescripting.teachable.com/p/nativescript-with-angular-getting-started-guide
//Open console and paste and execute this code. Then copy the results for each course.
//Change the level, launch date, tag, and categories manually


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
        var secBtn = $(secitem).find('.btn-primary');
        var secBtnText = $(secBtn).text().trim();
        $(secBtn).remove();
        var secItemTitle = secitem.innerText.trim();
        var href = secitem.href;
        var id = href.substring(href.lastIndexOf('/') + 1);
        lessons.push({ chapterId: chapCounter, id: id, name: secItemTitle, btnText: secBtnText });
    });
    chapters.push({ id: chapCounter, name: sectitle, lessons: lessons });
});
var products = [];
$('.checkout-button-group').each((i, group) => {
    var prodId = $(group).find('input[type="radio"]')[0].value;
    var price = parseFloat($(group).find('.default-product-price')[0].innerText.replace('$', ''));
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
    "bio": "Alex lives in Washington, DC. He's a speaker, trainer, and a Telerik Developer Expert. He's been invloved in NativeScript projects since 2015 and has created courses for Pluralsight.",
    "title": "Trainer and Owner"
}];
var courseObj = { id: courseId, title: courseTitle, subtitle: courseSubTitle, description: courseDescription, url: courseUrl, categories: ['core', 'ng'], level: 1, tag: 'PRESALE', launchdate: '05/01/2017', authors: authors, products: products, chapters: chapters };
console.log(JSON.stringify(courseObj, null, 2));



