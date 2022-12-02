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
    });

    closeBtn.addEventListener('click', event => {
        popUp.classList.toggle(popUpClass);
        bodyLock();
    });
}

export {showOverlay, backEvent, configBellBtn, configCartBtn};