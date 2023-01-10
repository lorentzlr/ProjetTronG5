const mongoose = require('mongoose');
const { User } = require("./users/User");

module.exports = {
    Database: class {
        constructor() {
            mongoose.connect('mongodb://localhost:27017/MaBD');
            this.UserDatabase = mongoose.model('User', { name: String, password: String, nbVictoire: Number });
        };

        async connectionUtilisateur(_name, _password, ConnectedUserCollection) {
            const user = new User(
                _name
            )
            let messageJson = {
                type: "FirstConnection",
                connectionStatus: true,
                idRoom: 1,
                message: ""
            }

            // Retourne une promesse qui sera résolue quand l'utilisateur aura créé son compte ou sera connecté
            return new Promise((resolveConnection) => {
                // Cherche l'utilisateur via son login et son password
                this.UserDatabase.findOne({ name: _name, password: _password }).exec(async (err, userFromDatabase) => {
                    // Dans le cas où une erreur serait rencontrée lors du findOne
                    if (err) {
                        // Retourne null
                        resolveConnection(null);
                    }

                    // Si un utilisateur a été trouvé
                    if (userFromDatabase != null) {
                        // vérifie si l'utilisateur est déjà connecté ailleurs
                        if (!ConnectedUserCollection.addUser(user)) {
                            messageJson.message = "Vous êtes déjà connecté ailleurs";
                            messageJson.connectionStatus = false;

                            // renvoie le résultat avec le mesage d'erreur
                            return resolveConnection(messageJson);
                        }
                        messageJson.message = "Connection reussie";
                    } else {
                        // Si aucun utilisateur n'a été trouvé on le créé
                        const newUser = new UserDatabase({ name: _name, password: _password, nbVictoire: 0 });
                        // Attends que l'utilisateur soit enregistré dans la BD
                        await new Promise((resolveCreation) => {
                            newUser.save().then(() => {
                                messageJson.connectionStatus = true;
                                messageJson.message = "Creation du compte";
                                resolveCreation();
                            });
                        });
                    }
                    // On retourne le statut de la connection
                    resolveConnection(messageJson);
                });
            });
        }
    }
}