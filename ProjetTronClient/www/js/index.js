const affichageManager = AffichageManager();
const socketManager = SocketManager(affichageManager);

let login = "";
let password = "";

function connection() {
    // on récupère les informations de connection
    login = document.getElementById('name').value;
    password = document.getElementById('password').value;

    let message = {
        "type" : 'FirstConnection',
        "name" : login,
        "password" : password
    };

    // on demande au server si les infos sont bonnes
    socketManager.sendMessage(message);
}

// le joueur quitte la recherche de partie
function quitRoom()
{
    affichageManager.fermerWaitingModale()
    socketManager.sendMessage({type: 'quitRoom'});
}

function joinGame()
{


    affichageManager.afficherWaitingModale(quitRoom);
    // L'utilisateur peut être dans la room
    socketManager.sendMessage({type: 'waitingForGame'});
}

