import { io } from "socket.io-client";
import { BASE_URL } from "./config";

class SocketIOService {
  static #socket;
  static #instance;

  constructor() {
    // Private constructor ensures singleton instance
    if (!SocketIOService.#instance) {
      SocketIOService.#instance = this;
    }
    return SocketIOService.#instance;
  }
  initSocket() {
    const host = BASE_URL;
    const options = {
      autoConnect: false,
    };

    SocketIOService.#socket = io(host, options);
    return SocketIOService.#socket;
  }

  connect(userId, clientId) {
    const auth = { userId, clientId };
    SocketIOService.#socket.auth = auth;
    SocketIOService.#socket.connect();
  }

  ready() {
    return SocketIOService.#socket !== null;
  }

  getSocket() {
    if (!SocketIOService.#socket) {
      throw new Error("Socket not initialization");
    }
    return SocketIOService.#socket;
  }
}

class CallSocket {
  static #socket;
  static #instance;

  constructor() {
    // Private constructor ensures singleton instance
    if (!CallSocket.#instance) {
      CallSocket.#instance = this;
    }
    return CallSocket.#instance;
  }
  initSocket() {
    const namespace = "/call";
    const host = `${BASE_URL}${namespace}`;
    const options = {
      autoConnect: false,
    };

    CallSocket.#socket = io(host, options);
    return CallSocket.#socket;
  }

  initAndConnect(userId, roomId) {
    const namespace = "/call";
    const host = `${BASE_URL}${namespace}`;
    const options = {
      retries: 3,
      auth: { userId, roomId },
    };

    CallSocket.#socket = io(host, options);
    return CallSocket.#socket;
  }

  connect(userId, roomId) {
    const auth = { userId, roomId };
    CallSocket.#socket.auth = auth;
    CallSocket.#socket.connect();
  }

  ready() {
    return CallSocket.#socket !== null;
  }

  getSocket() {
    if (!CallSocket.#socket) {
      throw new Error("Socket not initialization");
    }
    return CallSocket.#socket;
  }
}

const instance = new SocketIOService();
Object.freeze(instance);

export const callInstance = new CallSocket();

export default instance;
