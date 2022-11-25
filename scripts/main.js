'use strict'

const bannerURL = 'http://localhost:3000/head';
const specialURL = 'http://localhost:3000/special';
const productsURL = 'http://localhost:3000/products';

const bannerSliderItems = document.querySelectorAll('.banner__text');
const specialSliderItems = document.querySelectorAll('.slider__info');
const cards = document.querySelectorAll('.cards__row');
const cardSkeletonTemplate = document.querySelector('.card__template--skeleton');
cards.forEach(category => {
    for (let i = 0; i < 8; i++) {
        category.append(cardSkeletonTemplate.content.cloneNode(true));
    }
});

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

    headerBurgerBtn.addEventListener('click', event => {

        const headerOverlay = document.querySelector('.header__menu_overlay');
        const header = document.querySelector('.header');

        if (headerOverlay.classList.contains('header__menu_overlay--show')) {

            document.body.classList.remove('lock');
            header.classList.remove('overlay');
            headerOverlay.classList.remove('header__menu_overlay--show');
            headerBurgerBtn.classList.remove('header__menu--burger_active')
        } else {

            document.body.classList.add('lock');
            header.classList.add('overlay');
            headerOverlay.classList.add('header__menu_overlay--show');
            headerBurgerBtn.classList.add('header__menu--burger_active')
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

    const cardsItemTemplate = document.querySelector('.card__template');
    const data = fetch(url).then(response => response.json()).then(data => {
        //clear all skeleton
        cards.forEach(category => {
            category.innerHTML = '';
        })
        //add real cards for n items in data
        data.forEach(dataItem => {
            cards.forEach(category => {
                if (category.closest('.cards').classList.contains(dataItem.category)) {
                    category.append(cardsItemTemplate.content.cloneNode(true));
                }
            });
        });

        const cardsItem = document.querySelectorAll('.cards__item');
        //card info
        for (let i = 0; i < data.length; i++) {

                const card = cardsItem[i];
                //image
                card.firstElementChild.style.background = `url(/${data[i].image}) no-repeat center / contain`;
                //header
                card.lastElementChild.firstElementChild.textContent = data[i].header;
                //weight
                card.lastElementChild.firstElementChild.nextElementSibling.textContent = data[i].category === 'drinks' ? `Объем: ${data[i].weight} л` : `Вес: ${data[i].weight} г`;
                //price
                card.lastElementChild.lastElementChild.firstElementChild.textContent = `${data[i].price}грн.`;
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
    }).catch(error => console.log(error));
}
