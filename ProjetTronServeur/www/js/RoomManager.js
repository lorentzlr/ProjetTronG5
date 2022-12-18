const {Room} = require("./Room");

class RoomManager {
        constructor() {
            this.rooms = [];
        }

        addPlayerInRoom(login) {
            // Si aucune room n'existe on en créé une
            if (this.rooms.length === 0) {
                return this.createNewRoomInitializedWithOnePlayer(login, 1);
            }

            // Sinon on rajout le joueur dans une room existante
            return this.addInFirstAvailableRoom(login);
        }

        createNewRoomInitializedWithOnePlayer(login, id_room) {
            let new_room = new Room(id_room);
            new_room.addUserInRoom(login);
            this.rooms.push(new_room);

            return new_room;
        }

        addInFirstAvailableRoom(login) {
            let room = false;
            let index = 0
            // on parcours les rooms existante jusqu'a trouver de la place
            this.rooms.forEach(existing_room => {

                // si la room n'est pas pleine on rajoute le joueur dedans
                if (! existing_room.isRoomFull()) {
                    existing_room.addUserInRoom(login);
                    room = existing_room;
                }
                index++;
            });

            // si on a déjà rajouter le joueur, on renvoie la room. Sinon on en créé une autre
            return room ? room : this.createNewRoomInitializedWithOnePlayer(login, index);
        }
    }

module.exports = {
    RoomManager: new RoomManager()
}
