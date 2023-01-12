const {START_POSITIONS, MAX_USERS_PER_ROOM} = require("../constants");
module.exports = {
    Room: class {
        constructor(id) {
            // utilisateurs dans la room
            this.users = {};

            // id de la room
            this.id = id;

            // etat de la room en cours de game ou non
            this.is_game_running = false;

            this.murs = [];
        }

        addUserInRoom(user) {
            // si la room est full on essai pas de rajouter un utilisateur dedans
            if (this.isRoomFull()) {
                return;
            }

            this.users[user.getLogin()] = {
                user: user
            };
        }

        setUser(user) {
            this.users[user.getLogin()].user = user;
        }
        // enlève un utilisateur de la room
        removeUserFromRoom(user) {
            this.users[user.getLogin()].user.removeCurrentRoomId(); //L'user n'a plus de room
            delete this.users[user.getLogin()]; //La room ne contient plus l'user
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
            for(let login in this.users) {
                users_logins.push(login);
            }

            return users_logins;
        }

        isRoomFull() {
            // on vérifie si la room est pleine (superieur à deux joueurs)
            return Object.keys(this.users).length >= MAX_USERS_PER_ROOM;
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
            this.users = [];
        }

        initUserPosition() {
            let iterator_positions = 0;
            for(let login in this.users) {
                this.users[login].position = START_POSITIONS[iterator_positions];
                iterator_positions++;
            }
        }

        updatePositionPlayer(login, position) {
            this.users[login].position = position;
        }

        addMurs(position_murs) {
            this.murs.push(position_murs);
        }

        getMurs() {
            return this.murs;
        }

        getActualUsersPosition() {
            let users_positions = [];
            // pour chaque joueur dans la room on récupère sa position
            for(let login in this.users) {
                users_positions.push({
                    login: login,
                    etat_initial: this.users[login].position
                });
            }

            return users_positions;
        }

        getUsersStartPositions() {
            this.initUserPosition();
            return this.getActualUsersPosition();
        }
    }
}