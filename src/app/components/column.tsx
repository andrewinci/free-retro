import { useDrop } from "react-dnd";
import styled from "styled-components";
import { AddButton, CloseButton } from "./buttons";
import { Title } from "./textarea";

const StyledColumnContainer = styled.div`
  display: inline-flex;
`;

export const ColumnContainer = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return <StyledColumnContainer>{children}</StyledColumnContainer>;
};

const StyledColumn = styled.div`
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
`;

const BottomAddButton = styled(AddButton)`
  bottom: 0.5em;
`;

const TopCloseButton = styled(CloseButton)`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

type ColumnProps = {
  title: string;
  children?: React.ReactNode[];
  readOnly?: boolean;
  onDrop?: (id: any) => void;
  onTitleChange?: (_: string) => void;
  onAddClick?: () => void;
  onCloseClick?: () => void;
};

export const Column = (props: ColumnProps) => {
  const { title, children, onTitleChange, readOnly } = props;
  const { onDrop, onAddClick, onCloseClick } = props;
  const [_, drop] = useDrop(() => ({
    accept: "card",
    drop: (id, monitor) => {
      if (!monitor.didDrop() && onDrop) {
        onDrop(id);
      }
    },
    collect: (monitor) => ({
      item: monitor.getItem(),
    }),
  }));
  return (
    <StyledColumn ref={drop}>
      <TopCloseButton
        hidden={(children?.length ?? 0) > 0 || readOnly}
        onClick={() => (onCloseClick ? onCloseClick() : {})}
      />
      <div>
        <Title
          placeholder="Title"
          readOnly={readOnly}
          text={title}
          onTextChange={(t) => (onTitleChange ? onTitleChange(t) : {})}
        />
      </div>
      {children}
      {!readOnly && (
        <BottomAddButton onClick={() => (onAddClick ? onAddClick() : {})} />
      )}
    </StyledColumn>
  );
};
