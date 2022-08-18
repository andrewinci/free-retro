import { WebSocket } from "mock-socket";
global.WebSocket = WebSocket;
jest.useFakeTimers();
jest.spyOn(global, "setInterval");
jest.spyOn(global, "setTimeout");
