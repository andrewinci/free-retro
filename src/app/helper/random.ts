import { v4 as uuidv4 } from "uuid";

const colors = [
  "#bcf5cc",
  "#f7e5a8",
  "#f7c3a8",
  "#a8f7ef",
  "#aba8f7",
  "#e5a8ff",
  "#ffa8d1",
];

export const randomColor = () =>
  colors[Math.floor(Math.random() * colors.length)];

export const randomId = () => uuidv4();
