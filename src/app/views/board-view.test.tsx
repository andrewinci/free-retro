import renderer from "react-test-renderer";
import { Stage } from "../state";
import BoardView from "./board-view";
import { AppState } from "../state";
import * as AutomergeState from "../state/automerge-state";

describe("Test board view", () => {
  test("BoardView should render", () => {
    const getAppStateMock = jest.spyOn(AutomergeState, "getAppState");
    getAppStateMock.mockImplementation(() => ({} as AppState));
    const component = renderer.create(
      <BoardView columnsData={{}} stage={Stage.AddTickets} />
    );
    expect(component).toBeDefined();
  });
});
