import styled from "styled-components";
import { AddButton, RightArrowButton } from "../components/buttons";
import { CardGroup } from "../components/card";
import { Column, ColumnContainer } from "../components/column";
import { VotesLine } from "../components/vote-line";
import { Stage, ColumnState, getUser, CardPosition } from "../state";
import * as State from "../state";

const NextButton = styled(RightArrowButton)`
  position: fixed;
  right: 1em;
  top: 1em;
  height: 5em;
  width: 5em;
`;

const StageText = styled.div`
  position: fixed;
  left: 2em;
  top: 2em;
  h2 {
    margin: 0;
  }
  p {
    margin: 0;
  }
`;

export function stageToString(stage: Stage) {
  switch (stage) {
    case Stage.AddTickets:
      return "Add Tickets";
    case Stage.Group:
      return "Group";
    case Stage.Vote:
      return "Vote";
    case Stage.Discuss:
      return "Discuss";
    case Stage.End:
      return "End";
  }
}

function BoardCard(props: {
  card: State.CardGroupState;
  cardIndex: number;
  columnIndex: number;
  stage: Stage;
  readOnly: boolean;
}): JSX.Element {
  const { card, cardIndex, columnIndex, stage, readOnly } = props;
  const cards = card.cards.map((c) => ({
    ...c,
    cardType: stage == Stage.AddTickets ? undefined : c.originColumn,
    id: c.position,
  }));
  // event handlers
  const deleteCard = async () => await State.deleteCard(columnIndex, cardIndex);
  const changeCardText = async (text: string) =>
    await State.updateCardText(columnIndex, cardIndex, text);
  const addVotes = async () =>
    await State.updateCardVotes(columnIndex, cardIndex, "increment");
  const removeVotes = async () =>
    await State.updateCardVotes(columnIndex, cardIndex, "decrement");
  return (
    <CardGroup
      onDrop={(src) => State.moveCard(src, card.cards[0].position)}
      cards={cards}
      canDrag={stage == Stage.Group}
      onCloseClicked={deleteCard}
      onTextChange={changeCardText}
      title={card.title}
      onTitleChange={(title) =>
        State.setGroupTitle({ ...card.cards[0].position }, title)
      }
      blur={stage == Stage.AddTickets && cards[0].ownerId != getUser()?.id}
      readOnly={readOnly}>
      {stage != Stage.AddTickets && stage != Stage.Group && (
        <VotesLine
          readonly={false}
          votes={card.votes[getUser()?.id!!]?.value ?? 0}
          onAddVoteClicked={addVotes}
          onRemoveVoteClicked={removeVotes}></VotesLine>
      )}
    </CardGroup>
  );
}

function BoardColumn(props: {
  columnIndex: number;
  column: ColumnState;
  readOnly: boolean;
  stage: Stage;
}) {
  const { columnIndex, column, readOnly, stage } = props;
  return (
    <Column
      title={column.title}
      onDrop={(src) => State.moveCardToColumn(src, columnIndex)}
      onTitleChange={async (t) => await State.setColumnTitle(columnIndex, t)}
      onAddClick={async () => await State.addEmptyCard(columnIndex)}
      onCloseClick={async () => await State.deleteColumn(columnIndex)}
      readOnly={readOnly}>
      {column.groups.map((card, cardIndex) => (
        <BoardCard
          key={cardIndex}
          card={card}
          columnIndex={columnIndex}
          cardIndex={cardIndex}
          stage={stage}
          readOnly={readOnly}></BoardCard>
      ))}
    </Column>
  );
}

const BoardView = (props: {
  columnsData: ColumnState[];
  stage: Stage;
  readOnly?: boolean;
}) => {
  const { columnsData, stage, readOnly } = props;

  const changeStage = async (change: "next" | "back") => {
    const res = confirm(
      `Before moving to the next stage, make sure that everyone is ready to go ahead.\nClick ok to go to the next stage`
    );
    if (res) {
      await State.changeStage(change);
    }
  };
  const next = async () => await changeStage("next");
  return (
    <>
      <StageText>
        <p>step:</p>
        <h2>{stageToString(stage)}</h2>
      </StageText>
      <NextButton onClick={next}>Next</NextButton>
      <ColumnContainer>
        {columnsData.map((column, i) => (
          <BoardColumn
            key={i}
            column={column}
            columnIndex={i}
            readOnly={readOnly ?? false}
            stage={stage}
          />
        ))}
        {!readOnly && (
          <AddButton onClick={async () => await State.addColumn()} />
        )}
      </ColumnContainer>
    </>
  );
};

export default BoardView;
