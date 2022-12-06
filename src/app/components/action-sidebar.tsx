import styled from "@emotion/styled";
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
    <StyledContainer {...props} hidden={hidden}>
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
        <div
          style={{
            overflowY: "auto",
            height: "calc(100vh - 180px)",
            padding: "0 8px",
          }}>
          <Stack spacing={5}>
            {Object.entries(actions ?? {})
              .reverse()
              .sort(
                ([_, { done, date }], [__, { done: done2, date: date2 }]) => {
                  if (done == done2) {
                    if (Date.parse(date) < Date.parse(date2)) {
                      return 1;
                    } else {
                      return -1;
                    }
                  }
                  if (done) {
                    return 1;
                  } else {
                    return -1;
                  }
                }
              )
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
        </div>
      </Stack>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  border-left: 1px solid #e9ecef;
  min-width: 350px;
  ${({ theme }) =>
    `border-left-color: ${
      theme.colorScheme === "dark" ? "#2c2e33" : "#e9ecef"
    }`}
`;
