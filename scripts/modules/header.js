import { configOrderBtns, calculateTotalPrice } from "./cart.js";
import { localData  } from "./consts.js";

configOrderBtns(0, fillCardWithLocalData);
const popUp = document.querySelector('.header__cart--popup');

function showOverlay() {
    const headerBurgerBtn = document.querySelector('.header__menu--burger');

    headerBurgerBtn.addEventListener('click', event => {

        const headerOverlay = document.querySelector('.header__menu_overlay');
        const header = document.querySelector('.header');

        const showClass = 'header__menu_overlay--show';
        const activeClass = 'header__menu--burger_active';

        if (headerOverlay.classList.contains(showClass)) {

            document.body.classList.remove('lock');
            header.classList.remove('overlay');
            headerOverlay.classList.remove(showClass);
            headerBurgerBtn.classList.remove(activeClass);
        } else {

            document.body.classList.add('lock');
            header.classList.add('overlay');
            headerOverlay.classList.add(showClass);
            headerBurgerBtn.classList.add(activeClass);
        }
    });
}

function backEvent() {
    const backBtn = document.querySelector('.header__navigation--back');

    backBtn.addEventListener('click', event => {
        history.back();
    })
}

function configBellBtn() {
    const url = "https://ninja-tests.herokuapp.com/notifications";

    const notifBlock = document.querySelector('.header__menu--notif');
    const bellBtn = document.querySelector('.header__menu--item');
    const bellCloseBtn = document.querySelector('.header__menu--notif--close');

    bellBtn.addEventListener('click', event => {
        notifBlock.classList.add('header__menu--notif--show');

        axios.get(url).then(response => response.data).then(res => {
            const notifCards = document.querySelector('.header__menu--notif--cards');
            const templateItem = document.querySelector('.notif__item--template');

            notifCards.innerHTML = '';

            res.forEach((resItem, index) => {
                notifCards.append(templateItem.content.cloneNode(true));

                const notifItems = document.querySelectorAll('.header__menu--notif--item');
                const card = notifItems[index];

                const text = card.querySelector('.header__menu--notif--text');
                const time = card.querySelector('.header__menu--notif--time');

                const date = new Date(resItem.time);
                const dateFormatted = getFormattedDate(date);

                card.setAttribute('href', resItem.url);
                text.textContent = resItem.header;
                time.textContent = `${dateFormatted[0]}.${dateFormatted[1]} в ${dateFormatted[2]}:${dateFormatted[3]}`;

                addCardEvent(card);
            })
        });
    })

    bellCloseBtn.addEventListener('click', event => {
        notifBlock.classList.remove('header__menu--notif--show');
    });

    function addCardEvent(card) {
        const notifIcon = card.querySelector('.header__menu--notif--new');

        card.addEventListener('mouseover', event => {
            notifIcon.classList.add('header__menu--notif--viewed');
        });
    }

    function getFormattedDate(date) {
        const formattedDate = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            hours: date.getHours(),
            minutes: date.getMinutes()
        };

        return Object.values(formattedDate).map(item => {
            if (item >= 10) return item;
            return item = '0' + item;
        });
    }
}

function configCartBtn() {
    const cartBtn = document.querySelector('.header__menu--cart');
    const closeBtn = document.querySelector('.header__cart--close');

    const popUpClass = 'header__cart--popup-show';
    const bodyLock = () => document.body.classList.toggle('lock');

    cartBtn.addEventListener('click', event => {
        popUp.classList.toggle(popUpClass);
        bodyLock();
        checkEmptyCart();
        fillCardWithLocalData();
    });

    closeBtn.addEventListener('click', event => {
        popUp.classList.toggle(popUpClass);
        bodyLock();
        checkCardClass();
    });
}

function checkCardClass() {
    const cards = document.querySelectorAll('.cards__item');
    const items = localData();
    const buttonsNewClass = 'cards__item--add--added';

    cards.forEach(card => {
        const counter = card.querySelector('.cards__item--counter');
        const buttonsBlock = card.querySelector('.cards__item--add');

        if (buttonsBlock.classList.contains(buttonsNewClass)) {
            buttonsBlock.classList.remove(buttonsNewClass);
            counter.textContent = 0;
        }

        items.forEach(item => {
            if (item.id === card.dataset.id) {
                buttonsBlock.classList.add(buttonsNewClass);
                counter.textContent = item.amount;
            }
        });
    });
}

function setCardData(data, container, template) {
    data.forEach((item, index) => {
        container.append(template.content.cloneNode(true));

        const cards = document.querySelectorAll('.cart__item');
        const card = cards[index];

        const img = card.querySelector('.cart__image');

        const name = card.querySelector('.cart__name');
        const weight = card.querySelector('.cart__weight');

        const price = card.querySelector('.cart__price');
        const counter = card.querySelector('.cart__counter');

        card.dataset.id = item.id;
        name.textContent = item.name;
        weight.textContent = item.weight;
        price.textContent = `${item.price} грн.`;
        counter.textContent = item.amount;
        img.src = item.image;
    });
}

function fillCardWithLocalData() {
    const items = localData();
    const itemTemplate = document.querySelector('.template__header__cart--item');
    const itemsContainer = document.querySelector('.cart__items');

    itemsContainer.innerHTML = '';

    setCardData(items, itemsContainer, itemTemplate)
    calculateTotalPrice(items);
    checkEmptyCart();
}

function checkEmptyCart() {
    const emptyClass = 'header__cart--popup_empty';
    const items = localData();

    items.length === 0 ? popUp.classList.add(emptyClass) : popUp.classList.remove(emptyClass)
}

export { showOverlay, backEvent, configBellBtn, configCartBtn, setCardData, checkCardClass };