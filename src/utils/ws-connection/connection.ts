import { WEB_SOCKET_URL } from './constants';

class WsConnection {
  private socket: WebSocket;
  get webSocket() {
    return this.socket;
  }

  private webSocketConnected: Promise<void>;

  constructor() {
    this.socket = new WebSocket(WEB_SOCKET_URL);
    this.webSocketConnected = new Promise<void>((resolve) => {
      this.socket.addEventListener('open', () => {
        resolve();
      });
    });
  }

  async sendMessage(data: any) {
    await this.webSocketConnected;
    this.socket.send(JSON.stringify(data));
  }

  async addListener(listener: any) {
    await this.webSocketConnected;
    this.socket.addEventListener('message', listener);
  }

  async removeListener(listener: any) {
    await this.webSocketConnected;
    this.socket.removeEventListener('message', listener);
  }
}

export const wsConnection = new WsConnection();
