import { CSSProperties } from "react";
import * as State from "../state";
import { ActionState } from "../state";
import { ActionItem } from "./action-item";
import { Column } from "./column";

export const ActionColumn = (props: {
  actions: ActionState[];
  style?: CSSProperties;
}) => {
  const { actions, style } = props;
  return (
    <Column
      title="Actions 🛠️"
      style={style}
      canClose={false}
      onAddClick={async () => await State.addAction()}>
      {actions.map((a) => (
        <ActionItem
          key={a.id}
          text={a.text}
          done={a.done}
          date={a.date}
          onCloseClicked={async () => await State.removeAction(a.id)}
          onDoneChange={async (done) => await State.setActionDone(a.id, done)}
          onTextChange={async (text) => await State.setActionText(a.id, text)}
        />
      ))}
    </Column>
  );
};
