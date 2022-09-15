import { Button, Container } from "@mantine/core";
import { joinSession } from "../ws";

export const JoinRetroPage = () => {
  return (
    <Container size={350} px={0}>
      <Button
        fullWidth={true}
        onClick={async () => {
          const sessionId = location.hash.substring(1);
          await joinSession(sessionId);
        }}>
        🚀 Join retro
      </Button>
    </Container>
  );
};
