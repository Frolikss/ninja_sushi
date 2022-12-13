import { showOverlay, backEvent, configBellBtn, configCartBtn, setCardData } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';
import { configOrderBtns, calculateTotalPrice } from './modules/cart.js';
import { configCardCounter, fetchProductsData } from './modules/cardData.js';

let localData = () => {
    return JSON.parse(localStorage.getItem('cards')) ?? [];
}

let url = 'https://ninja-tests.herokuapp.com/products?_limit=4&page=1&category=drinks';
const cardContainer = document.querySelector('.cards');

showOverlay();
backEvent();
configBellBtn();
footerQuicktipToggle();
fillCardWithLocalData();
configCartBtn();
configOrderBtns(1, fillCardWithLocalData);
fetchProductsData(url, cardContainer);
configCardCounter([cardContainer]);

function fillCardWithLocalData() {
    let items = localData();
    const itemTemplate = document.querySelector('.cart__item--template');
    const itemsContainer = document.querySelectorAll('.cart__items')[1];

    itemsContainer.innerHTML = '';
    setCardData(items, itemsContainer, itemTemplate);
    calculateTotalPrice(items);
}