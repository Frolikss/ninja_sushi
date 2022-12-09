const addClass = 'cards__item--add--added';

function fetchProductsData(url, cardContainer) {
    const cardsItemTemplate = document.querySelector('.card__template');
    const isPaginatable = cardContainer.classList.contains('cards__showmore');

    if (!isPaginatable) {
        cardContainer.innerHTML = '';
    }

    let index = url.search('_page');
    let page = +url[index + 6];
    let newIndex = 0;

    if (page > 1) {
        newIndex = (page * 4) - 4;
    }
 
    axios.get(url).then(response => response.data).then(res => {

        res.forEach(() => {
            cardContainer.append(cardsItemTemplate.content.cloneNode(true));
        });

        const cards = [...cardContainer.querySelectorAll('.cards__item')];

        checkEmptyContainer(cards);

        if (isPaginatable) {
            fillCardWithJSON(res, cards.slice(newIndex));
        } else {
            fillCardWithJSON(res, cards);
        }
    });

    function checkEmptyContainer(cards) {
        if (cards.length === 0) {
            const par = document.createElement('p');
            const showMoreBtn = document.querySelector('.category__showmore');
            const notFound = 'Не найдено'
            par.textContent = notFound;
            par.style.textAlign = 'center';

            cardContainer.style.justifyContent = 'center';
            cardContainer.append(par);

            showMoreBtn.style.display = 'none';
        }
    }
}

function fillCardWithJSON(res, cardsItem) {

    for (let i = 0; i < res.length; i++) {
        const card = cardsItem[i];
        const marks = card.querySelector('.cards__item--marks');
        const header = card.querySelector('.cards__item--header');
        const weight = card.querySelector('.cards__item--weight');
        const text = card.querySelector('.cards__item--text');
        const price = card.querySelector('.cards__item--price');

        card.href = `/views/product.html?category=${res[i].category}&id=${res[i].id}`;
        card.setAttribute('data-id', res[i].id);
        marks.style.background = `url(/${res[i].image}) no-repeat top / contain`;

        header.textContent = res[i].header;
        weight.textContent = res[i].category === 'drinks' ? `Объем: ${res[i].weight} л` : `Вес: ${res[i].weight} г`;

        price.textContent = `${res[i].price} грн.`;
        text.textContent = res[i].text;

        marks.classList.add(...getIconsClasses(res[i]));
    }

    setCardCounter(cardsItem);
}

function getIconsClasses(data) {
    const obj = {
        isHit: 'cards__item_new',
        isNew: 'cards__item_hit',
        isSpicy: 'cards__item_spicy',
        isEco: 'cards__item_eco',
        isDisposable: 'cards__item_disposable'
    }

    let arr = [];

    const keys = Object.keys(obj)

    keys.forEach(key => {
        if (data[key]) {
            arr.push(obj[key]);
        }
    });

    return arr;
}

function setCardCounter(cards) {
    let items = JSON.parse(localStorage.getItem('cards')) ?? [];

    cards.forEach(card => {
        const item = items.find(({ id }) => id === card.dataset.id);

        if (item) {
            const counter = card.querySelector('.cards__item--counter');
            const counterContainer = card.querySelector('.cards__item--add');
            counterContainer.classList.add(`${addClass}`);
            counter.textContent = item.amount;
        }
    });
}

function configCardCounter(cards) {
    cards.forEach(item => {
        item.addEventListener('click', event => {
            const buttonsBlock = event.target.parentElement;
            if (buttonsBlock.parentElement.className !== 'cards__item--buttons') return;

            const counterSpan = buttonsBlock.childNodes[1];
            const plus = buttonsBlock.childNodes[3];
            const minus = buttonsBlock.childNodes[5];

            event.target.className === plus.className ? counterSpan.textContent++ : counterSpan.textContent--;
            +counterSpan.textContent > 0 ? buttonsBlock.classList.add(addClass) : buttonsBlock.classList.remove(addClass);

            const cardItem = buttonsBlock.closest('.cards__item');

            prepareCardForStorage(cardItem, counterSpan.textContent);
        });
    })
}

function prepareCardForStorage(card, count) {
    let cards = JSON.parse(localStorage.getItem('cards')) ?? [];

    const image = `${card.querySelector('.cards__item--marks').style.background}`;
    const imageLink = image.split(/[()]/)[1].replaceAll(`"`, ``);
    const header = card.querySelector('.cards__item--header');
    const weight = card.querySelector('.cards__item--weight');
    const price = card.querySelector('.cards__item--price').textContent;

    let data = {
        id: card.dataset.id,
        image: imageLink,
        name: header.textContent,
        weight: weight.textContent,
        price: +price.replace('грн.', ''),
        amount: +count
    }

    let existingCard = cards.find(({ id }) => id === data.id);
    existingCard ? existingCard.amount = count : cards.push(data);

    cards = cards.filter(({ amount }) => amount > 0);
    localStorage.setItem('cards', JSON.stringify(cards));
}

export { fillCardWithJSON, configCardCounter, fetchProductsData };