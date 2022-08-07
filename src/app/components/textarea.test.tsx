/**
 * @jest-environment jsdom
 */

import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import { TextArea } from "./textarea";

describe("textArea", () => {
  it("should render", () => {
    const component = renderer.create(<TextArea />);
    expect(component).toBeDefined();
  });

  it("should trigger textChange after every letter if reduceTextChangeUpdates=false", () => {
    const mockFunction = jest.fn();
    const div = document.createElement("div");
    ReactDOM.render(
      <TextArea
        text={"sample"}
        onTextChange={(t) => mockFunction(t)}></TextArea>,
      div
    );

    const input = div.children[0] as HTMLTextAreaElement;
    ["t", "e", "s", "t", " ", "1", "2", "3"]
      .map((key) => new KeyboardEvent("keyup", { bubbles: true, key: key }))
      .map((e) => input.dispatchEvent(e));

    expect(mockFunction).toBeCalledTimes(8);
  });
  it("should trigger textChange only if change focus or a space is typed when reduceTextChangeUpdates=true", () => {
    const mockFunction = jest.fn();
    const div = document.createElement("div");
    ReactDOM.render(
      <TextArea
        reduceTextChangeUpdates={true}
        text={"sample"}
        onTextChange={(t) => mockFunction(t)}></TextArea>,
      div
    );

    const input = div.children[0] as HTMLTextAreaElement;
    ["t", "e", "s", "t", " ", "1", "2", "3"]
      .map((key) => new KeyboardEvent("keyup", { bubbles: true, key: key }))
      .map((e) => input.dispatchEvent(e));
    input.blur();
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    input.dispatchEvent(new Event("focusout", { bubbles: true }));
    // 2: one time for the space and 1 time for the blur
    expect(mockFunction).toBeCalledTimes(2);
  });
  it("should not trigger textChange if readonly - reduceTextChangeUpdates=true", () => {
    const mockFunction = jest.fn();
    const div = document.createElement("div");
    ReactDOM.render(
      <TextArea
        reduceTextChangeUpdates={true}
        text={"sample"}
        onTextChange={(t) => mockFunction(t)}
        readOnly={true}></TextArea>,
      div
    );

    const input = div.children[0] as HTMLTextAreaElement;
    ["t", "e", "s", "t", " ", "1", "2", "3"]
      .map((key) => new KeyboardEvent("keyup", { bubbles: true, key: key }))
      .map((e) => input.dispatchEvent(e));
    input.blur();
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    input.dispatchEvent(new Event("focusout", { bubbles: true }));
    expect(mockFunction).toBeCalledTimes(0);
  });
  it("should not trigger textChange if readonly - reduceTextChangeUpdates=false", () => {
    const mockFunction = jest.fn();
    const div = document.createElement("div");
    ReactDOM.render(
      <TextArea
        text={"sample"}
        onTextChange={(t) => mockFunction(t)}
        readOnly={true}></TextArea>,
      div
    );

    const input = div.children[0] as HTMLTextAreaElement;
    ["t", "e", "s", "t", " ", "1", "2", "3"]
      .map((key) => new KeyboardEvent("keyup", { bubbles: true, key: key }))
      .map((e) => input.dispatchEvent(e));
    input.blur();
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    input.dispatchEvent(new Event("focusout", { bubbles: true }));
    expect(mockFunction).toBeCalledTimes(0);
  });
});
