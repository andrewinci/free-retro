import { useState } from "react";
import styled from "styled-components";
import { EmptyButton } from "../components/buttons";
import * as State from "../state";
import { joinSession } from "../ws";

const Container = styled.div`
  position: absolute;
  max-width: 22em;
  width: 40%;
  left: 50%;
  transform: translateX(-50%);
`;
const Label = styled.label`
  font-size: 1em;
  font-weight: bold;
`;
const Input = styled.input`
  margin: 1em 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

const JoinRetro = styled(EmptyButton)`
  background: #d9d9d9;
  width: 100%;
  height: 1.8em;
  font-size: 1.2em;
  font-weight: bold;
  margin: auto;
  margin-top: 0.5em;
`;

const JoinRetroView = () => {
  const currentUser = State.getUser();
  const [state, setState] = useState({
    username: currentUser?.username ?? "coolio",
  });
  return (
    <Container>
      <Label>Username: </Label>
      <Input
        value={state.username}
        onChange={(e) => setState({ ...state, username: e.target.value })}
      />
      <JoinRetro
        onClick={async () => {
          const { username } = state;
          State.setUserName(username);
          const sessionId = location.hash.substring(1);
          await joinSession(sessionId);
        }}>
        🚀 Join retro
      </JoinRetro>
    </Container>
  );
};

export default JoinRetroView;
