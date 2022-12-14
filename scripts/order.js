import { showOverlay, backEvent, configBellBtn, configCartBtn, setCardData, checkCardClass } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';
import { configOrderBtns, calculateTotalPrice, fillMobileCart } from './modules/cart.js';
import { configCardCounter, fetchProductsData } from './modules/cardData.js';

let localData = () => {
    return JSON.parse(localStorage.getItem('cards')) ?? [];
}

const cardContainer = document.querySelector('.cards');
const itemsContainer = document.querySelectorAll('.cart__items')[1];

showOverlay();
backEvent();
configBellBtn();
footerQuicktipToggle();
fillCardWithLocalData();
configCartBtn();
configOrderBtns(1, fillCardWithLocalData);
addCardsEvent();
addItemsEvent();

if (window.screen.width < 500) {
    fillMobileCart();
    fillMobileStr();
}

if (window.screen.width > 940) {
    let url = 'https://ninja-tests.herokuapp.com/products?_limit=4&page=1&category=drinks';
    fetchProductsData(url, cardContainer);
    configCardCounter([cardContainer]);
}

function fillCardWithLocalData() {
    let items = localData();
    const itemTemplate = document.querySelector('.cart__item--template');

    itemsContainer.innerHTML = '';
    setCardData(items, itemsContainer, itemTemplate);
    calculateTotalPrice(items);
}

function addCardsEvent() {
    cardContainer.addEventListener('click', event => {
        if (event.target.classList.contains('cards__item--minus') || event.target.classList.contains('cards__item--plus')) {
            fillCardWithLocalData();
        }
    })
    
}

function addItemsEvent() {
    itemsContainer.addEventListener('click', event => {
        const eventClass = event.target.classList;
    
        if (eventClass.contains('cart__remove') || eventClass.contains('cart__plus') || eventClass.contains('cart__minus')) {
            checkCardClass();
        }
    });
}

function fillMobileStr() {
    const str = document.querySelector('.order__cart--string');
    const items = localData();
    let strArr = [];

    items.forEach(item => {
        strArr.push(item?.name);
    });

    str.textContent = strArr.join(', ');
}