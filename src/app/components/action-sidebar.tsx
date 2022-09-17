import {
  ActionIcon,
  Center,
  Container,
  DefaultProps,
  Stack,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import * as State from "../state";
import { ActionState, Id } from "../state";
import { ActionCard } from "./action-card";

export const ActionSidebar = (
  props: {
    actions?: Record<Id, ActionState>;
    hidden?: boolean;
  } & DefaultProps
) => {
  const { actions, hidden } = props;
  return (
    <Container
      {...props}
      hidden={hidden}
      style={{ borderLeft: "1px solid #e9ecef", minWidth: "23em" }}>
      <Stack mt={90} spacing={10}>
        <Center>
          <Title order={2}>🛠️ Actions</Title>
        </Center>
        <ActionIcon
          ml={8}
          size={20}
          onClick={async () => await State.addAction()}>
          <IconPlus />
        </ActionIcon>
        <Stack spacing={1}>
          {Object.entries(actions ?? {})
            .reverse()
            .map(([id, { text, done, date }]) => (
              <ActionCard
                key={id}
                text={text}
                done={done}
                date={date}
                onCloseClicked={async () => await State.removeAction(id)}
                onDoneChange={async (done) =>
                  await State.setActionDone(id, done)
                }
                onTextChange={async (text) =>
                  await State.setActionText(id, text)
                }
              />
            ))}
        </Stack>
      </Stack>
    </Container>
  );
};
