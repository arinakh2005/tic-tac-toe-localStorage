class GameMap {

    #currentCell;
    #allCells = [];
    #occupiedCells = [];
    #numberOfCellsToWin = 3;
    #nobodyWonFlag = -1;

    constructor(size) {
        if (size <= 3) {
            this.size = 3;
        } else if (size > 100) {
            this.size = 100;
        } else{
            this.size = size;
        }
    }

    buildGameMap() {
        if (this.#allCells.length < 9) {
            const table = document.querySelector('table');
            for (let i = 0; i < this.size; i++) {
                const tr = document.createElement('tr');
                for (let j = 0; j < this.size; j++) {
                    const td = document.createElement('td');
                    td.classList.add("cell");
                    let id = `cell${((i * this.size) + j)}`;
                    td.setAttribute('id', `${id}`);
                    this.#currentCell = new Cell(id);
                    td.setAttribute('onclick', `doStep("${id}")`);
                    this.#allCells.push(this.#currentCell);
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
        }
        const box = document.getElementsByClassName('game-area')[0];
        box.style.visibility = 'visible';
    }

    buildGameMapFromLocalStorage() {
        let tempAllCells = [];
        const table = document.querySelector('table');
        for (let i = 0; i < this.size; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < this.size; j++) {
                const td = document.createElement('td');
                td.classList.add("cell");
                let id = `cell${((i * this.size) + j)}`;
                td.setAttribute('id', `${id}`);

                this.#currentCell = new Cell(id);
                if (this.#allCells[((i * this.size) + j)].occupiedBy === gameMark.cross) {
                    this.#currentCell.setCellOccupied();
                    this.#currentCell.setCellOccupiedByElement(gameMark.cross);
                    td.innerHTML = `<img src="./${gameMark.cross}.png" alt="${gameMark.cross}">`;
                }

                if (this.#allCells[((i * this.size) + j)].occupiedBy === gameMark.circle) {
                    this.#currentCell.setCellOccupied(true);
                    this.#currentCell.setCellOccupiedByElement(gameMark.circle);
                    td.innerHTML = `<img src="./${gameMark.circle}.png" alt="${gameMark.circle}">`;
                }

                td.setAttribute('onclick', `doStep("${id}")`);

                tempAllCells.push(this.#currentCell);

                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        this.#allCells = tempAllCells;
    }

    clearGameMap() {
        window.localStorage.clear();
        let elem = document.getElementsByClassName("game-area__table")[0];
        elem.parentNode.removeChild(elem);

        let spaceForElement = document.getElementsByClassName('game-area')[0];

        const gameMap = document.createElement('table');
        gameMap.classList.add('game-area__table');
        spaceForElement.appendChild(gameMap);

        elem = document.getElementById("player-number");
        elem.parentNode.removeChild(elem);

        const labelWithPlayersNumber = document.createElement('p');
        labelWithPlayersNumber.id = 'player-number';
        labelWithPlayersNumber.textContent = "Хід: ...";
        labelWithPlayersNumber.classList.add('game-area__player-number');
        spaceForElement.appendChild(labelWithPlayersNumber);

        this.#allCells = [];
        this.#occupiedCells = [];
        this.#currentCell = null;
        document.getElementById('btn-start').setAttribute('disabled', 'false');
    }

    isPlayerWon() {
        if (wonInRow(this.size, this.#allCells, this.#numberOfCellsToWin)) return true;
        if (wonInColumn(this.size, this.#allCells,this.#numberOfCellsToWin)) return true;
        if (wonInMainDiagonal(this.size, this.#allCells, this.#numberOfCellsToWin)) return true;
        if (wonInAntiDiagonal(this.size, this.#allCells, this.#numberOfCellsToWin)) return true;

        if (this.isAllCellsFilled()) {
            return this.#nobodyWonFlag;
        }

        function wonInRow(size, allCells, numberOfCellsToWin) {
            let step = 0;
            do {
                for (let i = size - numberOfCellsToWin - step; i < (size * size); i += numberOfCellsToWin + (size - numberOfCellsToWin)) {
                    if (allCells[i].occupiedBy === 'circle' && allCells[i + 1].occupiedBy === 'circle' && allCells[i + 2].occupiedBy === 'circle' ||
                        allCells[i].occupiedBy === 'cross' && allCells[i + 1].occupiedBy === 'cross' && allCells[i + 2].occupiedBy === 'cross') {
                        return true;
                    }
                }
                step++;
            } while (size - numberOfCellsToWin - step >= 0);
        }

        function wonInColumn(size, allCells, numberOfCellsToWin) {
            let step = size - numberOfCellsToWin;
            let index2;
            let index1;
            for (let i = 0; i < (size * (step + 1)); i++) {
                index1 = i + numberOfCellsToWin + step;
                index2 = i + 2 * (numberOfCellsToWin + step);
                if (allCells[i].occupiedBy === 'circle' && allCells[index1].occupiedBy === 'circle' && allCells[index2].occupiedBy === 'circle' ||
                    allCells[i].occupiedBy === 'cross' && allCells[index1].occupiedBy === 'cross' && allCells[index2].occupiedBy === 'cross') {
                    return true;
                }
            }
        }

        function wonInMainDiagonal(size, allCells, numberOfCellsToWin) {
            let index1;
            let index2;
            let allowableIndexes = fillArrOfAllowableIndexesInMainDiagonal(size, numberOfCellsToWin);

            let k = 0;
            let i = 0;
            while (k < allowableIndexes.length) {
                i = allowableIndexes[k];
                index1 = i + size + 1;
                index2 = i + 2 * (size + 1);
                if (allCells[i].occupiedBy === 'circle' && allCells[index1].occupiedBy === 'circle' && allCells[index2].occupiedBy === 'circle' ||
                    allCells[i].occupiedBy === 'cross' && allCells[index1].occupiedBy === 'cross' && allCells[index2].occupiedBy === 'cross') {
                    return true;
                }
                i = allowableIndexes[k];
                k++;
            }
        }

        function fillArrOfAllowableIndexesInMainDiagonal(size, numberOfCellsToWin) {
            let arrOfAllowableIndexes = [];
            let step = size - numberOfCellsToWin;

            let i = 0;
            while(step > 0) {
                arrOfAllowableIndexes.push(i++);
                step--;
            }
            step = size - numberOfCellsToWin;

            arrOfAllowableIndexes.push(i);
            for (i = size; i < size**2; i++) {
                if (step === 0){
                    return arrOfAllowableIndexes;
                }
                if(size % i === 0 || i % size === 0) {
                    arrOfAllowableIndexes.push(i);
                    while(step > 0) {
                        arrOfAllowableIndexes.push(++i);
                        step--;
                    }
                    step = size - numberOfCellsToWin;
                    if (arrOfAllowableIndexes.length >= (step+1)**2){
                        return arrOfAllowableIndexes;
                    }
                }
            }
        }

        function wonInAntiDiagonal(size, allCells, numberOfCellsToWin) {
            let index1;
            let index2;
            let allowableIndexes = fillArrOfAllowableIndexesInAntiDiagonal(size, numberOfCellsToWin)
                .sort(function(a, b) {
                return a - b;
            });

            let k = 0;
            let i = 0;
            while (k < allowableIndexes.length) {
                i = allowableIndexes[k];
                index1 = i + size - 1;
                index2 = i + 2 * (size - 1);
                if (allCells[i].occupiedBy === 'circle' && allCells[index1].occupiedBy === 'circle' && allCells[index2].occupiedBy === 'circle' ||
                    allCells[i].occupiedBy === 'cross' && allCells[index1].occupiedBy === 'cross' && allCells[index2].occupiedBy === 'cross') {
                    return true;
                }
                i = allowableIndexes[k];
                k++;
            }
        }

        function fillArrOfAllowableIndexesInAntiDiagonal(size, numberOfCellsToWin) {
            let arrOfAllowableIndexes = [];
            let step = size - numberOfCellsToWin;

            let indexForRemember;
            for (let i = size; i < size**2; i++) {

                if (step === 0){
                    arrOfAllowableIndexes.push(2);
                    return arrOfAllowableIndexes;
                }

                if(size % i === 0 || i % size === 0) {
                    i = i-1;
                    arrOfAllowableIndexes.push(i);
                    indexForRemember = i;
                    while(step > 0) {
                        arrOfAllowableIndexes.push(--i);
                        step--;
                    }
                    step = size - numberOfCellsToWin;
                    i = indexForRemember+size;
                    if (arrOfAllowableIndexes.length >= (step+1)**2){
                        return arrOfAllowableIndexes;
                    }
                }
            }
        }

    }

    isCellAvailableForStep(idHTML) {
        let id = +(idHTML.slice(4,6));
        if (this.#allCells[id].isCellOccupied()){
            return true;
        }
    }

    isAllCellsFilled() {
        let counter = 0;
        this.#allCells.forEach(function(item) { if (item.isOccupied === true) counter++; });
        if (counter === this.size ** 2) {
            return true;
        } else {
            return false;
        }
    }

    getCurrentCell() {
        return this.#currentCell;
    }

    setCurrentCell(cellId) {
        this.#currentCell = new Cell(cellId);
    }

    getAllCells() {
        return this.#allCells;
    }

    setAllCells(allCells) {
        this.#allCells = allCells;
    }

    getOccupiedCells() {
        return this.#occupiedCells;
    }

    setOccupiedCells(occupiedCells) {
        this.#occupiedCells = occupiedCells;
    }

    getNumberOfCellsToWin() {
        return this.#numberOfCellsToWin;
    }

    getNobodyWonFlag() {
        return this.#nobodyWonFlag;
    }
}
