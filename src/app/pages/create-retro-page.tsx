import {
  Button,
  Center,
  Checkbox,
  Container,
  Stack,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { TemplateSelector } from "../components";
import * as State from "../state";

export const CreateRetroPage = () => {
  const [state, setState] = useState({
    retroName: "Let's chat",
    withKudos: true,
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
        <Center>
          <Checkbox
            labelPosition="left"
            label="👏 Include a Kudos column"
            defaultChecked
            onChange={() => setState({ ...state, withKudos: !state.withKudos })}
          />
        </Center>
        <Button
          fullWidth={true}
          onClick={async () => {
            const columns = [
              ...templates[state.selectedIndex].columns,
              ...(state.withKudos ? ["Kudos"] : []),
            ];
            await State.createRetro(state.retroName, columns);
          }}>
          🚀 Create retro
        </Button>
      </Stack>
    </Container>
  );
};

const templates = [
  {
    titleLines: ["Mad", "Sad", "Glad"],
    columns: ["Mad", "Sad", "Glad"],
  },
  {
    titleLines: ["Start", "Stop", "Continue"],
    columns: ["Start", "Stop", "Continue"],
  },
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
