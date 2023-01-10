
class plateau{

    constructor(_size, _length){
        this.length = _length;
        this.size = _size;
        this.size_cell = this.length/this.size;
        this.x = 0;
        this.y = 0;
        this._color = "green";
        this.inGame = true;
        
    }


    //draw le plateau initial
    drawAll() {
    
        for(let i=0;i<this.size;++i){
            for(let j=0;j<this.size;++j){
                ctx.fillStyle = "darkblue";
                ctx.fillRect(i*this.size_cell,j*this.size_cell,this.size_cell,this.size_cell);

            }     
        }
    }
    //Fonction permettant dafficher a une position donnée un couleur ca permettra update notre position mais aussi celle des autres joueurs
    updatePos(x, y,color){
        ctx.fillStyle = color;
        ctx.fillRect(x*this.size_cell,y*this.size_cell,this.size_cell,this.size_cell);

        
    }

    //Permet de donner les position du joueur en local pour le demarage de la partie
    initPlayer(_x,_y,_color){
        this.x = _x;
        this.y = _y;
        this.color = _color;
        
    }
    //fonction qui va update tout le temps la position du joueur et envoyer un message au serveur
    async execute() {
        var j=0;
        while (this.inGame) {

            Plateau.updatePos(this.x+mouvement_x,this.y+mouvement_y,this.color)
            this.x+=mouvement_x;
            this.y+=mouvement_y;
            //ici rajouter la fonction denvoie pour le serveur

            // let message = {
            //     "name" : 'FirstConnection',
            //     "position" : {
            //         x : this.x,
            //         y : this.y,
            //     },
            //     "color" : this.color,
            //     "IDRoom" : 1 
            // };
            // SocketManager.sendMessage(message)
            await sleep(50);
        }
    }
    //permet de stopper le jeu quand le joueur va mourir cela nempeche pas de draw les couelurs adverse pour voir le deroulement de la partie
    stop(){
        this.inGame = false;
    }

    play(){
        this.inGame = true;
    }



}



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


  
var size_tableau=40;
var length = 800;

const canvas = document.getElementById('canvas');
canvas.width = length;
canvas.height = length;
const ctx = canvas.getContext('2d');

var Plateau = new plateau(size_tableau, length);
// Plateau.initPlayer(5,5,"Red");
// Plateau.updatePos(5,5,"Red");
// Plateau.drawAll();
// Plateau.execute();
// Plateau.stop();
