const affichageManager = AffichageManager();
const roomManager = RoomManager();
const socketManager = SocketManager(affichageManager, roomManager);

let login = "";
let password = "";

function connection() {
    // on récupère les informations de connection
    login = document.getElementById('name').value;
    password = document.getElementById('password').value;

    let message = {
        "type" : 'FirstConnection',
        "name" : name,
        "password" : password
    };

    // on demande au server si les infos sont bonnes
    socketManager.sendMessage(message);
}