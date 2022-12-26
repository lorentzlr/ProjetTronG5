const {Room} = require("./Room");

class RoomManager {
        constructor(ConnectedUserCollection) {
            this.connected_user_collection = ConnectedUserCollection;
            this.rooms = [];
        }

        addPlayerInRoom(user) {
            // Si aucune room n'existe, on en créait une
            if (this.rooms.length === 0) {
                return this.createNewRoomInitializedWithOnePlayer(user, 0);
            }

            // Sinon on rajoute le joueur dans une room existante
            return this.addInFirstAvailableRoom(user);
        }

        createNewRoomInitializedWithOnePlayer(user, id_room) {
            let new_room = new Room(id_room);
            new_room.addUserInRoom(user);
            this.connected_user_collection.addRoomForUser(user, new_room);
            this.rooms.push(new_room);

            return new_room;
        }

        addInFirstAvailableRoom(user) {
            let room = false;
            let index = 0
            // on parcourt les rooms existante jusqu'à trouver de la place
            this.rooms.forEach(existing_room => {

                // si la room n'est pas pleine on rajoute le joueur dedans
                if (! existing_room.isRoomFull()) {
                    existing_room.addUserInRoom(user);
                    room = existing_room;
                    this.connected_user_collection.addRoomForUser(user, room);
                    return;
                }
                index++;
            });

            // si on a déjà rajouté le joueur, on renvoie la room. Sinon on en créé une autre
            return room ? room : this.createNewRoomInitializedWithOnePlayer(user, index);
        }

        // enlève un utilisateur de la room et ne le considère plus en recherche de partie
        removeUserHisFromRoom(user) {
                let roomId = this.connected_user_collection.getUserRoomId(user);

                if (roomId === null) {
                    return null;
                }

                this.rooms[roomId].removeUserFromRoom(user);
                this.connected_user_collection.removeRoomForUser(user);
                return this.rooms[roomId];
            }
        }

module.exports = {
    RoomManager: RoomManager
}
