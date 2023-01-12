 class Adversaire {
    constructor(login , position) {
        // utilisateurs dans la room
        this.login = login;
        this.position = position;
    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position = position;
    }
}