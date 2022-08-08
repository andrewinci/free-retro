import * as AutomergeState from "./automerge-state";
import { AppState, Stage } from "./model";
import { changeDiscussCard, changeStage } from "./reducers";
import * as Automerge from "automerge";

describe("reducers", () => {
  let mockAppState = Automerge.init<AppState>();
  jest
    .spyOn(AutomergeState, "getAppState")
    .mockImplementation(() => mockAppState);
  jest.spyOn(AutomergeState, "changeState").mockImplementation(async (f) => {
    mockAppState = Automerge.change(mockAppState, (s) => f(s));
  });

  beforeEach(() => {
    mockAppState = Automerge.init<AppState>();
  });

  describe("change discuss card", () => {
    it("should increase the index up to the max number of cards", async () => {
      mockAppState = Automerge.change(mockAppState, (s) => {
        s.columns = [
          {
            groups: [
              { cards: [], votes: {} },
              { cards: [], votes: {} },
              { cards: [], votes: {} },
            ],
            title: "",
          },
        ];
      });
      // act
      for (let i = 0; i < 10; i++) {
        await changeDiscussCard("increment");
      }
      // assert
      expect(mockAppState.discussCardIndex?.value).toBe(2);
    });
    it("should not decrease below zero", async () => {
      mockAppState = Automerge.change(mockAppState, (s) => {
        s.discussCardIndex = new Automerge.Counter(2);
        s.columns = [
          {
            groups: [{ cards: [], votes: {} }],
            title: "",
          },
        ];
      });
      // act
      for (let i = 0; i < 10; i++) {
        await changeDiscussCard("decrement");
      }
      // assert
      expect(mockAppState.discussCardIndex?.value).toBe(0);
    });
  });
  describe("change stage", () => {
    it("should not exceed the Retro.Done", async () => {
      for (let i = 0; i < 20; i++) {
        await changeStage("next");
      }
      // assert
      expect(mockAppState?.stage).toBe(Stage.End);
    });
    it("should not exceed the Retro.Join", async () => {
      mockAppState = Automerge.change(mockAppState, (s) => {
        s.stage = Stage.End;
      });
      for (let i = 0; i < 20; i++) {
        await changeStage("back");
      }
      // assert
      expect(mockAppState?.stage).toBe(Stage.Create);
    });
  });
});
