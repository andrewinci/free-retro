import { TextArea } from "./textarea";
import { useDrag } from "react-dnd";
import { Id } from "../state";
import {
  CloseButton,
  createStyles,
  DefaultProps,
  Group,
  Paper,
  Text,
} from "@mantine/core";

type CardContainerProps = {
  id: Id;
  readOnly?: boolean;
  blur?: boolean;
  color?: string;
  children?: React.ReactNode;
  canDrag?: boolean;
  cardType?: string;
  onCloseClicked?: () => void;
  onDrop?: (id: Id) => void;
} & DefaultProps;

type CardProps = {
  text: string;
  onTextChange?: (_: string) => void;
} & DefaultProps;

export const Card = (props: CardProps & CardContainerProps) => {
  const { text, readOnly, blur, onTextChange } = props;
  return (
    <CardContainer {...props}>
      <TextArea
        // must be readonly if blurred
        readOnly={readOnly || blur}
        text={blur ? text.replace(/[^\s]/g, "*") : text}
        // this setting will update the text word by word
        // instead of char by char
        reduceTextChangeUpdates={true}
        onTextChange={(newText) => (onTextChange ? onTextChange(newText) : {})}
      />
    </CardContainer>
  );
};

export const CardContainer = (props: CardContainerProps) => {
  const { readOnly, blur, color, onCloseClicked } = props;
  const { cardType, canDrag, children } = props;
  const { classes, cx } = useStyles({ color });
  const [{ dragging }, drag] = useDrag(
    () => ({
      canDrag: () => canDrag ?? false,
      type: "card",
      item: { id: props.id },
      collect: (monitor) => ({
        dragging: monitor.isDragging(),
      }),
    }),
    [canDrag ?? false]
  );
  return (
    <Paper
      ref={drag}
      className={cx(
        classes.container,
        blur && classes.blur,
        canDrag && classes.drag,
        dragging && classes.dragging
      )}
      shadow="sm"
      radius="xs"
      p="md">
      <Group position={"right"} mt={-10} mr={-10} style={{ minHeight: "12px" }}>
        {cardType && <Text size={"xs"}>{cardType}</Text>}
        <CloseButton
          size={12}
          hidden={readOnly || blur}
          onClick={(_) => {
            if (onCloseClicked) onCloseClicked();
          }}
        />
      </Group>
      {children}
    </Paper>
  );
};

const useStyles = createStyles<string, { color?: string }>(
  (theme, params, _) => ({
    container: {
      padding: "8px",
      minHeight: "60px",
      position: "relative",
      cursor: "default",
      backgroundColor: params.color ?? "white",
    },
    blur: {
      filter: "blur(5px)",
    },
    drag: {
      cursor: "move",
      textarea: {
        cursor: "move !important",
      },
    },
    dragging: {
      opacity: 0.5,
    },
  })
);
