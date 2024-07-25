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

const instance = new SocketIOService();
Object.freeze(instance);

export default instance;
