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

        if (!isGameOver()) {
            this.#playerWhoMadeLastStep = this.#secondPlayer;
            this.getSecondPlayer().doComputerStep(this.getGameMap().getAllCells());
        }
    }

    getWinnerMessage() {
        if (this.#mode === gameMode.playerWithComputer) {
            if (this.#playerWhoMadeLastStep.getPlayerType() === playerType.computer) {
                alert("Переміг комп'ютер!");
            } else {
                alert("Переміг гравець!");
            }
        } else {
            alert(`Переміг гравець ${this.#playerWhoMadeLastStep.getPlayerType()}`);
        }
    }

    getDrawMessage() {
        alert("Нічия");
    }
}
