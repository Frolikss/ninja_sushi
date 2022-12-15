import { showOverlay, configBellBtn, configCartBtn, setCardData } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';
import { calculateTotalPrice, fillMobileCart, calculateTotalItems} from './modules/cart.js';
import { localData } from './modules/consts.js';

const isMobile = () => window.window.screen.width < 768;
const itemsContainer = document.querySelector(isMobile() ? '.info__order_mobile' : '.info__order--drop');

showDropMenu();
fillInfoWithFormData();
showOverlay();
configBellBtn();
footerQuicktipToggle();
fillCardWithLocalData();
configCartBtn();
fillMobileCart();

function fillCardWithLocalData() {
    let items = localData();
    const itemTemplate = document.querySelectorAll('.cart__item--template')[isMobile() ? 1 : 0];

    itemsContainer.innerHTML = '';
    setCardData(items, itemsContainer, itemTemplate);
    calculateTotalPrice(items);
    calculateTotalItems();

    if (!isMobile()) {
        calculateTotalPriceForItem();
    }
}

function calculateTotalPriceForItem() {
    const cards = document.querySelectorAll('.cart__item');

    cards.forEach(card => {
        let total = card.querySelector('.cart__total');
        let price = card.querySelector('.cart__price');
        let amount = card.querySelector('.cart__counter');
        
        total.textContent = `${+amount.textContent * (+price.textContent.split(' ')[0])} грн.`;
    });
}

function fillInfoWithFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = [];

    for (let [key, value] of urlParams.entries()) {
        if (value) {
            params.push({key, value});
        }
    }

    const infoContainer = document.querySelector('.info__delivery--data');

    const infoTemplate = document.querySelector('.info__delivery--template');

    params.forEach(({key, value}, index) => {
        infoContainer.append(infoTemplate.content.cloneNode(true));

        const infoItem = document.querySelectorAll('.info__delivery--data--item')[index];

        const header = infoItem.querySelector('.info__delivery--data--header');
        const text = infoItem.querySelector('.info__delivery--data--text');

        header.textContent = key;
        text.textContent = value
    });
}

function showDropMenu() {
    const menu = document.querySelector('.info__order--menu');
    const drop = document.querySelector('.info__order--drop');

    menu.addEventListener('click', event => {
        drop.classList.toggle('info__order--drop_show');
    })
}