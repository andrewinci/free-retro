import { useState } from "react";
import styled from "styled-components";
import { ButtonContainer } from "../components/buttons";
import * as State from "../state";

const CreateRetroContainer = styled.div`
  position: absolute;
  width: 24em;
  left: 50%;
  transform: translateX(-50%);
`;

const Label = styled.label`
  font-size: 1em;
  font-weight: bold;
`;

const Input = styled.input`
  margin: 1em 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

const CreateRetroButton = styled(ButtonContainer)`
  background: #d9d9d9;
  width: 100%;
  height: 1.8em;
  font-size: 1.2em;
  font-weight: bold;
  margin: auto;
  margin-top: 0.5em;
  margin-bottom: 2em;
`;

const RetroTemplatesContainer = styled.div`
  margin: 1em 0;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  cursor: pointer !important;
`;

const Template = styled.div<{ selected: boolean }>`
  margin: 0.2em;
  width: 5.3em;
  height: 5.3em;
  font-weight: bold;
  text-align: center;
  font-size: 1.2em;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e3e3e3;
  }

  p {
    margin: 0;
  }
  ${({ selected }) =>
    selected ? `border: 2px solid #b8b8ff` : `border: 2px solid #e3e3e3;`}
`;

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
    <RetroTemplatesContainer>
      {templates.map((template, index) => (
        <Template
          onClick={() => onSelectedIndexChanged(index)}
          selected={selectedIndex == index}
          key={index}>
          {template.titleLines.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </Template>
      ))}
    </RetroTemplatesContainer>
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
    <CreateRetroContainer>
      <Label>Retro name: </Label>
      <Input
        value={state.retroName}
        onChange={(e) => setState({ ...state, retroName: e.target.value })}
      />
      <RetroTemplates
        templates={templates}
        selectedIndex={state.selectedIndex}
        onSelectedIndexChanged={(selectedIndex) =>
          setState({ ...state, selectedIndex })
        }></RetroTemplates>
      <CreateRetroButton
        onClick={async () =>
          await State.createRetro(
            state.retroName,
            templates[state.selectedIndex].columns
          )
        }>
        🚀 Create retro
      </CreateRetroButton>
    </CreateRetroContainer>
  );
};
