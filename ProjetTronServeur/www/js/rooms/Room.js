const {START_POSITIONS, MAX_USERS_PER_ROOM} = require("../constants");
module.exports = {
    Room: class {
        constructor(id) {
            // utilisateurs dans la room
            this.users = [];

            // id de la room
            this.id = id;

            // etat de la room: en cours de jeu ou non
            this.is_game_running = false;
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
            // on vérifie si la room est pleine (superieur à deux joueurs)
            return this.users.length >= MAX_USERS_PER_ROOM;
        }

        isGameRunning()
        {
            return this.is_game_running;
        }

        gameStart()
        {
            this.is_game_running = true;
        }

        gameEnd()
        {
            this.is_game_running = false;
        }

        getUsersPositions() {
            let users_positions = [];
            let iterator_positions = 0;

            // pour chaque joueur dans la room on récupère sa position
            this.users.forEach(user => {
                users_positions.push({
                    login: user.getLogin(),
                    position: START_POSITIONS[iterator_positions]
                });
                iterator_positions++;
            });

            return users_positions;
        }
    }
}