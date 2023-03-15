import express, { Application, Request, Response } from 'express';
import router from './router';
import cors from 'cors';
import http from 'http';
import socketio, { Server as SocketServer } from 'socket.io';
// import { ExpressPeerServer } from 'peer';
import User from './models/User';

const app: Application = express();
const port: number = 5000;
const server: http.Server = http.createServer(app);
const io: SocketServer = socketio(server, {
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

app.use(cors());
app.use(express.json());
app.use(router);
// app.use('peerjs', peerServer);

io.on('connection', (socket) => {
  console.log(`👽 User ${socket.id} connected 👽`);
  socket.emit('me', socket.id);

  socket.on('userConnected', async ({ name }) => {
    await User.findOneAndUpdate(
      { username: name },
      { socketID: socket.id, online: true },
    );

    let users = await User.find({ online: true });
    io.emit('users', users);
  });

  socket.on('newRequest', async () => {
    let users = await User.find({ online: true });
    io.emit('users', users);
  });

  socket.on('disconnect', async () => {
    await User.findOneAndUpdate(
      { socket: socket.id },
      { socketID: '', online: false },
    );
    
    let users = await User.find({ online: true });
    io.emit('users', users);
    //socket.broadcast.emit('callEnded');
  });

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

  socket.on('leaveCall', async ({ recipientID, senderID }) => {
    await User.findOneAndUpdate(
      { $or: [{ socketID: recipientID }, { socketID: senderID }] },
      { $set: { 'requests.$[elem].status': 'Completed' } },
      {
        arrayFilters: [{ 'elem.date': { $lte: new Date() } }],
        new: true,
        sort: { 'requests.date': -1 },
      }
    );
    io.to(recipientID).emit('callEnded');
    io.to(senderID).emit('callEnded');
  });
});

server.listen(port, () => console.log(`🧲 Server running on port ${port} 🧲`));

export default app;