class ConnectedUserCollection {
    constructor() {
        this.connections = {};
    }

    addUser(user) {
        // si l'utilisateur est déjà connecté on ne fait rien
        if (this.userAlreadyConnected(user.getLogin())) {
            return false;
        }

        // rajoute l'utilisateur dans la liste des utilisateurs connectés
        this.connections[user.getLogin()] = user;

        return true;
    }

    getConnections() {
        return this.connections;
    }

    // Vérifie si un utilisateur est connecté
    userAlreadyConnected(login) {
        return this.connections[login] !== undefined;
    }

    // L'utilisateur n'est plus considéré comme connecté
    removeUserFromCollection(user) {
        delete this.connections[user.getLogin()];
    }
}

module.exports = {
    ConnectedUserCollection: new ConnectedUserCollection()
}