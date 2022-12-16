const ws = new WebSocket('ws://localhost:9898/');
let DOM_reponse = document.getElementById("reponse");
ws.onopen = function() {
    console.log("Bienvenue sur le jeu Tron")
};
<<<<<<< Updated upstream
ws.onmessage = function(message) {
        DOM_reponse.innerHTML = "Creation de la rom" + message.data
};
   

function connexion() {
    let DOM_ndc = document.getElementById("ndc").value;
    var json ={};
    json.numeroRom = DOM_ndc;
    var jsonToString = JSON.stringify(json);
    ws.send(jsonToString);
}
=======
function connection() {
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;

    let message = {
        "type" : 'firstConnection',
        "name" : name,
        "password" : password
    };

    console.log(JSON.stringify(message));
    ws.send(JSON.stringify(message));
};

ws.onmessage = function(message){

    //On parse le message pour avoir un objet
    message = JSON.parse(message.data);
    console.log("Message du serveur : ",message);
    switch(message.type){
        case 'firstConnection':
            //Si c'est false, la connexion a échoué, on va afficher le message du serveur
            if(message.connectionStatus === false){
                document.getElementById('messageServeur').innerHTML = message.message
            } else { //Si c'est true, la connexion a réussi
                document.getElementById('connection').style.display = 'none'; //On cache le menu de login
                document.getElementById('waitingRoom').style.display = 'inline-block'; //On affiche la salle d'attente

                //On affiche un petit message concernant la room
                document.getElementById('infoRoom').innerHTML = "Bienvenue dans la room " + message.idRoom;

                //On stocke les infos de connexion dans le localStorage
                localStorage.setItem("name", document.getElementById('name').value);
                localStorage.setItem("password", document.getElementById('password').value);
            }
    };
};
>>>>>>> Stashed changes
