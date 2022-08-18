import styled from "styled-components";
import { ButtonContainer } from "../components/buttons";
import { joinSession } from "../ws";

const Container = styled.div`
  position: absolute;
  max-width: 22em;
  width: 40%;
  left: 50%;
  transform: translateX(-50%);
`;

const JoinRetro = styled(ButtonContainer)`
  background: #d9d9d9;
  width: 100%;
  height: 1.8em;
  font-size: 1.2em;
  font-weight: bold;
  margin: auto;
  margin-top: 0.5em;
`;

const JoinRetroView = () => {
  return (
    <Container>
      <JoinRetro
        onClick={async () => {
          const sessionId = location.hash.substring(1);
          await joinSession(sessionId);
        }}>
        🚀 Join retro
      </JoinRetro>
    </Container>
  );
};

export default JoinRetroView;
