import { Button, Text, Stack } from "@mantine/core";
import * as State from "../state";
import { ActionState, Id, Stage } from "../state";

export const EndRetroPage = (props: {
  sessionId: string;
  actions?: Record<Id, ActionState>;
}) => {
  const { sessionId, actions } = props;
  return (
    // <Center>
    <Stack align="center" justify="flex-start" spacing={30}>
      <Text>🎉 Congratulation, the retro is now concluded</Text>
      <Button
        fullWidth={true}
        style={{ maxWidth: 350 }}
        onClick={() => {
          State.initAppState(sessionId, Stage.Create, actions);
        }}>
        🚀 Start a new retro
      </Button>
      <Text>✅ Review the actions before starting a new one</Text>
      <Text style={{ textAlign: "center" }}>
        <strong>💾 Note:</strong> actions will be still available in
        <br /> the new retro as long as the same retro id is used.
      </Text>
    </Stack>
    // </Center>
  );
};
