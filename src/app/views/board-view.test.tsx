import renderer from "react-test-renderer";
import { Stage } from "../state";
import BoardView from "./board-view";

describe("Test board view", () => {
  test("BoardView should render", () => {
    const component = renderer.create(
      <BoardView columnsData={[]} stage={Stage.AddTickets} />
    );
    expect(component).toBeDefined();
  });
});
