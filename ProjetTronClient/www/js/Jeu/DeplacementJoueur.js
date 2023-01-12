class DeplacementJoueur {
    constructor(direction_initial, plateau, affichage_manager, sendMessageCallback, position_initiale) {
        this.direction = direction_initial;
        this.plateau = plateau;
        this.in_game = true;
        this.affichage_manager = affichage_manager;
        this.sendMessageCallback = sendMessageCallback;
        this.position = position_initiale;
    }

    choixDirection(event) {
        event.preventDefault();
        switch (event.key) {
            case "ArrowDown":
                event.currentTarget.user.direction = "down"
                break;
            case "ArrowUp":
                event.currentTarget.user.direction = "up"
                break;
            case "ArrowLeft":
                event.currentTarget.user.direction = "left"
                break;
            case "ArrowRight":
                event.currentTarget.user.direction = "right"
                break;
        }
    }

    // Ajout de l'eventListener pour les flèches directionnelles
    async initialisation() {
        window.addEventListener("keydown", this.choixDirection);
        window.user = this;
        await this.deplacement(login);
    }

    async deplacement(login) {
        let direction_x = 0;
        let direction_y = 0;
        while (this.in_game) {
            await this.sleep(250);

            //Avant de faire le déplacement du joueur, on va transformer sa position actuelle en mur
            let caseActuelle = this.plateau.getCases()[this.position.x][this.position.y];
            caseActuelle.becomeWall();

            //Ensuite, on regarde quelle est la direction indiquée par le joueur pour actualiser la position de sa moto
            switch (this.direction) {
                case "up":
                    if (direction_x != 1) {
                        direction_y = 0;
                        direction_x = -1;
                    }
                    break;
                case "right":
                    if (direction_y != -1) {
                        direction_y = 1;
                        direction_x = 0;
                    }
                    break;
                case "down":
                    if (direction_x != -1) {
                        direction_y = 0;
                        direction_x = 1;
                    }
                    break;
                case "left":
                    if (direction_y != 1) {
                        direction_y = -1;
                        direction_x = 0;
                    }
                    break;
            }

            this.position.x += direction_x;
            this.position.y += direction_y;
            let message = {}

            //Si le joueur avance sur une case qui est un mur
            if (this.plateau.getCases()[this.position.x][this.position.y].isAWall()) {
                message = {
                    type: 'PositionClient',
                    login: login,
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    isAlive: false //On indique au serveur qu'on est mort
                };

                this.in_game = false; //On stoppe le joueur

                //On affiche quelques infos et le bouton de retour au menu
                document.getElementById('retourMenu').style.display = 'inline-block';
                document.getElementById('infosJeuCourant').innerHTML = "Partie terminée !"
                let retourMenu = document.querySelector("#retourMenu p"); 
                retourMenu.innerHTML = "Vous avez perdu ! Revenir au menu : "
            
            } else { //Dans le cas où la case est libre, on envoie la position et isAlive reste true
                message = {
                    type: 'PositionClient',
                    login: login,
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    isAlive: true
                };
            }

            this.sendMessageCallback(message);

            this.affichage_manager.afficherPositionJoueurPrincipale(
                this.plateau.getCases()[this.position.x][this.position.y].getValeur()
            );
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}