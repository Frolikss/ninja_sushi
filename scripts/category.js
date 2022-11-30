"use strict"

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
const counter = document.querySelector('.category__filter--counter');
const mobileMediaQ = window.matchMedia('(max-width: 940px)');

let url = `http://localhost:3000/products?_page=1&_sort=price&_order=desc&_limit=8&category=${category}`;

fetchProductsData();
filters();
uiLogic();

function backEvent() {
    const backBtn = document.querySelector('.header__navigation--back');

    backBtn.addEventListener('click', event => {
        history.back();
    })
}

function fetchProductsData() {

    const cardsItemTemplate = document.querySelector('.card__template');
    const cardContainer = document.querySelector('.cards');

    cardContainer.innerHTML = '';

    const data = fetch(url).then(response => response.json()).then(res => {

        res.forEach(() => {
            cardContainer.append(cardsItemTemplate.content.cloneNode(true));
        });

        const cards = document.querySelectorAll('.cards__item');

        checkEmptyContainer(cards);

        for (let i = 0; i < res.length; i++) {
            fillCardWithJSON(cards[i], res, i);
        }
    });

    function checkEmptyContainer(cards) {

        if (cards.length === 0) {
            const par = document.createElement('p');
            const showMoreBtn = document.querySelector('.category__showmore');

            par.textContent = 'Не найдено';
            par.style.textAlign = 'center';

            cardContainer.style.justifyContent = 'center';
            cardContainer.append(par);

            showMoreBtn.style.display = 'none';
        }
    }

    function fillCardWithJSON(card, res, i) {

        const marks = card.firstElementChild;
        const icons = marks.lastElementChild;
        const data = card.lastElementChild;
        const header = data.firstElementChild;
        const itemInfo = data.lastElementChild;

        marks.style.background = `url(/${res[i].image}) no-repeat top / contain`;

        header.textContent = res[i].header;

        header.nextElementSibling.textContent = res[i].category === 'drinks' ? `Объем: ${res[i].weight} л` : `Вес: ${res[i].weight} г`;

        //price
        itemInfo.firstElementChild.textContent = `${res[i].price}грн.`;

        //text
        itemInfo.previousElementSibling.textContent = res[i].text;

        if (res[i].isHit) {
            marks.classList.add('cards__item_new');
        }

        if (res[i].isNew) {
            marks.classList.add('cards__item_hit');
        }

        if (res[i].isSpicy) {
            icons.classList.add('cards__item_spicy');
        }

        if (res[i].isEco) {
            icons.classList.add('cards__item_eco');
        }

        if (res[i].isDisposable) {
            icons.classList.add('cards__item_disposable');
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
    headersCahnge();
    showOverlay();
}

function typeFilter() {
    const typeBtns = document.querySelectorAll('.category__filter--item');

    typeBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            const type = btn.dataset.type;

            for (let i = 0; i < typeBtns.length; i++) {
                typeBtns[i].classList.remove('category__filter--item_active');
            }

            btn.classList.add('category__filter--item_active');

            if (type === 'all') {

                const reg = new RegExp('&type=[a-zA-Z]+');
                url = url.replace(reg, '');

            } else if (!url.includes(`&type=`)) {

                url += `&type=${type}`;

            } else {

                const reg = new RegExp('&type=[a-zA-Z]+');
                url = url.replace(reg, `&type=${type}`);
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
                url += flavor;
            } else {
                url = url.replace(flavor, '');
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
                url += fish;
                counter.textContent = +counter.textContent + 1;
            } else {
                url = url.replace(fish, '');
                counter.textContent -= 1;
            }

            counter.textContent <= 0 ? counter.style.display = 'none' :
                counter.style.display = 'block';

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

    orderSelect.addEventListener('change', event => {
        const reg = new RegExp('&_order=[a-zA-Z]+');
        url = url.replace(reg, `&${orderSelect.value}`);

        fetchProductsData();
    });
}

function changeHeaderCategory() {
    const headerCategories = document.querySelectorAll('.header__subitem');

    headerCategories.forEach(headerCategory => {
        if (headerCategory.dataset.category === category) {
            headerCategory.classList.add('header__subitem_selected');
        }
    });
}

function headersCahnge() {
    const activeCategory = document.querySelector('.header__subitem_selected');
    const categoryHeader = document.querySelector('.category__header');
    const navigationHeader = document.querySelector('.header__navigation--itemtext');
    
    categoryHeader.textContent = activeCategory.textContent;
    navigationHeader.textContent = activeCategory.textContent;
}

function showOverlay() {
    const headerBurgerBtn = document.querySelector('.header__menu--burger');

    headerBurgerBtn.addEventListener('click', event => {

        const headerOverlay = document.querySelector('.header__menu_overlay');
        const header = document.querySelector('.header');

        if (headerOverlay.classList.contains('header__menu_overlay--show')) {

            document.body.classList.remove('lock');
            header.classList.remove('overlay');
            headerOverlay.classList.remove('header__menu_overlay--show');
            headerBurgerBtn.classList.remove('header__menu--burger_active')
        } else {

            document.body.classList.add('lock');
            header.classList.add('overlay');
            headerOverlay.classList.add('header__menu_overlay--show');
            headerBurgerBtn.classList.add('header__menu--burger_active')
        }
    });
}

function configMenuMobile() {
    const categoryMenu = document.querySelector('.category__submenu');

    categoryMenu.style.right = 'auto';
    categoryMenu.style.left = '0';
    counter.style.opacity = '0';
    
    const mobileResetBtn = document.querySelector('.category__submenu--clear');
    const mobileApplyBtn = document.querySelector('.category__submenu--apply');

    mobileResetBtn.addEventListener('click', resetEvent);

    mobileApplyBtn.addEventListener('click', event => {
        categoryMenu.classList.toggle('category__submenu_mobile');
    })
}

function configMenuDesktop() {

    const resetBtn = document.querySelector('.category__submenu--reset');
    resetBtn.addEventListener('click', resetEvent);
}

function resetEvent() {
    const fishsBtn = document.querySelectorAll('.category__filter--fishitem');

    counter.textContent = 0;
    counter.style.display = 'none';

    fishsBtn.forEach(btn => {
        btn.classList.remove('active');
    });

    if (url.includes('&ingridients_like')) {
        const reg = new RegExp('&ingridients_like=[a-zA-Z]+', 'g');
        url = url.replace(reg, '');

        fetchProductsData();
    }
}

function configMenuBtns(subMenu, openBtn, closeBtn) {
    openBtn.addEventListener('click', event => {
        subMenu.classList.toggle(mobileMediaQ.matches ? 'category__submenu_mobile' : 'category__submenu_active');
        document.body.classList.toggle('lock');
    });

    closeBtn.addEventListener('click', event => {
        subMenu.classList.remove('category__submenu_active', 'category__submenu_mobile');
        document.body.classList.toggle('lock');
    });

}