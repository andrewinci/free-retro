import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { CloseButton } from "./buttons";
import { TextArea } from "./textarea";

const Container = styled.div`
  margin: 0.5em;
  margin-bottom: 0.8em;
  position: relative;
  max-width: 20rem;
  font-size: 1.2em;
`;

const CardContainer = styled.div<{ blur: boolean; showCardType: boolean }>`
  padding: 0.6em;
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

type CardProps = {
  text: string;
  showCardType?: boolean;
  cardType?: string;
  onTextChange: (_: string) => void;
  color?: string;
  readOnly?: boolean;
  blur?: boolean;
  onCloseClicked: () => void;
  className?: string | undefined;
  children?: React.ReactNode;
};

const Card: FunctionComponent<CardProps> = (props: CardProps) => {
  const { text, readOnly, blur, color, onCloseClicked, onTextChange } = props;
  const { showCardType, cardType } = props;
  return (
    <Container className={props.className}>
      <CardContainer
        color={color}
        blur={blur ?? false}
        showCardType={showCardType ?? false}>
        <TopCloseButton
          hidden={text.length > 0 || readOnly || blur}
          onClick={(_) => onCloseClicked()}
        />
        <CardType hidden={!showCardType}>{cardType}</CardType>
        <TextArea
          // must be readonly if blurred
          readOnly={readOnly || blur}
          text={text}
          onTextChange={(newText) => onTextChange(newText)}
        />
      </CardContainer>
      {props.children}
    </Container>
  );
};

Card.defaultProps = {
  readOnly: false,
  blur: false,
  color: "orange",
};

export default Card;
