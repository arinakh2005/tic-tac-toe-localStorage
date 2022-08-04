const gameMark = {
    cross: 'cross',
    circle: 'circle'
}

class Game {
    #mode;
    #gameMap;
    #firstPlayer;
    #secondPlayer;
    #playerWhoMadeLastStep;

    constructor() {
        this.lastRole = gameMark.circle;
    }

    setGameMap(value) {
        this.#gameMap = new GameMap(value);
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

        if (this.lastRole === gameMark.cross) {
            this.lastRole = gameMark.circle;
            cell.innerHTML = `<img src="./${gameMark.circle}.png" alt="${gameMark.circle}">`;
            this.getGameMap().getAllCells()[i].setCellOccupiedByElement(gameMark.circle);
            this.#playerWhoMadeLastStep = this.#secondPlayer;
            return;
        }

        if (this.lastRole === gameMark.circle) {
            this.lastRole = gameMark.cross;
            cell.innerHTML = `<img src="./${gameMark.cross}.png" alt="${gameMark.cross}">`;
            this.getGameMap().getAllCells()[i].setCellOccupiedByElement(gameMark.cross);
            this.#playerWhoMadeLastStep = this.#firstPlayer;
            return;
        }
    }

    doStepInModePlayerWithComputer(id) {
        if (this.lastRole === gameMark.circle) {
            let elem = document.getElementById(id);
            elem.innerHTML = `<img src="./${gameMark.cross}.png" alt="${gameMark.cross}">`;
            let i = +(id.slice(4, 6));
            this.#gameMap.getAllCells()[i].setCellOccupied();
            this.#gameMap.getAllCells()[i].setCellOccupiedByElement(gameMark.cross);
            this.#playerWhoMadeLastStep = this.#secondPlayer;
        }
        if (isGameOver()){
            return;
        } else if (!isGameOver()) {
            let temp = this;
            setTimeout(function() {
                temp.getSecondPlayer().doComputerStep(temp.getGameMap().getAllCells());
            }, 300);
            this.#playerWhoMadeLastStep = this.#firstPlayer;
        }
    }

    getWinnerMessage() {
        if (this.#mode === 1) {
            if (this.#playerWhoMadeLastStep.getPlayerType() === 3) {
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
