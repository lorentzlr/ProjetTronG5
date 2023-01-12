const http = require('http');
const { RoomManager } = require("./rooms/RoomManager");
const { ConnectedUserCollection } = require("./users/ConnectedUsersCollection");
const events = require('events');
const eventEmitter = new events.EventEmitter();
const { User } = require("./users/User");
const { Database } = require('./Database');
const server = http.createServer();
server.listen(9898);

const roomManager = new RoomManager();
const database = new Database();

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
                joueurEnRechercheDePartie(user);
                break;
            case "quitRoom":
                joueurQuitteLaRecherche(user);
                break;
            case "PositionClient":
                deplacementJoueur(user, message);
                break;
            default:
                break;
        }
    });

    connection.on('close', function () {
        if (user === null) {
            return;
        }
        let room = roomManager.getRoomById(user.getCurrentRoomId());

        // on vérifie si l'utilisateur est en game
        if (room !== undefined && room.isGameRunning()) {
            return;
        }

        // si non, on ne considère plus l'utilisateur comme connecté
        ConnectedUserCollection.removeUserFromCollection(user);
        joueurQuitteLaRecherche(user);
    });
});

function deplacementJoueur(user, message) {
    let room_id = user.getCurrentRoomId();
    if (room_id === null) {
        return;
    }
    let room = roomManager.getRoomById(room_id);

    //Si le message reçu indique que le joueur est mort, on va le retirer de la room
    if (message.isAlive === false) {
        room.removeUserFromRoom(user);
    } else { //Si le joueur est toujours vivant
        // envoie la nouvelle position du joueur à tous les autres joueurs de la partie
        room.getUsers().forEach(user_from_room => {
            user_from_room.getConnection().send(JSON.stringify(message));
        });
    }
}

function joueurQuitteLaRecherche(user) {
    let room_updated = roomManager.removeUserHisFromRoom(user);

    // Si l'utilisateur était dans une room, on le retire de la room
    if (room_updated !== null) {
        let event_in_room_data = {
            id_room: room_updated.getId(),
            room_users: room_updated.getUsersLogins()
        };

        eventEmitter.emit("UpdateUsersInRoom", event_in_room_data);
    }
}

function joueurEnRechercheDePartie(user) {
    // on rajoute le joueur dans une room
    let room = roomManager.addPlayerInRoom(user);

    // on récupère les données pour l'evenement UpdateUsersInRoom
    let event_in_room_data = {
        id_room: room.getId(),
        room_users: room.getUsersLogins()
    };

    // Si la room est complète, on peut lancer le Grille
    if (room.isRoomFull()) {
        eventEmitter.emit("UpdateUsersInRoom", event_in_room_data);

        // on prévient qu'un nouvel utilisateur est dans la room avant de lancer la partie
        UpdateUsersInRoom(event_in_room_data, room.getId(), user.getConnection());

        // on lance la partie
        let event_data = { room: room };
        room.gameStart();
        eventEmitter.emit("launchGame", event_data);
        lancementJeu(event_data, room.getId(), user.getConnection());
        return;
    }

    // on attend d'autres joueurs
    eventEmitter.on("UpdateUsersInRoom", (room_data) => UpdateUsersInRoom(room_data, room.getId(), user.getConnection()));

    // on prévient qu'un nouvel utilisateur est dans la room
    eventEmitter.emit("UpdateUsersInRoom", event_in_room_data);

    // sinon on attend que la room soit complète
    eventEmitter.on("launchGame", (room_from_event) => lancementJeu(room_from_event, room.getId(), user.getConnection()));
}

function UpdateUsersInRoom(room_data, room_send_id, connection) {
    if (room_data.id_room !== room_send_id) {
        return;
    }

    connection.send(
        JSON.stringify({
            type: 'UpdateUsersInRoom',
            room: {
                id_room: room_data.id_room,
                users: room_data.room_users
            }
        }
        )
    );
}

function lancementJeu(room_event, id_room, connection) {
    if (room_event.room.getId() === id_room) {
        // on lance le Grille pour les joueurs dans la rooms
        return connection.send(
            JSON.stringify({
                type: 'launchGame',
                positions: room_event.room.getUsersPositions()
            })
        );
    }
}

console.log("Server on");