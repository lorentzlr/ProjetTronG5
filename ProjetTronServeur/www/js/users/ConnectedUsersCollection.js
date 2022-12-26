class ConnectedUserCollection {
    constructor() {
        this.connections = [];
    }

    addUser(user) {
        // si l'utilisateur est déjà connecté on ne fait rien
        if (this.userAlreadyConnected(user.getLogin())) {
            return false;
        }

        // rajoute l'utilisateur dans la liste des utilisateurs connectés
        this.connections[user.getLogin()] = {
            user: user,
            room_id: null
        };

        return true;
    }

    // Vérifie si un utilisateur est connecté
    userAlreadyConnected(login) {
        return this.connections[login] !== undefined;
    }

    // récupère l'id de la room dans laquelle l'utilisateur est
    getUserRoomId(user) {
        return this.connections[user.getLogin()].room_id;
    }

    // Ajoute la room d'un utilisateur
    addRoomForUser(user, room) {
        this.connections[user.getLogin()].room_id = room.getId();
    }

    // retire un utilisateur de sa room
    removeRoomForUser(user) {
        this.connections[user.getLogin()].room_id = null;
    }

    // retire un utilisateur de sa room
    removeUserFromCollection(user) {
        delete this.connections[user.getLogin()];
    }
}

module.exports = {
    ConnectedUserCollection: new ConnectedUserCollection()
}