import { Container, CloseButton, Group, ActionIcon } from "@mantine/core";
import { CSSProperties } from "react";
import { useDrop } from "react-dnd";
import styled from "@emotion/styled";
import { Id } from "../state";
import { TextArea } from "./textarea";
import { IconPlus } from "@tabler/icons-react";

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
  const closeButtonClick = (e: React.MouseEvent) => {
    if (onCloseClick) {
      const columnContainer = e.currentTarget.parentElement?.parentElement;
      if (!columnContainer) throw new Error("Invalid parent");
      // wait for the animation to complete before calling the on close
      // click that can remove the element from the dom
      columnContainer.addEventListener("animationend", () => onCloseClick());
      columnContainer.classList.remove("horizontal-fade-in");
      columnContainer.classList.add("horizontal-fade-out");
    }
  };
  return (
    <ColumnContainer ref={drop} style={style} className={"horizontal-fade-in"}>
      <Group position={"right"} mb={-5} style={{ minHeight: "28px" }}>
        <CloseButton
          hidden={(children?.length ?? 0) > 0 || readOnly || !canClose}
          onClick={(e) => closeButtonClick(e)}
        />
      </Group>
      <ColumnTitle
        placeholder="Title"
        readOnly={readOnly}
        text={title}
        onTextChange={(t) => (onTitleChange ? onTitleChange(t) : {})}
      />
      {!readOnly && (
        <ActionIcon
          ml={8}
          size={20}
          onClick={() => (onAddClick ? onAddClick() : {})}>
          <IconPlus />
        </ActionIcon>
      )}
      <Container
        style={{
          overflowY: "auto",
          height: "calc(100vh - 205px)",
          padding: "0 8px",
        }}>
        {children}
      </Container>
    </ColumnContainer>
  );
};

const ColumnContainer = styled(Container)`
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-width: 300px;
  margin: 4px;
  height: calc(100vh - 125px);
  padding: 2px;

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

const ColumnTitle = styled(TextArea)`
  font-size: 1.5em;
  text-align: center;
  ${({ theme }) =>
    `color: ${theme.colorScheme === "dark" ? theme.white : theme.black}`}
`;
