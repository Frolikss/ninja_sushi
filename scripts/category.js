"use strict"

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

fillWithSkeleton();
backEvent();
fetchProductsData(category);

function backEvent() {
    const backBtn = document.querySelector('.header__navigation--back');

    backBtn.addEventListener('click', event => {
        history.back();
    })
}

function fetchProductsData(category) {
    const url = `http://localhost:3000/products?_page=1&_limit=10&category=${category}`;
    const cardsItemTemplate = document.querySelector('.card__template');
    const cardContainer = document.querySelector('.cards');

    cardContainer.innerHTML = '';

    const data = fetch(url).then(response => response.json()).then(res => {

        res.forEach(() => {
            cardContainer.append(cardsItemTemplate.content.cloneNode(true));
        });

        const cards = document.querySelectorAll('.cards__item');

        for (let i = 0; i < res.length; i++) {

            const card = cards[i];
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
    });
}

function fillWithSkeleton() {
    const cards = document.querySelector('.cards');
    const cardSkeletonTemplate = document.querySelector('.card__template--skeleton');


    for (let i = 0; i < 8; i++) {
        cards.append(cardSkeletonTemplate.content.cloneNode(true));
    }

}