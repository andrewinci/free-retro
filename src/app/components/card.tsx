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

const CardContainer = styled.div<{ blur: boolean }>`
  padding: 0.6em;
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

type CardProps = {
  text: string;
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
  return (
    <Container className={props.className}>
      <CardContainer color={color} blur={blur ?? false}>
        <TopCloseButton
          hidden={text.length > 0 || readOnly || blur}
          onClick={(_) => onCloseClicked()}
        />
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
