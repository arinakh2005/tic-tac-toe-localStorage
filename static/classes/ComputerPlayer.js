class ComputerPlayer extends Player {
    constructor() {
        super(0);
    }

    doComputerStep(allCells) {
        let id = this.generateNumberOfCell(allCells.length);
        if (allCells[id].isCellOccupied()) {
            this.doComputerStep(allCells);
        } else {
            let idHTML = `cell${id}`;
            document.getElementById(idHTML).innerHTML = `<img src="./images/${gameMark.circle}.png" alt="${gameMark.circle}">`;
            allCells[id].setCellOccupied();
            allCells[id].setCellOccupiedByElement(gameMark.circle);
            isGameOver();
        }
    }

    generateNumberOfCell(size) {
        return (Math.floor(Math.random() * size));
    }
}
