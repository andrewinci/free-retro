import renderer from "react-test-renderer";
import { CreateRetroPage } from "./create-retro-page";

describe("Test create retro view", () => {
  test("CreateRetroView should render", () => {
    const component = renderer.create(<CreateRetroPage />);
    expect(component).toBeDefined();
  });
});
