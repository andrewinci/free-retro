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
  className?: string;
  readOnly?: boolean;
  blur?: boolean;
  children?: React.ReactNode;
  canDrag?: boolean;
  onCloseClicked?: () => void;
  onTextChange?: (_: string) => void;
  onDrop?: (id: Id) => void;
};

type CardProps = {
  id: Id;
  text: string;
  cardType?: string;
  color?: string;
} & DefaultProps;

export const Card = (props: CardProps & CardContainerProps) => {
  const { text, readOnly, blur, color, onCloseClicked, onTextChange } = props;
  const { cardType, canDrag } = props;
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
    [canDrag ?? false, text]
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
      <Group position={"right"} mb={-5} style={{ minHeight: "12px" }}>
        {cardType && <Text size={"xs"}>{cardType}</Text>}
        <CloseButton
          size={12}
          hidden={text.length > 0 || readOnly || blur}
          onClick={(e) => {
            if (onCloseClicked) {
              const cardGroup =
                e.currentTarget.parentElement?.parentElement?.parentElement;
              if (!cardGroup) throw new Error("Invalid parent");
              // wait for the animation to finish before calling
              // the on close event handler
              cardGroup.addEventListener("animationend", () =>
                onCloseClicked()
              );
              cardGroup.classList.remove("vertical-fade-in");
              cardGroup.classList.add("vertical-fade-out");
            }
          }}
        />
      </Group>
      <TextArea
        // must be readonly if blurred
        readOnly={readOnly || blur}
        text={blur ? text.replace(/[^\s]/g, "*") : text}
        // this setting will update the text word by word
        // instead of char by char
        reduceTextChangeUpdates={true}
        onTextChange={(newText) => (onTextChange ? onTextChange(newText) : {})}
      />
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
