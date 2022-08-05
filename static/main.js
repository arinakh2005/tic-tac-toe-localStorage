'use strict'
let game;

function createNewGame() {
    let haveUnfinishedGame = JSON.parse(window.localStorage.getItem('haveUnfinishedGame'));
    game = new Game();
    game.createNewGame(haveUnfinishedGame);
}

function doStep(id) {
    game.doStep(id);
}

function restartGame() {
    if (game) {
        game.getGameMap().clearGameMap();
    }
    createNewGame();
}


