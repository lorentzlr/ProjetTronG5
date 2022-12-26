module.exports = {
    User: class {
        constructor(login) {
            // utilisateurs dans la room
            this.login = login;
        }

        getLogin() {
            return this.login;
        }
    }
}