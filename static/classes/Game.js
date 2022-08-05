class Game {
    #mode;
    #gameMap;
    #firstPlayer;
    #secondPlayer;
    #playerWhoMadeLastStep;

    constructor() {
        this.lastRole = gameMark.circle;
    }

    setGameMap(valueSize, valueNumberOfCellsForWin) {
        this.#gameMap = new GameMap(valueSize, valueNumberOfCellsForWin);
    }

    getGameMap() {
        return this.#gameMap;
    }

    setMode(value) {
        this.#mode = value;
    }

    getMode() {
        return this.#mode;
    }

    setFirstPlayer(value) {
        this.#firstPlayer = new Player(value);
    }

    getFirstPlayer() {
        return this.#firstPlayer;
    }

    setSecondPlayer(value) {
        if (value === 0) {
            this.#secondPlayer = new ComputerPlayer(value);
        } else {
            this.#secondPlayer = new Player(value);
        }
    }

    getSecondPlayer() {
        return this.#secondPlayer;
    }

    setPlayerWhoMadeLastStep(value) {
        this.#playerWhoMadeLastStep = new Player(value);
    }

    getPlayerWhoMadeLastStep() {
        return this.#playerWhoMadeLastStep;
    }

    createNewGame(haveUnfinishedGame) {
        if (haveUnfinishedGame) {
            let continueUnfinishedGame = confirm(`У Вас є незавершена гра. Продовжити грати?`);
            if (continueUnfinishedGame) {
                this.resumeGameFromLocalStorage();
            } else {
                window.localStorage.clear();
                this.createNewGame();
            }
        } else {
            let select = document.getElementById("game-area");
            const size = +(select.value);

            select = document.getElementById("number-of-cells-for-win");
            const numberOfCellsForWin = +(select.value);
            this.setGameMap(size, numberOfCellsForWin);

            select = document.getElementById("game-mode");
            this.setMode(+(select.value));

            this.getGameMap().buildGameMap(0);

            if (this.getMode() === gameMode.playerWithPlayer) {
                this.setFirstPlayer(playerType.player1);
                this.setSecondPlayer(playerType.player2);
                this.setPlayerWhoMadeLastStep(playerType.player2);
            } else if (this.getMode() === gameMode.playerWithComputer) {
                this.setFirstPlayer(playerType.player);
                this.setSecondPlayer(playerType.computer)
                this.setPlayerWhoMadeLastStep(playerType.computer);
            }
        }

        let buttonStart = document.getElementById('btn-start');
        buttonStart.setAttribute('disabled', 'true');
        let buttonClear = document.getElementById('btn-clear');
        buttonClear.removeAttribute('disabled')
    }

    doStep(id) {
        if (this.#gameMap.isCellAvailableForStep(id)) {
            return;
        }
        if (this.#mode === gameMode.playerWithPlayer) {
            document.getElementById('player-number').innerText = `Хід: гравець ${this.#playerWhoMadeLastStep.getPlayerType()}`;
            this.doStepInModePlayerWithPlayer(id);
            this.isGameOver();
        } else if (this.#mode === gameMode.playerWithComputer) {
            this.doStepInModePlayerWithComputer(id);
        }
        this.putOnLocalStorage();
    }

    doStepInModePlayerWithPlayer(id) {
        let cell = document.getElementById(id);
        this.getGameMap().getOccupiedCells().push(id);
        let i = +(id.slice(4, 6));
        this.getGameMap().getAllCells()[i].setCellOccupied();

        if (this.#playerWhoMadeLastStep.getPlayerType() === game.#firstPlayer.getPlayerType()) {
            cell.innerHTML = `<img src="./images/${gameMark.circle}.png" alt="${gameMark.circle}">`;
            this.getGameMap().getAllCells()[i].setCellOccupiedByElement(gameMark.circle);
            this.#playerWhoMadeLastStep = this.#secondPlayer;
        } else {
            this.lastRole = gameMark.cross;
            cell.innerHTML = `<img src="./images/${gameMark.cross}.png" alt="${gameMark.cross}">`;
            this.getGameMap().getAllCells()[i].setCellOccupiedByElement(gameMark.cross);
            this.#playerWhoMadeLastStep = this.#firstPlayer;
        }
    }

    doStepInModePlayerWithComputer(id) {
        if (this.#playerWhoMadeLastStep.getPlayerType() === game.#secondPlayer.getPlayerType()) {
            let elem = document.getElementById(id);
            elem.innerHTML = `<img src="./images/${gameMark.cross}.png" alt="${gameMark.cross}">`;
            let i = +(id.slice(4, 6));
            this.#gameMap.getAllCells()[i].setCellOccupied();
            this.#gameMap.getAllCells()[i].setCellOccupiedByElement(gameMark.cross);
            this.#playerWhoMadeLastStep = this.#firstPlayer;
        }

        if (!this.isGameOver()) {
            this.#playerWhoMadeLastStep = this.#secondPlayer;
            this.getSecondPlayer().doComputerStep(this.getGameMap().getAllCells());
        }
    }

    isGameOver() {
        let isGameOver = false;
        if (this.getGameMap().isPlayerWon() === this.getGameMap().getNobodyWonFlag()) {
            setTimeout(this.getDrawMessage, 200);
            setTimeout(restartGame, 500);
            isGameOver = true;
        } else if (this.getGameMap().isPlayerWon()) {
            let temp = this;
            setTimeout(function () {
                temp.getWinnerMessage();
            }, 200);
            setTimeout(restartGame, 500);
            isGameOver = true;
        }
        return isGameOver;
    }

    getWinnerMessage() {
        if (this.getMode() === gameMode.playerWithComputer) {
            if (this.getPlayerWhoMadeLastStep().getPlayerType() === playerType.computer) {
                alert("Переміг комп'ютер!");
            } else {
                alert("Переміг гравець!");
            }
        } else {
            alert(`Переміг гравець ${this.getPlayerWhoMadeLastStep().getPlayerType()}`);
        }
    }

    getDrawMessage() {
        alert("Нічия");
    }

    putOnLocalStorage() {
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

    resumeGameFromLocalStorage() {
        let size = JSON.parse(window.localStorage.getItem('prevSize'));
        let mode = JSON.parse(window.localStorage.getItem('gameMode'));
        let numberOfCellsForWin = JSON.parse(window.localStorage.getItem('numberOfCellsForWin'));
        let prevGame = JSON.parse(window.localStorage.getItem('game'));
        let prevGameMap = JSON.parse(window.localStorage.getItem('gameMap'));

        this.setGameMap(size, numberOfCellsForWin);
        this.setMode(prevGame.mode);
        this.setFirstPlayer(prevGame.firstPlayer.playerType);
        this.setSecondPlayer(prevGame.secondPlayer.playerType);
        this.setPlayerWhoMadeLastStep(prevGame.playerWhoMadeLastStep.playerType);

        this.getGameMap().setAllCells(prevGameMap.allCells);
        this.getGameMap().setOccupiedCells(prevGameMap.occupiedCells);
        this.getGameMap().buildGameMap(1);

        let selectModeElemHTML = document.getElementById('game-mode');
        selectModeElemHTML.value = mode;

        let selectSizeElemHTML = document.getElementById('game-area');
        selectSizeElemHTML.value = size;

        let selectNumberOfCellsForWinElemHTML = document.getElementById('number-of-cells-for-win');
        selectNumberOfCellsForWinElemHTML.value = numberOfCellsForWin;

        let labelWhoMakeNextStep = document.getElementById('player-number');
        let nextPlayer;
        if (this.getMode() === gameMode.playerWithPlayer){
            if (this.getPlayerWhoMadeLastStep().getPlayerType() === this.getFirstPlayer().getPlayerType()) {
                nextPlayer = this.getSecondPlayer().getPlayerType();
            } else {
                nextPlayer = this.getFirstPlayer().getPlayerType();
            }
            labelWhoMakeNextStep.innerText = `Хід: гравець ${nextPlayer}`;
        } else {
            labelWhoMakeNextStep.innerText = 'Хід: ... ';
        }
    }

}
