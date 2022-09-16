import React, { useEffect, useState } from 'react';
import { WEB_SOCKET_URL } from './constants';
import { WsConnection } from './types';

export const WsConnectionContext = React.createContext<
  WsConnection | undefined
>(undefined);

type WsConnectionProviderProps = {
  children: React.ReactNode;
};

export const WsConnectionProvider: React.FC<WsConnectionProviderProps> = ({
  children,
}) => {
  const [webSocketConnection, setWebSocketConnection] =
    useState<WsConnection>();

  useEffect(() => {
    const socket = new WebSocket(WEB_SOCKET_URL);
    socket.addEventListener('open', () => {
      const wsConnection: WsConnection = {
        sendMessage: (data: any) => {
          socket.send(JSON.stringify(data));
        },
      };
      setWebSocketConnection(wsConnection);
    });

    socket.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data);
      console.log('RECEIVED ' + payload);
    });
  }, []);

  return (
    <WsConnectionContext.Provider value={webSocketConnection}>
      {children}
    </WsConnectionContext.Provider>
  );
};
