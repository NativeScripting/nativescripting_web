'use strict';

window.onload = function () {

    var detail = document.getElementsByClassName('lessons-block');
    var main = document.getElementsByClassName('bottom-header');
    setTimeout(function () {
        $('.card-block .learn-card .top-block .card-header').each(function () {
            console.log($(this).height());
            if ($(this).height() > 97) {
                $(this).find('img').css('top', '22px');
                $(this).css('top', '126px');
            }
        });
    }, 100);

    if (main.length > 0) {

        $('.card-block .learn-card .medium-block .right').on('click', function () {
            $(this).toggleClass('right-active');
        });


        if (localStorage.getItem('filter-value') == undefined) {
            localStorage.setItem('filter-value', 'left');
        }

        if (localStorage.getItem('filter-value') === 'left') {
            document.querySelector('#loadCard-2').style.display = 'none';
            document.querySelector('.text-left').style.color = '#12ffcd';
            document.querySelector('.text-right').style.color = '#4a81da';
            //document.querySelector('.bottom-header .left').style.backgroundColor = '#12ffcd';
            //document.querySelector('.bottom-header .right').style.backgroundColor = '#4a81da';
        } else {
            document.querySelector('#loadCard').style.display = 'none';
            document.querySelector('.text-right').style.color = '#12ffcd';
            //document.querySelector('.bottom-header .right').style.backgroundColor = '#12ffcd';
            //document.querySelector('.bottom-header .left').style.backgroundColor = '#4a81da';
            document.querySelector('.text-left').style.color = '#4a81da';
        }

        var leftFilter = document.querySelector('#left-filter').addEventListener('click', function () {
            document.querySelector('.text-left').style.color = '#12ffcd';
            document.querySelector('.text-right').style.color = '#4a81da';
            //document.querySelector('.bottom-header .left').style.backgroundColor = '#12ffcd';
            //document.querySelector('.bottom-header .right').style.backgroundColor = '#4a81da';
            localStorage.setItem('filter-value', 'left');
            document.querySelector('#loadCard-2').style.display = 'none';
            document.querySelector('#loadCard').style.display = 'block';
        });

        var rightFilter = document.querySelector('#right-filter').addEventListener('click', function () {
            document.querySelector('.text-right').style.color = '#12ffcd';
            document.querySelector('.text-left').style.color = '#4a81da';
            //document.querySelector('.bottom-header .left').style.backgroundColor = '#4a81da';
            //document.querySelector('.bottom-header .right').style.backgroundColor = '#12ffcd';
            localStorage.setItem('filter-value', 'right');
            document.querySelector('#loadCard-2').style.display = 'block';
            document.querySelector('#loadCard').style.display = 'none';
        });

        $('.bottom-header .select-cat').on('click', function () {

            //$(this).toggleClass('select-cat-active');

        });

        $('.select-cat a').on('click', function () {
            console.log($(this).attr('data-value'));
            var value = $(this).attr('data-value');

            $('.select-cat').prepend($(this));
            if (value == 'left') {
                document.querySelector('.text-left').style.color = '#12ffcd';
                document.querySelector('.text-right').style.color = '#4a81da';
                //document.querySelector('.bottom-header .left').style.backgroundColor = '#12ffcd';
                //document.querySelector('.bottom-header .right').style.backgroundColor = '#4a81da';
                localStorage.setItem('filter-value', 'left');
                document.querySelector('#loadCard-2').style.display = 'none';
                document.querySelector('#loadCard').style.display = 'block';

            } else {
                document.querySelector('.text-right').style.color = '#12ffcd';
                document.querySelector('.text-left').style.color = '#4a81da';
                //document.querySelector('.bottom-header .left').style.backgroundColor = '#4a81da';
                //document.querySelector('.bottom-header .right').style.backgroundColor = '#12ffcd';
                localStorage.setItem('filter-value', 'right');
                document.querySelector('#loadCard-2').style.display = 'block';
                document.querySelector('#loadCard').style.display = 'none';

            }
        });


    }

    $('.bundle-card .medium-block .teams').on('click', function () {
        $(this).toggleClass('teams-active')
    });

    $('.bundle-card .single-user').on('click', function () {

        $(this).parent().find('.team-select').removeClass('team-select');
        $(this).parent().find('.team-list-active').removeClass('team-list-active');
        $(this).parent().removeClass('medium-block-active');
        $(this).toggleClass('active-single');
        if ($(this).hasClass('active-single')) {
            $(this).parent().parent().addClass('select-bundle');
        } else {
            $(this).parent().parent().removeClass('select-bundle');
        }
        var count = 0;

        $('.bundle-card').each(function () {

            if ($(this).hasClass('select-bundle') === false) {
                count++
                $(this).css('opacity', '0.6');
            } else {
                $(this).css('opacity', '1');
            }
            if (count === 3) {
                $('.bundle-card').css('opacity', '1');
            }
        });
    });

    $('.bundle-card .bottom a').on('click', function (e) {
        e.preventDefault();
        console.log($(this).prev().find('.active-single,.teams-active').length);
        if ($(this).parent().prev().find('.active-single,.team-list-active').length > 0) {
            $(this).parent().prev().prev().find('.error').removeClass('error-active');
            $(this).parent().parent().addClass('select-bundle');
            $(this).parent().prev().removeClass('medium-block-active');
        } else {
            $(this).parent().parent().addClass('select-bundle');
            $(this).parent().prev().addClass('medium-block-active');
            $(this).parent().prev().prev().find('.error').addClass('error-active');
        }
    });

    $('.bundle-card .top-block .included').on('click', function () {
        $(this).parent().toggleClass('included-active')
    });

    $('.bundle-card .medium-block .teams ul li').on('click', function () {
        if ($(this).parent().parent().hasClass('teams-active')) {
            $(this).parent().parent().parent().find('.team-select').removeClass('team-select');
            $(this).parent().parent().parent().removeClass('medium-block-active');
            $(this).parent().parent().parent().parent().addClass('select-bundle');
            $(this).parent().parent().parent().find('.active-single').removeClass('active-single');
            $(this).parent().parent().addClass('team-list-active');
            $($(this).parent()).prepend($(this));
            var count = 0;

            $('.bundle-card').each(function () {

                if ($(this).hasClass('select-bundle') === false) {
                    count++
                    $(this).css('opacity', '0.6');
                } else {
                    $(this).css('opacity', '1');
                }
                if (count === 3) {
                    $('.bundle-card').css('opacity', '1');
                }
            });
        }
    });

    // $('.bundle-card .medium-block .teams .users').on('click',function () {
    //     $(this).parent().parent().find('.active-single').removeClass('active-single');
    //     $(this).parent().parent().find('.team-list-active').removeClass('team-list-active');
    //     $(this).parent().parent().parent().find('.medium-block').removeClass('medium-active');
    //     $(this).toggleClass('team-select');
    // });



    $('.learn-card .medium-block .right ul li').on('click', function () {
        if ($(this).parent().parent().hasClass('right-active')) {
            $(this).parent().parent().parent().find('.learn-user').removeClass('active active-pre');
            $(this).parent().parent().parent().parent().find('.medium-block').removeClass('medium-active');
            $(this).parent().parent().parent().find('.active-users').removeClass('active-users');
            $(this).parent().find('.active-li').removeClass('active-li');
            $($(this).parent()).prepend($(this));
            $(this).parent().parent().addClass('active-users');
        }
    });

    $('.learn-card .bottom,.learn-card .pre-bottom').on('click', function () {
        if ($(this).parent().find('.active-li,.active-users, .active,.active-pre').length > 0) {
            $(this).prev().prev().find('.error').removeClass('error-active');
        } else {
            $(this).prev().prev().find('.error').addClass('error-active');
            $(this).prev().addClass('medium-active');
        }
    });


    $('.learn-card .medium-block .right').on('click', function () {
        // $(this).parent().find('.active-li').removeClass('active-li');
        // $(this).parent().parent().find('.learn-user').removeClass('active active-pre');
        // $(this).toggleClass('active-users');
    });


    $('.main-card .learn-user').on('click', function () {
        $(this).parent().find('.active-li').removeClass('active-li');
        $(this).parent().find('.active-users').removeClass('active-users');
        $(this).parent().parent().find('.medium-block').removeClass('medium-active');
        $(this).toggleClass('active')
    });


    $('.pre-card .learn-user').on('click', function () {
        $(this).parent().find('.active-li').removeClass('active-li');
        $(this).parent().find('.active-users').removeClass('active-users');
        $(this).parent().parent().find('.medium-block').removeClass('medium-active');
        $(this).toggleClass('active-pre')
    });


    $('.header .burger').on('click', function () {
        $(this).toggleClass('burger-anim');
        $('.header .mobile-header').toggleClass('active-burger')
    });



    if (detail.length > 0) {


        $('.medium-block .right').on('click', function () {
            $(this).toggleClass('right-active');
        });

        $('.detail-top-block .medium-block .right ul li').on('click', function () {
            if ($(this).parent().parent().hasClass('right-active')) {
                $(this).parent().parent().parent().find('.learn-user').removeClass('active');
                $(this).parent().parent().addClass('active-users');
                $(this).parent().parent().parent().removeClass('medium-active');
                $($(this).parent()).prepend($(this));
            }
        });

        $('.detail-top-block .learn-user').on('click', function () {
            $(this).parent().find('.li-active').removeClass('li-active');
            $(this).parent().find('.active-users').removeClass('active-users');
            $(this).parent().removeClass('medium-active');
            $(this).toggleClass('active');
        });

        $('.detail-top-block .bottom a').on('click', function (e) {
            e.preventDefault();
            console.log($(this).parent().prev().find('.active,.active-users').length);
            if ($(this).parent().prev().find('.active,.active-users').length > 0) {
                $(this).parent().prev().prev().removeClass('error-active');
            } else {
                $(this).parent().prev().addClass('medium-active');
                $('.detail-top-block .error').addClass('error-active');
            }
        });


        document.querySelectorAll('.detail-bundle .bundle-card .top-block h2')[0].addEventListener('click', function () {
            this.parentNode.nextElementSibling.classList.toggle('active-medium');
            this.parentNode.classList.toggle('active-header');
        });

        document.querySelectorAll('.detail-bundle .supreme-bundle .top-block h2')[0].addEventListener('click', function () {
            this.parentNode.nextElementSibling.classList.toggle('active-medium');
            this.parentNode.classList.toggle('active-header');
        });

        document.querySelectorAll('.detail-bundle .ultimate-bundle .top-block h2')[0].addEventListener('click', function () {
            this.parentNode.nextElementSibling.classList.toggle('active-medium');
            this.parentNode.classList.toggle('active-header');
        });


        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            var detailStyle = window.getComputedStyle(document.getElementById('detailForHeight'));

            var setHeight = detailStyle.getPropertyValue('height');

            document.getElementById('detailSetHeight').style.height = setHeight;
        }
    }

};



