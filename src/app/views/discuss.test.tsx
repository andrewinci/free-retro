import { Counter } from "automerge";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import renderer from "react-test-renderer";
import DiscussView from "./discuss";

describe("Test discuss view", () => {
  it("should render", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <DiscussView
          cards={[{ cards: [], votes: { a: new Counter(1) } }]}
          index={0}
        />
      </DndProvider>
    );
    expect(component).toBeDefined();
  });
});
