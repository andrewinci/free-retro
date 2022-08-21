import styled from "styled-components";
import { VotesLine } from ".";
import { Stage } from "../state";

const StageTextContainer = styled.div`
  position: fixed;
  left: 1em;
  top: 2.5em;

  @media only screen and (min-width: 734px) {
    left: 2em;
    top: 2.5em;
  }

  z-index: 2;

  h2 {
    margin: 0;
    font-size: 1em;

    @media only screen and (min-width: 734px) {
      font-size: 1.5em;
    }
  }

  p {
    margin: 0;
    font-size: 1em;
  }
`;

export function stageToString(stage: Stage) {
  switch (stage) {
    case Stage.AddTickets:
      return "Add Tickets";
    case Stage.Group:
      return "Group";
    case Stage.Vote:
      return "Vote";
    case Stage.Discuss:
      return "Discuss";
    case Stage.End:
      return "End";
  }
}

export const StageText = (props: {
  stage: Stage;
  votes?: number | undefined;
}) => {
  const { stage, votes } = props;
  const showVotes: boolean =
    stage == Stage.Vote && votes && votes > 0 ? true : false;
  return (
    <StageTextContainer>
      <p>step:</p>
      <h2>{stageToString(stage)}</h2>
      {showVotes && <VotesLine votes={votes} readonly={true}></VotesLine>}
    </StageTextContainer>
  );
};
