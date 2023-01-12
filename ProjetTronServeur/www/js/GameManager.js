const events = require('events');
const eventEmitter = new events.EventEmitter();

module.exports = {
    GameManager: class {
        constructor(roomManager, database){
            this.roomManager = roomManager;
            this.database = database;
            this.eventEmitter = eventEmitter;
        }

        deplacementJoueur(user, message) {
            let room_id = user.getCurrentRoomId();
            if (room_id === null) {
                return;
            }
            let room = this.roomManager.getRoomById(room_id);
        
            //Si le message reçu indique que le joueur est mort, on va le retirer de la room
            if (message.isAlive === false) {
                room.removeUserFromRoom(user);
        
                //Ici on va vérifier s'il reste un seul joueur ou pas
                let joueursRestants = room.getUsers();
                if (joueursRestants.length === 1) { //Si un seul joueur restant, fin de partie
                    let gagnant = joueursRestants[0];
                    this.database.addOneWin(gagnant.getLogin()); //On ajoute une victoire à cet user
        
                    //On crée le message à envoyer au client gagnant et on l'envoie
                    let messageFinPartie = {
                        "type": 'Winner',
                    };
                    gagnant.getConnection().send(JSON.stringify(messageFinPartie));
        
                    //On vide la room et on lui indique que la partie est finie
                    room.gameEnd();
                }
            } else { //Si le joueur est toujours vivant
                // envoie la nouvelle position du joueur à tous les autres joueurs de la partie
                for (let login in room.getUsers()) {
                    room.getUsers()[login].user.getConnection().send(JSON.stringify(message));
                }
            };
        }

        joueurQuitteLaRecherche(user) {
            let room_updated = this.roomManager.removeUserHisFromRoom(user);
        
            // Si l'utilisateur était dans une room, on le retire de la room
            if (room_updated !== null) {
                let event_in_room_data = {
                    id_room: room_updated.getId(),
                    room_users: room_updated.getUsersLogins()
                };
        
                this.eventEmitter.emit("UpdateUsersInRoom", event_in_room_data);
                this.eventEmitter.removeAllListeners();
            }
        }

        joueurEnRechercheDePartie(user) {
            // on rajoute le joueur dans une room
            let room = this.roomManager.addPlayerInRoom(user);
        
            // on récupère les données pour l'evenement UpdateUsersInRoom
            let event_in_room_data = {
                id_room: room.getId(),
                room_users: room.getUsersLogins()
            };
        
            // sinon on attend que la room soit complète
            this.eventEmitter.on("launchGame", (room_from_event) => this.lancementJeu(room_from_event, room.getId(), user.getConnection()));
        
            // Si la room est complète, on peut lancer le Grille
            if (room.isRoomFull()) {
                this.eventEmitter.emit("UpdateUsersInRoom", event_in_room_data);
        
                // on prévient qu'un nouvel utilisateur est dans la room avant de lancer la partie
                this.UpdateUsersInRoom(event_in_room_data, room.getId(), user.getConnection());
        
                // on lance la partie
                let event_data = { room: room };
                room.gameStart();
                eventEmitter.emit("launchGame", event_data);
                return;
            }
        
            // on attend d'autres joueurs
            this.eventEmitter.on("UpdateUsersInRoom", (room_data) => this.UpdateUsersInRoom(room_data, room.getId(), user.getConnection()));
        
            // on prévient qu'un nouvel utilisateur est dans la room
            this.eventEmitter.emit("UpdateUsersInRoom", event_in_room_data);
        }
        
        UpdateUsersInRoom(room_data, room_send_id, connection) {
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
        
        lancementJeu(room_event, id_room, connection) {
            console.log("lancement du jeu")
            if (room_event.room.getId() === id_room) {
                // on lance le Grille pour les joueurs dans la rooms
                this.eventEmitter.removeAllListeners();
                return connection.send(
                    JSON.stringify({
                        type: 'launchGame',
                        positions: room_event.room.getUsersStartPositions()
                    })
                );
            }
        }
    }
}