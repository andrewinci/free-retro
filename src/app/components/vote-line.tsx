import styled from "styled-components";
import { AddButton } from "./buttons";

const VotesContainer = styled.div`
  display: flex;
  margin-top: 0.1em;
`;

const Vote = styled.div`
  cursor: pointer !important;
  margin-left: 2px;
  height: 15px;
  width: 15px;
  background-color: gray;
  border-radius: 100%;

  span {
    position: absolute;
    margin-top: -3px;
    margin-left: 3px;
    opacity: 0;

    &:hover {
      opacity: 100;
    }
  }
`;

const AddVote = styled(AddButton)`
  border-radius: 100%;
  height: 15px;
  width: 15px;
  background-color: #d8d8d8;
  margin-left: 0;
`;

type VotesLineProps = {
  readonly?: boolean;
  votes?: number;
  onAddVoteClicked?: () => void;
  onRemoveVoteClicked?: () => void;
};

export const VotesLine = (props: VotesLineProps) => {
  const { votes, readonly, onAddVoteClicked, onRemoveVoteClicked } = props;
  return (
    <VotesContainer>
      {!readonly && (
        <AddVote
          onClick={(_) => (onAddVoteClicked ? onAddVoteClicked() : {})}
        />
      )}
      {[...Array(votes)].map((e, i) => (
        <Vote
          key={i}
          onClick={(_) => (onRemoveVoteClicked ? onRemoveVoteClicked() : {})}>
          {!readonly && <span>-</span>}
        </Vote>
      ))}
    </VotesContainer>
  );
};
