import styled from "styled-components";
import {
  CloseButton,
  LeftArrowButton,
  RightArrowButton,
} from "../components/buttons";
import { CardGroup } from "../components/card";
import { VotesLine } from "../components/vote-line";
import { CardGroupState, Stage } from "../state";
import * as State from "../state";
import { Column } from "../components";
import { StageText } from "./stage-text";

const CloseRetro = styled(CloseButton)`
  position: fixed;
  right: 1em;
  top: 1em;
  height: 5em;
  width: 5em;
`;

const CardDiscussContainer = styled.div`
  flex: 1;
  flex-grow: 1;
  min-width: 20rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-content: space-between;
  flex-wrap: nowrap;
  justify-content: space-evenly;
`;

const Prev = styled(LeftArrowButton)`
  flex: 1;
  flex-grow: 0;
  height: 3em;
  width: 3em;
  &:disabled {
    fill: #eaeaea;
  }
`;

const Next = styled(RightArrowButton)`
  flex: 1;
  flex-grow: 0;
  height: 3em;
  width: 3em;
  &:disabled {
    fill: #eaeaea;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
`;

const DiscussView = (props: { cards: CardGroupState[]; index: number }) => {
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
      <StageText stage={Stage.Discuss} />
      <CloseRetro onClick={async () => await closeRetro()} />
      <Container>
        <CardDiscussContainer>
          <Prev
            onClick={async () => await State.changeDiscussCard("decrement")}
            disabled={index <= 0}></Prev>

          <CardGroup
            style={{ minWidth: "20em" }}
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

          <Next
            onClick={async () => await State.changeDiscussCard("increment")}
            disabled={index >= sortedCards.length - 1}></Next>
        </CardDiscussContainer>
        <Column title="Actions" style={{ maxWidth: "23em" }}></Column>
      </Container>
    </>
  );
};

export default DiscussView;
