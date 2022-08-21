import styled from "styled-components";
import { ActionColumn } from "../components";
import { ButtonContainer } from "../components/buttons";
import * as State from "../state";
import { ActionState, Stage } from "../state";

const EndViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-between;
  justify-content: center;
`;
const StyledP = styled.p`
  font-size: 1em;
  text-align: center;
`;

const RefreshPageButton = styled(ButtonContainer)`
  background: #d9d9d9;
  max-width: 18em;
  width: 100%;
  height: 1.8em;
  font-size: 1.2em;
  font-weight: bold;
  margin: auto;
  margin-top: 0.5em;
  margin-bottom: 2em;
`;

const EndRetroView = (props: {
  sessionId: string;
  actions?: ActionState[];
}) => {
  const { sessionId, actions } = props;
  return (
    <EndViewContainer>
      <StyledP>
        This retro is now concluded. 🎉
        <br />
        Review the actions or start a new one. ✅ <br />
        <br />
        <strong>Note:</strong> these actions will be still available in
        <br /> the new retro as long as the same retro id is used 💾
      </StyledP>
      <RefreshPageButton
        onClick={() => {
          State.initAppState(sessionId, Stage.Create, actions);
        }}>
        🚀 Start a new retro
      </RefreshPageButton>
      <ActionColumn
        style={{ width: "100%", maxWidth: "40em", marginBottom: "2em" }}
        actions={actions ?? []}
      />
    </EndViewContainer>
  );
};

export default EndRetroView;
