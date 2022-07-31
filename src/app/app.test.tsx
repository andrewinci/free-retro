import React from "react";
import renderer from "react-test-renderer";
import { App } from "./app";

describe("Test button components", () => {
  test("App should render", () => {
    const component = renderer.create(<App />);
    expect(component).toBeDefined();
  });
});
