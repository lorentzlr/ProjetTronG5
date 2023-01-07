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

        // récupération des noms des joueurs
        getUsersLogins() {
            let users_logins = [];
            this.users.forEach(user => {
                users_logins.push(user.getLogin());
            });

            return users_logins;
        }

        isRoomFull() {
            // on vérfie si la room est pleine (superieur à deux joueurs)
            return this.users.length >= 3;
        }
    }
}