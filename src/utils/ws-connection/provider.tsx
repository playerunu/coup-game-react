import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { WEB_SOCKET_URL } from "./constants";
import { WsConnection } from "./types";

export const WsConnectionContext = React.createContext<
  WsConnection | undefined
>(undefined);

export const WsConnectionProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const [webSocket, setWebSocket] = useState<WebSocket>();
  const [wsConnection, setWsConnection] = useState<WsConnection>();

  useEffect(() => {
    const connection = new WebSocket(WEB_SOCKET_URL);
    connection.addEventListener("open", () => {
      setWebSocket(connection);
    });

    connection.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      console.log("RECEIVED " + payload);

      //dispatch(updateChatLog(payload));
    });
    const wsConnection: WsConnection = {
      sendMessage: (data: any) => {
        webSocket && webSocket.send(JSON.stringify(data));
      },
    };

    setWsConnection(wsConnection);
  }, [webSocket]);

  return (
    <WsConnectionContext.Provider value={wsConnection}>
      {children}
    </WsConnectionContext.Provider>
  );
};
