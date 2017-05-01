//Go to teachable course page, ex: http://nativescripting.teachable.com/p/nativescript-with-angular-getting-started-guide
//Open console and paste and execute this code. Then copy the results

var courseTitle = $('.course-title')[0].innerText;
var courseSubTitle = $('.course-subtitle')[0].innerText;
var courseDescription = $('.course-description')[0].innerText;
var courseId = $('#fedora-data').attr('data-course-id');
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

    products.push({ id: prodId, name: prodName, description: prodDesc, pricesale: price });
});
var courseObj = { id: courseId, title: courseTitle, subtitle: courseSubTitle, description: courseDescription, products: products, chapters: chapters };
console.log(JSON.stringify(courseObj, null, 2));