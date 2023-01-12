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
        document.getElementById('game').style.display = 'inline-block'; //On affiche le div du Grille
    }

    function afficherWaitingModale()
    {
        let waiting_modale = document.getElementById('waiting-modale');
        waiting_modale.showModal();
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

    function afficherPositionJoueurPrincipale(case_value) {
        let td = document.getElementById(case_value);
        td.classList.add("position-joueur");
    }

    function afficherAdversaire(case_value) {
        let td = document.getElementById(case_value);
        td.classList.add("position-adversaire");
    }

    function afficherPlateau(plateau) {
        let grille = document.getElementById("grille");
        plateau.getCases().forEach(line => {
            let tr = addLine(grille);
            line.forEach(one_case => {
                addCase(tr, one_case);
            })
        })
    }

    // ajout des lignes de la grille
    function addLine(grille) {
        let tr = document.createElement("tr")
        grille.appendChild(tr);
        return tr;
    }

    // ajout des cases de la grille
    function addCase(tr, one_case) {
        let td = document.createElement("td");
        td.id = one_case.getValeur();
        if (one_case.isAWall()) {
            td.classList.add("position-Mur");
        }
        tr.appendChild(td);
    }

    /**
     * Fonction qui remet la grille à 0 et renvoie le joueur vers le menu du jeu
     */
    function retourAuMenu(){
        let game = document.getElementById('game');
        game.style.display = 'none';
        let waiting_modale = document.getElementById('waiting-modale');
        waiting_modale.showModal();
    }

    return  {
        afficherMessage,
        afficherPageConnexion,
        afficherPartie,
        updateWaitingModale,
        fermerWaitingModale,
        afficherWaitingModale,
        afficherPlateau,
        afficherPositionJoueurPrincipale,
        afficherAdversaire,
        retourAuMenu
    }
}