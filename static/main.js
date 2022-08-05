'use strict'
let game;

function resumeGameFromLocalStorage() {
    let size = JSON.parse(window.localStorage.getItem('prevSize'));
    let mode = JSON.parse(window.localStorage.getItem('gameMode'));
    let numberOfCellsForWin = JSON.parse(window.localStorage.getItem('numberOfCellsForWin'));
    let prevGame = JSON.parse(window.localStorage.getItem('game'));
    let prevGameMap = JSON.parse(window.localStorage.getItem('gameMap'));

    game.setGameMap(size, numberOfCellsForWin);
    game.setMode(prevGame.mode);
    game.setFirstPlayer(prevGame.firstPlayer.playerType);
    game.setSecondPlayer(prevGame.secondPlayer.playerType);
    game.setPlayerWhoMadeLastStep(prevGame.playerWhoMadeLastStep.playerType);

    game.getGameMap().setAllCells(prevGameMap.allCells);
    game.getGameMap().setOccupiedCells(prevGameMap.occupiedCells);
    game.getGameMap().buildGameMap(1);

    let selectModeElemHTML = document.getElementById('game-mode');
    selectModeElemHTML.value = mode;

    let selectSizeElemHTML = document.getElementById('game-area');
    selectSizeElemHTML.value = size;

    let selectNumberOfCellsForWinElemHTML = document.getElementById('number-of-cells-for-win');
    selectNumberOfCellsForWinElemHTML.value = numberOfCellsForWin;

    let labelWhoMakeNextStep = document.getElementById('player-number');
    let nextPlayer;
    if (game.getMode() === gameMode.playerWithPlayer){
        if (game.getPlayerWhoMadeLastStep().getPlayerType() === game.getFirstPlayer().getPlayerType()) {
            nextPlayer = game.getSecondPlayer().getPlayerType();
        } else {
            nextPlayer = game.getFirstPlayer().getPlayerType();
        }
        labelWhoMakeNextStep.innerText = `Хід: гравець ${nextPlayer}`;
    } else {
        labelWhoMakeNextStep.innerText = 'Хід: ... ';
    }
}

function createNewGame() {
    let haveUnfinishedGame = JSON.parse(window.localStorage.getItem('haveUnfinishedGame'));
    game = new Game();

    if (haveUnfinishedGame) {
        let continueUnfinishedGame = confirm(`У Вас є незавершена гра. Продовжити грати?`);
        if (continueUnfinishedGame) {
            resumeGameFromLocalStorage();
        } else {
            window.localStorage.clear();
            createNewGame();
        }
    } else {
        let select = document.getElementById("game-area");
        const size = +(select.value);

        select = document.getElementById("number-of-cells-for-win");
        const numberOfCellsForWin = +(select.value);
        game.setGameMap(size, numberOfCellsForWin);

        select = document.getElementById("game-mode");
        game.setMode(+(select.value));

        game.getGameMap().buildGameMap(0);

        if (game.getMode() === gameMode.playerWithPlayer) {
            game.setFirstPlayer(playerType.player1);
            game.setSecondPlayer(playerType.player2);
            game.setPlayerWhoMadeLastStep(playerType.player2);
        } else if (game.getMode() === gameMode.playerWithComputer) {
            game.setFirstPlayer(playerType.player);
            game.setSecondPlayer(playerType.computer)
            game.setPlayerWhoMadeLastStep(playerType.computer);
        }
    }

    let buttonStart = document.getElementById('btn-start');
    buttonStart.setAttribute('disabled', 'true');
    let buttonClear = document.getElementById('btn-clear');
    buttonClear.removeAttribute('disabled')
}

function doStep(id) {
    if (game.getGameMap().isCellAvailableForStep(id)) {
        return;
    }
    if (game.getMode() === gameMode.playerWithPlayer) {
        document.getElementById('player-number').innerText = `Хід: гравець ${game.getPlayerWhoMadeLastStep().getPlayerType()}`;
        game.doStepInModePlayerWithPlayer(id);
        isGameOver();
    } else if (game.getMode() === gameMode.playerWithComputer) {
        game.doStepInModePlayerWithComputer(id);
    }
    putOnLocalStorage();
}

function isGameOver() {
    let isGameOver = false;
    if (game.getGameMap().isPlayerWon() === game.getGameMap().getNobodyWonFlag()) {
        setTimeout(function() { game.getDrawMessage(); }, 200);
        setTimeout(restartGame, 500);
        isGameOver = true;
    } else if (game.getGameMap().isPlayerWon()) {
        setTimeout(function () {
            game.getWinnerMessage();
        }, 200);
        setTimeout(restartGame, 500);
        isGameOver = true;
    }
    return isGameOver;
}

function restartGame() {
    if(game) game.getGameMap().clearGameMap();
    createNewGame();
}

function putOnLocalStorage() {
    window.localStorage.clear();

    const savedGameMap = {
        'currentCell': game.getGameMap().getCurrentCell(),
        'allCells': game.getGameMap().getAllCells(),
        'occupiedCells': game.getGameMap().getOccupiedCells(),
        'numberOfCellsToWin': game.getGameMap().getNumberOfCellsToWin(),
        'nobodyWonFlag': game.getGameMap().getNobodyWonFlag(),
        'size': game.getGameMap().size,
        'numberOfCellsForWin': game.getGameMap().getNumberOfCellsToWin()
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
    window.localStorage.setItem('numberOfCellsForWin', JSON.stringify(savedGameMap.numberOfCellsForWin));
    window.localStorage.setItem('gameMode', JSON.stringify(savedGame.mode));
    window.localStorage.setItem('haveUnfinishedGame', JSON.stringify(true));
}



