import { useId } from "react";
import styled from "styled-components";
import { TextArea } from "./textarea";
import { TopCloseButton } from "./buttons";

const ActionItemContainer = styled.div`
  border: 1px solid #d4d4d4;
  padding: 1em;
  font-size: 1em;
  height: 3rem;
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
  &.action-vertical-fade-in {
    @keyframes action-vertical-fade-in {
      from {
        height: 0;
        opacity: 0;
      }
      to {
        height: 3rem;
        opacity: 1;
      }
    }
    animation: action-vertical-fade-in 0.1s linear;
  }
  &.action-vertical-fade-out {
    @keyframes action-vertical-fade-out {
      from {
        height: 3rem;
        opacity: 1;
      }
      to {
        height: 0;
        opacity: 0;
      }
    }
    height: 0;
    opacity: 0;
    animation: action-vertical-fade-out 0.1s linear;
  }
`;

export type ActionItemProps = {
  text: string;
  done?: boolean;
  date?: string;
  onTextChange?: (_: string) => void;
  onDoneChange?: (_: boolean) => void;
  onCloseClicked?: () => void;
};

const ActionItemText = styled(TextArea)`
  font-size: 1.2em;
`;

const ActionItemTime = styled.p`
  font-size: 1em;
  position: absolute;
  font-style: italic;
  left: 10px;
  top: -10px;
`;

export const ActionItem = (props: ActionItemProps) => {
  const { text, done, date, onTextChange, onDoneChange, onCloseClicked } =
    props;
  const id = useId();
  return (
    <ActionItemContainer className={"action-vertical-fade-in"}>
      <ActionItemTime>{date}</ActionItemTime>
      <TopCloseButton
        hidden={text.length > 0}
        onClick={(e) => {
          if (onCloseClicked) {
            const parent = e.currentTarget.parentElement;
            if (!parent) throw new Error("Invalid parent");
            parent.addEventListener("animationend", () => onCloseClicked());
            parent.classList.remove("action-vertical-fade-in");
            parent.classList.add("action-vertical-fade-out");
          }
        }}
      />
      <ActionItemText
        placeholder="Todo item...."
        text={text}
        onTextChange={onTextChange}
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
