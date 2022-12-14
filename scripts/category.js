"use strict"

import { configCardCounter, fetchProductsData } from './modules/cardData.js';
import { showOverlay, backEvent, configBellBtn, configCartBtn } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

const counter = document.querySelector('.category__filter--counter');
const mobileMediaQ = window.matchMedia('(max-width: 940px)');
const cardContainer = document.querySelector('.cards');

let url = new URL(`https://ninja-tests.herokuapp.com/products?_page=1&_sort=price&_order=desc&_limit=8&category=${category}`);

fetchProductsData(url.toString(), cardContainer);
changeHeaderCategory();
backEvent();
configMenu();
headersChange();
showOverlay();
configBellBtn();
typeFilter();
flavorFilter();
fishFilter();
orderFilter();
footerQuicktipToggle();
configCartBtn();
configCardCounter([cardContainer]);

function mutateURL(param, value) {
    const urlParams = url.searchParams;

    if (param && !urlParams.has(param)) {
        urlParams.set(param, value);
    }

    if (value && urlParams.has(param)) {
        urlParams.set(param, value);
    }

    if (!value && urlParams.has(param)) {
        urlParams.delete(param);
    }

    fetchProductsData(url.toString(), cardContainer);
}

function filter(param, value) {
    if (!url.searchParams.has(param)) {
        mutateURL(param, value);
    } else {
        mutateURL(param, '');
    }
}

function typeFilter() {
    const typeBtns = document.querySelectorAll('.category__filter--item');

    typeBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            const typeBtn = btn.dataset.type;
            const param = 'type';
            const value = typeBtn;
            const activeClass = 'category__filter--item_active';

            typeBtns.forEach(btn => {
                btn.classList.remove(activeClass);
            })

            btn.classList.add(activeClass);

            if (typeBtn !== 'all') {
                filter(param, value);
                return;
            }
            mutateURL(param, '');
        });
    })
}

function flavorFilter() {
    const flavorBtns = document.querySelectorAll('.category__filter--flavoritem');

    flavorBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            btn.classList.toggle('active');
            const param = btn.dataset.flavor;
            const value = true;
            filter(param, value);
        });
    });
}

function fishFilter() {
    const fishsBtn = document.querySelectorAll('.category__filter--fishitem');

    fishsBtn.forEach(btn => {
        btn.addEventListener('click', event => {
            fishsBtn.forEach(btn => btn.classList.remove('active'));
            btn.classList.toggle('active');
            const param = 'ingridients_like';
            const value = btn.dataset.fish;
            url.searchParams.has(param) ? counter.textContent -= 1 : counter.textContent = +counter.textContent + 1;

           filter(param, value);
            counter.style.display = counter.textContent <= 0 ? 'none' : 'block';
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

    orderSelect.addEventListener('change', event => {
        const param = '_order';
        const value = orderSelect.value;
        filter(param, value);
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
        })
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
    const param = 'ingridients_like';

    counter.textContent = 0;
    counter.style.display = 'none';

    fishsBtn.forEach(btn => {
        btn.classList.remove('active');
    });

    filter(param, '');
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