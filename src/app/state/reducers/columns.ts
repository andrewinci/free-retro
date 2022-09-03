import { randomColor, randomId } from "../../helper/random";
import { changeState } from "../automerge-state";
import { Id } from "../model";
import { getUser } from "../user";

export const addColumn = () =>
  changeState((state) => {
    if (!state.columns) {
      state.columns = [];
    }
    state.columns.push({
      id: randomId(),
      title: "",
      groups: [],
    });
  });

export const deleteColumn = (columnId: Id) =>
  changeState((state) => {
    if (!state.columns) state.columns = [];
    const columnIndex = state.columns.findIndex((c) => c.id == columnId);
    if (columnIndex < 0)
      throw new Error("Invalid column id. Column not found.");
    state.columns.splice(columnIndex, 1);
  });

export const setColumnTitle = (columnId: Id, title: string) =>
  changeState((state) => {
    if (!state.columns) state.columns = [];
    const column = state.columns.find((c) => c.id == columnId);
    if (!column) throw new Error("Invalid column id");
    column.title = title;
    for (const c of column.groups) {
      for (const c1 of c.cards) {
        c1.originColumn = title;
      }
    }
  });

export const addEmptyCard = (columnId: Id) =>
  changeState((state) => {
    if (!state.columns) return;
    const column = state.columns.find((c) => c.id == columnId);
    if (!column) throw new Error("Invalid column id. Column not found.");
    column.groups.unshift({
      id: randomId(),
      votes: {},
      cards: [
        {
          id: randomId(),
          originColumn: column.title,
          ownerId: getUser()?.id ?? "",
          text: "",
          color: randomColor(),
        },
      ],
    });
  });
