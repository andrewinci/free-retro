import { Button, Container, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import * as State from "../state";
import { TemplateSelector } from "../components";

export const CreateRetroPage = () => {
  const [state, setState] = useState({
    retroName: "Let's chat",
    selectedIndex: 0,
  });
  return (
    <Container size={350} px={0}>
      <Stack>
        <TextInput
          label="Retro name"
          value={state.retroName}
          onChange={(e) => setState({ ...state, retroName: e.target.value })}
        />
        <TemplateSelector
          templates={templates}
          selectedIndex={state.selectedIndex}
          onSelectedIndexChanged={(selectedIndex) =>
            setState({ ...state, selectedIndex })
          }></TemplateSelector>
        <Button
          fullWidth={true}
          onClick={async () =>
            await State.createRetro(
              state.retroName,
              templates[state.selectedIndex].columns
            )
          }>
          🚀 Create retro
        </Button>
      </Stack>
    </Container>
  );
};

const templates = [
  {
    titleLines: ["Start", "Stop", "Continue"],
    columns: ["Start", "Stop", "Continue"],
  },
  { titleLines: ["Mad", "Sad", "Glad"], columns: ["Mad", "Sad", "Glad"] },
  {
    titleLines: ["Happy", "Confused", "Sad"],
    columns: ["Happy", "Confused", "Sad"],
  },
  {
    titleLines: ["Liked", "Longed", "Lacked", "Learned"],
    columns: ["Liked", "Longed for", "Lacked", "Learned"],
  },
  {
    titleLines: ["To do", "Doing", "Done"],
    columns: ["ToDo", "Doing", "Done"],
  },
  { titleLines: ["Empty"], columns: [] },
];
