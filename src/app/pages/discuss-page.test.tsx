import { Counter } from "@automerge/automerge";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";
import renderer from "react-test-renderer";
import { DiscussPage } from "./discuss-page";

describe("Test discuss view", () => {
  it("should render", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <DiscussPage
          cards={[{ cards: {}, votes: { a: new Counter(1) } }]}
          cardIndex={0}
        />
      </DndProvider>,
    );
    expect(component).toBeDefined();
  });
});
