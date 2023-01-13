const affichageManager = AffichageManager();
const socketManager = SocketManager(affichageManager);

let login = "";
let password = "";


function MouvementUp(){
    window.user.direction = "up"
}

function MouvementLeft(){
    window.user.direction = "left"
}

function MouvementRight(){
    window.user.direction = "right"
}
function MouvementDown(){
    window.user.direction = "down"
}
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

/**
 * Fonction de retour au menu une fois la partie perdue/terminée
 */
function backToMenu(){
    affichageManager.retourAuMenu();
}
