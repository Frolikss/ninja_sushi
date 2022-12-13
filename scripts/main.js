'use strict'
import { fillCardWithJSON, configCardCounter } from './modules/cardData.js';
import { showOverlay, configBellBtn, configCartBtn } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';

const bannerURL = 'https://ninja-tests.herokuapp.com/head';
const specialURL = 'https://ninja-tests.herokuapp.com/special';
const productsURL = 'https://ninja-tests.herokuapp.com/products';

const bannerSliderItems = document.querySelectorAll('.banner__text');
const specialSliderItems = document.querySelectorAll('.slider__info');

const cards = document.querySelectorAll('.cards__row');

fillWithSkeleton();
showOverlay();
configBellBtn();
configCartBtn();
footerQuicktipToggle();
fetchSliderData(bannerSliderItems, bannerURL);
fetchSliderData(specialSliderItems, specialURL);
fetchProductsData(productsURL);

function fillWithSkeleton() {
    const cardSkeletonTemplate = document.querySelector('.card__template--skeleton');

    cards.forEach(category => {
        for (let i = 0; i < 8; i++) {
            category.append(cardSkeletonTemplate.content.cloneNode(true));
        }
    });
}

function fetchSliderData(slider, url) {
    const data = fetch(url).then(response => response.json()).then(data => {
        for (let i = 0; i < slider.length; i++) {
            const sliderItem = slider[i].firstElementChild;
            sliderItem.textContent = data[i].header;
            sliderItem.nextElementSibling.textContent = data[i].subtext;
        }
    }).catch(error => console.log(error));
}

function fetchProductsData(url) {
    const cardsItemTemplate = document.querySelector('.card__template');

    axios.get(url).then(response => response.data).then(res => {

        cards.forEach(category => {
            category.innerHTML = '';
        })

        res.forEach(dataItem => {
            cards.forEach(category => {
                if (category.closest('.cards').classList.contains(dataItem.category)) {
                    category.append(cardsItemTemplate.content.cloneNode(true));
                }
            });
        });
        const cardItems = document.querySelectorAll('.cards__item');
        
        fillCardWithJSON(res, cardItems);
        configCardCounter(cards);
    });
}