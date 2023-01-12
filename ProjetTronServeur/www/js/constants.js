module.exports = Object.freeze({
    MAX_USERS_PER_ROOM: 2,
    MAX_ROOMS: 8,
    START_POSITIONS: [
        {
            position:
                {
                    x: 3,
                    y: 3
                },
            direction: "right"
        }, {
            position:
                {
                    x: 13,
                    y: 3,
                },
            direction: "down"
        }, {
            position:
                {
                    x: 3,
                    y: 13,
                },
            direction: "left"

        }, {
            position:
                {
                    x: 13,
                    y: 13,
                },
            direction: "up"

        },
    ]
});
