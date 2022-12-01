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

export {showOverlay, backEvent};