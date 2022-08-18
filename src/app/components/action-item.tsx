import { useId } from "react";
import styled from "styled-components";
import { TextArea } from "./textarea";
import { TopCloseButton } from "./buttons";

const ActionItemContainer = styled.div`
  border: 1px solid #d4d4d4;
  padding: 1em;
  font-size: 1em;
  min-height: 3rem;
  margin: 0 0.5em 0.5em 0.5em;
  position: relative;
  display: flex;
  border-radius: 0.4rem;
  align-items: center;
  .checkbox-input {
    display: none;
  }
  .checkbox-input:checked + label .checkbox:after {
    transform: translate(-50%, -50%) scale(1);
  }

  .checkbox {
    margin-left: 0.5em;
    border: 1px solid gray;
    border-radius: 3px;
    width: 18px;
    height: 18px;
    display: inline-block;
    position: relative;
  }
  .checkbox:after {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-51%, -51%) scale(0);
    font-size: 23px;
    content: "✅";
    border-radius: 3px;
    transition: 0.2s;
  }
`;

export type ActionItemProps = {
  text: string;
  done?: boolean;
  onTextChange?: (_: string) => void;
  onDoneChange?: (_: boolean) => void;
  onCloseClicked?: () => void;
};

const ActionItemText = styled(TextArea)`
  font-size: 1.2em;
`;

export const ActionItem = (props: ActionItemProps) => {
  const { text, done, onTextChange, onDoneChange, onCloseClicked } = props;
  const id = useId();
  return (
    <ActionItemContainer>
      <TopCloseButton
        hidden={text.length > 0}
        onClick={() => (onCloseClicked ? onCloseClicked() : {})}
      />
      <ActionItemText
        placeholder="Todo item...."
        text={text}
        onTextChange={onTextChange}
        reduceTextChangeUpdates={true}
      />
      <div>
        <input
          id={id}
          type="checkbox"
          className="checkbox-input"
          checked={done}
          onChange={(e) =>
            onDoneChange ? onDoneChange(e.target.checked) : {}
          }></input>
        <label htmlFor={id}>
          <span className="checkbox"></span>
        </label>
      </div>
    </ActionItemContainer>
  );
};
