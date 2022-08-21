import styled from "styled-components";
import { AddButton, RightArrowButton } from "../components/buttons";
import { CardGroup } from "../components/card";
import { Column, ColumnGroup } from "../components/column";
import { VotesLine } from "../components/vote-line";
import { StageText } from "../components/stage-text";
import { Stage, ColumnState, getUser, setUserName } from "../state";
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

function BoardCard(props: {
  cardGroup: State.CardGroupState;
  stage: Stage;
  readOnly: boolean;
}): JSX.Element {
  const { cardGroup, stage, readOnly } = props;
  const cards = cardGroup.cards.map((c) => ({
    ...c,
    cardType: stage == Stage.AddTickets ? undefined : c.originColumn,
    id: c.id,
  }));
  // event handlers
  const deleteCardGroup = async () => await State.deleteCardGroup(cardGroup.id);
  const changeCardText = async (text: string) =>
    await State.updateFirstCardText(cardGroup.id, text);
  const addVotes = async () =>
    await State.updateGroupVotes(cardGroup.id, "increment");
  const removeVotes = async () =>
    await State.updateGroupVotes(cardGroup.id, "decrement");
  const { id: userId } = getUser() ?? setUserName();
  return (
    <CardGroup
      onDrop={async (src) => await State.moveCardToGroup(src, cardGroup.id)}
      cards={cards}
      canDrag={stage == Stage.Group}
      onCloseClicked={deleteCardGroup}
      onTextChange={changeCardText}
      title={cardGroup.title}
      onTitleChange={async (title) =>
        await State.setGroupTitle(cardGroup.id, title)
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
  readOnly: boolean;
  stage: Stage;
}) {
  const { column, readOnly, stage } = props;
  return (
    <Column
      title={column.title}
      canClose={stage == Stage.AddTickets}
      onDrop={async (src) => await State.moveCardToColumn(src, column.id)}
      onTitleChange={async (t) => await State.setColumnTitle(column.id, t)}
      onAddClick={async () => await State.addEmptyCard(column.id)}
      onCloseClick={async () => await State.deleteColumn(column.id)}
      readOnly={readOnly}>
      {column.groups.map((group) => (
        <BoardCard
          key={group.id}
          cardGroup={group}
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
      <StageText votes={State.getRemainingUserVotes()} stage={stage} />
      <NextButton onClick={next}>Next</NextButton>
      <ColumnGroup>
        {columnsData.map((column) => (
          <BoardColumn
            key={column.id}
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

export default BoardView;
