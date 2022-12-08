import { showOverlay, backEvent, configBellBtn, configCartBtn, configOrderBtns } from './modules/header.js';
import { footerQuicktipToggle } from './modules/footer.js';

configBellBtn();
configCartBtn();
configOrderBtns();
backEvent();
showOverlay();
footerQuicktipToggle();
setCards();

function setCards() {
    fetchCards().then(data => {
        const cardTemplate = document.querySelector('.products__slider--template');
    
        const slider = document.querySelector('.products__slider');

        data.forEach((dataItem, index) => {
            slider.append(cardTemplate.content.cloneNode(true));

            const card = document.querySelectorAll('.products__item')[index];
            const contains = dataItem.contains[0].items;

            const marks = {
                isNew: card.querySelector('.new'),
                isHit: card.querySelector('.hit'),
                isEco: card.querySelector('.products__item--eco'),
                isSpicy: card.querySelector('.products__item--spicy'),
                isDisposable: card.querySelector('.products__item--lactose')
            }

            setIconsClasses(dataItem, marks);
            setCardContent(dataItem, card);
            setContainsSlider(contains, card);
        });
    }).then(res => setSlider());
}

async function fetchCards() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const id = urlParams.get('id');

    const url = `https://ninja-tests.herokuapp.com/products?_embed=contains&category=${category}`
    const response = await axios.get(url);

    return await response.data;
}

function setIconsClasses(data, marks) {
    const classList = {
        isNew: 'new_show',
        isHit: 'hit_show',
        isEco: 'products__item--eco_show',
        isSpicy: 'products__item--spicy_show',
        isDisposable: 'products__item--lactose_show'
    }

    const keys = Object.keys(classList);

    keys.forEach(key => {
        if (data[key]) {
            marks[key].classList.add(classList[key]);
        }
    });
}

function setCardContent(data, card) {
    const image = card.querySelector('.products__item--img');
    const header = card.querySelector('.products__item--header');
    const weight = card.querySelector('.products__item--weight');
    const price = card.querySelector('.products__item--sum');

    card.dataset.id = data.id;
    image.src = `/${data.image}`;
    header.textContent = data.header;
    weight.textContent = data.category === 'drinks' ? `Объем: ${data.weight} л` : `Вес: ${data.weight} г`;
    price.textContent = data.price;
}

function setContainsSlider(contains, card) {
    contains.forEach((item, i) => {
        const consistSlider = card.querySelector('.products__item--consist--slider');
        const containTemplate = document.querySelector('.products__item--consist--template');

        consistSlider.append(containTemplate.content.cloneNode(true));

        const slide = card.querySelectorAll('.products__item--consist--item')[i];
        const name = slide.querySelector('.products__item--consist--name');
        const image = slide.querySelector('.products__item--consist--image');

        name.textContent = item.replace('lac_', '');
        image.src = `/assets/png/${item.replace('lac_', '')}.png`;
    })
}