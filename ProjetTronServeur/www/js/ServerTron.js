const http = require('http');
const { RoomManager } = require("./rooms/RoomManager");
const { ConnectedUserCollection } = require("./users/ConnectedUsersCollection");
const { User } = require("./users/User");
const { Database } = require('./Database');
const { GameManager } = require('./GameManager');
const server = http.createServer();
server.listen(9898);

const roomManager = new RoomManager();
const database = new Database();
const gameManager = new GameManager(roomManager, database);

// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer(
    {
        httpServer: server
    }
);

// Mise en place des événements WebSockets
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    let user = null;

    // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', async function (message) {
        message = JSON.parse(message.utf8Data);
        switch (message.type) {
            case "FirstConnection":
                //Appel de la fonction de l'objet database pour savoir si l'adversaire peut se connecter
                const retourConnexion = await database.connectionUtilisateur(message.name, message.password, ConnectedUserCollection);
                if (retourConnexion.connectionStatus) {
                    user = new User(message.name, connection);
                }

                connection.send(JSON.stringify(retourConnexion));
                break;
            case "waitingForGame":
                gameManager.joueurEnRechercheDePartie(user);
                break;
            case "quitRoom":
                gameManager.joueurQuitteLaRecherche(user);
                break;
            case "PositionClient":
                gameManager.deplacementJoueur(user, message);
                break;
            default:
                break;
        }
    });

    connection.on('close', function (reasonCode, description) {
        if (user === null) {
            return;
        };

        let room = roomManager.getRoomById(user.getCurrentRoomId());
        // on vérifie si l'utilisateur est en game
        if (room !== undefined && room.isGameRunning()) {
            return;
        }

        // si non, on ne considère plus l'utilisateur comme connecté
        ConnectedUserCollection.removeUserFromCollection(user);
        gameManager.joueurQuitteLaRecherche(user);
    });
});

console.log("Server on");