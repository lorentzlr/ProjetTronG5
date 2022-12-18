module.exports = {
    Room: class {
        constructor(id) {
            // utilisateurs dans la room
            this.users = [];

            // id de la room
            this.id = id;
        }

        addUserInRoom(login) {
            // si la room est full on essai pas de rajouter un utilisateur dedans
            if (this.isRoomFull()) {
                return;
            }
            this.users.push(login)
        }

        getId() {
            return this.id;
        }

        isRoomFull()
        {
            // on vérfie si la room est plein (superieure à deux joueurs)
            return this.users.length >= 2;
        }
    }
}