import { CSSProperties } from "react";
import * as State from "../state";
import { ActionState, Id } from "../state";
import { ActionItem } from "./action-item";
import { Column } from "./column";

export const ActionColumn = (props: {
  actions?: Record<Id, ActionState>;
  style?: CSSProperties;
}) => {
  const { actions, style } = props;
  return (
    <Column
      title="Actions 🛠️"
      style={style}
      canClose={false}
      onAddClick={async () => await State.addAction()}>
      {Object.entries(actions ?? {}).map(([id, { text, done, date }]) => (
        <ActionItem
          key={id}
          text={text}
          done={done}
          date={date}
          onCloseClicked={async () => await State.removeAction(id)}
          onDoneChange={async (done) => await State.setActionDone(id, done)}
          onTextChange={async (text) => await State.setActionText(id, text)}
        />
      ))}
    </Column>
  );
};
