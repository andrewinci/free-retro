import styled from "styled-components";
import { TopCloseButton } from "./buttons";
import { TextArea, Title } from "./textarea";
import { useDrag, useDrop } from "react-dnd";
import { Id } from "../state";

type CardContainerProps = {
  className?: string;
  readOnly?: boolean;
  blur?: boolean;
  children?: React.ReactNode;
  canDrag?: boolean;
  onCloseClicked?: () => void;
  onTextChange?: (_: string) => void;
  onDrop?: (id: Id) => void;
};

type CardProps = {
  id: Id;
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

export const CardGroup = (props: CardGroupProps & CardContainerProps) => {
  const cards = props.cards.map((c) => ({ ...props, ...c }));
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
        hidden={cards.length == 1}
        text={props.title}
        placeholder="Group title"
        readOnly={props.readOnlyTitle}
        onTextChange={(text) =>
          props.onTitleChange ? props.onTitleChange(text) : {}
        }
      />
      {cards.map((p) => (
        <SingleCard {...p} key={p.id}></SingleCard>
      ))}
      {props.children}
    </CardGroupContainer>
  );
};

const SingleCard = (props: CardProps & CardContainerProps) => {
  const { text, readOnly, blur, color, onCloseClicked, onTextChange } = props;
  const { cardType, canDrag } = props;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      canDrag: () => canDrag ?? false,
      type: "card",
      item: { id: props.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [canDrag ?? false, text]
  );
  return (
    <SingleCardContainer
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      color={color}
      blur={blur ?? false}
      showCardType={cardType != null}>
      <TopCloseButton
        hidden={text.length > 0 || readOnly || blur}
        onClick={(e) => {
          if (onCloseClicked) {
            const cardGroup = e.currentTarget.parentElement?.parentElement;
            if (!cardGroup) throw new Error("Invalid parent");
            // wait for the animation to finish before calling
            // the on close event handler
            cardGroup.addEventListener("animationend", () => onCloseClicked());
            cardGroup.classList.remove("vertical-fade-in");
            cardGroup.classList.add("vertical-fade-out");
          }
        }}
      />
      <CardTypeText hidden={!cardType}>{cardType}</CardTypeText>
      <TextArea
        // must be readonly if blurred
        readOnly={readOnly || blur}
        text={blur ? text.replace(/[^\s]/g, "*") : text}
        // this setting will update the text word by word
        // instead of char by char
        reduceTextChangeUpdates={true}
        onTextChange={(newText) => (onTextChange ? onTextChange(newText) : {})}
      />
    </SingleCardContainer>
  );
};

const CardGroupContainer = styled.div`
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

const SingleCardContainer = styled.div<{
  blur: boolean;
  showCardType: boolean;
}>`
  padding: 0.6em;
  min-height: 2.6rem;
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

const CardTypeText = styled.p`
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

const CardGroupTitle = styled(Title)`
  font-size: 1.3rem;
`;
