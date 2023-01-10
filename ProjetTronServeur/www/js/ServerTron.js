const http = require('http');
const {RoomManager} = require("./rooms/RoomManager");
const {ConnectedUserCollection} = require("./users/ConnectedUsersCollection");
const events = require('events');
const eventEmitter = new events.EventEmitter();
const {User} = require("./users/User");
const {Database} = require('./Database');
const server = http.createServer();
server.listen(9898);

const roomManager = new RoomManager();
const database = new Database();

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/MaBD');

// const UserDatabase = mongoose.model('User', { name: String , password: String, nbVictoire: Number});

// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server
});

// Mise en place des événements WebSockets
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    let user = null;
    // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', async function(message) {
        message = JSON.parse(message.utf8Data);
        switch (message.type) {
            case "FirstConnection":
                //Appel de la fonction de l'objet database pour savoir si l'user peut se connecter
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
            case "PositionClient" :
                deplacementJoueur(user, message);
                break;
            default:
                break;
        }
    });

    connection.on('close', function(reasonCode, description) {
        joueurQuitteLaRecherche(user);

        // on ne considère plus l'utilisateur comme connecté
        ConnectedUserCollection.removeUserFromCollection(user)
        user.removeCurrentRoomId();

        // UpdateUsersInRoom(room_data, room_updated.getId(), connection);
        console.log("Fermeture du socket raison : " + reasonCode + " description : " + description );
    });
});

function deplacementJoueur(user, message) {
    let room_id = user.getCurrentRoomId();
    if (room_id === null) {
        return;
    }
    let room = roomManager.getRoomById(room_id);
    // envoie la nouvelle position du joueur à tous les autres joueurs de la partie
    room.getUsers().forEach(user_from_room => {
        user_from_room.getConnection().send(JSON.stringify(message));
    })
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

    // Si la room est complète, on peut lancer le jeu
    if (room.isRoomFull()) {
        eventEmitter.emit("UpdateUsersInRoom", event_in_room_data);

        // on prévient qu'un nouvel utilisateur est dans la room avant de lancer la partie
        UpdateUsersInRoom(event_in_room_data, room.getId(), user.getConnection());

        // on lance la partie
        let event_data = {id_room: room.getId()};
        eventEmitter.emit("launchGame", event_data);
        lancementJeu(event_data, room.getId(), user.getConnection());
    }

    // on attend d'autres joueurs
    eventEmitter.on("UpdateUsersInRoom",  (room_data) => UpdateUsersInRoom(room_data, room.getId(), user.getConnection()));

    // on prévient qu'un nouvel utilisateur est dans la room
    eventEmitter.emit("UpdateUsersInRoom", event_in_room_data);

    // sinon on attend que la room soit complète
    eventEmitter.on("launchGame",  (id_room) => lancementJeu(id_room, room.getId(), user.getConnection()));
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

function lancementJeu(id_room_event, id_room, connection) {
    if (id_room_event.id_room === id_room) {
        eventEmitter.on("deplacementJoueur",  (message) => deplacementJoueur(message));
        // on lance le jeu pour les joueurs dans la rooms
        return connection.send(
            JSON.stringify({
                "type" : 'launchGame'
            })
        );
    }
}

/*
async function connectionUtilisateur(_name, _password) {
    const user = new User(
        _name
    )
    let messageJson = {
        type : "FirstConnection",
        connectionStatus : true,
        idRoom : 1,
        message : ""
    }

    // Retourne une promesse qui sera résolue quand l'utilisateur aura créé son compte ou sera connecté
    return new Promise((resolveConnection) => {
        // Cherche l'utilisateur via son login et son password
        UserDatabase.findOne({name : _name, password: _password}).exec(async (err, userFromDatabase)=> {
            // Dans le cas où une erreur serait rencontrée lors du findOne
            if (err) {
                // Retourne null
                resolveConnection(null);
            }

            // Si un utilisateur a été trouvé
            if (userFromDatabase != null) {
                // vérifie si l'utilisateur est déjà connecté ailleurs
                if (! ConnectedUserCollection.addUser(user)) {
                    messageJson.message = "Vous êtes déjà connecté ailleurs";
                    messageJson.connectionStatus = false;

                    // renvoie le résultat avec le mesage d'erreur
                    return resolveConnection(messageJson);
                }
                messageJson.message = "Connection reussie";
            } else {
                // Si aucun utilisateur n'a été trouvé on le créé
                const newUser = new UserDatabase({ name: _name, password: _password , nbVictoire: 0});
                // Attends que l'utilisateur soit enregistré dans la BD
                await new Promise((resolveCreation) => {
                    newUser.save().then(() => {
                        messageJson.connectionStatus = true;
                        messageJson.message = "Creation du compte";
                        resolveCreation();
                    });
                });
            }
            // On retourne le statut de la connection
            resolveConnection(messageJson);
        });
    });
}
*/

console.log("Server on");