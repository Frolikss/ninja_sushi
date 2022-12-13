let localData = () => {
    return JSON.parse(localStorage.getItem('cards')) ?? [];
}

function configOrderBtns(index, fillCards) {
    const itemsContainer = document.querySelectorAll('.cart__items')[index];

    itemsContainer.addEventListener('click', event => {
        switch (event.target.className) {
            case 'cart__remove': removeFromLocaleStorage(event, fillCards); break;
            case 'cart__plus': changeCounterLocalStorage(event, true, fillCards); break;
            case 'cart__minus': changeCounterLocalStorage(event, false, fillCards); break;
            default: break;
        }
    });
}

function removeFromLocaleStorage(event, fillCards) {
    const items = localData();
    const selectedItem = event.target.parentNode.parentNode;
    const filteredItems = items.filter(({ id }) => id !== selectedItem.dataset.id) ?? [];

    localStorage.setItem('cards', JSON.stringify(filteredItems));
    fillCards();
}

function changeCounterLocalStorage(event, isAdded, fillCards) {
    const items = localData();
    const selectedItem = event.target.parentNode.parentNode.parentNode;

    const filteredItems = items
        .map(item => {
            if (item.id !== selectedItem.dataset.id) { return item; }
            isAdded ? item.amount++ : item.amount--;
            return item;
        })
        .filter(({ amount }) => +amount > 0);


    localStorage.setItem('cards', JSON.stringify(filteredItems));
    fillCards();
}

function calculateTotalPrice(items) {
    const MIN_PRICE = 400;
    const finalPrice = document.querySelectorAll('.cart__sum');
    const confirmBtn = document.querySelectorAll('.cart__confirm');

    finalPrice.forEach((price, index) => {
        price.textContent = items.reduce((sum, current) => {
            sum += (current.price * +current.amount);
            return sum;
        }, 0);

        confirmBtn[index].disabled = +finalPrice.textContent < MIN_PRICE ? true : false;
    })
}

export { configOrderBtns, calculateTotalPrice };