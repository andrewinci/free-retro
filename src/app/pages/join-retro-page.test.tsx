import renderer from "react-test-renderer";
import { JoinRetroPage } from "./join-retro-page";

describe("Test join retro view", () => {
  test("JoinRetroView should render", () => {
    const component = renderer.create(<JoinRetroPage />);
    expect(component).toBeDefined();
  });
});
