document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restartBtn');
    
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    
    // Сообщения игры
    const winningMessage = () => `Игрок ${currentPlayer} победил!`;
    const drawMessage = () => `Ничья!`;
    const currentPlayerTurn = () => `Ход игрока ${currentPlayer}`;
    
    // Условия победы
    const winningConditions = [
        [0, 1, 2], // верхняя строка
        [3, 4, 5], // средняя строка
        [6, 7, 8], // нижняя строка
        [0, 3, 6], // левый столбец
        [1, 4, 7], // средний столбец
        [2, 5, 8], // правый столбец
        [0, 4, 8], // диагональ
        [2, 4, 6]  // диагональ
    ];
    
    // Инициализация игры
    function initGame() {
        board.innerHTML = '';
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        status.textContent = currentPlayerTurn();
        
        // Создаем клетки
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
    
    // Обработка клика по клетке
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // Если клетка уже занята или игра не активна, игнорируем клик
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Ход игрока
        makeMove(clickedCell, clickedCellIndex, currentPlayer);
        
        // Проверка результата после хода игрока
        if (gameActive) {
            // Ход компьютера
            setTimeout(computerMove, 500);
        }
    }
    
    // Сделать ход
    function makeMove(cell, index, player) {
        gameState[index] = player;
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        checkResult();
    }
    
    // Ход компьютера
    function computerMove() {
        if (!gameActive) return;
        
        // Простой ИИ: сначала проверяем, может ли компьютер выиграть следующим ходом
        let move = findWinningMove('O');
        
        // Если нет, проверяем, может ли игрок выиграть следующим ходом, чтобы заблокировать
        if (move === -1) {
            move = findWinningMove('X');
        }
        
        // Если нет выигрышных или блокирующих ходов, выбираем случайную клетку
        if (move === -1) {
            const emptyCells = gameState.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
            if (emptyCells.length > 0) {
                move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
        }
        
        if (move !== -1) {
            const cell = document.querySelector(`.cell[data-index="${move}"]`);
            makeMove(cell, move, 'O');
        }
    }
    
    // Поиск выигрышного хода для указанного игрока
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            // Проверяем, есть ли два символа игрока и одна пустая клетка в линии
            if ((gameState[a] === player && gameState[b] === player && gameState[c] === '') ||
                (gameState[a] === player && gameState[c] === player && gameState[b] === '') ||
                (gameState[b] === player && gameState[c] === player && gameState[a] === '')) {
                
                if (gameState[a] === '') return a;
                if (gameState[b] === '') return b;
                if (gameState[c] === '') return c;
            }
        }
        return -1;
    }
    
    // Проверка результата игры
    function checkResult() {
        let roundWon = false;
        
        // Проверяем условия победы
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                break;
            }
        }
        
        // Если есть победитель
        if (roundWon) {
            status.textContent = winningMessage();
            gameActive = false;
            return;
        }
        
        // Проверка на ничью
        if (!gameState.includes('')) {
            status.textContent = drawMessage();
            gameActive = false;
            return;
        }
        
        // Смена игрока
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = currentPlayerTurn();
    }
    
    // Перезапуск игры
    restartBtn.addEventListener('click', initGame);
    
    // Начало игры
    initGame();
});