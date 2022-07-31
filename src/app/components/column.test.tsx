import React from "react";
import renderer from "react-test-renderer";
import { Column, ColumnContainer } from "./column";

describe("Test column components", () => {
  test("Column should render", () => {
    const component = renderer.create(<Column title="column title"></Column>);
    expect(component).toBeDefined();
  });
  test("ColumnContainer should render", () => {
    const component = renderer.create(
      <ColumnContainer>
        <Column title="column title" />
      </ColumnContainer>
    );
    expect(component).toBeDefined();
  });
});
