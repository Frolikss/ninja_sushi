'use strict'
import {fillCardWithJSON} from './modules/cardData.js';
import {showOverlay} from './modules/header.js'
import {footerQuicktipToggle} from './modules/footer.js';

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
footerQuicktipToggle();
fetchSliderData(bannerSliderItems, bannerURL);
fetchSliderData(specialSliderItems, specialURL);
fetchProductsData(productsURL);



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
    const data = fetch(url).then(response => response.json()).then(res => {
        //clear all skeleton
        cards.forEach(category => {
            category.innerHTML = '';
        })
        //add real cards for n items in data
        res.forEach(dataItem => {
            cards.forEach(category => {
                if (category.closest('.cards').classList.contains(dataItem.category)) {
                    category.append(cardsItemTemplate.content.cloneNode(true));
                }
            });
        });
        fillCardWithJSON(res);
    });
}