const playerType = {
    computer: 0,
    player: 3,
    player1: 1,
    player2: 2
}

class Player {
    constructor(playerType) {
        this.playerType = playerType;
    }

    getPlayerType() {
        return this.playerType;
    }
}
