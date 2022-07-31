import React from "react";
import renderer from "react-test-renderer";
import { TextArea } from "./textarea";

describe("Test button components", () => {
  test("TextArea should render", () => {
    const component = renderer.create(<TextArea />);
    expect(component).toBeDefined();
  });
});
