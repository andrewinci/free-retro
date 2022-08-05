import renderer from "react-test-renderer";
import { App } from "./app";
import { AppState } from "./state";
import * as AutomergeState from "./state/automerge-state";

describe("Test button components", () => {
  test("App should render", () => {
    const getAppStateMock = jest.spyOn(AutomergeState, "getAppState");
    getAppStateMock.mockImplementation(() => ({} as AppState));
    const onStateChangeMock = jest.spyOn(AutomergeState, "onStateChange");
    onStateChangeMock.mockImplementation(async () => {});
    const component = renderer.create(<App />);
    expect(component).toBeDefined();
  });
});
