import React from "react";
import renderer from "react-test-renderer";
import JoinRetroView from "./join-retro";

describe("Test join retro view", () => {
  test("JoinRetroView should render", () => {
    const component = renderer.create(<JoinRetroView />);
    expect(component).toBeDefined();
  });
});
