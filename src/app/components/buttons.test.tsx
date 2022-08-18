import renderer from "react-test-renderer";
import {
  AddButton,
  CloseButton,
  ButtonContainer,
  LeftArrowButton,
  RightArrowButton,
} from "./buttons";

describe("Test button components", () => {
  test("EmptyButton should render", () => {
    const component = renderer.create(<ButtonContainer></ButtonContainer>);
    expect(component).toBeDefined();
  });
  test("AddButton should render", () => {
    const component = renderer.create(<AddButton></AddButton>);
    expect(component).toBeDefined();
  });
  test("RightArrowButton should render", () => {
    const component = renderer.create(<RightArrowButton></RightArrowButton>);
    expect(component).toBeDefined();
  });
  test("LeftArrowButton should render", () => {
    const component = renderer.create(<LeftArrowButton></LeftArrowButton>);
    expect(component).toBeDefined();
  });
  test("CloseButton should render", () => {
    const component = renderer.create(<CloseButton></CloseButton>);
    expect(component).toBeDefined();
  });
});
