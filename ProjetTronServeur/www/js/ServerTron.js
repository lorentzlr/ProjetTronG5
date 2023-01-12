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

function reconnexion(login, connection) {
    let room_id = ConnectedUserCollection.getConnections()[login].getCurrentRoomId();
    console.log(room_id);
    if (room_id === null) {
        let messageJson = {
            type: "FirstConnection",
            connectionStatus: false,
            message: "Vous êtes déjà connecté ailleurs"
        }

        connection.send(JSON.stringify(messageJson));
        return null;
    }
    let room = roomManager.getRoomById(room_id);
    if (room !== undefined && room.isGameRunning()) {
        ConnectedUserCollection.getConnections()[login].setConnection(connection);

        let messageJson = {
            type: "Reconnexion",
            position_joueurs: room.getActualUsersPosition(),
            murs: room.getMurs(),
            connectionStatus: true,
        }

        connection.send(JSON.stringify(messageJson));
        let user = ConnectedUserCollection.getConnections()[login];
        roomManager.getRoomById(room_id).setUser(user);
        return user;
    }
}

async function stopGame(room) {
    let message = {
        type: "MiseEnPause",
    }
    for(let login in room.getUsers()) {
        room.getUsers()[login].user.getConnection().send(JSON.stringify(message));
    }

    await sleep(1000)

    // 15 seconde de pause
    let timer = 15;
    while (timer !== 0) {
        let message = {
            type: "TimerPause",
            timer: timer
        }

        // on envoie le timer de la pause à tous les joueurs
        sendMessageToAllRoomPlayers(room, message);

        timer--;
        await sleep(1000)
    }

    message = {
        type: "Reprise"
    }

    // le jeu reprend
    sendMessageToAllRoomPlayers(room, message);
}

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
                if (ConnectedUserCollection.userAlreadyConnected(message.name)) {
                    user = reconnexion(message.name, connection);
                    return;
                }
                //Appel de la fonction de l'objet database pour savoir si l'adversaire peut se connecter
                const retourConnexion = await database.connectionUtilisateur(message.name, message.password);

                if (retourConnexion.connectionStatus) {
                    user = new User(message.name, connection);
                    ConnectedUserCollection.addUser(user);
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


    connection.on('close', async function () {
        if (user === null) {
            return;
        };

        let room = roomManager.getRoomById(user.getCurrentRoomId());
        // on vérifie si l'utilisateur est en game
        if (room !== undefined && room.isGameRunning()) {
            await stopGame(room);
        }

        // si non, on ne considère plus l'utilisateur comme connecté
        ConnectedUserCollection.removeUserFromCollection(user);
        gameManager.joueurQuitteLaRecherche(user);
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sendMessageToAllRoomPlayers(room, message) {
    for (let login in room.getUsers()) {
        room.getUsers()[login].user.getConnection().send(JSON.stringify(message));
    }
}

console.log("Server on");