module.exports = Object.freeze({
    MAX_USERS_PER_ROOM: 4,
    MAX_ROOMS: 8,
    START_POSITIONS: [
        {
            position:
                {
                    x: 25,
                    y: 1
                },
            direction: "right"
        }, {
            position:
                {
                    x: 1,
                    y: 25,
                },
            direction: "down"
        }, {
            position:
                {
                    x: 25,
                    y: 49,
                },
            direction: "left"

        }, {
            position:
                {
                    x: 49,
                    y: 25,
                },
            direction: "up"

        },
    ]
});
