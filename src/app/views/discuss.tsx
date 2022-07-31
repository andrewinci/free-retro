import React, { useState } from "react";
import styled from "styled-components";
import { LeftArrowButton, RightArrowButton } from "../components/buttons";
import Card from "../components/card";
import { VotesLine } from "../components/vote-line";
import { CardState } from "../state";
import * as State from "../state";

const ButtonsContainer = styled.div`
  position: absolute;
  width: 20rem;
  left: 50%;
  top: 15%;
  transform: translateX(-50%);
`;

const Prev = styled(LeftArrowButton)`
  margin-bottom: 2em;
  height: 3em;
  width: 3em;
`;
const Next = styled(RightArrowButton)`
  position: absolute;
  right: 1em;
  margin-bottom: 2em;
  height: 3em;
  width: 3em;
`;

export const DiscussView = (props: { cards: CardState[]; index: number }) => {
  const { cards, index } = props;
  const totalVotes = (c: CardState) =>
    Object.values(c.votes)
      .map((v) => v.value)
      .reduce((a, b) => a + b);
  const sortedCards = cards
    .map((c) => ({ votes: totalVotes(c), card: c }))
    .sort((a, b) => b.votes - a.votes);

  const { card, votes } = (
    index >= sortedCards.length
      ? sortedCards[sortedCards.length - 1]
      : sortedCards.at(index)
  )!!;

  return (
    <>
      <ButtonsContainer>
        <Prev
          onClick={() => State.changeDiscussesCard("decrement")}
          disabled={index <= 0}></Prev>
        <Next
          onClick={() => State.changeDiscussesCard("increment")}
          disabled={index >= sortedCards.length}></Next>
        <Card
          text={card.text}
          color={card.color}
          readOnly={true}
          onTextChange={() => {}}
          onCloseClicked={() => {}}>
          <VotesLine readonly={true} votes={votes}></VotesLine>
        </Card>
      </ButtonsContainer>
    </>
  );
};