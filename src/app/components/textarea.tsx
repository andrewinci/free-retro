import React, { FunctionComponent, useEffect, useRef } from "react";
import styled from "styled-components";

const StyledTextArea = styled.textarea`
  overflow: hidden;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  width: 100%;
  height: 100%;
  outline: none;
  resize: none;
  overflow: hidden;
  font-size: 1em;
  ${(props) => (props.readOnly ? `cursor: pointer !important;` : ``)}

  appearance: none;
  -webkit-appearance: none;
  -moz-apperarance: none;
  -ms-appearance: none;
  -o-appearance: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  -ms-box-shadow: none;
  -o-box-shadow: none;
  box-shadow: none;
`;

type onTextChangeHandler = (_: string) => void;

type TextAreaProps = {
  text?: string;
  onTextChange?: onTextChangeHandler;
  readOnly?: boolean;
  className?: string;
};

export const TextArea: FunctionComponent<TextAreaProps> = (props) => {
  const { text, onTextChange, className, readOnly } = props;
  const textInput = useRef<any>(null);

  const autosize = (textarea: HTMLTextAreaElement) => {
    textarea.style.cssText = "height:auto; padding:0";
    textarea.style.cssText = `height:${textarea.scrollHeight}px`;
  };

  useEffect(() => autosize(textInput.current));

  return (
    <StyledTextArea
      ref={textInput}
      readOnly={readOnly}
      className={className}
      value={text}
      onInput={(e) => autosize(e.currentTarget)}
      onChange={(e) => {
        if (onTextChange) {
          onTextChange(e.target.value);
        }
      }}
      onKeyDown={(e) => autosize(e.target)}
      onFocus={(e) => autosize(e.target)}
    />
  );
};

TextArea.defaultProps = {
  text: "",
  onTextChange: undefined,
  className: undefined,
  readOnly: false,
};

export const Title = styled(TextArea)`
  font-size: 2em;
  height: 60px;
  text-align: center;
`;
