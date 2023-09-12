import styled from "@emotion/styled";
import { CardGroup, VotesLine, Card } from "../components";

import { CardGroupState } from "../state";
import * as State from "../state";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

type DiscussViewProps = {
  cards: CardGroupState[];
  cardIndex: number;
};

export const DiscussPage = (props: DiscussViewProps) => {
  const { cards, cardIndex } = props;

  if (cards.length == 0) {
    console.log("No cards -> nothing to discuss");
    return <></>;
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
      <Container>
        <CardDiscussContainer>
          <ActionIcon
            title="previous card"
            onClick={async () => await State.changeDiscussCard("decrement")}
            disabled={cardIndex <= 0}
            size="xl">
            <IconArrowLeft size={100} />
          </ActionIcon>
          <CardGroupContainer>
            <CardGroup
              title={card.title}
              readOnlyTitle={true}
              hiddenTitle={!card.title}>
              {Object.entries(card.cards).map(
                ([id, { text, color, originColumn }]) => (
                  <Card
                    id={id}
                    key={id}
                    text={text}
                    cardType={originColumn}
                    readOnly={true}
                    color={color}
                  />
                ),
              )}
              <VotesLine mt={3} readOnly={true} votes={votes}></VotesLine>
            </CardGroup>
          </CardGroupContainer>
          <ActionIcon
            title="next card"
            onClick={async () => await State.changeDiscussCard("increment")}
            disabled={cardIndex >= sortedCards.length - 1}
            size="xl">
            <IconArrowRight size={100} />
          </ActionIcon>
        </CardDiscussContainer>
      </Container>
    </>
  );
};

const CardDiscussContainer = styled.div`
  flex: 1;
  flex-grow: 1;
  min-width: 450px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: space-between;
  justify-content: space-evenly;
  margin-top: 2em;
  margin-bottom: 2em;

  @media only screen and (min-width: 734px) {
    margin-bottom: 10em;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  @media only screen and (min-width: 734px) {
    align-items: stretch;
    flex-direction: row;
  }
`;

const CardGroupContainer = styled.div`
  min-width: 10rem;

  @media only screen and (min-width: 734px) {
    min-width: 20rem;
  }
`;
