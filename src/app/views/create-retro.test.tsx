import renderer from "react-test-renderer";
import CreateRetroView from "./create-retro";

describe("Test create retro view", () => {
  test("CreateRetroView should render", () => {
    const component = renderer.create(<CreateRetroView />);
    expect(component).toBeDefined();
  });
});
