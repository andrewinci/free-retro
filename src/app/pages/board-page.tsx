import styled from "styled-components";
import { AddButton, RightArrowButton } from "../components/buttons";
import { CardGroup } from "../components/card";
import { Column, ColumnGroup } from "../components/column";
import { VotesLine } from "../components/vote-line";
import { StageText } from "../components/stage-text";
import {
  Stage,
  ColumnState,
  getUser,
  setUserName,
  CardGroupState,
  Id,
} from "../state";
import * as State from "../state";

const NextButton = styled(RightArrowButton)`
  position: fixed;
  right: 2em;
  top: 1.5em;

  @media only screen and (min-width: 734px) {
    top: 2em;
  }

  z-index: 2;
`;

function BoardCardGroup(props: {
  cardGroup: CardGroupState;
  cardGroupId: Id;
  stage: Stage;
  readOnly: boolean;
}): JSX.Element {
  const { cardGroup, cardGroupId, stage, readOnly } = props;
  const cards = Object.entries(cardGroup.cards).map(([id, card]) => ({
    ...card,
    cardType: stage == Stage.AddTickets ? undefined : card.originColumn,
    id,
  }));
  // event handlers
  const deleteCardGroup = async () => await State.deleteCardGroup(cardGroupId);
  const changeCardText = async (text: string) =>
    await State.updateFirstCardText(cardGroupId, text);
  const addVotes = async () =>
    await State.updateGroupVotes(cardGroupId, "increment");
  const removeVotes = async () =>
    await State.updateGroupVotes(cardGroupId, "decrement");
  const { id: userId } = getUser() ?? setUserName();
  return (
    <CardGroup
      onDrop={async (src) => await State.moveCardToGroup(src, cardGroupId)}
      cards={cards}
      canDrag={stage == Stage.Group}
      onCloseClicked={deleteCardGroup}
      onTextChange={changeCardText}
      title={cardGroup.title}
      onTitleChange={async (title) =>
        await State.setGroupTitle(cardGroupId, title)
      }
      readOnlyTitle={stage != Stage.Group}
      blur={stage == Stage.AddTickets && cards[0].ownerId != getUser()?.id}
      readOnly={readOnly}>
      {stage != Stage.AddTickets && stage != Stage.Group && (
        <VotesLine
          readonly={false}
          votes={cardGroup.votes[userId]?.value ?? 0}
          onAddVoteClicked={addVotes}
          onRemoveVoteClicked={removeVotes}></VotesLine>
      )}
    </CardGroup>
  );
}

function BoardColumn(props: {
  column: ColumnState;
  columnId: Id;
  readOnly: boolean;
  stage: Stage;
}) {
  const { column, columnId, readOnly, stage } = props;
  return (
    <Column
      title={column.title}
      canClose={stage == Stage.AddTickets}
      reverse={true}
      onDrop={async (src) => await State.moveCardToColumn(src, columnId)}
      onTitleChange={async (t) => await State.setColumnTitle(columnId, t)}
      onAddClick={async () => await State.addEmptyCard(columnId)}
      onCloseClick={async () => await State.deleteColumn(columnId)}
      readOnly={readOnly}>
      {Object.entries(column.groups ?? {}).map(([groupId, group]) => (
        <BoardCardGroup
          key={groupId}
          cardGroupId={groupId}
          cardGroup={group}
          stage={stage}
          readOnly={readOnly}></BoardCardGroup>
      ))}
    </Column>
  );
}

export const BoardPage = (props: {
  columnsData?: Record<Id, ColumnState>;
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
      <StageText votes={State.getRemainingUserVotes()} stage={stage} />
      <NextButton onClick={next}>Next</NextButton>
      <ColumnGroup>
        {Object.entries(columnsData ?? {}).map(([columnId, column]) => (
          <BoardColumn
            key={columnId}
            columnId={columnId}
            column={column}
            readOnly={readOnly ?? false}
            stage={stage}
          />
        ))}
        {!readOnly && (
          <AddButton onClick={async () => await State.addColumn()} />
        )}
      </ColumnGroup>
    </>
  );
};
