import styled from "styled-components";
import { CloseButton } from "./buttons";
import { GroupTitle, TextArea } from "./textarea";
import { useDrag, useDrop } from "react-dnd";
import { CardPosition } from "../state";

type CardContainerProps = {
  className?: string;
  readOnly?: boolean;
  blur?: boolean;
  children?: React.ReactNode;
  canDrag?: boolean;
  onCloseClicked?: () => void;
  onTextChange?: (_: string) => void;
  onDrop?: (id: CardPosition) => void;
};

type CardProps = {
  id?: CardPosition;
  text: string;
  cardType?: string;
  color?: string;
};

type CardGroupProps = {
  title?: string;
  readOnlyTitle?: boolean;
  cards: CardProps[];
  onTitleChange?: (_: string) => void;
};

const CardContent = (props: CardProps & CardContainerProps) => {
  const { text, readOnly, blur, color, onCloseClicked, onTextChange } = props;
  const { cardType, canDrag } = props;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      canDrag: () => canDrag ?? false,
      type: "card",
      item: props.id,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [canDrag ?? false, text]
  );
  return (
    <CardContentDiv
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      color={color}
      blur={blur ?? false}
      showCardType={cardType != null}>
      <TopCloseButton
        hidden={text.length > 0 || readOnly || blur}
        onClick={() => (onCloseClicked ? onCloseClicked() : {})}
      />
      <CardType hidden={!cardType}>{cardType}</CardType>
      <TextArea
        // must be readonly if blurred
        readOnly={readOnly || blur}
        text={blur ? text.replace(/[^\s]/g, "*") : text}
        // this setting will update the text word by word
        // instead of char by char
        reduceTextChangeUpdates={true}
        onTextChange={(newText) => (onTextChange ? onTextChange(newText) : {})}
      />
    </CardContentDiv>
  );
};

export const CardGroup = (props: CardGroupProps & CardContainerProps) => {
  const cardProps = props.cards.map((c) => ({ ...props, ...c }));
  const [_, drop] = useDrop(() => ({
    accept: "card",
    drop: (id: CardPosition, _) => {
      props?.onDrop ? props.onDrop(id) : {};
    },
    collect: (monitor) => ({
      item: monitor.getItem(),
    }),
  }));
  return (
    <Container ref={drop} className={props.className}>
      <GroupTitle
        hidden={cardProps.length == 1}
        text={props.title}
        placeholder="Group title"
        readOnly={props.readOnlyTitle}
        onTextChange={(text) =>
          props.onTitleChange ? props.onTitleChange(text) : {}
        }
      />
      {cardProps.map((p, i) => (
        <CardContent {...p} key={i}></CardContent>
      ))}
      {props.children}
    </Container>
  );
};

const Container = styled.div`
  margin: 0.5em;
  margin-bottom: 0.8em;
  position: relative;
  max-width: 20rem;
  font-size: 1.2em;
`;

const CardContentDiv = styled.div<{ blur: boolean; showCardType: boolean }>`
  padding: 0.6em;
  position: relative;
  ${(props) => props.showCardType && `padding-top: 1.2em;`}
  background-color: ${(props) => props.color};
  ${(props) => {
    if (props.blur) {
      return `
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -o-filter: blur(5px);
        -ms-filter: blur(5px);
        filter: blur(5px);        
      `;
    }
    return "";
  }}
`;

const TopCloseButton = styled(CloseButton)`
  position: absolute;
  top: 2px;
  right: 2px;
  height: 15px;
  width: 15px;
`;

const CardType = styled.p`
  text-align: right;
  position: absolute;
  top: 2px;
  right: 5px;
  width: 200px;
  font-size: 0.8em;
  margin: 0;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
`;
