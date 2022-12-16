const ws = new WebSocket('ws://localhost:9898/');
let DOM_reponse = document.getElementById("reponse");
ws.onopen = function() {
    console.log("Bienvenue sur le jeu Tron")
};
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
