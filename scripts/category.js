"use strict"

backEvent();

function backEvent() {
    const backBtn = document.querySelector('.header__navigation--back');

    backBtn.addEventListener('click', event => {
        history.back();
    })
}

