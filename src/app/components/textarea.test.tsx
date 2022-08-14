/**
 * @jest-environment jsdom
 */

import { createRoot } from "react-dom/client";
import renderer from "react-test-renderer";
import { TextArea } from "./textarea";
import { act } from "react-dom/test-utils";

describe("textArea", () => {
  const div = document.createElement("div");
  const root = createRoot(div);

  it("should render", () => {
    const component = renderer.create(<TextArea />);
    expect(component).toBeDefined();
  });

  it("should trigger textChange after every letter if reduceTextChangeUpdates=false", () => {
    const mockFunction = jest.fn();
    act(() =>
      root.render(
        <TextArea text={""} onTextChange={(t) => mockFunction(t)}></TextArea>
      )
    );

    const input = div.children[0] as HTMLTextAreaElement;
    ["t", "e", "s", "t", " ", "1", "2", "3"]
      .map((key) => ({
        e1: new KeyboardEvent("keyup", { bubbles: true, key: key }),
        e2: new Event("change", { bubbles: true }),
        key,
      }))
      .map(({ e1, e2, key }) => {
        input.value += key;
        input.dispatchEvent(e2);
        input.dispatchEvent(e1);
      });

    expect(mockFunction).toBeCalledTimes(8);
  });
  it("should trigger textChange only if change focus or a space is typed when reduceTextChangeUpdates=true", () => {
    const mockFunction = jest.fn();
    act(() =>
      root.render(
        <TextArea
          reduceTextChangeUpdates={true}
          text={"sample"}
          onTextChange={(t) => mockFunction(t)}></TextArea>
      )
    );

    const input = div.children[0] as HTMLTextAreaElement;
    ["t", "e", "s", "t", " ", "1", "2", "3"]
      .map((key) => ({
        e1: new KeyboardEvent("keyup", { bubbles: true, key: key }),
        e2: new Event("change", { bubbles: true }),
        key,
      }))
      .map(({ e1, e2, key }) => {
        input.value += key;
        input.dispatchEvent(e2);
        input.dispatchEvent(e1);
      });
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    input.dispatchEvent(new Event("focusout", { bubbles: true }));
    // 2: one time for the space and 1 time for the blur
    expect(mockFunction).toBeCalledTimes(2);
  });
  it("should not trigger textChange if readonly - reduceTextChangeUpdates=true", () => {
    const mockFunction = jest.fn();
    act(() =>
      root.render(
        <TextArea
          reduceTextChangeUpdates={true}
          text={"sample"}
          onTextChange={(t) => mockFunction(t)}
          readOnly={true}></TextArea>
      )
    );

    const input = div.children[0] as HTMLTextAreaElement;
    ["t", "e", "s", "t", " ", "1", "2", "3"]
      .map((key) => new KeyboardEvent("keyup", { bubbles: true, key: key }))
      .map((e) => input.dispatchEvent(e));
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    input.dispatchEvent(new Event("focusout", { bubbles: true }));
    expect(mockFunction).toBeCalledTimes(0);
  });
  it("should not trigger textChange if readonly - reduceTextChangeUpdates=false", () => {
    const mockFunction = jest.fn();
    act(() =>
      root.render(
        <TextArea
          text={"sample"}
          onTextChange={(t) => mockFunction(t)}
          readOnly={true}></TextArea>
      )
    );

    const input = div.children[0] as HTMLTextAreaElement;
    ["t", "e", "s", "t", " ", "1", "2", "3"]
      .map((key) => new KeyboardEvent("keyup", { bubbles: true, key: key }))
      .map((e) => input.dispatchEvent(e));
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    input.dispatchEvent(new Event("focusout", { bubbles: true }));
    expect(mockFunction).toBeCalledTimes(0);
  });
  it("should not trigger textChange if the text doesn't change", () => {
    const mockFunction = jest.fn();
    act(() =>
      root.render(
        <TextArea
          text={"sample"}
          onTextChange={(t) => mockFunction(t)}></TextArea>
      )
    );

    const input = div.children[0] as HTMLTextAreaElement;
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keyup", { bubbles: true, key: "s" })
      );
    });
    for (let i = 0; i < 10; i++) {
      // react 18: https://reactjs.org/docs/test-utils.html#act
      act(() => {
        input.dispatchEvent(new Event("focus", { bubbles: true }));
        input.dispatchEvent(new Event("focusout", { bubbles: true }));
      });
    }
    expect(mockFunction).toBeCalledTimes(1);
  });
});
