import { showOverlay, backEvent, configBellBtn, configCartBtn, setCardData } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';
import { configOrderBtns, calculateTotalPrice } from './modules/cart.js';

let localData = () => {
    return JSON.parse(localStorage.getItem('cards')) ?? [];
}

showOverlay();
backEvent();
configBellBtn();
footerQuicktipToggle();
fillCardWithLocalData();
configCartBtn();
configOrderBtns(1, fillCardWithLocalData);

function fillCardWithLocalData() {
    let items = localData();
    const itemTemplate = document.querySelector('.cart__item--template');
    const itemsContainer = document.querySelectorAll('.cart__items')[1];

    itemsContainer.innerHTML = '';
    setCardData(items, itemsContainer, itemTemplate);
    calculateTotalPrice(items);
}