import React from "react";
import renderer from "react-test-renderer";
import { CardGroup } from "./card";

describe("Test card component", () => {
  test("CardGroup should render with no cards", () => {
    const component = renderer.create(<CardGroup cards={[]}></CardGroup>);
    expect(component).toBeDefined();
  });

  test("CardGroup should render", () => {
    const component = renderer.create(
      <CardGroup cards={[{ text: "test1" }, { text: "test2" }]}></CardGroup>
    );
    expect(component).toBeDefined();
  });
});
