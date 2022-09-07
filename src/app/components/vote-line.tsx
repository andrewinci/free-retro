import { Center, DefaultProps, Group } from "@mantine/core";
import styled from "@emotion/styled";
import { IconMinus, IconPlus } from "@tabler/icons";

type VotesLineProps = {
  readonly?: boolean;
  votes?: number;
  onAddVoteClicked?: () => void;
  onRemoveVoteClicked?: () => void;
} & DefaultProps;

export const VotesLine = (props: VotesLineProps) => {
  const { votes, readonly, onAddVoteClicked, onRemoveVoteClicked } = props;
  return (
    <Group position={"left"} spacing={0} {...props}>
      {!readonly && (
        <AddVoteButton
          onClick={(_) => (onAddVoteClicked ? onAddVoteClicked() : {})}>
          <Center className="icon-container">
            <IconPlus style={{ marginTop: 1 }} size={13} />
          </Center>
        </AddVoteButton>
      )}
      {[...Array(votes)].map((e, i) => (
        <Vote
          key={i}
          onClick={(_) => (onRemoveVoteClicked ? onRemoveVoteClicked() : {})}>
          {!readonly && (
            <Center className="icon-container">
              <IconMinus style={{ marginTop: 1 }} color="white" size={13} />
            </Center>
          )}
        </Vote>
      ))}
    </Group>
  );
};

const Vote = styled.div`
  cursor: pointer !important;
  margin-right: 2px;
  height: 15px;
  width: 15px;
  background-color: gray;
  border-radius: 100%;

  .icon-container {
    opacity: 0;

    &:hover {
      opacity: 100;
    }
  }
`;

const AddVoteButton = styled(Vote)`
  background-color: #d8d8d8;
`;
