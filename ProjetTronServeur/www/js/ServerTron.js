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
    connection.on('message', function(message) {

        message = JSON.parse(message.utf8Data);

        switch (message.type) {
            case "firstConnection":
                    connection.send(FirstConnection(message.name, message.password));                
                break;
        
            default:
                break;
        }
        connection.send(message.utf8Data);

     });
     connection.on('close', function(reasonCode, description) {
        console.log("Fermeture du socket raison : " + reasonCode + " description : " + description );
    });
});


function FirstConnection(_name, _password){

    var messageJson = {
        "type" : "FirstConnection",
        "connectionStatus" : true,
        "idRoom" : 1,
        "message" : ""
    }

    if (User.where({name : _name, password: _password}) != null) {
        messageJson.message = "Connection reussie";
    }else if (User.where({name : _name}) != null) {
        messageJson.connectionStatus = false;
        messageJson.message = "Nom de compte incorrect";
        
    }else if (User.where({password: _password}) != null) {
        messageJson.connectionStatus = false;
        messageJson.message = "Mot de passe incorrect";
    }else{
        const newUser = new User({ name: _name, password: _password , nbVictoire: 0});
        newUser.save().then(() => console.log('Creation de user'));
        messageJson.connectionStatus = true;
        messageJson.message = "Creation du compte";
    }
    return JSON.stringify(messageJson);
}

console.log("Server on");