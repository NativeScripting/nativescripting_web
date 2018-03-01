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
        var isPreview = secBtnText === 'Preview';
        $(secBtn).remove();
        var secItemTitle = secitem.innerText.trim();
        var href = secitem.href;
        var id = href.substring(href.lastIndexOf('/') + 1);
        lessons.push({ chapterId: chapCounter, id: id, name: secItemTitle, isPreview: isPreview });
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
var authors = ['alex_ziskind'];
var courseObj = {
    id: courseId,
    title: courseTitle,
    subtitle: courseSubTitle,
    description: courseDescription,
    url: courseUrl,
    flavors: ['Core', 'Angular'],
    level: 1,
    label: 'PRESALE',
    launchdate: '05/01/2017',
    authors: authors,
    products: products,
    publishedChapters: [
        10,
        20,
        30,
        40,
        50,
        60
    ],
    chapters: chapters
};
console.log(JSON.stringify(courseObj, null, 2));



