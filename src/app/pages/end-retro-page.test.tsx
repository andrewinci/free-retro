import renderer from "react-test-renderer";
import { EndRetroPage } from "./end-retro-page";
import { DndProvider } from "react-dnd";
import { TestBackend } from "react-dnd-test-backend";

describe("Test end retro view", () => {
  it("should render", () => {
    const component = renderer.create(
      <DndProvider backend={TestBackend}>
        <EndRetroPage actions={{}} sessionId="123" />
      </DndProvider>
    );
    expect(component).toBeDefined();
  });
});
