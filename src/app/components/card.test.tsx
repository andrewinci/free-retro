import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import renderer from "react-test-renderer";
import { CardGroup, Card } from ".";

describe("Test card component", () => {
  test("CardGroup should render with no cards", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <CardGroup></CardGroup>
      </DndProvider>,
    );
    expect(component).toBeDefined();
  });

  test("CardGroup should render", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <CardGroup>
          <Card id="1" text="test 1" />
          <Card id="2" text="test 2" />
        </CardGroup>
      </DndProvider>,
    );
    expect(component).toBeDefined();
  });
});
