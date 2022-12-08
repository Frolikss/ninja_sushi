
$(document).ready(function () {
    $('.banner__scroll').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    });
});

$(document).ready(function () {
    $('.slider__row').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    });
});

function setSlider() {
    $(document).ready(function () {
        $('.products__slider').slick({
            autoplay: false,
            infinite: false,
            dots: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true
        });
    });

    if (!window.matchMedia('(max-width: 1050px)').matches) {
        $(document).ready(function () {
            $('.products__item--consist--slider').slick({
                autoplay: false,
                infinite: false,
                dots: false,
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: true
            });
        });
    }
}