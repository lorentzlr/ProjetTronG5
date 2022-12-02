const ws = new WebSocket('ws://localhost:9898/');
let DOM_reponse = document.getElementById("reponse");

ws.onopen = function() {
    console.log("Bienvenue sur le jeu Tron")
};

ws.onmessage = function(message) {
        DOM_reponse.innerHTML = "Creation de la rom" + message.data
};
   
function connexion() {
    let name = document.getElementById('name');
    let password = document.getElementById('password');

    let message = {
        "name" : name,
        "password" : password
    };

    ws.send(JSON.stringify(message));
};

ws.onmessage = function(message){

    //On parse le message pour avoir un objet
    message = JSON.parse(message);

    switch(message.type){
        case 'firstConnection':
            //Si c'est false, la connexion a échoué, on va afficher le emssage du serveur
            if(message.connectionStatus === false){
                document.getElementById('messageServeur').innerHTML = message.message
            } else { //Si c'est true, la connexion a réussi
                document.getElementById('connection').style.display = 'none'; //On cache le menu de login
                document.getElementById('waitingRoom').style.display = 'inline-block'; //On affiche la salle d'attente

                document.getElementById('infoRoom').innerHTML = "Bienvenue dans la room " + message.IDRoom;
                localStorage.setItem("name", )
            }
    };
};