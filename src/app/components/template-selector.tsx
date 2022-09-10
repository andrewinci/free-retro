import { Group, Text } from "@mantine/core";
import styled from "@emotion/styled";

type TemplateModel = {
  titleLines: string[];
  columns: string[];
};

export const TemplateSelector = (props: {
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
