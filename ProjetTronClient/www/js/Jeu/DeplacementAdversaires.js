class DeplacementAdversaires {
    constructor(affichage_manager, adversaires, plateau) {
        this.adversaires = adversaires;
        this.plateau = plateau;
        this.affichage_manager = affichage_manager;
    }

    initPositionAdversaires() {
        for (let adversaire in this.adversaires) {
            this.deplacerAdversaire(adversaire);
        }
    }

    /** Déplace la position d'un adversaire donné dans l'objet qui le représente
     * 
     * @param {*} adversaire_login le login de l'adversaire
     * @param {*} position la position renvoyée par le serveur
     */
    changerPositionAdversaire(adversaire_login, position) {
        this.adversaires[adversaire_login].setPosition(position); //On change sa position
        this.deplacerAdversaire(adversaire_login); //Et on appelle la fonction pour changer l'affichage du jeu
    }

    /** Déplace la position d'un adversaire donné dans l'affichage du jeu en cours
     * 
     * @param {*} adversaire le login de l'adversaire
     */
    deplacerAdversaire(adversaire) {
        //On vient demander à afficher l'adversaire à la nouvelle positions qu'on a fixée dans l'appel de la fonction précédente
        this.affichage_manager.afficherAdversaire(
            this.plateau.getCases()
            [this.adversaires[adversaire].getPosition().x]
            [this.adversaires[adversaire].getPosition().y].getValeur()
        );
    }
}
