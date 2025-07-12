/**
 * WebSocket Socket.io
 */
const socket = require('socket.io')({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    allowEIO3: true,
    pingInterval: 10000,
    pingTimeout: 5000,
    maxHttpBufferSize: 1e6,
    perMessageDeflate: false,
});

let sockets = []
let connectedUser = {}
socket.on('connection', (socket) => {
    console.log('connected', socket.id)
    let user
    if (socket?.handshake?.query?.user) {
        user = socket.handshake.query.user
    }
    if (user) {
        connectedUser[user] = socket.id
        console.log(`🏠 현재 소켓 연결 유저수: ${Object.keys(connectedUser).length}`)
    }

    sockets.push(socket)

    socket.on('message', (msg) => {
        socket.emit('message', msg)
    });

    socket.on('join', (room) => {
        console.log(`클라이언트가 ${room}에 조인`)
        socket.join(room)
    })

    socket.on('leave', (room) => {
        console.log(`클라이언트가 ${room}에서 나감`)
        socket.leave(room)
    })

    socket.on("ping", (timestamp) => {
        const latency = Date.now() - timestamp;
        console.log(`[${socket.id}] Ping Latency: ${latency}ms`);
        socket.emit("pong", latency);
    });


    socket.on('disconnect', () => {
        console.log('disconnected', socket.id)
        if (user && connectedUser[user]) {
            delete connectedUser[user]
        }
        console.log(`🏠 현재 소켓 연결 유저수: ${Object.keys(connectedUser).length}`)
        sockets = sockets.filter((e) => e.id !== socket.id)
    });

    socket.on('error', (error) => { //에러 시
        console.error('socket.io Error : ', error);
    });
})

socket.send = (e, data) => {
    socket.emit(e, data)
}

module.exports = socket