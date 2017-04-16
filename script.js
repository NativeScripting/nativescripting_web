'use strict';

window.onload = function () {

    var detail = document.getElementsByClassName('lessons-block');
    var main = document.getElementsByClassName('bottom-header');

    if (main.length > 0) {

        $('.card-block .learn-card .medium-block .right .team').on('click', function () {
            $(this).parent().toggleClass('right-active')
        });


        if (localStorage.getItem('filter-value') == undefined) {
            localStorage.setItem('filter-value', 'left');
        }

        if (localStorage.getItem('filter-value') === 'left') {
            //document.querySelector('#loadCard-2').style.display = 'none';
            //document.querySelector('.text-left').style.color = '#12ffcd';
            //document.querySelector('.text-right').style.color = '#4a81da';
            //document.querySelector('.bottom-header .left').style.backgroundColor = '#12ffcd';
            //document.querySelector('.bottom-header .right').style.backgroundColor = '#4a81da';
        } else {
            document.querySelector('#loadCard').style.display = 'none';
            document.querySelector('.text-right').style.color = '#12ffcd';
            document.querySelector('.bottom-header .right').style.backgroundColor = '#12ffcd';
            document.querySelector('.bottom-header .left').style.backgroundColor = '#4a81da';
            document.querySelector('.text-left').style.color = '#4a81da';
        }

        $('.bottom-header select').on('change', function () {

            var value = $(this).children(":selected").attr('data-value');
            console.log(value);
            if (value === 'left') {
                document.querySelector('.text-left').style.color = '#12ffcd';
                document.querySelector('.text-right').style.color = '#4a81da';
                document.querySelector('.bottom-header .left').style.backgroundColor = '#12ffcd';
                document.querySelector('.bottom-header .right').style.backgroundColor = '#4a81da';
                localStorage.setItem('filter-value', 'left');
                document.querySelector('#loadCard-2').style.display = 'none';
                document.querySelector('#loadCard').style.display = 'block';
            } else {
                document.querySelector('.text-right').style.color = '#12ffcd';
                document.querySelector('.text-left').style.color = '#4a81da';
                document.querySelector('.bottom-header .left').style.backgroundColor = '#4a81da';
                document.querySelector('.bottom-header .right').style.backgroundColor = '#12ffcd';
                localStorage.setItem('filter-value', 'right');
                document.querySelector('#loadCard-2').style.display = 'block';
                document.querySelector('#loadCard').style.display = 'none';
            }
        });

    }

    $('.bundle-card .medium-block .teams .team').on('click', function () {
        $(this).parent().toggleClass('teams-active')
    });


    $('.bundle-card .top-block .included').on('click', function () {
        $(this).parent().toggleClass('included-active')
    });

    $('.bundle-card .medium-block .teams .users').on('click', function () {
        $(this).parent().parent().find('.active-single').removeClass('active-single');
        $(this).parent().parent().find('.team-list-active').removeClass('team-list-active');
        $(this).toggleClass('team-select');
    });

    $('.bundle-card .medium-block .teams ul li').on('click', function () {
        $(this).parent().parent().parent().find('.team-select').removeClass('team-select');
        $(this).parent().parent().parent().find('.active-single').removeClass('active-single');
        $(this).parent().find('.team-list-active').removeClass('team-list-active');
        $(this).toggleClass('team-list-active');
    });

    $('.learn-card .medium-block .right ul li').on('click', function () {
        $(this).parent().parent().parent().find('.learn-user').removeClass('active active-pre');
        $(this).parent().parent().parent().find('.active-users').removeClass('active-users');
        $(this).parent().find('.active-li').removeClass('active-li');
        $(this).toggleClass('active-li');
    });


    $('.learn-card .medium-block .right .users').on('click', function () {
        $(this).parent().find('.active-li').removeClass('active-li');
        $(this).parent().parent().find('.learn-user').removeClass('active active-pre');
        $(this).toggleClass('active-users')
    });


    $('.main-card .learn-user').on('click', function () {
        $(this).parent().find('.active-li').removeClass('active-li');
        $(this).parent().find('.active-users').removeClass('active-users');
        $(this).toggleClass('active')
    });


    $('.pre-card .learn-user').on('click', function () {
        $(this).parent().find('.active-li').removeClass('active-li');
        $(this).parent().find('.active-users').removeClass('active-users');
        $(this).toggleClass('active-pre')
    });


    $('.bundle-card .single-user').on('click', function () {
        $(this).parent().find('.team-select').removeClass('team-select');
        $(this).parent().find('.team-list-active').removeClass('team-list-active');
        $(this).toggleClass('active-single');
    });


    $('.header .burger').on('click', function () {
        $(this).toggleClass('burger-anim');
        $('.header .mobile-header').toggleClass('active-burger')
    });



    if (detail.length > 0) {

        var right = document.querySelectorAll('.medium-block .right .team');

        for (var i = 0; i < right.length; i++) {
            right[i].addEventListener('click', function () {
                this.parentNode.classList.toggle('right-active');
            });
        }

        $('.medium-block .right .users').on('click', function () {
            $(this).parent().parent().find('.learn-user').removeClass('active');
            $(this).parent().parent().find('.li-active').removeClass('li-active');
            $(this).toggleClass('active-users');
        });

        $('.detail-top-block .medium-block .right ul li').on('click', function () {
            $(this).parent().parent().parent().find('.learn-user').removeClass('active');
            $(this).parent().parent().find('.active-users').removeClass('active-users');
            $(this).parent().find('.li-active').removeClass('li-active');
            $(this).toggleClass('li-active');
        });

        $('.detail-top-block .learn-user').on('click', function () {
            $(this).parent().find('.li-active').removeClass('li-active');
            $(this).parent().find('.active-users').removeClass('active-users');
            $(this).toggleClass('active');
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



