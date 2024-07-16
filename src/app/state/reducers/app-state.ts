import { changeState, getAppState } from "../automerge-state";
import * as Automerge from "@automerge/automerge";
import { randomId } from "../helper/random";
import { ColumnState, Stage } from "../model";
import { getAllGroups } from "../state";

export const startTimer = (seconds: number) => {
  changeState((state) => {
    state.timer = {
      // utc unix timestamp
      start: new Date().getTime(),
      // seconds
      duration: seconds,
    };
  });
};

export const resetTimer = () => {
  changeState((state) => {
    state.timer = null;
  });
};

export const createRetro = (retroName: string, initialColumns: string[]) =>
  changeState((state) => {
    state.retroName = retroName;
    state.stage = Stage.AddTickets;
    state.columns = initialColumns.reduce(
      (prev, current) => ({
        ...prev,
        [randomId()]: {
          title: current,
          groups: {},
        } as ColumnState,
      }),
      {},
    );
  }, true);

export const changeDiscussCard = (changeType: "increment" | "decrement") => {
  // avoid to trigger changes if the index is out of bound
  const { discussCardIndex } = getAppState();
  const currentIndex = discussCardIndex?.value ?? 0;
  const totalCards = getAllGroups().length;

  return changeState((state) => {
    if (!state.discussCardIndex) {
      state.discussCardIndex = new Automerge.Counter(0);
    }

    if (currentIndex >= totalCards - 1 && changeType == "increment") return;
    if (currentIndex <= 0 && changeType == "decrement") return;

    switch (changeType) {
      case "decrement":
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.discussCardIndex.decrement();
        break;
      case "increment":
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.discussCardIndex.increment();
        break;
    }
  });
};

export const changeStage = (change: "next" | "back") => {
  const currentStage = getAppState().stage ?? 0;
  console.log("YAHA, currentStage:", currentStage);
  if (currentStage <= 0 && change == "back") return;
  if (currentStage >= Stage.End && change == "next") return;
  return changeState((mutableState) => {
    if (!mutableState.stage) mutableState.stage = 0;
    if (change == "back") {
      mutableState.stage -= 1;
    } else if (change == "next") {
      // check if there are any ticket to discuss or we can go straight to the end.
      if (getAllGroups().length == 0) {
        mutableState.stage = Stage.End;
      } else {
        mutableState.stage += 1;
      }
    }
  });
};
