import React, { createContext, useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { DateTime, Interval } from 'luxon';
import { getUser, createUser, updateUser, sendRequest } from './lib/ApiService';
import { CallType, ContextType, PeerNode, Props, Request, User } from './types';


const Context = createContext<ContextType>({});

const socket = io(process.env.REACT_APP_SERVER_URL!);

const ContextProvider = ({ children }: Props) => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [currentUser, setCurrentUser] = useState<User>({
    username: '',
    email: '',
    role: 'Helpee',
    requests: [],
    reviews: [],
    socketID: '',
    registered: false,
  });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [call, setCall] = useState<CallType>({
    accepted: false,
    ended: false,
    incoming: false,
    from: '',
    name: '',
    signal: null,
  });
  const [stroke, setStroke] = useState<any[]>([]);
  const [incomingStroke, setIncomingStroke] = useState<any[]>([]);
  const [request, setRequest] = useState<Request>({
    _id: '',
    content: '',
    type: 'Plumbing',
    status: null,
    sent: false,
    helper: '',
    rating: 0,
    review: '',
    time: null,
  });
  const [currentPage, setCurrentPage] = useState('Request');
  const [recipient, setRecipient] = useState('');
  const [initialFetch, setInitialFetch] = useState(false);

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Sets up the video stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      });

    // Updates the online user list
    if (isAuthenticated && currentUser.registered === true) {
      socket.emit('userConnected', { name: currentUser.username });
      socket.on('users', (users) => {
        const usersWithPendingRequests = users.filter((user: { requests: any[]; }) =>
          user.requests.some((request: { status: string; }) => request.status === 'Pending')
        );
        setOnlineUsers(usersWithPendingRequests);
      });
    }

    socket.on('me', (id) => setCurrentUser({ ...currentUser, socketID: id }));

    // Sends a call to the helpee user
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({
        ...call,
        incoming: true,
        from,
        name: callerName,
        signal,
      });
    });

    // Responds to the other user ending the call
    socket.on('callEnded', () => {
      setCall({
        accepted: false,
        ended: true,
        incoming: false,
        from: '',
        name: '',
        signal: null,
      });
      setCurrentPage('Request');
    });

    socket.on('stroke', (stroke) => {
      setIncomingStroke(stroke);
    });
  }, [isAuthenticated, currentUser, user, currentPage, call]);

  useEffect(() => {
    socket.emit('stroke', { recipient, stroke });
  }, [stroke]);

  // Checks if user exists in database
  const handleGetUser = async () => {
    const receivedUser = await getUser({ user });

    setInitialFetch(true);

    if (receivedUser) {
      setCurrentUser({
        ...currentUser,
        username: receivedUser.username,
        email: receivedUser.email,
        role: receivedUser.role,
        requests: receivedUser.requests,
        reviews: receivedUser.reviews,
        registered: true,
      });
    }
  };

  // Creates user in database
  const handleCreateUser = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const receivedUser = await createUser({
      username: currentUser.username,
      email: user?.email,
      role: currentUser.role,
    });

    if (receivedUser) {
      setCurrentUser({
        ...currentUser,
        username: receivedUser.username,
        email: receivedUser.email,
        role: receivedUser.role,
        registered: true,
      });
    }
  };

  // Update user in database
  const handleUpdateUser = async () => {
    setCurrentPage('Request');
    await updateUser({
      socketID: currentUser.socketID,
      username: currentUser.username,
      role: currentUser.role,
    });
  };

  // Send request to database and socket
  const handleRequest = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const userResponse = await sendRequest({
      username: currentUser.username,
      content: request.content,
      type: request.type,
      status: 'Pending',
    });

    const newRequest = userResponse.requests[userResponse.requests.length - 1];

    setRequest({
      ...request,
      _id: newRequest._id,
      sent: true,
      status: 'Pending',
    });

    socket.emit('newRequest', newRequest);
  };

  // Sets up the peer.js connection
  const callUser = (id: React.SetStateAction<string>) => {
    // stun/turn servers might be needed to avoid connection problems, needs investigating
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    setRecipient(id);

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: currentUser.socketID,
        name: currentUser.username,
      });
    });

    peer.on('stream', (currentStream) => {
      if (remoteVideo.current) remoteVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCall({ ...call, accepted: true, incoming: true });
      peer.signal(signal);
    });
  };

  // Accepts the call from the other user
  const answerCall = () => {
    setCall({ ...call, accepted: true });

    setRequest({
      ...request,
      time: DateTime.now(),
    });

    // stun/turn servers might be needed to avoid connection problems, needs investigating
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      console.log(remoteVideo);
      if (remoteVideo.current) {
        const current = remoteVideo.current as PeerNode;
        current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);
  };

  // Ends the call and saves the call time
  const leaveCall = () => {
    socket.emit('leaveCall', {
      recipientID: call.from,
      senderID: currentUser.socketID,
    });

    setRequest({
      ...request,
      helper: call.name,
      time: request.time ? Interval.fromDateTimes(request.time as DateTime, DateTime.now()).toDuration() : null,
    });

    setCall({
      accepted: false,
      ended: true,
      incoming: false,
      from: '',
      name: '',
      signal: null,
    });
  };

  return (
    <Context.Provider
      value={{
        currentUser,
        currentPage,
        isAuthenticated,
        user,
        onlineUsers,
        call,
        localVideo,
        remoteVideo,
        stream,
        incomingStroke,
        request,
        initialFetch,
        setCurrentUser,
        loginWithRedirect,
        logout,
        callUser,
        leaveCall,
        answerCall,
        handleGetUser,
        handleCreateUser,
        handleUpdateUser,

        stroke,
        socket,
        setStroke,
        setCall,
        setIncomingStroke,
        setRequest,
        handleRequest,
        setCurrentPage,
        setStream,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
