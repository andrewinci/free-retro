import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Stage } from "./state";
import { getAppState, onStateChange } from "./state/automerge-state";
import BoardView from "./views/board-view";
import CreateRetroView from "./views/create-retro";
import JoinRetroView from "./views/join-retro";

const Container = styled.div`
  padding-left: 1rem;
  * {
    font-family: monospace;
  }
`;

const Title = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  h1 {
    margin: 0;
  }
  h2 {
    margin: 0;
  }
`;

const Space = styled.div`
  height: 7em;
`;

export const App = () => {
  const [appState, setState] = useState(getAppState());
  useMemo(() => onStateChange((newState) => setState(newState)), []);
  // view selector depending on the app stage
  const currentView = () => {
    switch (appState.stage) {
      case Stage.Join:
        <JoinRetroView />;
      case Stage.Create:
        return <CreateRetroView />;
      case Stage.AddTickets:
        return (
          <BoardView
            columnsData={appState.columns}
            stage={appState.stage}
            readOnly={false}></BoardView>
        );
      case Stage.Vote:
        return (
          <BoardView
            columnsData={appState.columns}
            stage={appState.stage}
            readOnly={true}></BoardView>
        );
    }
  };
  return (
    <Container>
      <Title>
        <h1>⚡ Free retro 🗣️</h1>
        {appState.retroName ? <h2>{`"${appState.retroName}"`}</h2> : <></>}
      </Title>
      <Space />
      {currentView()}
    </Container>
  );
};
