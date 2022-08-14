import {
  changeState,
  getAppState,
  initAppState,
  onStateChange,
} from "./automerge-state";
import "jest-location-mock";
import { Stage } from "./model";

describe("automerge state manager", () => {
  it("throws if the state is not initialised first", () => {
    expect(getAppState).toThrow();
  });

  it("notifies subscribers when the state changes", async () => {
    // arrange
    initAppState("sessionId", Stage.Create);
    let stateUpdated = false;
    await changeState((s) => (s.retroName = "initial-name"));
    // act
    onStateChange((_) => {
      stateUpdated = true;
    });
    // assert
    await changeState((s) => (s.retroName = "new-name"));
    expect(stateUpdated).toBe(true);
  });
});
