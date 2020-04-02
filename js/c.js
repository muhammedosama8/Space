$(document).ready(function () {

    $(function () {
        'use strict';
        if ($(document).scrollTop()>150){
            $('.fixed-top').addClass('border-bottom  bg-light');
        }
        console.log($(window).scrollTop());
        $(window).scroll('scroll',function () {
            if ($(window).scrollTop() > 520){
                $('.cd-top').fadeIn();

            }else {
                $('.cd-top').fadeOut();
            }

            if ($(window).scrollTop() > 150){
                $('.fixed-top').addClass('border-bottom  bg-light');

            }else {
                $('.fixed-top').removeClass('border-bottom  bg-light');
            }

        });
    });


});