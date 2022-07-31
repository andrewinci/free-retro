import React, { useState } from "react";
import styled from "styled-components";
import { EmptyButton } from "../components/buttons";
import * as State from "../state";

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

const CreateButton = styled(EmptyButton)`
  width: 100%;
  height: 1.8em;
  font-size: 1.2em;
  font-weight: bold;
  margin: auto;
  margin-top: 0.5em;
`;

const CreateRetroView = () => {
  const currentUser = State.getUser();
  const [state, setState] = useState({
    retroName: "Let's chat",
    username: currentUser?.username ?? "coolio",
  });
  return (
    <Container>
      <Label>Retro name: </Label>
      <Input
        value={state.retroName}
        onChange={(e) => setState({ ...state, retroName: e.target.value })}
      />
      <Label>Username: </Label>
      <Input
        value={state.username}
        onChange={(e) => setState({ ...state, username: e.target.value })}
      />
      <CreateButton
        onClick={async () =>
          await State.createRetro(state.username, state.retroName)
        }>
        🚀 Create retro
      </CreateButton>
    </Container>
  );
};

export default CreateRetroView;