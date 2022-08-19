import { WEB_SOCKET_URL } from "./constants";

const socket = new WebSocket(WEB_SOCKET_URL);

export const wsConnection = {
  sendMessage: (data: any) => {
    socket.send(JSON.stringify(data));
  },

  addListener: (listener: any) => {
    socket.addEventListener("message", listener);
  },

  removeListener: (listener: any) => {
    socket.removeEventListener("message", listener);
  },
};
