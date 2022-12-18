function RoomManager() {
    function waitingGame(login) {
        //On affiche la salle d'attente
        document.getElementById('waitingRoom').style.display = 'inline-block';

        return {
            "type": 'waitingForGame',
            "name": login
        };
    }

    return {
        waitingGame
    }
}
