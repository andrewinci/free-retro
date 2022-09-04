import { randomColor, randomId } from "../helper/random";
import { changeState } from "../automerge-state";
import { Id } from "../model";
import { getUser } from "../user";

export const addColumn = () =>
  changeState((state) => {
    if (!state.columns) {
      state.columns = {};
    }
    state.columns[randomId()] = {
      title: "",
      groups: {},
    };
  });

export const deleteColumn = (columnId: Id) =>
  changeState((state) => {
    if (!state.columns || !(columnId in state.columns))
      throw new Error("Invalid column id. Column not found.");
    delete state.columns[columnId];
  });

export const setColumnTitle = (columnId: Id, title: string) =>
  changeState((state) => {
    if (!state.columns || !(columnId in state.columns))
      throw new Error("Invalid column id. Column not found.");
    // update column title
    state.columns[columnId].title = title;
    // update all cards under the column
    for (const group of Object.values(state.columns[columnId].groups)) {
      for (const card of Object.values(group.cards)) {
        card.originColumn = title;
      }
    }
  });

export const addEmptyCard = (columnId: Id) =>
  changeState((state) => {
    if (!state.columns || !(columnId in state.columns))
      throw new Error("Invalid column id. Column not found.");
    state.columns[columnId].groups[randomId()] = {
      votes: {},
      cards: {
        [randomId()]: {
          originColumn: state.columns[columnId].title,
          ownerId: getUser()?.id ?? "",
          text: "",
          color: randomColor(),
        },
      },
    };
  });
