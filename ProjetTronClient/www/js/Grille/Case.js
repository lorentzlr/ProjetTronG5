class Case {
    constructor(position_x, position_y, valeur){
        this.valeur = valeur;
        this.position_x = position_x;
        this.position_y = position_y;
        this.is_a_wall = false;
    }

    isAWall() {
        return this.is_a_wall;
    }

    getValeur() {
        return this.valeur;
    }

    becomeIsAWall() {
        this.is_a_wall = true;
    }
}