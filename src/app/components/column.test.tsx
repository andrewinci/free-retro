import { DndProvider } from "react-dnd";
import renderer from "react-test-renderer";
import { Column } from "./column";
import { TestBackend } from "react-dnd-test-backend";

describe("Test column components", () => {
  test("Column should render", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <Column title="column title"></Column>
      </DndProvider>,
    );
    expect(component).toBeDefined();
  });
});
