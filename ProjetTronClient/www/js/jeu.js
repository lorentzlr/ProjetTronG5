class jeu {
    constructor(plateau, sendMessage, ctx) {
        this.plateau = plateau;
        this.sendMessage = sendMessage;
        this.ctx = ctx;
        this.inGame = true;
    }

    async sleep(ms) {
        // new Promise(r => setTimeout(r, ms));
    }

    //fonction qui va update tout le temps la position du joueur et envoyer un message au serveur
    async execute() {
        var j=0;
        while (this.inGame) {
            this.sendMessage(this.x);
            console.log("banana");
            // this.plateau.updatePos(this.x+mouvement_x,this.y+mouvement_y,this.color)
            // this.x+=mouvement_x;
            // this.y+=mouvement_y;
            //ici rajouter la fonction denvoie pour le serveur
            await this.sleep(2000);
        }
    }
    //permet de stopper le jeu quand le joueur va mourir cela nempeche pas de draw les couelurs adverse pour voir le deroulement de la partie
    stop(){
        this.inGame = false;
    }

    initGame() {
        const sleep = ms => new Promise(r => setTimeout(r, ms));

        var mouvement_x = 0;
        var mouvement_y = 1;

        document.addEventListener("keydown", function(event) {
            // Vérification de la touche appuyée
            if (event.key === "w" && mouvement_x != 0) {
                mouvement_y = -1;
                mouvement_x = 0;

            }
            if (event.key === "s" && mouvement_x != 0) {
                mouvement_y = 1;
                mouvement_x = 0;

            }
            if (event.key === "a" && mouvement_y != 0) {
                mouvement_x = -1;
                mouvement_y = 0;

            }
            if (event.key === "d" && mouvement_y != 0) {
                mouvement_x = 1;
                mouvement_y = 0;

            }
        });
    }
}