module.exports = {
    User: class {
        constructor(login, connection) {
            // utilisateurs dans la room
            this.login = login;
            this.connection = connection;
            this.current_room_id = null;
        }

        getLogin() {
            return this.login;
        }

        getConnection() {
            return this.connection;
        }

        getCurrentRoomId() {
            return this.current_room_id;
        }

        // ajout une room pour l'utilisateur
        setCurrentRoomId(room_id) {
            this.current_room_id = room_id;
        }

        removeCurrentRoomId()
        {
            // this.setCurrentRoomId(null);
        }
    }
}