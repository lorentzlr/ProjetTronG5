const ws = new WebSocket('ws://localhost:9898/');
let DOM_reponse = document.getElementById("reponse");

ws.onopen = function() {
    console.log("Bienvenue sur le jeu Tron")
};
function connection() {
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;

    let message = {
        "type" : 'FirstConnection',
        "name" : name,
        "password" : password
    };

    ws.send(JSON.stringify(message));
};

ws.onmessage = function(message){

    //On parse le message pour avoir un objet
    message = JSON.parse(message.data);

    switch(message.type){
        case 'FirstConnection':
            //Si c'est false, la connexion a échoué, on va afficher le message du serveur
            if(message.connectionStatus === false){
                document.getElementById('messageServeur').innerHTML = message.message
            } else { //Si c'est true, la connexion a réussi
                console.log("Connexion résussie")
                document.getElementById('connection').style.display = 'none'; //On cache le menu de login
                document.getElementById('waitingRoom').style.display = 'inline-block'; //On affiche la salle d'attente

                //On affiche un petit message concernant la room
                document.getElementById('infoRoom').innerHTML = "Bienvenue dans la room " + message.idRoom;

                //On stocke les infos de connexion dans le localStorage
                localStorage.setItem("name", document.getElementById('name').value);
                localStorage.setItem("password", document.getElementById('password').value);
            };

        case 'LancementPartie':
            //Quand on reçoit le message de lancement de la partie du serveur
            document.getElementById('waitingRoom').style.display = 'none'; //On cache la room d'attente
            document.getElementById('game').style.display = 'inline-block'; //On affiche le div du jeu
    };
};