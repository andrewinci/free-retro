import renderer from "react-test-renderer";
import EndRetroView from "./end-view";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";

describe("Test end retro view", () => {
  it("should render", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <EndRetroView actions={{}} sessionId="123" />
      </DndProvider>
    );
    expect(component).toBeDefined();
  });
});
