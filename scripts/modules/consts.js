const categories = {
    sushi: 'Суши',
    rolls: 'Ролы',
    sets: 'Сеты',
    snacks: 'Снеки',
    drinks: 'Напитки',
}
const localData = () => JSON.parse(localStorage.getItem('cards')) ?? [];

export { categories, localData };