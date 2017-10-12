'use strict';

$(function () {

    var detail = document.getElementsByClassName('lessons-block');
    var main = document.getElementsByClassName('bottom-header');

    $('.header .burger').on('click', function () {
        $(this).toggleClass('burger-anim');
        $('.header .mobile-header').toggleClass('active-burger')
    });

    if (main.length > 0) {
        $('.card-block .learn-card .medium-block .right').on('click', function () {
            $(this).toggleClass('right-active');
        });
    }

    $('.bundle-card .bottom a').on('click', function (e) {
        e.preventDefault();
        if ($(this).parent().prev().find('.active-single,.team-list-active').length > 0) {
            $(this).parent().parent().addClass('select-bundle');
        } else {
            $(this).parent().parent().addClass('select-bundle');
        }
    });

    $('.learn-card .medium-block .right ul li').on('click', function () {
        if ($(this).parent().parent().hasClass('right-active')) {
            $(this).parent().parent().parent().find('.learn-user').removeClass('active active-pre');
            $(this).parent().parent().parent().find('.active-users').removeClass('active-users');
            $(this).parent().find('.active-li').removeClass('active-li');
            $(this).parent().parent().addClass('active-users');
        }
    });

    $('.main-card .learn-user').on('click', function () {
        $(this).parent().find('.active-li').removeClass('active-li');
        $(this).parent().find('.active-users').removeClass('active-users');
    });

    $('.pre-card .learn-user').on('click', function () {
        $(this).parent().find('.active-li').removeClass('active-li');
        $(this).parent().find('.active-users').removeClass('active-users');
        $(this).toggleClass('active-pre');
    });


    if (detail.length > 0) {
        $('.detail-top-block .learn-user').on('click', function () {
            $(this).parent().find('.li-active').removeClass('li-active');
        });

        $('.detail-top-block .bottom a').on('click', function (e) {
            e.preventDefault();
        });

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            var detailStyle = window.getComputedStyle(document.getElementById('detailForHeight'));

            var setHeight = detailStyle.getPropertyValue('height');

            document.getElementById('detailSetHeight').style.height = setHeight;
        }
    }
});
