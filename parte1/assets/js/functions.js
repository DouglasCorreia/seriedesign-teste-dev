$(document).ready(function () {
    headerFixed();
    slider();
    scrollInitial();
    optionsEnable();
    mobileMenu();

    function slider() {
        var $banner = $('.banner');

        $banner.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 2000,
            prevArrow: '<div class="sprite banner__arrow"></div>',
            nextArrow: '<div class="sprite banner__arrow right"></div>',
        });
    }

    function headerFixed() {
        $(window).on('scroll', function () {
            var top = $(this).scrollTop()
            var $header = $('.header');

            if (top > 160) {
                $header.addClass('fixed');
            } else {
                $header.removeClass('fixed');
            }
        });
    }

    function scrollInitial() {
        var $upArrow = $('.sprite--arrow');

        $upArrow.on('click', function () {
            $('body, html').animate({ scrollTop: $('#initial').offset().top }, 700);
        });
    }

    function optionsEnable() {
        var $window = $(window);

        $window.on('scroll', function () {
            var top = $(this).scrollTop()
            var $options = $('.options');

            if (top > ($window.height() - 300)) {
                $options.fadeIn();
            } else {
                $options.fadeOut();
            }
        });
    }

    function mobileMenu() {
        var $menuButton = $('.header__menu--button');
        var $headerMenu = $('.header__menu');

        if ($(window).width() < 1023) {
            $headerMenu.before($menuButton);

            $menuButton.on('click', function () {
                $headerMenu.slideToggle();
            })
        }
    }
})