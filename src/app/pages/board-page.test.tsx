import renderer from "react-test-renderer";
import { Stage } from "../state";
import { BoardPage } from "./board-page";
import { AppState } from "../state";
import * as AutomergeState from "../state/automerge-state";

describe("Test board view", () => {
  test("BoardView should render", () => {
    const getAppStateMock = jest.spyOn(AutomergeState, "getAppState");
    getAppStateMock.mockImplementation(() => ({}) as AppState);
    const component = renderer.create(
      <BoardPage columnsData={{}} stage={Stage.AddTickets} />,
    );
    expect(component).toBeDefined();
  });
});
