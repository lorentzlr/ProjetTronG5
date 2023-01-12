const {Room} = require("./Room");

class RoomManager {
    constructor() {
        this.rooms = [];
    }

    getRoomById(room_id) {
        return this.rooms[room_id];
    }

    addPlayerInRoom(user) {
        let room;
        // Si aucune room n'existe, on en créé une
        if (this.rooms.length === 0) {
            room = this.createNewRoomInitializedWithOnePlayer(user, 0);
        } else {
            // Sinon on rajoute le joueur dans une room existante
            room = this.addInFirstAvailableRoom(user);
        }

        user.setCurrentRoomId(room.getId());
        return room;
    }

    createNewRoomInitializedWithOnePlayer(user, id_room) {
        let new_room = new Room(id_room);
        new_room.addUserInRoom(user);
        this.rooms.push(new_room);

        return new_room;
    }

    addInFirstAvailableRoom(user) {
        let room = false;
        let index = 0
        // on parcourt les rooms existante jusqu'à trouver de la place
        this.rooms.forEach(existing_room => {
            // si la room n'est pas pleine on rajoute le joueur dedans
            if (!existing_room.isRoomFull()) {
                existing_room.addUserInRoom(user);
                room = existing_room;
                return;
            }
            index++;
        });

            // si on a déjà rajouté le joueur, on renvoie la room. Sinon on en créé une autre
            return room ? room : this.createNewRoomInitializedWithOnePlayer(user, index);
        }

    // enlève un utilisateur de la room et ne le considère plus en recherche de partie
    removeUserHisFromRoom(user) {
        let room_id = user.getCurrentRoomId();

        if (room_id === null) {
            return null;
        }

        this.rooms[room_id].removeUserFromRoom(user);
        user.removeCurrentRoomId();
        return this.rooms[room_id];
    }
}

module.exports = {
    RoomManager: RoomManager
}
