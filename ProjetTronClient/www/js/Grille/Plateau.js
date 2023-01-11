class Plateau {
    constructor(size_plateau) {
        console.log('coucou');
        this.cases = [];
        this.murs  = [];
        let valeur = 1;
        for(let i = 0; i <= size_plateau; i++) {
            let line = []
            for (let j =0; j <= size_plateau; j++) {
                let one_case = new Case(i, j, valeur);
                line.push(one_case);
                valeur++;
            }
            this.cases.push(line);
        }
    }

    getCases() {
        return this.cases;
    }

    getMurs() {
        return this.murs;
    }
}