import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import styled from "@emotion/styled";
import * as State from "../state";

type TemplateModel = {
  titleLines: string[];
  columns: string[];
};

const RetroTemplates = (props: {
  templates: TemplateModel[];
  selectedIndex: number;
  onSelectedIndexChanged: (index: number) => void;
}) => {
  const { templates, selectedIndex, onSelectedIndexChanged } = props;
  return (
    <Group align={"center"} position={"center"} spacing={2}>
      {templates.map((template, index) => (
        <Template
          onClick={() => onSelectedIndexChanged(index)}
          selected={selectedIndex == index}
          key={index}>
          {template.titleLines.map((t) => (
            <Text size={"sm"} key={t}>
              {t}
            </Text>
          ))}
        </Template>
      ))}
    </Group>
  );
};

export const CreateRetroPage = () => {
  const [state, setState] = useState({
    retroName: "Let's chat",
    selectedIndex: 0,
  });

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

  return (
    <Container size={350} px={0}>
      <Stack>
        <TextInput
          label="Retro name"
          value={state.retroName}
          onChange={(e) => setState({ ...state, retroName: e.target.value })}
        />
        <RetroTemplates
          templates={templates}
          selectedIndex={state.selectedIndex}
          onSelectedIndexChanged={(selectedIndex) =>
            setState({ ...state, selectedIndex })
          }></RetroTemplates>
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

const Template = styled.div<{ selected: boolean }>`
  margin: 0.2em;
  width: 5.3em;
  height: 5.3em;
  font-weight: bold;
  text-align: center;
  font-size: 1.2em;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ced4da;

  &:hover {
    border: 1px solid #228be6;
  }

  ${({ selected }) =>
    selected
      ? `
    background-color: #228be6;
    color: white;
    `
      : `
    background-color: white;
    color: black;
    `}
`;
