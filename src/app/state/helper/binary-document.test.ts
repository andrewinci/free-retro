import { toBase64, toBinaryDocument } from "./binary-document";
import * as Automerge from "automerge";

describe("base64 to binaryDocumnet converter", () => {
  test("round trip", () => {
    // arrange
    type Test = {
      a: string;
    };
    // perform a change
    let doc = Automerge.init<Test>();
    doc = Automerge.change(doc, (s) => (s.a = "test"));
    const expected = Automerge.save(doc);
    // act
    const res = toBinaryDocument(toBase64(expected));
    // assert
    expect(res).toEqual(expected);
  });
});
