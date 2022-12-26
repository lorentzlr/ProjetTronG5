module.exports = {
    Room: class {
        constructor(id) {
            // utilisateurs dans la room
            this.users = [];

            // id de la room
            this.id = id;
        }

        addUserInRoom(user) {
            // si la room est full on essai pas de rajouter un utilisateur dedans
            if (this.isRoomFull()) {
                return;
            }
            this.users.push(user);
        }

        // enlève un utilisateur de la room
        removeUserFromRoom(user) {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].getLogin() !== user.getLogin) {
                    delete this.users.splice(i, 1);
                }
            }
        }

        getId() {
            return this.id;
        }

        getUsers() {
            return this.users;
        }

        isRoomFull() {
            // on vérfie si la room est plein (superieure à deux joueurs)
            return this.users.length >= 3;
        }
    }
}