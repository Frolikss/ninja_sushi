import { showOverlay, configBellBtn, configCartBtn, setCardData } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';
import { calculateTotalPrice, fillMobileCart, calculateTotalItems} from './modules/cart.js';
import { localData } from './modules/consts.js';

const itemsContainer = document.querySelector('.info__order--drop');

showOverlay();
configBellBtn();
footerQuicktipToggle();
fillCardWithLocalData();
configCartBtn();
fillMobileCart();
calculateTotalItems();

function fillCardWithLocalData() {
    let items = localData();
    const itemTemplate = document.querySelector('.cart__item--template');

    itemsContainer.innerHTML = '';
    setCardData(items, itemsContainer, itemTemplate);
    calculateTotalPrice(items);
}


