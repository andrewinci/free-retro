import { TextArea } from "./textarea";
import { CardContainer } from "./card";
import { Checkbox, Grid } from "@mantine/core";
import { useMemo } from "react";

export type ActionCardProps = {
  text: string;
  done?: boolean;
  date?: string;
  onTextChange?: (_: string) => void;
  onDoneChange?: (_: boolean) => void;
  onCloseClicked?: () => void;
};

export const ActionCard = (props: ActionCardProps) => {
  const { text, done, date, onTextChange, onDoneChange, onCloseClicked } =
    props;
  const canClose = useMemo(() => text.length == 0, [text]);
  return (
    <CardContainer
      id={"-"}
      cardType={date}
      color="#e1efff"
      onCloseClicked={onCloseClicked}
      canClose={canClose}>
      <Grid>
        <Grid.Col span={11}>
          <TextArea
            placeholder="Todo item...."
            text={text}
            onTextChange={onTextChange}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <Checkbox
            checked={done}
            onChange={(e) =>
              onDoneChange ? onDoneChange(e.target.checked) : {}
            }></Checkbox>
        </Grid.Col>
      </Grid>
    </CardContainer>
  );
};
