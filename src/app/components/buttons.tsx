import React from "react";
import styled from "styled-components";

export const EmptyButton = styled.button`
  margin-left: 0.5em;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  width: 25px;
  border-radius: 5px;
  :hover {
    background-color: #a8a8a8;
  }
`;

export const AddButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <EmptyButton {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="bi bi-plus"
      viewBox="0 0 16 16">
      {" "}
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />{" "}
    </svg>
  </EmptyButton>
);

const Arrow = (props: React.HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 490 490"
    xmlSpace="preserve"
    {...props}>
    <g>
      <path
        d="M52.8,311.3c-12.8-12.8-12.8-33.4,0-46.2c6.4-6.4,14.7-9.6,23.1-9.6s16.7,3.2,23.1,9.6l113.4,113.4V32.7
		c0-18,14.6-32.7,32.7-32.7c18,0,32.7,14.6,32.7,32.7v345.8L391,265.1c12.8-12.8,33.4-12.8,46.2,0c12.8,12.8,12.8,33.4,0,46.2
		L268.1,480.4c-6.1,6.1-14.4,9.6-23.1,9.6c-8.7,0-17-3.4-23.1-9.6L52.8,311.3z"
      />
    </g>
  </svg>
);

const RightArrow = styled(Arrow)`
  transform: rotate(-90deg);
  border-radius: 50%;
  height: 40px;
  width: 40px;
`;

const LeftArrow = styled(RightArrow)`
  transform: rotate(90deg);
`;

export const RightArrowButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <EmptyButton {...props}>
    <RightArrow></RightArrow>
    {props.children}
  </EmptyButton>
);

export const LeftArrowButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => (
  <EmptyButton {...props}>
    <LeftArrow></LeftArrow>
    {props.children}
  </EmptyButton>
);

export const CloseButton = styled(AddButton)`
  transform: rotate(45deg);
  border-radius: 50%;
  height: 25px;
  width: 25px;
`;
