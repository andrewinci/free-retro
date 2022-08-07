import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
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
  ${(props) =>
    props.readOnly
      ? `
    cursor: pointer !important;
    user-select: none;
    &::selection {
      background-color: transparent;
    }
  `
      : ``}

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
  reduceTextChangeUpdates?: boolean;
  onTextChange?: onTextChangeHandler;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
  hidden?: boolean;
};

export const TextArea: FunctionComponent<TextAreaProps> = (props) => {
  const { className, readOnly, placeholder, hidden } = props;
  const { text, onTextChange, reduceTextChangeUpdates } = props;
  const textInput = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState({ current: text, lastUpdate: "" });
  const autosize = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.cssText = "height:auto; padding:0";
    textarea.style.cssText = `height:${textarea.scrollHeight}px`;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setState({ ...state, current: text }), [text]);
  useEffect(() => {
    autosize(textInput.current);
    if (readOnly) {
      textInput.current?.blur();
    }
  });

  const textChanged = (text: string, key: string | null = null) => {
    // nothing to do if it is readonly
    if (readOnly) return;
    // if reduceTextChangeUpdates, only act when key is " "
    if (key && key != " " && reduceTextChangeUpdates) return;
    if (onTextChange && text != state.lastUpdate) {
      onTextChange(text);
      setState({ ...state, lastUpdate: text });
    }
  };

  return (
    <StyledTextArea
      ref={textInput}
      hidden={hidden}
      readOnly={readOnly}
      placeholder={placeholder}
      className={className}
      value={state.current}
      onInput={(e) => autosize(e.currentTarget)}
      onChange={(e) => {
        if (!readOnly) setState({ ...state, current: e.target.value });
      }}
      onKeyUp={(e) => {
        autosize(e.target);
        textChanged(e.target.value, e.key);
      }}
      onFocus={(e) => autosize(e.target)}
      onBlur={(e) => {
        textChanged(e.target.value);
      }}
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

export const GroupTitle = styled(Title)`
  font-size: 1.3em;
`;
