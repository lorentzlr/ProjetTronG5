const mongoose = require('mongoose');
mongoose.set('strictQuery', true); //Pour enlever le warning de deprecation
const { User } = require("./users/User");
const UserDatabase = mongoose.model('User', { name: String, password: String, nbVictoire: Number });

module.exports = {
    Database: class {
        constructor() {
            mongoose.connect('mongodb://localhost:27017/MaBD');
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
                // Cherche l'utilisateur via son login, le password est vérifié plus loin
                UserDatabase.findOne({ name: _name }).exec(async (err, userFromDatabase) => {
                    // Dans le cas où une erreur serait rencontrée lors du findOne
                    if (err) {
                        // Retourne null
                        resolveConnection(null);
                    }

                    // Si un utilisateur a été trouvé
                    if (userFromDatabase != null) {
                        if (_password != userFromDatabase.password) {
                            //Si les mdp ne correspondent pas la connexion est refusée
                            console.log("mdp incorrect")
                            messageJson.message = "Mot de passe incorrect";
                            messageJson.connectionStatus = false;

                            return resolveConnection(messageJson);
                        } else { //Si les mdp correspondent on connecte
                            messageJson.nbWinUser = userFromDatabase.nbVictoire;
                            messageJson.message = "Connexion reussie";
                        };
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

        /** Rajoute +1 au nb de victoires du joueur gagnant
         * 
         * @param {*} username le nom du joueur gagnant
         */
        async addOneWin(username) {
            new Promise((resolveConnection) => {
                UserDatabase.updateOne({ name: username }, { $inc: { 'nbVictoire': 1 } }, async (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        resolveConnection();
                    };
                })
            });
        }
    }
}