import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import renderer from "react-test-renderer";
import { CardGroup } from "./card";

describe("Test card component", () => {
  test("CardGroup should render with no cards", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <CardGroup cards={[]}></CardGroup>
      </DndProvider>
    );
    expect(component).toBeDefined();
  });

  test("CardGroup should render", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <CardGroup cards={[{ text: "test1" }, { text: "test2" }]}></CardGroup>
      </DndProvider>
    );
    expect(component).toBeDefined();
  });
});
