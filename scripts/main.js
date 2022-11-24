'use strict'

const bannerURL = 'http://localhost:3000/head';
const specialURL = 'http://localhost:3000/special';
const productsURL = 'http://localhost:3000/products';

const wrapper = document.querySelector('.header__wrapper');
const bannerSliderItems = document.querySelectorAll('.banner__text');
const specialSliderItems = document.querySelectorAll('.slider__info');

showOverlay();
fetchSliderData(bannerSliderItems, bannerURL);
fetchSliderData(specialSliderItems, specialURL);
fetchProductsData(productsURL);

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

function showOverlay() {
    const headerBurgerBtn = document.querySelector('.header__menu--burger');
    const headerCaption = document.querySelector('.header__menu--burger--caption');

    headerBurgerBtn.addEventListener('click', event => {

        const headerOverlay = document.querySelector('.header__menu_overlay');
        const header = document.querySelector('.header');

        if (headerOverlay.classList.contains('header__menu_overlay--show')) {

            document.body.classList.remove('lock');
            header.classList.remove('overlay');
            headerOverlay.classList.remove('header__menu_overlay--show');

            headerCaption.style.display = 'none';
            headerCaption.style.opacity = '0';
        } else {

            document.body.classList.add('lock');
            header.classList.add('overlay');
            headerOverlay.classList.add('header__menu_overlay--show');

            headerCaption.style.display = 'block';
            headerCaption.style.opacity = '1';
        }
    });
}

function fetchSliderData(slider, url) {
    const data = fetch(url).then(response => response.json()).then(data => {
        for (let i = 0; i < slider.length; i++) {
            slider[i].firstElementChild.textContent = data[i].header;
            slider[i].firstElementChild.nextElementSibling.textContent = data[i].subtext;
        }
    }).catch(error => console.log(error));
}

function fetchProductsData(url) {
    const cards = document.querySelectorAll('.cards__item');
    const data = fetch(url).then(response => response.json()).then(data => {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].closest('.cards').classList.contains(data[i].category)) {
                const card = cards[i];

                //image
                card.firstElementChild.style.background = `url(/${data[i].image}) no-repeat center`;
                //header
                card.lastElementChild.firstElementChild.textContent = data[i].header;
                //weight
                card.lastElementChild.firstElementChild.nextElementSibling.textContent = data[i].category === 'drinks' ? `Объем: ${data[i].weight} л` : `Вес: ${data[i].weight} г`;
                //price
                card.lastElementChild.lastElementChild.firstElementChild.textContent = `${data[i].price} грн`;
                //text
                card.lastElementChild.lastElementChild.previousElementSibling.textContent = data[i].text;

                if (data[i].isHit) {
                    card.firstElementChild.classList.add('cards__item_new');
                }

                if (data[i].isNew) {
                    card.firstElementChild.classList.add('cards__item_hit');
                }

                if (data[i].isSpicy) {
                    card.firstElementChild.lastElementChild.classList.add('cards__item_spicy');
                }

                if (data[i].isEco) {
                    card.firstElementChild.lastElementChild.classList.add('cards__item_eco');
                }

                if (data[i].isDisposable) {
                    card.firstElementChild.lastElementChild.classList.add('cards__item_disposable');
                }
            }
        }
    }).catch(error => console.log(error));
}
