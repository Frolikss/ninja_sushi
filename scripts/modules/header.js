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

            res.forEach(() => {
                notifCards.append(templateItem.content.cloneNode(true));
            })

            const notifItems = document.querySelectorAll('.header__menu--notif--item');

            for (let i = 0; i < res.length; i++) {

                const card = notifItems[i];
                const text = card.firstElementChild;
                const time = card.lastElementChild;
                const date = new Date(res[i].time);
                const dateFormatted = getFormattedDate(date);

                card.setAttribute('href', res[i].url);
                text.textContent = res[i].header;
                time.textContent = `${dateFormatted.day}.${dateFormatted.month} в ${dateFormatted.hours}:${dateFormatted.minutes}`;

                addCardEvent(card);
            }
        });
    })

    bellCloseBtn.addEventListener('click', event => {
        notifBlock.classList.remove('header__menu--notif--show');
    });

    function addCardEvent(card) {
        const notifIcon = card.firstElementChild.lastElementChild;

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
        const items = fillCardWithLocalData();
        configOrderBtns(items);
    });

    closeBtn.addEventListener('click', event => {
        popUp.classList.toggle(popUpClass);
        bodyLock();
    });
}

function fillCardWithLocalData() {
    const items = JSON.parse(localStorage.getItem('cards'));
    const itemTemplate = document.querySelector('.template__header__cart--item');
    const itemsContainer = document.querySelector('.header__cart--items');

    itemsContainer.innerHTML = '';

    const confirmBtn = document.querySelector('.header__cart--confirm');

    items.forEach(() => {
        itemsContainer.append(itemTemplate.content.cloneNode(true));
    });

    items.forEach((item, index) => {
        const cards = document.querySelectorAll('.header__cart--item');

        const row = cards[index].firstElementChild;
        const summary = cards[index].lastElementChild;

        const info = row.lastElementChild;
        const img = info.firstElementChild;

        const text = info.lastElementChild;
        const name = text.firstElementChild;
        const weight = text.lastElementChild;

        const price = summary.firstElementChild;
        const counter = summary.lastElementChild.firstElementChild.nextElementSibling;

        cards[index].dataset.id = item.id
        name.textContent = item.name;
        weight.textContent = item.weight;
        price.textContent = item.price;
        counter.textContent = item.amount;
        img.src = item.image;
    });

    calculateTotalPrice(items);
    return items;

    function calculateTotalPrice(items) {
        let finalPrice = document.querySelector('.header__cart--finalprice');

        const MIN_PRICE = 400;

        finalPrice.textContent = `${items.reduce((sum, current) => {
            sum += (current.price.replace('грн.', '') * +current.amount);
            return sum;
        }, 0)} грн.`;

        confirmBtn.disabled = +finalPrice.textContent.replace('грн.', '') < MIN_PRICE ? true : false;
    }
}

function configOrderBtns(items) {
    const itemsContainer = document.querySelector('.header__cart--items');

    itemsContainer.addEventListener('click', event => {
        switch (event.target.className) {
            case 'header__cart--remove': removeFromLocaleStorage(items, event); break;
            case 'header__cart--plus': changeCounterLocalStorage(items, event, true); break;
            case 'header__cart--minus': changeCounterLocalStorage(items, event, false); break;
            default: break;
        }
    });
}

function removeFromLocaleStorage(items, event) {
    const selectedItem = event.target.parentNode.parentNode;
    const filteredItems = items.filter(({ id }) => id != selectedItem.dataset.id) ?? [];

    localStorage.setItem('cards', JSON.stringify(filteredItems));
    fillCardWithLocalData();
}

function changeCounterLocalStorage(items, event, isAdded) {
    const selectedItem = event.target.parentNode.parentNode.parentNode;
    const filteredItems = items
        .map(item => {
            if (item.id === selectedItem.dataset.id) {
                isAdded ? item.amount = +item.amount + 1 : item.amount -= 1;
            }
            return item;
        })
        .filter(({ amount }) => amount > 0);

    localStorage.setItem('cards', JSON.stringify(filteredItems));
    fillCardWithLocalData();
}

export { showOverlay, backEvent, configBellBtn, configCartBtn };