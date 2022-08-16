import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { ColumnState, Stage } from "./state";
import { getAppState, onStateChange } from "./state/automerge-state";
import BoardView from "./views/board-view";
import CreateRetroView from "./views/create-retro";
import DiscussView from "./views/discuss";
import EndRetroView from "./views/end-view";
import JoinRetroView from "./views/join-retro";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

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
    a {
      color: inherit; /* blue colors for links too */
      text-decoration: inherit; /* no underline */
    }
  }
  h2 {
    margin: 0;
  }
`;

const Space = styled.div`
  height: 7em;
`;

const CurrentView = (props: {
  stage: Stage;
  columns: ColumnState[];
  discussCardIndex: number;
}) => {
  const { stage, columns, discussCardIndex } = props;
  switch (stage) {
    case Stage.Join:
      return <JoinRetroView />;
    case Stage.Create:
      return <CreateRetroView />;
    case Stage.AddTickets:
      return (
        <BoardView columnsData={columns ?? []} stage={stage} readOnly={false} />
      );
    case Stage.Group:
      return (
        <BoardView columnsData={columns ?? []} stage={stage} readOnly={true} />
      );
    case Stage.Vote:
      return (
        <BoardView columnsData={columns ?? []} stage={stage} readOnly={true} />
      );
    case Stage.Discuss:
      return (
        <DiscussView
          cards={columns?.flatMap((c) => c.groups) ?? []}
          index={discussCardIndex}
        />
      );
    case Stage.End:
      return <EndRetroView />;
  }
};

export const App = () => {
  const [appState, setState] = useState(getAppState());
  useMemo(() => onStateChange((newState) => setState(newState)), []);
  // view selector depending on the app stage
  return (
    <React.StrictMode>
      <DndProvider backend={HTML5Backend}>
        <Container>
          <Title>
            <h1>
              <a href="/">⚡ Free retro 🗣️</a>
            </h1>
            {appState.retroName ? <h2>{`"${appState.retroName}"`}</h2> : <></>}
          </Title>
          <Space />
          <CurrentView
            columns={appState.columns ?? []}
            discussCardIndex={appState.discussCardIndex?.value ?? 0}
            stage={appState.stage}></CurrentView>
        </Container>
      </DndProvider>
    </React.StrictMode>
  );
};
