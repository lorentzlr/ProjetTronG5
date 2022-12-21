const http = require('http');
const {RoomManager} = require("./RoomManager");
const events = require('events');
const eventEmitter = new events.EventEmitter();

const server = http.createServer();
server.listen(9898);

const roomManager = RoomManager;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/MaBD');

const User = mongoose.model('User', { name: String , password: String, nbVictoire: Number});

// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server
});

// Mise en place des événements WebSockets
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', async function(message) {
        message = JSON.parse(message.utf8Data);
        switch (message.type) {
            case "FirstConnection":
                const retourConnexion = await connectionUtilisateur(message.name, message.password)
                connection.send(retourConnexion);
                break;
            case "waitingForGame":
                // on récupère le login du joueur
                let user_login = message.name;

                // on rajoute le joueur dans une room
                let room = roomManager.addPlayerInRoom(user_login);

                // Si la room est complète, on peut lancer le jeu
                if (room.isRoomFull()) {
                    let event_data = {id_room: room.getId()};
                    eventEmitter.emit("launchGame", event_data);
                    lancementJeu(event_data, room.getId(), connection);
                    break;
                }

                // sinon on attends que la room soit complète
                eventEmitter.on("launchGame",  (id_room) => lancementJeu(id_room, room.getId(), connection));
                break;

            default:
                break;
        }

    });
    connection.on('close', function(reasonCode, description) {
        console.log("Fermeture du socket raison : " + reasonCode + " description : " + description );
    });
});


function lancementJeu(id_room_event,id_room, connection) {
    if (id_room_event.id_room === id_room) {
        // on lance le jeu pour les joueurs dans la rooms
        return connection.send(
            JSON.stringify({
                "type" : 'launchGame'
            })
        );
    }
}

async function connectionUtilisateur(_name, _password){

    var messageJson = {
        type : "FirstConnection",
        connectionStatus : true,
        idRoom : 1,
        message : ""
    }

    // Retourne une promess qui sera résolue quand l'utilisateur aura créé son compte ou sera connecté
    return new Promise((resolve1) => {
        // Cherche l'utilisateur via son login et son password
        User.findOne({name : _name, password: _password}).exec(async (err, user)=> {
            // Dans le cas où une erreur serait rencontrée lors du findOne
            if (err) {
                // Retourne null
                resolve1(null);
            }

            // Si un utilisateur a été trouvé
            if (user != null) {
                messageJson.message = "Connection reussie";
            } else {
                // Si aucun utilisateur n'a été trouvé on le créé
                const newUser = new User({ name: _name, password: _password , nbVictoire: 0});
                // Attends que l'utilisateur soit enregistré dans la BD
                await new Promise((resolve2) => {
                    newUser.save().then(() => {
                        messageJson.connectionStatus = true;
                        messageJson.message = "Creation du compte";
                        resolve2();
                    });
                });
            }
            // On retourne le statut de la connection
            resolve1(JSON.stringify(messageJson));
        });
    });
}

console.log("Server on");