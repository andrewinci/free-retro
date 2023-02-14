import { arrToRecord, migrateState } from "./mapper";
import * as Automerge from "@automerge/automerge";
import { AppStateV0 } from "./model-v0";
import {
  randomId,
  toBase64,
  toBinaryDocument,
} from "../../../app/state/helper";
import { AppState } from "../../../app/state";

describe("array to Record", () => {
  it("ignores undefined", () => {
    expect(arrToRecord(undefined)).toBeUndefined();
  });
  it("returns an empty object for an empty array", () => {
    expect(arrToRecord([])).toStrictEqual({});
  });
  it("maps array to records", () => {
    const arr: [string, number][] = [
      ["1", 1],
      ["2", 2],
      ["3", 3],
    ];
    expect(arrToRecord(arr)).toStrictEqual({
      1: 1,
      2: 2,
      3: 3,
    });
  });
  it("uses the last value when there are duplicates", () => {
    const arr: [string, number][] = [
      ["1-2-3-4", 1],
      ["1-2-3-4", 2],
    ];
    expect(arrToRecord(arr)).toStrictEqual({ ["1-2-3-4"]: 2 });
  });
  it("works with nested objects", () => {
    type User = { name: string; surname: string; age: number };
    const arr: [string, User][] = [
      ["user-1", { name: "user namer", surname: "sur", age: 32 }],
      ["user-2", { name: "test", surname: "sur-test", age: 19 }],
    ];
    expect(arrToRecord(arr)).toStrictEqual({
      ["user-1"]: { name: "user namer", surname: "sur", age: 32 },
      ["user-2"]: { name: "test", surname: "sur-test", age: 19 },
    });
  });
  it("dedup nested objects", () => {
    type User = { name: string; surname: string; age: number };
    const arr: [string, User][] = [
      ["1", { name: "user namer", surname: "sur", age: 32 }],
      ["1", { name: "test", surname: "sur-test", age: 19 }],
    ];
    expect(arrToRecord(arr)).toStrictEqual({
      ["1"]: { name: "test", surname: "sur-test", age: 19 },
    });
  });
});

describe("migrate state", () => {
  it("migrates an empty state", () => {
    const empty = Automerge.init<AppStateV0>();
    const rawState = toBase64(Automerge.save(empty));
    expect(migrateState(rawState)).toBeDefined();
  });
  // it("migrates columns with empty groups and no votes", () => {
  //   let state = Automerge.init<AppStateV0>();
  //   state = Automerge.change(state, (s) => {
  //     s.columns = [
  //       {
  //         id: "1-1",
  //         title: "col1-title",
  //         groups: [
  //           {
  //             cards: [
  //               {
  //                 id: "card-2",
  //                 originColumn: "3",
  //                 ownerId: "u1",
  //                 text: "123",
  //                 color: "red",
  //               },
  //             ],
  //             id: "g-1",
  //             votes: {
  //               u1: new Automerge.Counter(1),
  //               u2: new Automerge.Counter(2),
  //             },
  //           },
  //           {
  //             title: "Yo!",
  //             cards: [
  //               {
  //                 id: "card-2",
  //                 originColumn: "1",
  //                 ownerId: "u2",
  //                 text: "",
  //                 color: "red",
  //               },
  //             ],
  //             id: "g-2",
  //             votes: {},
  //           },
  //         ],
  //       },
  //     ];
  //   });
  //   const rawState = toBase64(Automerge.save(state));
  //   // act
  //   const newState = Automerge.load<AppState>(
  //     toBinaryDocument(migrateState(rawState))
  //   );
  //   expect(newState).toStrictEqual({
  //     columns: {
  //       "1-1": {
  //         title: "col1-title",
  //         groups: {
  //           "g-1": {
  //             cards: {
  //               "card-2": {
  //                 originColumn: "3",
  //                 ownerId: "u1",
  //                 text: "123",
  //               },
  //             },
  //             votes: {
  //               u1: new Automerge.Counter(1),
  //               u2: new Automerge.Counter(2),
  //             },
  //           },
  //           "g-2": {
  //             title: "Yo!",
  //             cards: {
  //               "card-2": {
  //                 originColumn: "1",
  //                 ownerId: "u2",
  //                 text: "",
  //                 color: "red",
  //               },
  //             },
  //             votes: {},
  //           },
  //         },
  //       },
  //     },
  //   });
  // });
  // it("migrates columns with no groups", () => {
  //   let state = Automerge.init<AppStateV0>();

  //   state = Automerge.change(state, (s) => {
  //     s.columns = [
  //       { id: "1-1", title: "col1-title", groups: [] },
  //       { id: "1-2", title: "col2-title", groups: [] },
  //       { id: "1-3", title: "col3-title", groups: [] },
  //     ];
  //   });
  //   const rawState = toBase64(Automerge.save(state));
  //   // act
  //   const newState = Automerge.load<AppState>(
  //     toBinaryDocument(migrateState(rawState))
  //   );
  //   expect(newState).toStrictEqual({
  //     columns: {
  //       "1-1": { title: "col1-title", groups: {} },
  //       "1-2": { title: "col2-title", groups: {} },
  //       "1-3": { title: "col3-title", groups: {} },
  //     },
  //   });
  // });
  // it("migrates empty columns", () => {
  //   let state = Automerge.init<AppStateV0>();

  //   state = Automerge.change(state, (s) => {
  //     s.columns = [];
  //   });
  //   const rawState = toBase64(Automerge.save(state));
  //   // act
  //   const newState = Automerge.load<AppState>(
  //     toBinaryDocument(migrateState(rawState))
  //   );
  //   expect(newState).toStrictEqual({
  //     columns: {},
  //   });
  // });
  // it("migrates empty actions list", () => {
  //   let state = Automerge.init<AppStateV0>();

  //   state = Automerge.change(state, (s) => {
  //     s.actions = [];
  //   });
  //   const rawState = toBase64(Automerge.save(state));
  //   // act
  //   const newState = Automerge.load<AppState>(
  //     toBinaryDocument(migrateState(rawState))
  //   );
  //   expect(newState).toStrictEqual({
  //     actions: {},
  //   });
  // });
  // it("migrates actions", () => {
  //   let state = Automerge.init<AppStateV0>();

  //   state = Automerge.change(state, (s) => {
  //     s.actions = [
  //       { id: "1.0", date: "date1", done: true, text: "action 1" },
  //       { id: "2.0", date: "date2", done: false, text: "action 2" },
  //     ];
  //   });
  //   const rawState = toBase64(Automerge.save(state));
  //   // act
  //   const newState = Automerge.load<AppState>(
  //     toBinaryDocument(migrateState(rawState))
  //   );
  //   expect(newState).toStrictEqual({
  //     actions: {
  //       "1.0": { date: "date1", done: true, text: "action 1" },
  //       "2.0": { date: "date2", done: false, text: "action 2" },
  //     },
  //   });
  // });

  it("migrates unchanged fields", () => {
    let state = Automerge.init<AppStateV0>();
    const sessionId = randomId();
    state = Automerge.change(state, (s) => {
      s.stage = 1;
      s.discussCardIndex = new Automerge.Counter(3);
      s.sessionId = sessionId;
      s.retroName = "Test retro name";
    });
    const rawState = toBase64(Automerge.save(state));
    // act
    const newState = Automerge.load<AppState>(
      toBinaryDocument(migrateState(rawState))
    );
    expect(newState).toStrictEqual({
      stage: 1,
      discussCardIndex: new Automerge.Counter(3),
      sessionId: sessionId,
      retroName: "Test retro name",
    });
  });
});
