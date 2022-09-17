import { Column, CardGroup, VotesLine, Card } from "../components";
import { Stage, ColumnState, CardGroupState, Id, getUser } from "../state";
import * as State from "../state";
import { ActionIcon, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons";

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
  const { id: userId } = State.getUser() ?? State.setUserName();
  return (
    <CardGroup
      title={cardGroup.title}
      onTitleChange={async (title) =>
        await State.setGroupTitle(cardGroupId, title)
      }
      readOnlyTitle={stage != Stage.Group}
      hiddenTitle={cards.length == 1}
      onDrop={async (src) => await State.moveCardToGroup(src, cardGroupId)}>
      {cards.map((c) => (
        <Card
          id={c.id}
          key={c.id}
          text={c.text}
          color={c.color}
          cardType={c.cardType}
          blur={stage == Stage.AddTickets && c.ownerId != getUser()?.id}
          onCloseClicked={deleteCardGroup}
          onTextChange={changeCardText}
          canDrag={stage == Stage.Group}
          readOnly={readOnly}
        />
      ))}
      {stage != Stage.AddTickets && stage != Stage.Group && (
        <VotesLine
          mt={3}
          readOnly={false}
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
      onDrop={async (src) => await State.moveCardToColumn(src, columnId)}
      onTitleChange={async (t) => await State.setColumnTitle(columnId, t)}
      onAddClick={async () => await State.addEmptyCard(columnId)}
      onCloseClick={async () => await State.deleteColumn(columnId)}
      readOnly={readOnly}>
      {Object.entries(column.groups ?? {})
        .reverse()
        .map(([groupId, group]) => (
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

  return (
    <Group
      noWrap={true}
      position={"center"}
      mr={20}
      style={{
        display: "inline-flex",
      }}>
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
        <ActionIcon size={20} onClick={async () => await State.addColumn()}>
          <IconPlus />
        </ActionIcon>
      )}
    </Group>
  );
};
