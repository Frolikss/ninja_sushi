import { fetchProductsData } from './modules/cardData.js';

const MAX_PAGE = 4;

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const cardContainer = document.querySelector('.cards');
const reg = new RegExp('_limit=[0-9]+');

const max = document.querySelector('.recomend__max');
max.textContent = MAX_PAGE;

let baseUrl = `https://ninja-tests.herokuapp.com/products?_limit=4&_page=1&id_ne=${id}`;

switch (window.screen.width) {
    case 1350:
        baseUrl = baseUrl.replace(reg, '_limit=3');
        break;
    case 940:
        baseUrl = baseUrl.replace(reg, '_limit=2');
        break;
    case 830:
        baseUrl = baseUrl.replace(reg, '_limit=4');
        cardContainer.classList.add('cards__showmore');
        break;
    default:
        break;
}

fetchProductsData(baseUrl, cardContainer);
configSliderBtns();
showMore();

function changePage(isAdded) {
    const current = document.querySelector('.recomend__current');
    let index = baseUrl.search('_page');
    let counter = +baseUrl[index + 6];
    let reg = new RegExp('_page=[0-9]+');

    isAdded ? counter++ : counter--;

    if (counter > 0 && counter <= MAX_PAGE) {
        current.textContent = counter;
        baseUrl = baseUrl.replace(reg, `_page=${counter}`);
        fetchProductsData(baseUrl, cardContainer);
    }
}

function configSliderBtns() {
    const prevBtn = document.querySelector('.recomend__prev');
    const nextBtn = document.querySelector('.recomend__next');

    prevBtn.addEventListener('click', event => {
        changePage(false);
    })

    nextBtn.addEventListener('click', event => {
        changePage(true);
    })

}

function showMore() {
    const showMoreBrn = document.querySelector('.recomend__showmore');

    showMoreBrn.addEventListener('click', event => {
        changePage(true);
    });
}
