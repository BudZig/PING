"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
// import { ExpressPeerServer } from 'peer';
const User_1 = __importDefault(require("./models/User"));
const app = (0, express_1.default)();
const port = 5000;
const server = http_1.default.createServer(app);
const io = (0, socket_io_1.default)(server, {
    allowEIO3: true,
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   path: '/ping',
// });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(router_1.default);
// app.use('peerjs', peerServer);
io.on('connection', (socket) => {
    console.log(`👽 User ${socket.id} connected 👽`);
    socket.emit('me', socket.id);
    socket.on('userConnected', ({ name }) => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.findOneAndUpdate({ username: name }, { socketID: socket.id, online: true });
        let users = yield User_1.default.find({ online: true });
        io.emit('users', users);
    }));
    socket.on('newRequest', () => __awaiter(void 0, void 0, void 0, function* () {
        let users = yield User_1.default.find({ online: true });
        io.emit('users', users);
    }));
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.findOneAndUpdate({ socket: socket.id }, { socketID: '', online: false });
        let users = yield User_1.default.find({ online: true });
        io.emit('users', users);
        //socket.broadcast.emit('callEnded');
    }));
    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name });
        console.log('callUser', userToCall, signalData, from, name);
    });
    socket.on('answerCall', (data) => {
        console.log('answerCall', data);
        io.to(data.to).emit('callAccepted', data.signal);
    });
    socket.on('stroke', ({ recipient, stroke }) => {
        io.to(recipient).emit('stroke', stroke);
    });
    socket.on('leaveCall', ({ recipientID, senderID }) => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.findOneAndUpdate({ $or: [{ socketID: recipientID }, { socketID: senderID }] }, { $set: { 'requests.$[elem].status': 'Completed' } }, {
            arrayFilters: [{ 'elem.date': { $lte: new Date() } }],
            new: true,
            sort: { 'requests.date': -1 },
        });
        io.to(recipientID).emit('callEnded');
        io.to(senderID).emit('callEnded');
    }));
});
server.listen(port, () => console.log(`🧲 Server running on port ${port} 🧲`));
