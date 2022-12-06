import { Buffer } from "buffer";

export const toBinaryDocument = (base64: string) => {
  return Uint8Array.from(Buffer.from(base64, "base64")) as Uint8Array;
};
export const toBase64 = (bin: Uint8Array) => {
  return Buffer.from(bin).toString("base64");
};
