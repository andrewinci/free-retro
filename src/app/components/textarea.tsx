import { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { DefaultProps } from "@mantine/core";

type onTextChangeHandler = (_: string) => void;

type TextAreaProps = {
  text?: string;
  reduceTextChangeUpdates?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  hidden?: boolean;
  onTextChange?: onTextChangeHandler;
} & DefaultProps;

export const TextArea = (props: TextAreaProps) => {
  const { className, readOnly, placeholder, hidden } = props;
  const { text, onTextChange, reduceTextChangeUpdates } = props;
  const textInput = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState({ current: text, lastUpdate: "" });
  const autosize = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.cssText = "height:auto; padding:0";
    textarea.style.cssText = `height: ${textarea.scrollHeight}px`;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setState({ ...state, current: text }), [text]);
  // resize the text area on mount (without memoization)
  useEffect(() => autosize(textInput.current));
  useEffect(() => {
    // autofocus writable empty text
    // use memoization so that this is only executed once.
    if (!readOnly && text == "") {
      textInput.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textChanged = (text: string, lastKeyPressed: string | null = null) => {
    // nothing to do if it is readonly
    if (readOnly) return;
    // if reduceTextChangeUpdates, only act when last key pressed is " " or the text is empty
    if (
      lastKeyPressed &&
      lastKeyPressed != " " &&
      reduceTextChangeUpdates &&
      text != ""
    )
      return;
    if (onTextChange && text != state.lastUpdate) {
      onTextChange(text);
      setState({ ...state, lastUpdate: text });
    }
  };

  return (
    <StyledTextArea
      rows={1}
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
        autosize(e.target as HTMLTextAreaElement);
        textChanged((e.target as HTMLTextAreaElement).value, e.key);
      }}
      onFocus={(e) => autosize(e.target)}
      onBlur={(e) => {
        textChanged(e.target.value);
      }}
    />
  );
};

const StyledTextArea = styled.textarea`
  overflow: hidden;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  resize: none;
  font-size: 0.9em;
  appearance: none;
  box-shadow: none;

  ${(props) =>
    props.readOnly
      ? `
    cursor: default;
    user-select: none;
    &::selection {
      background-color: transparent;
    }
  `
      : ``}
`;
