import renderer from "react-test-renderer";
import { TextArea } from "./textarea";

describe("Test textArea component", () => {
  test("TextArea should render", () => {
    const component = renderer.create(<TextArea />);
    expect(component).toBeDefined();
  });
});
