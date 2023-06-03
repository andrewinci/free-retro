import { TextArea } from "./textarea";
import { useDrop } from "react-dnd";
import { Id } from "../state";
import { DefaultProps } from "@mantine/core";
import styled from "@emotion/styled";

type CardGroupProps = {
  title?: string;
  readOnlyTitle?: boolean;
  hiddenTitle?: boolean;
  children?: React.ReactNode;
  onTitleChange?: (_: string) => void;
  onDrop?: (id: Id) => void;
} & DefaultProps;

export const CardGroup = (props: CardGroupProps) => {
  const [_, drop] = useDrop(() => ({
    accept: "card",
    drop: (item: { id: Id }, _) => {
      props?.onDrop ? props.onDrop(item.id) : {};
    },
    collect: (monitor) => ({
      item: monitor.getItem(),
    }),
  }));
  return (
    <CardGroupContainer
      ref={drop}
      className={`${props.className} vertical-fade-in`}>
      <CardGroupTitle
        hidden={props.hiddenTitle}
        text={props.title}
        placeholder="Group title"
        readOnly={props.readOnlyTitle}
        onTextChange={(text) => props?.onTitleChange?.(text)}
      />
      {props.children}
    </CardGroupContainer>
  );
};

const CardGroupContainer = styled.div<{ canDrag?: boolean }>`
  margin: 0.5em;
  margin-bottom: 0.8em;
  position: relative;
  font-size: 1rem;

  &.vertical-fade-in {
    @keyframes vertical-fade-in {
      from {
        height: 0;
        opacity: 0;
      }

      to {
        height: 2.6rem;
        opacity: 1;
      }
    }

    animation: vertical-fade-in 0.1s linear;
  }

  &.vertical-fade-out {
    @keyframes vertical-fade-out {
      from {
        height: 2.6rem;
        opacity: 1;
      }

      to {
        height: 0;
        opacity: 0;
      }
    }

    height: 0;
    opacity: 0;
    animation: vertical-fade-out 0.1s linear;
  }
`;

const CardGroupTitle = styled(TextArea)`
  font-size: 1.2em;
  text-align: center;
  ${({ theme }) =>
    `color: ${theme.colorScheme === "dark" ? theme.white : theme.black}`}
`;
