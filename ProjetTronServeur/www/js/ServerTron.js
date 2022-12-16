const { Console } = require('console');
const http = require('http');
const server = http.createServer();
server.listen(9898);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/MaBD');
const User = mongoose.model('User', { name: String , password: String, nbVictoire: Number});


// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
 httpServer: server
});

// Mise en place des événements WebSockets
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
     // Ecrire ici le code qui indique ce que l'on fait en cas de
    // réception de message et en cas de fermeture de la WebSocket
    connection.on('message', async function(message) {

        message = JSON.parse(message.utf8Data);
        switch (message.type) {
            case "firstConnection":
                const retourConnexion = await connectionUtilisateur(message.name, message.password)  
                console.log(retourConnexion)
                connection.send(retourConnexion);                
                break;
        
            default:
                break;
        }

     });
     connection.on('close', function(reasonCode, description) {
        console.log("Fermeture du socket raison : " + reasonCode + " description : " + description );
    });
});


async function connectionUtilisateur(_name, _password){

    var messageJson = {
        type : "FirstConnection",
        connectionStatus : true,
        idRoom : 1,
        message : ""
    }

    // Retourne une promess qui sera résolue quand l'utilisateur aura créé son compte ou sera connecté
    return new Promise((resolve1) => {
        // Cherche l'utilisateur via son login et son password
        User.findOne({name : _name, password: _password}).exec(async (err, user)=> {
            // Dans le cas où une erreur serait rencontrée lors du findOne
            if (err) {
                // Retourne null
                resolve1(null);
            } 

            // Si un utilisateur a été trouvé
            if (user != null) {
                messageJson.message = "Connection reussie";
            } else {
                // Si aucun utilisateur n'a été trouvé on le créé
                const newUser = new User({ name: _name, password: _password , nbVictoire: 0});
                // Attends que l'utilisateur soit enregistré dans la BD
                await new Promise((resolve2) => {
                    newUser.save().then(() => {
                        messageJson.connectionStatus = true;
                        messageJson.message = "Creation du compte";
                        resolve2();
                    });
                });
            }
            // On retourne le statut de la connection
            resolve1(JSON.stringify(messageJson));
        });
    });
}

console.log("Server on");