const TAILLE_PLATEAU = 50;

function SocketManager(affichageManager) {
    const ws = new WebSocket('ws://localhost:9898/');

    ws.onopen = function () {
        console.log("Bienvenue sur le Grille Tron");

        //Quand la co est ouverte, on va autoremplir les credentials si on en a qui sont stockés
        if (localStorage.getItem("name") !== null) { //On vérifie qu'il existe des credentials
            //On récupère les deux
            let login = localStorage.getItem("name");
            let password = localStorage.getItem("password");

            //Et on les met directement dans les inputs
            document.getElementById('name').value = login;
            document.getElementById('password').value = password;
        }
    }

    ws.onmessage = function (message) {
        //On parse le message pour avoir un objet
        message = JSON.parse(message.data);
        console.log(message);
        switch (message.type) {
            case 'FirstConnection':
                //Si c'est false, la connexion a échoué, on va afficher le message du serveur
                if (message.connectionStatus === false) {
                    affichageManager.afficherMessage(message.message);
                    break;
                }
                // Si c'est true, la connexion a réussi
                affichageManager.afficherPageConnexion(message);
                break;
            case 'launchGame' :
                affichageManager.afficherPartie();
                affichageManager.fermerWaitingModale();
                
                let plateau = new Plateau(TAILLE_PLATEAU);
                let deplacement_joueur = new DeplacementJoueur("right", plateau, affichageManager, sendMessage);

                affichageManager.afficherPlateau(plateau);
                deplacement_joueur.initialisation();

                //TODO: faire passer les positions au Grille pour placer les joueurs
                break;
            case 'UpdateUsersInRoom' :
                // mise à jour des informations dans la modale
                affichageManager.updateWaitingModale(message.room.users.length);
                break;
            case 'PositionClient' :
                // mise à jour des informations dans la modale
                console.log(message);
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
