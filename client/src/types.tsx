import { DateInput, DateTime, Duration } from "luxon";

export interface User {
  username: string;
  email: string;
  role: string;
  requests: Request[];
  reviews: Review[];
  socketID: string;
  registered: boolean;
}

export interface CallType {
  accepted: boolean;
  ended: boolean;
  incoming: boolean;
  userToCall?: string;
  from: string;
  name: string;
  signal: any;
}

export type Socket = any;

export type Request = {
  _id: string,
  content: string;
  type: string;
  status: string | null;
  sent: boolean,
  helper: string,
  rating: number,
  review: string,
  time: DateTime | Duration | DateInput | null
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
};

export interface Props {
  children: React.ReactNode;
}

export interface PeerNode {
  srcObject: MediaStream;
}

export interface ContextType {
  currentUser?: User;
  setCurrentUser?: React.Dispatch<React.SetStateAction<User>>;
  onlineUsers?: User[];
  stream?: MediaStream;
  call?: CallType;
  setCall?: React.Dispatch<React.SetStateAction<CallType>>;
  currentPage?: string;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
  stroke?: any[];
  setStroke?: React.Dispatch<React.SetStateAction<any[]>>;
  incomingStroke?: any;
  setIncomingStroke?: React.Dispatch<React.SetStateAction<any[]>>;
  request?: any;
  initialFetch?: boolean;
  setRequest?: React.Dispatch<React.SetStateAction<any>>;
  localVideo?: React.MutableRefObject<HTMLVideoElement | null >;
  remoteVideo?: React.MutableRefObject<HTMLVideoElement | null>;
  socket?: Socket;
  callUser?: (userToCall: string) => void;
  answerCall?: () => void;
  leaveCall?: () => void;
  isAuthenticated?: boolean;
  loginWithRedirect?: () => void;
  logout?: (logoutParams: any) => void;
  user?: any;
  handleGetUser?: () => void;
  handleCreateUser?: (event: {
    preventDefault: () => void;
}) => void;
  handleUpdateUser?: () => void;
  handleRequest?: (request: any) => void;
  setStream?: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
}

