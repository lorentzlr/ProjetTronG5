module.exports = {
    Room: class {
        constructor(id) {
            // utilisateurs dans la room
            this.users = [];

            // id de la room
            this.id = id;
        }

       getId() {
            return this.id;
        }

        countUsersInRoom() {
            return this.users.length;
        }
    }
}