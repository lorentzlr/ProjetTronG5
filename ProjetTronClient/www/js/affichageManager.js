function AffichageManager()
{
    function afficherPageConnexion(message)
    {
        let nomJoueur = document.getElementById('name').value;
        document.getElementById('connection').style.display = 'none'; //On cache le menu de login
        document.getElementById('waitingRoom').style.display = 'inline-block'; //On affiche la salle d'attente

        //On affiche un petit message concernant la room
        document.getElementById('infoRoom').innerHTML = "Bienvenue dans la room " + message.idRoom;
        document.getElementById('infoJoueur').innerHTML = "Joueur : " + nomJoueur + "</br> Victoires : " + message.nbWinUser;

        //On stocke les infos de connexion dans le localStorage
        localStorage.setItem("name", document.getElementById('name').value);
        localStorage.setItem("password", document.getElementById('password').value);
    }

    function afficherMessage(message)
    {
        console.log(message);
        document.getElementById('messageServeur').innerText = message;
    }

    function afficherPartie() {
        document.getElementById('waitingRoom').style.display = 'none'; //On cache la room d'attente
        document.getElementById('game').style.display = 'inline-block'; //On affiche le div du jeu
    }

    function afficherWaitingModale(close_modale_callback)
    {
        let waiting_modale = document.getElementById('waiting-modale');
        waiting_modale.showModal();

        // lorsque la modale se ferme, on appelle la callback
        waiting_modale.addEventListener('close', close_modale_callback);
    }

    function fermerWaitingModale()
    {
        let waiting_modale = document.getElementById('waiting-modale');
        waiting_modale.close();
    }

    // on met à jour la modale de recherche de partie
    function updateWaitingModale(nb_joueurs) {
        document.getElementById("nb-joueurs").innerHTML = nb_joueurs;
    }

    return  {
        afficherMessage,
        afficherPageConnexion,
        afficherPartie,
        updateWaitingModale,
        fermerWaitingModale,
        afficherWaitingModale
    }
}