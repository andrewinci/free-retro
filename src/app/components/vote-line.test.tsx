import React from "react";
import renderer from "react-test-renderer";
import { VotesLine } from "./vote-line";

describe("Test button components", () => {
  test("VotesLine should render", () => {
    const component = renderer.create(<VotesLine />);
    expect(component).toBeDefined();
  });
});
