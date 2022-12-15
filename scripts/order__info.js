import { showOverlay, configBellBtn, configCartBtn, setCardData } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';
import { calculateTotalPrice, fillMobileCart, calculateTotalItems} from './modules/cart.js';
import { localData } from './modules/consts.js';

const isMobile = () => window.window.screen.width < 768;
const itemsContainer = document.querySelector(isMobile() ? '.info__order_mobile' : '.info__order--drop');

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
}
