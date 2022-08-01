import React from "react";
import styled from "styled-components";
import { AddButton, RightArrowButton } from "../components/buttons";
import Card from "../components/card";
import { Column, ColumnContainer } from "../components/column";
import { VotesLine } from "../components/vote-line";
import { Stage, ColumnState, getUser } from "../state";
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
    case Stage.Vote:
      return "Vote";
    case Stage.Discuss:
      return "Discuss";
    case Stage.End:
      return "End";
  }
}

function buildColumn(
  columnIndex: number,
  column: ColumnState,
  readOnly: boolean,
  showVotes: boolean
) {
  return (
    <Column
      title={column.title}
      key={columnIndex}
      onTitleChange={async (t) => await State.setColumnTitle(columnIndex, t)}
      onAddClick={async () => await State.addEmptyCard(columnIndex)}
      onCloseClick={async () => await State.deleteColumn(columnIndex)}
      readOnly={readOnly}>
      {column.cards.map((card, cardIndex) => (
        <Card
          text={card.text}
          key={cardIndex}
          color={card.color}
          onCloseClicked={async () =>
            await State.deleteCard(columnIndex, cardIndex)
          }
          onTextChange={async (text) =>
            await State.updateCardText(columnIndex, cardIndex, text)
          }
          blur={!(showVotes || card.ownerId == getUser()?.id)}
          readOnly={readOnly}>
          {showVotes && (
            <VotesLine
              readonly={false}
              votes={card.votes[getUser()?.id!!]?.value ?? 0}
              onAddVoteClicked={async () =>
                await State.updateCardVotes(columnIndex, cardIndex, "increment")
              }
              onRemoveVoteClicked={async () =>
                await State.updateCardVotes(columnIndex, cardIndex, "decrement")
              }></VotesLine>
          )}
        </Card>
      ))}
    </Column>
  );
}

const nextStage = async () => {
  const res =
    confirm(`Before moving to the next stage, make sure that everyone is ready to go ahead.
Click ok to go to the next stage`);
  if (res) {
    await State.nextStage();
  }
};

const BoardView = (props: {
  columnsData: ColumnState[];
  stage: Stage;
  readOnly?: boolean;
}) => {
  const { columnsData, stage, readOnly } = props;
  const vote = Stage.Vote === stage;
  return (
    <>
      <StageText>
        <p>step:</p>
        <h2>{stageToString(stage)}</h2>
      </StageText>
      <NextButton onClick={async () => await nextStage()}>Next</NextButton>
      <ColumnContainer>
        {columnsData.map((column, i) =>
          buildColumn(i, column, readOnly ?? false, vote)
        )}
        {!readOnly && (
          <AddButton onClick={async () => await State.addColumn()} />
        )}
      </ColumnContainer>
    </>
  );
};

export default BoardView;
