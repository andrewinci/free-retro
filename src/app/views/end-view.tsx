import styled from "styled-components";
import { EmptyButton } from "../components/buttons";
import * as State from "../state";
import { ActionState, Stage } from "../state";

const Container = styled.div`
  position: absolute;
  max-width: 22em;
  width: 40%;
  left: 50%;
  transform: translateX(-50%);
`;
const StyledP = styled.p`
  font-size: 1em;
  text-align: center;
`;

const RefreshPage = styled(EmptyButton)`
  background: #d9d9d9;
  width: 100%;
  height: 1.8em;
  font-size: 1.2em;
  font-weight: bold;
  margin: auto;
  margin-top: 0.5em;
`;

const EndRetroView = (props: {
  sessionId: string;
  actions?: ActionState[];
}) => {
  const { sessionId, actions } = props;
  return (
    <Container>
      <StyledP>This retro is now concluded.</StyledP>
      <RefreshPage
        onClick={() => {
          State.initAppState(sessionId, Stage.Create, actions);
        }}>
        🚀 Start a new retro
      </RefreshPage>
    </Container>
  );
};

export default EndRetroView;
