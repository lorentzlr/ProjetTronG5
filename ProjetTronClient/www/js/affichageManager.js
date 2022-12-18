function AffichageManager()
{
    function afficherPageConnexion(message)
    {
        console.log("Connexion résussie")
        document.getElementById('connection').style.display = 'none'; //On cache le menu de login
        document.getElementById('waitingRoom').style.display = 'inline-block'; //On affiche la salle d'attente

        //On affiche un petit message concernant la room
        document.getElementById('infoRoom').innerHTML = "Bienvenue dans la room " + message.idRoom;

        //On stocke les infos de connexion dans le localStorage
        localStorage.setItem("name", document.getElementById('name').value);
        localStorage.setItem("password", document.getElementById('password').value);
    }

    function afficherMessage(message)
    {
        document.getElementById('messageServeur').innerHTML = message;
    }

    function afficherPartie() {
        document.getElementById('waitingRoom').style.display = 'none'; //On cache la room d'attente
        document.getElementById('game').style.display = 'inline-block'; //On affiche le div du jeu
    }

    return  {
        afficherMessage,
        afficherPageConnexion,
        afficherPartie
    }
}