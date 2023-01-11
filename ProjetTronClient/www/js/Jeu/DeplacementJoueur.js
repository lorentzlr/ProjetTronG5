class DeplacementJoueur {
    constructor(direction_initial, plateau, affichage_manager, sendMessageCallback) {
        this.direction = direction_initial;
        this.plateau = plateau;
        this.in_game = true;
        this.affichage_manager = affichage_manager;
        this.sendMessageCallback = sendMessageCallback;
        this.position = {
            x: 15,
            y: 15
        }
    }

    choixDirection(event) {
        event.preventDefault();
        switch (event.key) {
            case "ArrowDown":
                event.currentTarget.user.direction ="down"
                break;
            case "ArrowUp":
                event.currentTarget.user.direction ="up"
                break;
            case "ArrowLeft":
                event.currentTarget.user.direction ="left"
                break;
            case "ArrowRight":
                event.currentTarget.user.direction ="right"
                break;
        }
    }

    // Ajout de l'eventListener pour les flèches directionnelles
    async initialisation() {
        window.addEventListener("keydown", this.choixDirection);
        window.user = this;
        await this.deplacement();
    }

    async deplacement() {
        while (this.in_game) {
            await this.sleep(250);
            switch (this.direction) {
                case "up" :
                    this.position.x--;
                    break;
                case "right" :
                    this.position.y++;
                    break;
                case "down" :
                    this.position.x++;
                    break;
                case "left" :
                    this.position.y--;
                    break;
            }

            let message = {
                type : 'PositionClient',
                postion : {
                    x: this.position.x,
                    y: this.position.y
                }
            };
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