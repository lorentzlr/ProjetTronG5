function SocketManager(affichageManager, roomManager) {
    const ws = new WebSocket('ws://localhost:9898/');

    ws.onopen = function() {
        console.log("Bienvenue sur le jeu Tron");

        //Quand la co est ouverte, on va autoremplir les credentials si on en a qui sont stockés
        if(localStorage.getItem("name") !== null){ //On vérifie qu'il existe des credentials
            //On récupère les deux
            let login = localStorage.getItem("name");
            let password = localStorage.getItem("password");

            //Et on les met directement dans les input
            document.getElementById('name').value = login;
            document.getElementById('password').value = password;
        }
    }

    ws.onmessage = function(message)
    {
        //On parse le message pour avoir un objet
        message = JSON.parse(message.data);
        switch(message.type){
            case 'FirstConnection':
                //Si c'est false, la connexion a échoué, on va afficher le message du serveur
                if(message.connectionStatus === false){
                    affichageManager.afficherMessage(message.message);
                    break;
                }
                // Si c'est true, la connexion a réussi
                affichageManager.afficherPageConnexion(message);

                // L'utilisateur peut être dans la room
                ws.send(JSON.stringify(roomManager.waitingGame(login)));
                break;
            case 'launchGame' :
                affichageManager.afficherPartie()

                let departJoueurs = message.positionJoueurs;
                //TODO: faire passer les positions au jeu pour placer les joueurs
                break;
        }
    }

    function sendMessage(message) {
        ws.send(JSON.stringify(message));
    }

    return {
        sendMessage
    }
}
