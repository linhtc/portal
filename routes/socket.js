module.exports = function (io) {
    var app = require('express');
    var router = app.Router();

    io.path('/connect-jump');

    // set allow origins domain
    io.set('origins', 'http://localhost:3000/games:*');
    // io.origins(['http://localhost:3000:*']);

    // io.origins((origin, callback) => {
    //     console.log('socket.io: origin ' + origin);
    //     //console.log('socket.io: callback' + callback);
    //     if (origin !== 'http://localhost:3000/games:*') {
    //         console.log(origin);
    //         return callback('origin not allowed', false);
    //     }
    //     console.log('TRUE');
    //     callback(null, true);
    // });

    io.on('connection', function (socket) {
        console.log('socket.io: Client connection');

        systemLog.write("run", "socketio", "socket.id " + socket.id);

        socket.on('connectGame', function (data) {
            console.log(data);

            var data_return = {
                code: 200,
                message: "connectGame -> success",
                status: 1,
                data: {
                    playId: socket.id,
                }
            };
            data_return = JSON.stringify(data_return);

            socket.emit('readyGame', data_return);
        });

        socket.on('joinPlayGame', function (data) {
            console.log(data);
            systemLog.write("run", data.oaId + "-" + data.uId + "-" + data.campaignId + "-" + data.playId, "joinPlayGame | socket.id  " + socket.id);

            var data_return = {
                code: 200,
                message: "joinPlayGame -> success",
                status: 1,
                data: {
                    game: {
                        id: 1000000
                    },
                    items: {
                        total: 2,
                        detail: [
                            {
                                id: 1,
                                name: '1',
                                absolute: [12.5, 15.6],
                            },
                            {
                                id: 2,
                                name: '2',
                                absolute: [12.5, 15.6],
                            }
                        ]
                    }
                }
            };
            data_return = JSON.stringify(data_return);

            io.sockets.in(socket.id).emit('listenConnectGame', data_return);
        });

        socket.on('collectData', function (data) {
            console.log(data);
            systemLog.write("run", data.oaId + "-" + data.uId + "-" + data.campaignId + "-" + data.playId, "collectData | socket.id  " + socket.id);

            var data_return = {
                code: 201,
                message: "collectData -> success",
                status: 1,
                data: {
                    data
                }
            };
            data_return = JSON.stringify(data_return);

            io.sockets.in(socket.id).emit('listenConnectGame', data_return);
        });

    });

    router.get('/send-message', function (req, res) {
        var id = req.query.id;

        var data_return = {
            code: 300,
            message: "Send message -> success",
            status: 1,
            data: {}
        };
        data_return = JSON.stringify(data_return);

        io.sockets.in(id).emit('listenConnectGame', data_return);
        return res.send({ status: 1, value: 'success' });
    });

    return router;
}