class plateau{
    constructor(_size, _length, ctx) {
        this.length = _length;
        this.size = _size;
        this.size_cell = this.length/this.size;
        this.x = 0;
        this.y = 0;
        this.color = "green";
        this.inGame = true;
        this.ctx = ctx;
    }

    //Fonction permettant dafficher a une position donnée un couleur ca permettra update notre position mais aussi celle des autres joueurs
    updatePos(x, y,color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x*this.size_cell,y*this.size_cell,this.size_cell,this.size_cell);
    }

    //draw le plateau initial
    drawAll() {
        for(let i=0;i<this.size;++i){
            for(let j=0;j<this.size;++j){
                this.ctx.fillStyle = "darkblue";
                this.ctx.fillRect(i*this.size_cell,j*this.size_cell,this.size_cell,this.size_cell);
            }
        }
    }

    //Permet de donner les position du joueur en local pour le demarage de la partie
    initPlayer(_x,_y,_color){
        this.x = _x;
        this.y = _y;
        this.color = _color;

    }
}