let localData = () => {
    return JSON.parse(localStorage.getItem('cards'));
}

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
                time.textContent = `${dateFormatted.day}.${dateFormatted.month} в ${dateFormatted.hours}:${dateFormatted.minutes}`;

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
        const obj = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            hours: date.getHours(),
            minutes: date.getMinutes()
        };

        for (let [key, item] of Object.entries(obj)) {
            if (item < 10) {
                obj[key] = '0' + item;
            }
        }
        return obj;
    }
}

function configCartBtn() {
    const cartBtn = document.querySelector('.header__menu--cart');
    const popUp = document.querySelector('.header__cart--popup');
    const closeBtn = document.querySelector('.header__cart--close');

    const popUpClass = 'header__cart--popup-show';
    const bodyLock = () => document.body.classList.toggle('lock');

    cartBtn.addEventListener('click', event => {
        popUp.classList.toggle(popUpClass);
        bodyLock();
        fillCardWithLocalData();
        configOrderBtns();
    });

    closeBtn.addEventListener('click', event => {
        popUp.classList.toggle(popUpClass);
        bodyLock();
    });
}

function fillCardWithLocalData() {
    const items = localData();
    const itemTemplate = document.querySelector('.template__header__cart--item');
    const itemsContainer = document.querySelector('.header__cart--items');
    const confirmBtn = document.querySelector('.header__cart--confirm');

    itemsContainer.innerHTML = '';

    items.forEach((item, index) => {
        itemsContainer.append(itemTemplate.content.cloneNode(true));

        const cards = document.querySelectorAll('.header__cart--item');
        const card = cards[index];

        const info = card.querySelector('.header__cart--info');
        const img = card.querySelector('.header__cart--image');

        const name = card.querySelector('.header__cart--name');
        const weight = card.querySelector('.header__cart--weight');

        const price = card.querySelector('.header__cart--price');
        const counter = card.querySelector('.header__cart--counter');

        card.dataset.id = item.id;
        name.textContent = item.name;
        weight.textContent = item.weight;
        price.textContent = `${item.price} грн.`;
        counter.textContent = item.amount;
        img.src = item.image;
    });

    calculateTotalPrice(items);

    function calculateTotalPrice(items) {
        const MIN_PRICE = 400;
        const finalPrice = document.querySelector('.header__cart--sum');

        finalPrice.textContent = items.reduce((sum, current) => {
            sum += (current.price * +current.amount);
            return sum;
        }, 0);

        confirmBtn.disabled = +finalPrice.textContent < MIN_PRICE ? true : false;
    }
}

function configOrderBtns() {
    const itemsContainer = document.querySelector('.header__cart--items');

    itemsContainer.addEventListener('click', event => {
        switch (event.target.className) {
            case 'header__cart--remove': removeFromLocaleStorage(event); break;
            case 'header__cart--plus': changeCounterLocalStorage(event, true); break;
            case 'header__cart--minus': changeCounterLocalStorage(event, false); break;
            default: break;
        }
    });
}

function removeFromLocaleStorage(event) {
    const items = localData();
    const selectedItem = event.target.parentNode.parentNode;
    const filteredItems = items.filter(({ id }) => id !== selectedItem.dataset.id) ?? [];

    localStorage.setItem('cards', JSON.stringify(filteredItems));
    fillCardWithLocalData();
}

function changeCounterLocalStorage(event, isAdded) {
    const items = localData();
    const selectedItem = event.target.parentNode.parentNode.parentNode;

    const filteredItems = items
        .map(item => {
            if (item.id !== selectedItem.dataset.id) { return item; }
            isAdded ? item.amount += + 1 : item.amount -= 1;
            return item;
        })
        .filter(({ amount }) => +amount > 0);

    localStorage.setItem('cards', JSON.stringify(filteredItems));
    fillCardWithLocalData();
}

export { showOverlay, backEvent, configBellBtn, configCartBtn };