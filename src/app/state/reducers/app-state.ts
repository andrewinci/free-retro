import { changeState, getAppState } from "../automerge-state";
import * as Automerge from "automerge";
import { randomId } from "../helper/random";
import { Stage } from "../model";

// app state reducers
export const changeDiscussCard = (changeType: "increment" | "decrement") => {
  // avoid to trigger changes if the index is out of bound
  const { columns, discussCardIndex } = getAppState();
  const currentIndex = discussCardIndex?.value ?? 0;
  const totalCards =
    columns?.flatMap((c) => c.groups.length).reduce((a, b) => a + b, 0) ?? 0;

  return changeState((state) => {
    if (!state.discussCardIndex) {
      state.discussCardIndex = new Automerge.Counter(0);
    }

    if (currentIndex >= totalCards - 1 && changeType == "increment") return;
    if (currentIndex <= 0 && changeType == "decrement") return;

    switch (changeType) {
      case "decrement":
        state.discussCardIndex.decrement();
        break;
      case "increment":
        state.discussCardIndex.increment();
        break;
    }
  });
};

export const createRetro = (retroName: string, initialColumns: string[]) =>
  changeState((state) => {
    state.retroName = retroName;
    state.stage = Stage.AddTickets;
    state.columns = [];
    initialColumns.map((title) =>
      // using push to make automerge happy
      state.columns?.push({
        id: randomId(),
        title,
        groups: [],
      })
    );
  }, true);

export const changeStage = (change: "next" | "back") => {
  const currentStage = getAppState().stage ?? 0;
  if (currentStage <= 0 && change == "back") return;
  if (currentStage >= Stage.End && change == "next") return;
  return changeState((state) => {
    if (!state.stage) state.stage = 0;
    if (change == "back") {
      state.stage -= 1;
    } else if (change == "next") {
      // check if there are any ticket to discuss or we can go straight to the end.
      if (!state.columns) {
        state.stage = Stage.End;
        return;
      }
      // due to automerge, we need to use for loops to count the number of cards
      // instead of using map + reduce
      let totalCardsNumber = 0;
      for (let c = 0; c < state.columns.length; c++) {
        const column = state.columns[c];
        for (let g = 0; g < column.groups.length; g++) {
          totalCardsNumber += column.groups[g].cards.length;
        }
      }

      if (totalCardsNumber == 0) {
        state.stage = Stage.End;
      } else {
        state.stage += 1;
      }
    }
  });
};
