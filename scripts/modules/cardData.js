function fillCardWithJSON(res) {
    const cardsItem = document.querySelectorAll('.cards__item');
    
    for (let i = 0; i < res.length; i++) {
        const card = cardsItem[i];
        const marks = card.firstElementChild;
        const icons = marks.lastElementChild;
        const data = card.lastElementChild;
        const header = data.firstElementChild;
        const itemInfo = data.lastElementChild;

        card.setAttribute('data-id', res[i].id);
        marks.style.background = `url(/${res[i].image}) no-repeat top / contain`;

        header.textContent = res[i].header;
        header.nextElementSibling.textContent = res[i].category === 'drinks' ? `Объем: ${res[i].weight} л` : `Вес: ${res[i].weight} г`;

        itemInfo.firstElementChild.textContent = `${res[i].price}грн.`;
        itemInfo.previousElementSibling.textContent = res[i].text;

        marks.classList.add(...checkIconsData(res[i]));
    }

    setCardCounter(cardsItem);
}

function checkIconsData(data) {
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

    cards.forEach((card, index) => {
        const item = items.find(({id}) => id === cards[index].dataset.id);

        if (item) {
            let counter = card.querySelector('.cards__item--counter');
            const counterContainer = card.querySelector('.cards__item--add');
            counterContainer.classList.add('cards__item--add--added');
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
    
            event.target.className === plus.className ? counterSpan.textContent = +counterSpan.textContent + 1 : counterSpan.textContent -= 1;
            +counterSpan.textContent > 0 ? buttonsBlock.classList.add('cards__item--add--added') : buttonsBlock.classList.remove('cards__item--add--added');
    
            const cardItem = buttonsBlock.closest('.cards__item');

            prepareCardForStorage(cardItem, counterSpan.textContent); 
        });
    })
}

function prepareCardForStorage(card, count) {
    let cards = JSON.parse(localStorage.getItem('cards')) ?? [];

    const image = `${card.firstElementChild.style.background}`;
    const imageLink = image.split(/[()]/)[1].replaceAll(`"`, ``);
    const info = card.lastElementChild;
    const header = info.firstElementChild;
    const weight = header.nextElementSibling;
    const price = info.lastElementChild.firstElementChild;

    let data = {
        id: card.dataset.id,
        image: imageLink,
        name: header.textContent,
        weight: weight.textContent,
        price: price.textContent,
        amount: count
    }

    let cardArr = cards.find(({id}) => id === data.id);

    if (cardArr) {
        cardArr.amount = count;
    } else {
        cards.push(data);
    }

    cards = cards.filter(({amount}) => amount > 0);

    localStorage.setItem('cards', JSON.stringify(cards));
}

export {fillCardWithJSON, configCardCounter};