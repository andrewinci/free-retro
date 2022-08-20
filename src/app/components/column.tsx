import { CSSProperties } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { Id } from "../state";
import { AddButton, CloseButton } from "./buttons";
import { Title } from "./textarea";

const ColumnGroupContainer = styled.div`
  display: inline-flex;
`;

export const ColumnGroup = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <ColumnGroupContainer>{children}</ColumnGroupContainer>;
};

type ColumnProps = {
  title: string;
  children?: React.ReactNode[];
  readOnly?: boolean;
  canClose?: boolean;
  onDrop?: (id: string) => void;
  onTitleChange?: (_: string) => void;
  onAddClick?: () => void;
  onCloseClick?: () => void;
} & { style?: CSSProperties | undefined };

export const Column = (props: ColumnProps) => {
  const { title, children, readOnly, canClose, style } = props;
  const { onDrop, onAddClick, onCloseClick, onTitleChange } = props;
  const [_, drop] = useDrop(() => ({
    accept: "card",
    drop: (item: { id: Id }, monitor) => {
      if (!monitor.didDrop() && onDrop) {
        onDrop(item.id);
      }
    },
    collect: (monitor) => ({
      item: monitor.getItem(),
    }),
  }));
  return (
    <ColumnContainer ref={drop} style={style} className={"horizontal-fade-in"}>
      <TopCloseButton
        hidden={(children?.length ?? 0) > 0 || readOnly || !canClose}
        onClick={(e) => {
          if (onCloseClick) {
            const parent = e.currentTarget.parentElement;
            if (!parent) throw new Error("Invalid parent");
            // wait for the animation to complete before calling the on close
            // click that can remove the element from the dom
            parent.addEventListener("animationend", () => onCloseClick());
            parent.classList.remove("horizontal-fade-in");
            parent.classList.add("horizontal-fade-out");
          }
        }}
      />
      <div>
        <Title
          placeholder="Title"
          readOnly={readOnly}
          text={title}
          onTextChange={(t) => (onTitleChange ? onTitleChange(t) : {})}
        />
      </div>
      {!readOnly && (
        <BottomAddButton onClick={() => (onAddClick ? onAddClick() : {})} />
      )}
      {children}
    </ColumnContainer>
  );
};

const ColumnContainer = styled.div`
  min-width: 20rem;
  height: 80vh;
  flex: 1;
  flex-grow: 0 1;
  border-radius: 0.4rem;
  margin-right: 1em;
  border: 2px solid #d4d4d4;
  padding: 0.5rem 0.3rem;
  position: relative;
  overflow-y: scroll;

  &.horizontal-fade-in {
    @keyframes horizontal-fade-in {
      from {
        transform: translateX(-50%);
        opacity: 0;
      }

      to {
        transform: translateX(0%);
        opacity: 1;
      }
    }

    animation: horizontal-fade-in 0.1s linear;
  }

  &.horizontal-fade-out {
    @keyframes horizontal-fade-out {
      from {
        transform: translateX(0%);
        opacity: 1;
      }

      to {
        transform: translateX(-50%);
        opacity: 0;
      }
    }

    opacity: 0;
    animation: horizontal-fade-out 0.1s linear;
  }
`;

const BottomAddButton = styled(AddButton)`
  bottom: 0.5em;
`;

const TopCloseButton = styled(CloseButton)`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;
