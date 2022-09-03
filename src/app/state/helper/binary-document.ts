import { BinaryDocument } from "automerge";
import { Buffer } from "buffer";

export const toBinaryDocument = (base64: string) => {
  return Uint8Array.from(Buffer.from(base64, "base64")) as BinaryDocument;
};
export const toBase64 = (bin: BinaryDocument) => {
  return Buffer.from(bin).toString("base64");
};
