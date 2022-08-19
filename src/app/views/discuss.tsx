import styled from "styled-components";
import {
  CloseButton,
  LeftArrowButton,
  RightArrowButton,
  CardGroup,
  VotesLine,
  ActionColumn,
} from "../components";

import { ActionState, CardGroupState, Stage } from "../state";
import * as State from "../state";
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
  min-width: 450px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: space-between;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  margin-bottom: 10em;
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
  align-items: stretch;
  justify-content: space-around;
`;

type DiscussViewProps = {
  cards: CardGroupState[];
  cardIndex: number;
  actions: ActionState[];
};

const DiscussView = (props: DiscussViewProps) => {
  const { cards, cardIndex, actions } = props;

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
    cardIndex >= sortedCards.length
      ? sortedCards[sortedCards.length - 1]
      : sortedCards[cardIndex];

  return (
    <>
      <StageText stage={Stage.Discuss} />
      <CloseRetro onClick={async () => await closeRetro()} />
      <Container>
        <CardDiscussContainer>
          <Prev
            onClick={async () => await State.changeDiscussCard("decrement")}
            disabled={cardIndex <= 0}></Prev>
          <div style={{ minWidth: "20rem" }}>
            <CardGroup
              title={card.title}
              cards={card.cards.map((c) => ({
                id: c.id,
                text: c.text,
                cardType: c.originColumn,
                color: c.color,
              }))}
              readOnlyTitle={true}
              readOnly={true}>
              <VotesLine readonly={true} votes={votes}></VotesLine>
            </CardGroup>
          </div>
          <Next
            onClick={async () => await State.changeDiscussCard("increment")}
            disabled={cardIndex >= sortedCards.length - 1}></Next>
        </CardDiscussContainer>
        <ActionColumn style={{ maxWidth: "25em" }} actions={actions} />
      </Container>
    </>
  );
};

export default DiscussView;
