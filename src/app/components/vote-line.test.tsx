import renderer from "react-test-renderer";
import { VotesLine } from "./vote-line";

describe("Test votesLine component", () => {
  test("VotesLine should render", () => {
    const component = renderer.create(<VotesLine />);
    expect(component).toBeDefined();
  });
});
