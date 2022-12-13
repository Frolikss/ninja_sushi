import { showOverlay, backEvent, configBellBtn, configCartBtn, configOrderBtns, setCardData } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';

let localData = () => {
    return JSON.parse(localStorage.getItem('cards')) ?? [];
}

showOverlay();
backEvent();
configBellBtn();
footerQuicktipToggle();
fillCardWithLocalData();
configCartBtn();
configOrderBtns()

function fillCardWithLocalData() {
    let items = localData();
    const itemTemplate = document.querySelector('.cart__item--template');
    const itemsContainer = document.querySelectorAll('.cart__items')[1];

    itemsContainer.innerHTML = '';
    setCardData(items, itemsContainer, itemTemplate);
    console.log('here');
}