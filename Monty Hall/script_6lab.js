// Элементы и состояние
const doors = document.querySelectorAll('.door');
const messageEl = document.querySelector('.message');
const actionButtons = document.querySelector('.action-buttons');
const resultEl = document.querySelector('.result');
const resetBtn = document.querySelector('.btn-reset');

const images = {
    car: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
    goat: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Noto_Emoji_v2.034_1f410.svg/640px-Noto_Emoji_v2.034_1f410.svg.png',
    door: 'https://cdn1.iconfinder.com/data/icons/door-and-window/64/Door-02-1024.png'
};

let prizeDoor, selectedDoor, openedDoor;

// Основные функции
function initGame() {
    prizeDoor = Math.floor(Math.random() * 3) + 1;
    selectedDoor = openedDoor = null;
    
    doors.forEach(door => {
        const content = door.querySelector('.door-content');
        content.style.backgroundImage = `url("${images.door}")`;
        door.style.pointerEvents = 'auto';
        door.style.opacity = '1';
    });
    
    messageEl.className = 'message info';
    messageEl.textContent = 'Выберите одну из трёх дверей. За одной из них находится автомобиль, за двумя другими - козы.';
    actionButtons.classList.add('hidden');
    resultEl.classList.add('hidden');
    resetBtn.classList.add('hidden');
}

function selectDoor(doorNumber) {
    selectedDoor = doorNumber;
    
    // Выбираем дверь с козой для открытия
    const availableDoors = [1, 2, 3].filter(num => num !== prizeDoor && num !== selectedDoor);
    openedDoor = availableDoors[Math.floor(Math.random() * availableDoors.length)];
    
    const openedContent = document.querySelector(`.door[data-door="${openedDoor}"] .door-content`);
    openedContent.style.backgroundImage = `url("${images.goat}")`;
    document.querySelector(`.door[data-door="${openedDoor}"]`).style.pointerEvents = 'none';
    
    messageEl.className = 'message warning';
    messageEl.textContent = `Я открыл дверь ${openedDoor}, за которой коза. Хотите изменить свой выбор?`;
    actionButtons.classList.remove('hidden');
}

function showResult(switchChoice) {
    if (switchChoice) {
        selectedDoor = [1, 2, 3].find(num => num !== selectedDoor && num !== openedDoor);
    }
    
    const isWin = selectedDoor === prizeDoor;
    
    doors.forEach(door => {
        const num = parseInt(door.getAttribute('data-door'));
        const content = door.querySelector('.door-content');
        content.style.backgroundImage = `url("${num === prizeDoor ? images.car : images.goat}")`;
        door.style.pointerEvents = 'none';
    });
    
    resultEl.textContent = isWin 
        ? `Поздравляем! Вы выиграли автомобиль! (Приз был за дверью ${prizeDoor})`
        : `К сожалению, вы проиграли. Приз был за дверью ${prizeDoor}.`;
    resultEl.className = `message ${isWin ? 'success' : 'info'}`;
    
    actionButtons.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    messageEl.textContent = isWin ? 'Поздравляем с победой!' : 'В следующий раз повезёт!';
}

// Обработчики событий
doors.forEach(door => {
    door.addEventListener('click', () => {
        if (!selectedDoor) selectDoor(parseInt(door.getAttribute('data-door')));
    });
});

document.querySelector('.btn-switch').addEventListener('click', () => showResult(true));
document.querySelector('.btn-stay').addEventListener('click', () => showResult(false));
resetBtn.addEventListener('click', initGame);

// Запуск игры
initGame();