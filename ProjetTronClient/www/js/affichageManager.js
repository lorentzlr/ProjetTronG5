function AffichageManager() {
    let nbVictoires = null;
    let nomJoueur = null;
    let idRoom = null;

    /** Fonction qui affiche le menu du jeu après la connexion ou après une fin de partie
     * 
     * @param {*} message le message renvoyé par le serveur
     */
    function premiereConnexion(message) {
        console.log(message)
        nomJoueur = document.getElementById('name').value;
        nbVictoires = message.nbWinUser === undefined ? 0 : message.nbWinUser; //On stocke le nb de victoires en local pour augmenter si victoire
        idRoom = message.idRoom;
        
        //On stocke les infos de connexion dans le localStorage
        localStorage.setItem("name", document.getElementById('name').value);
        localStorage.setItem("password", document.getElementById('password').value);

        afficherMenu();
    }

    function afficherMessage(message) {
        console.log(message);
        document.getElementById('messageServeur').innerText = message;
    }

    function afficherPartie() {
        document.getElementById('waitingRoom').style.display = 'none'; //On cache la room d'attente
        document.getElementById('retourMenu').style.display = 'none';
        document.getElementById('infosJeuCourant').innerHTML = "Partie lancée !"
        document.getElementById('game').style.display = 'inline-block'; //On affiche le div du Grille
    }

    function afficherWaitingModale() {
        let waiting_modale = document.getElementById('waiting-modale');
        waiting_modale.showModal();
    }

    function fermerWaitingModale() {
        let waiting_modale = document.getElementById('waiting-modale');
        waiting_modale.close();
    }

    // on met à jour la modale de recherche de partie
    function updateWaitingModale(nb_joueurs) {
        document.getElementById("nb-joueurs").innerHTML = nb_joueurs;
    }

    function afficherPauseModale()
    {
        let pause_modale = document.getElementById('pause-modale');
        document.getElementById("timer").innerHTML = 30;
        pause_modale.showModal();
    }

    function fermerPauseModale()
    {
        let pause_modale = document.getElementById('pause-modale');
        pause_modale.close();
    }

    // on met à jour la modale de recherche de partie
    function updatePauseModale(timer) {
        document.getElementById("timer").innerHTML = timer;
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
     * Modifie les affichages pour indiquer qu'un joueur a gagné
     */
    function afficherVictoire() {
        //Donc on lui affiche qu'il a gagné et le bouton pour revenir au menu
        document.getElementById('retourMenu').style.display = 'inline-block';
        document.getElementById('infosJeuCourant').innerHTML = "Partie terminée !"
        let retourMenu = document.querySelector("#retourMenu p");
        retourMenu.innerHTML = "Vous avez gagné ! Revenir au menu : "

        //On augmente le nb de victoires du joueur
        nbVictoires++;
    }


    /**
     * Fonction qui remet la grille à 0 et renvoie le joueur vers le menu du jeu
     */
    function retourAuMenu() {
        //On cache le jeu
        let game = document.getElementById('game');
        game.style.display = 'none';

        //On vide la grille
        let grille = document.getElementById('grille');
        grille.innerHTML = "";

        //On affiche le menu
        afficherMenu();
    }

    function afficherMenu(){
        document.getElementById('connection').style.display = 'none'; //On cache le menu de login
        document.getElementById('waitingRoom').style.display = 'inline-block'; //On affiche la salle d'attente

        //On affiche un petit message concernant la room
        document.getElementById('infoRoom').innerHTML = "Bienvenue dans la room " + idRoom;
        document.getElementById('infoJoueur').innerHTML = "Joueur : " + nomJoueur + "</br> Victoires : " + nbVictoires;
    }

    return {
        afficherMessage,
        premiereConnexion,
        afficherPartie,
        updateWaitingModale,
        fermerWaitingModale,
        afficherWaitingModale,
        afficherPlateau,
        afficherPositionJoueurPrincipale,
        afficherAdversaire,
        afficherVictoire,
        retourAuMenu,
        afficherPauseModale,
        fermerPauseModale,
        updatePauseModale,
    }
}