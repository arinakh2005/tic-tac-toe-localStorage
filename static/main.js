'use strict'
let game;

function createNewGame() {
    //window.localStorage.setItem('wasPrevGame', JSON.stringify(false));
    let wasPrevGame = JSON.parse(window.localStorage.getItem('wasPrevGame'));
    let size = JSON.parse(window.localStorage.getItem('prevSize'));
    let mode = JSON.parse(window.localStorage.getItem('gameMode'));

    game = new Game();

    if (wasPrevGame) {
        let prevGame = JSON.parse(window.localStorage.getItem('game'));
        let prevGameMap = JSON.parse(window.localStorage.getItem('gameMap'));

        game.setGameMap(size);
        game.setMode(prevGame.mode);
        game.setFirstPlayer(prevGame.firstPlayer);
        game.setSecondPlayer(prevGame.secondPlayer);
        game.setPlayerWhoMadeLastStep(prevGame.secondPlayer);

        //game.getGameMap().setCurrentCell(prevGameMap.currentCell);
        game.getGameMap().setAllCells(prevGameMap.allCells);
        game.getGameMap().setOccupiedCells(prevGameMap.occupiedCells);
        game.getGameMap().buildGameMapFromLocalStorage();

        let selectModeElemHTML = document.getElementById('game-mode');
        selectModeElemHTML.value = mode;

        let selectSizeElemHTML = document.getElementById('game-area');
        selectSizeElemHTML.value = size;

    } else {
        let select = document.getElementById("game-area");
        const size = +(select.value);

        if (size < 3) {
            select.value = 3;
            alert('Мінімальний розмір поля 3х3!');
        } else if (size > 100) {
            select.value = 100;
            alert('Максимальний розмір поля 100х100!');
        }

        select = document.getElementById("game-mode");
        game.setMode(+(select.value));
        game.setGameMap(size);
        game.getGameMap().buildGameMap();
    }

    document.getElementById('btn-start').setAttribute('disabled', 'true');

    if (game.getMode() === 0) {
        game.setFirstPlayer(1);
        game.setSecondPlayer(2);
        game.setPlayerWhoMadeLastStep(2);
    } else if (game.getMode() === 1) {
        game.setFirstPlayer(3);
        game.setSecondPlayer(0)
        game.setPlayerWhoMadeLastStep(0);
    }
    let buttonClear = document.getElementById('btn-clear');
    buttonClear.removeAttribute('disabled')
}

function doStep(id) {
    if (game.getGameMap().isCellAvailableForStep(id)) {
        return;
    }
    if (game.getMode() === 0) {
        document.getElementById('player-number').innerText = `Хід: гравець ${game.getPlayerWhoMadeLastStep().getPlayerType()}`;
        game.doStepInModePlayerWithPlayer(id);
        isGameOver();
    } else if (game.getMode() === 1) {
        game.doStepInModePlayerWithComputer(id);
    }

    window.localStorage.clear();

    const savedGameMap = {
        'currentCell': game.getGameMap().getCurrentCell(),
        'allCells': game.getGameMap().getAllCells(),
        'occupiedCells': game.getGameMap().getOccupiedCells(),
        'numberOfCellsToWin': game.getGameMap().getNumberOfCellsToWin(),
        'nobodyWonFlag': game.getGameMap().getNobodyWonFlag(),
        'size': game.getGameMap().size
    };

    const savedGame = {
        'mode': game.getMode(),
        'gameMap': savedGameMap,
        'firstPlayer': game.getFirstPlayer(),
        'secondPlayer': game.getSecondPlayer(),
        'playerWhoMadeLastStep': game.getPlayerWhoMadeLastStep(),
        'lastRole': game.lastRole
    };

    window.localStorage.setItem('game', JSON.stringify(savedGame));
    window.localStorage.setItem('gameMap', JSON.stringify(savedGameMap));
    window.localStorage.setItem('prevSize', JSON.stringify(savedGameMap.size));
    window.localStorage.setItem('gameMode', JSON.stringify(savedGame.mode));
    window.localStorage.setItem('wasPrevGame', JSON.stringify(true));
}

function isGameOver() {
    if (game.getGameMap().isPlayerWon() === game.getGameMap().getNobodyWonFlag()) {
        setTimeout(function() { game.getDrawMessage(); }, 200);
        setTimeout(restartGame, 500);
        return true;
    } else if (game.getGameMap().isPlayerWon()) {
        setTimeout(function() { game.getWinnerMessage(); }, 200);
        setTimeout(restartGame, 500);
        return true;
    } else {
        return false;
    }
}

function restartGame() {
    if(game) game.getGameMap().clearGameMap();
    createNewGame();
}




