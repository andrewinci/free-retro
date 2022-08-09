import styled from "styled-components";
import {
  CloseButton,
  LeftArrowButton,
  RightArrowButton,
} from "../components/buttons";
import { CardGroup } from "../components/card";
import { VotesLine } from "../components/vote-line";
import { CardGroupState } from "../state";
import * as State from "../state";

const CloseRetro = styled(CloseButton)`
  position: fixed;
  right: 1em;
  top: 1em;
  height: 5em;
  width: 5em;
`;

const CardDiscussContainer = styled.div`
  position: absolute;
  width: 20rem;
  left: 50%;
  top: 15%;
  transform: translateX(-50%);
`;

const Prev = styled(LeftArrowButton)`
  height: 3em;
  width: 3em;
`;

const Next = styled(RightArrowButton)`
  position: absolute;
  right: 1em;
  height: 3em;
  width: 3em;
`;

export const DiscussView = (props: {
  cards: CardGroupState[];
  index: number;
}) => {
  const { cards, index } = props;

  const closeRetro = async () => {
    const res = confirm(`This action will close the retro session.
Click ok to go ahead.`);
    if (res) {
      await State.changeStage("next");
    }
  };

  if (cards.length == 0) {
    console.log("No cards -> nothing to discuss");
    return (
      <>
        <CloseRetro onClick={async () => await closeRetro()} />
      </>
    );
  }

  const totalVotes = (c: CardGroupState) =>
    Object.values(c.votes)
      .map((v) => v.value)
      .reduce((a, b) => a + b, 0);

  const sortedCards = cards
    .map((c) => ({ votes: totalVotes(c), card: c }))
    .sort((a, b) => b.votes - a.votes);

  const { card, votes } =
    index >= sortedCards.length
      ? sortedCards[sortedCards.length - 1]
      : sortedCards[index];

  return (
    <>
      <CloseRetro onClick={async () => await closeRetro()} />
      <CardDiscussContainer>
        <Prev
          onClick={async () => await State.changeDiscussCard("decrement")}
          disabled={index <= 0}></Prev>
        <Next
          onClick={async () => await State.changeDiscussCard("increment")}
          disabled={index > sortedCards.length}></Next>
        <CardGroup
          title={card.title}
          cards={card.cards.map((c) => ({
            text: c.text,
            cardType: c.originColumn,
            color: c.color,
          }))}
          readOnlyTitle={true}
          readOnly={true}>
          <VotesLine readonly={true} votes={votes}></VotesLine>
        </CardGroup>
      </CardDiscussContainer>
    </>
  );
};
