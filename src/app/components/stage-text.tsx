import { Container, Group, Text } from "@mantine/core";
import { VotesLine } from ".";
import { Stage } from "../state";

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
      return "Review Actions";
    default:
      return null;
  }
}

export const StageText = (props: {
  stage: Stage;
  votes?: number | undefined;
}) => {
  const { stage, votes } = props;
  const showVotes: boolean =
    stage == Stage.Vote && votes && votes > 0 ? true : false;
  const stepText = stageToString(stage);
  return (
    <Container hidden={!stepText}>
      <Group spacing={5}>
        <Text size={"sm"}>step:</Text>
        <Text weight={"bold"} size={"lg"}>
          {stepText}
        </Text>
      </Group>
      {showVotes && <VotesLine votes={votes} readonly={true}></VotesLine>}
    </Container>
  );
};
