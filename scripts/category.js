"use strict"

import { fillCardWithJSON, configCardCounter } from './modules/cardData.js';
import { showOverlay, backEvent, configBellBtn, configCartBtn, configOrderBtns } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

const counter = document.querySelector('.category__filter--counter');
const mobileMediaQ = window.matchMedia('(max-width: 940px)');
const cardContainer = document.querySelector('.cards');

let url = `https://ninja-tests.herokuapp.com/products?_page=1&_sort=price&_order=desc&_limit=8&category=${category}`;

fetchProductsData();
filters();
uiLogic();
footerQuicktipToggle();
configCartBtn();
configOrderBtns();
configCardCounter([cardContainer]);

function mutateURL({
    type = '',
    flavor = '',
    fish = '',
    reg = '',
    replace = '' } = {}) {

    if (type || flavor || fish) {
        url += type + flavor + fish;
    }

    if (reg) {
        url = url.replace(reg, replace);
    }
}

function fetchProductsData() {
    const cardsItemTemplate = document.querySelector('.card__template');

    cardContainer.innerHTML = '';

    axios.get(url).then(response => response.data).then(res => {

        res.forEach(() => {
            cardContainer.append(cardsItemTemplate.content.cloneNode(true));
        });

        const cards = document.querySelectorAll('.cards__item');

        checkEmptyContainer(cards);
        fillCardWithJSON(res);
    });

    function checkEmptyContainer(cards) {
        if (cards.length === 0) {
            const par = document.createElement('p');
            const showMoreBtn = document.querySelector('.category__showmore');
            const notFound = 'Не найдено'
            par.textContent = notFound;
            par.style.textAlign = 'center';

            cardContainer.style.justifyContent = 'center';
            cardContainer.append(par);

            showMoreBtn.style.display = 'none';
        }
    }
}

function filters() {
    typeFilter();
    flavorFilter();
    fishFilter();
    orderFilter();
}

function uiLogic() {
    changeHeaderCategory();
    backEvent();
    configMenu();
    headersChange();
    showOverlay();
    configBellBtn();
}

function typeFilter() {
    const typeBtns = document.querySelectorAll('.category__filter--item');

    typeBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            const typeBtn = btn.dataset.type;
            const type = `&type=${typeBtn}`;
            const reg = new RegExp('&type=[a-zA-Z]+');
            const activeClass = 'category__filter--item_active';

            typeBtns.forEach(btn => {
                btn.classList.remove(activeClass);
            })

            btn.classList.add(activeClass);

            if (typeBtn === 'all') {
                mutateURL({ reg });
            } else if (!url.includes(`&type=`)) {
                mutateURL({ type });
            } else {
                mutateURL({ type, reg });
            }
            fetchProductsData();
        });
    })
}

function flavorFilter() {
    const flavorBtns = document.querySelectorAll('.category__filter--flavoritem');

    flavorBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            btn.classList.toggle('active');

            const flavor = `&${btn.dataset.flavor}`;

            if (!url.includes(flavor)) {
                mutateURL({ flavor });
            } else {
                mutateURL({ reg: flavor });
            }
            fetchProductsData();
        });
    });
}

function fishFilter() {
    const fishsBtn = document.querySelectorAll('.category__filter--fishitem');

    fishsBtn.forEach(btn => {
        btn.addEventListener('click', event => {
            btn.classList.toggle('active');

            const fish = `&ingridients_like=${btn.dataset.fish}`;

            if (!url.includes(fish)) {
                mutateURL({ fish });
                counter.textContent = +counter.textContent + 1;
            } else {
                mutateURL({ reg: fish });
                counter.textContent -= 1;
            }

            counter.style.display = counter.textContent <= 0 ? 'none' : 'block';

            fetchProductsData();
        });
    });
}

function configMenu() {
    const subMenu = document.querySelector('.category__submenu');
    const openBtn = document.querySelector('.category__filter--menu');
    const closeBtn = document.querySelector('.category__submenu--close');

    if (!mobileMediaQ.matches) {
        configMenuDesktop();
    } else {
        configMenuMobile(subMenu, openBtn, closeBtn);
    }
    configMenuBtns(subMenu, openBtn, closeBtn);
}

function orderFilter() {
    const orderSelect = document.querySelector('.category__filter--sort');
    const reg = new RegExp('&_order=[a-zA-Z]+');

    orderSelect.addEventListener('change', event => {
        const order = `&${orderSelect.value}`;
        mutateURL({ reg, replace: order });
        fetchProductsData();
    });
}

function changeHeaderCategory() {
    const headerCategories = document.querySelectorAll('.header__subitem');

    headerCategories.forEach(({ dataset, classList }) => {
        if (dataset.category === category) {
            classList.add('header__subitem_selected');
        }
    });
}

function headersChange() {
    const activeCategory = document.querySelector('.header__subitem_selected');
    const categoryHeader = document.querySelector('.category__header');
    const navigationHeader = document.querySelector('.header__navigation--itemtext');

    categoryHeader.textContent = activeCategory.textContent;
    navigationHeader.textContent = activeCategory.textContent;
}

function configMenuMobile() {
    const categoryMenu = document.querySelector('.category__submenu');

    categoryMenu.style.right = 'auto';
    categoryMenu.style.left = '0';
    counter.style.opacity = '0';

    const mobileResetBtn = document.querySelector('.category__submenu--clear');
    const mobileApplyBtn = document.querySelector('.category__submenu--apply');
    const flavorBtns = document.querySelectorAll('.category__filter--flavoritem');

    mobileResetBtn.addEventListener('click', event => {
        resetEvent();
        flavorBtns.forEach(btn => {
            btn.classList.remove('active');
            url = url.replace(`&${btn.dataset.flavor}`, '');
        })
        fetchProductsData();
    });

    mobileApplyBtn.addEventListener('click', event => {
        categoryMenu.classList.toggle('category__submenu_mobile');
        document.body.classList.toggle('lock');
    })
}

function configMenuDesktop() {
    const resetBtn = document.querySelector('.category__submenu--reset');
    resetBtn.addEventListener('click', resetEvent);
}

function resetEvent() {
    const fishsBtn = document.querySelectorAll('.category__filter--fishitem');
    const reg = new RegExp('&ingridients_like=[a-zA-Z]+', 'g');

    counter.textContent = 0;
    counter.style.display = 'none';

    fishsBtn.forEach(btn => {
        btn.classList.remove('active');
    });

    if (url.includes('&ingridients_like')) {
        url = url.replace(reg, '');
        fetchProductsData();
    }
}

function configMenuBtns(subMenu, openBtn, closeBtn) {
    const mobileClass = 'category__submenu_mobile';
    const activeClass = 'category__submenu_active';

    openBtn.addEventListener('click', event => {
        subMenu.classList.toggle(mobileMediaQ.matches ? mobileClass : activeClass);
        document.body.classList.toggle('lock');
    });

    closeBtn.addEventListener('click', event => {
        subMenu.classList.remove(mobileClass, activeClass);
        document.body.classList.toggle('lock');
    });
}