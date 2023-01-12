const TAILLE_PLATEAU = 50;

function SocketManager(affichageManager) {
    const ws = new WebSocket('ws://localhost:9898/');
    let deplacement_adversaires = null;
    let deplacement_joueur = null;
    let nbVictoire = null;

    let adversaires = null;
    let position_user = null;
    let direction_user = null;
    let plateau = null;

    ws.onopen = function () {
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
        switch (message.type) {
            case 'FirstConnection':
                //Si c'est false, la connexion a échoué, on va afficher le message du serveur
                if (message.connectionStatus === false) {
                    affichageManager.afficherMessage(message.message);
                    break;
                }
                // Si c'est true, la connexion a réussi
                affichageManager.premiereConnexion(message);
                break;
            case 'launchGame':
                console.log(message);
                adversaires = {};
                position_user = {
                    x: 0,
                    y: 0
                }
                direction_user = "up";

                message.positions.forEach(user => {
                    console.log(user);
                    if (user.login === login) {
                        position_user = user.etat_initial.position;
                        direction_user = user.etat_initial.direction;
                    } else {
                        adversaires[user.login] = new Adversaire(user.login, user.etat_initial.position);
                    }
                })

                affichageManager.afficherPartie();
                affichageManager.fermerWaitingModale();

                plateau = new Plateau(TAILLE_PLATEAU);
                affichageManager.afficherPlateau(plateau);

                deplacement_adversaires = new DeplacementAdversaires(affichageManager, adversaires, plateau);
                deplacement_adversaires.initPositionAdversaires();

                deplacement_joueur = new DeplacementJoueur(
                    direction_user, plateau, affichageManager, sendMessage, position_user
                );

                deplacement_joueur.initialisation(login);

                break;
            case 'UpdateUsersInRoom':
                // mise à jour des informations dans la modale
                affichageManager.updateWaitingModale(message.room.users.length);
                break;
            case 'PositionClient' :
                if (message.login !== login) {
                    deplacement_adversaires.changerPositionAdversaire(message.login, message.position)
                }

                // mise à jour des informations dans la modale
                break;
            case 'Winner': //Si le client reçoit ce message, c'est que c'est le dernier en vie

                //Et on l'arrête en indiquant que le jeu est terminé
                deplacement_joueur.in_game = false;

                //Et on vient modifier les affichages
                affichageManager.afficherVictoire();
            case 'MiseEnPause' :
                deplacement_joueur.jeuEnPause();
                // mise à jour des informations dans la modale
                affichageManager.afficherPauseModale();
                break;
            case 'TimerPause' :
                // mise à jour des informations dans la modale
                affichageManager.updatePauseModale(message.timer);
                break;
            case 'Reprise' :
                // mise à jour des informations dans la modale
                affichageManager.fermerPauseModale();

                deplacement_joueur.repriseDuJeu();
                break;
            case 'Reconnexion' :
                affichageManager.premiereConnexion(message);

                adversaires = {};
                position_user = {
                    x: 0,
                    y: 0
                }

                direction_user = "up";

                message.position_joueurs.forEach(user => {
                    if (user.login === login) {
                        position_user = user.etat_initial.position;
                    } else {
                        adversaires[user.login] = new Adversaire(user.login, user.etat_initial.position);
                    }
                });

                affichageManager.afficherPartie();
                affichageManager.fermerWaitingModale();

                plateau = new Plateau(TAILLE_PLATEAU);
                plateau.setMurs(message.murs);
                // murs
                affichageManager.afficherPlateau(plateau);

                deplacement_adversaires = new DeplacementAdversaires(affichageManager, adversaires, plateau);
                deplacement_adversaires.initPositionAdversaires();

                deplacement_joueur = new DeplacementJoueur(
                    direction_user, plateau, affichageManager, sendMessage, position_user
                );

                deplacement_joueur.initListener();
                deplacement_joueur.jeuEnPause();
                // mise à jour des informations dans la modale
                affichageManager.afficherPauseModale();
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
