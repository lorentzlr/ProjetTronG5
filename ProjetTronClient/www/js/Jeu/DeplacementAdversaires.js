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

    changerPositionAdversaire(adversaire_login, position) {
       this.adversaires[adversaire_login].setPosition(position);
       this.deplacerAdversaire(adversaire);
    }


    deplacerAdversaire(adversaire) {
        this.affichage_manager.afficherAdversaire(
            this.plateau.getCases()
                [this.adversaires[adversaire].getPosition().x]
                [this.adversaires[adversaire].getPosition().y].getValeur()
        );
    }
}
