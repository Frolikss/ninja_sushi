function fillCardWithJSON(res) {
    const cardsItem = document.querySelectorAll('.cards__item');
    
    for (let i = 0; i < res.length; i++) {
        const card = cardsItem[i];
        const marks = card.firstElementChild;
        const icons = marks.lastElementChild;
        const data = card.lastElementChild;
        const header = data.firstElementChild;
        const itemInfo = data.lastElementChild;

        marks.style.background = `url(/${res[i].image}) no-repeat top / contain`;

        header.textContent = res[i].header;
        header.nextElementSibling.textContent = res[i].category === 'drinks' ? `Объем: ${res[i].weight} л` : `Вес: ${res[i].weight} г`;

        itemInfo.firstElementChild.textContent = `${res[i].price}грн.`;
        itemInfo.previousElementSibling.textContent = res[i].text;

        marks.classList.add(...checkIconsData(res[i]));
    }
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

export {fillCardWithJSON};