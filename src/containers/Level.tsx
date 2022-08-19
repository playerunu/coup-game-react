import React, { useContext, useEffect } from "react";
import { GameTable } from "components/GameTable";
import { GameMessage } from "types/GameMessage";
import { WsConnectionContext } from "utils/ws-connection/provider";

export const Level: React.FC = () => {
  const wsConnection = useContext(WsConnectionContext);

  useEffect(() => {
    if (!!wsConnection) {
      wsConnection.sendMessage({
        messageType: GameMessage[GameMessage.PlayerJoined],
        data: {
          name: Date.now().toString(),
        },
      });
    }
  }, [wsConnection]);

  return <GameTable />;
};
