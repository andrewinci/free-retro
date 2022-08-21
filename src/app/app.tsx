import { useMemo, useState } from "react";
import styled from "styled-components";
import { ColumnState, Stage, ActionState } from "./state";
import { getAppState, onStateChange } from "./state/automerge-state";
import BoardView from "./views/board-view";
import CreateRetroView from "./views/create-retro";
import DiscussView from "./views/discuss";
import EndRetroView from "./views/end-view";
import JoinRetroView from "./views/join-retro";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const AppContainer = styled.div`
  * {
    font-family: monospace;
  }
`;

const Title = styled.div`
  width: 100%;
  min-width: 240px;
  height: 4.5em;
  background: white;
  position: fixed;
  z-index: 1;
  top: 0;
  padding-top: 1em;
  text-align: center;

  h1 {
    margin: 0;
    font-size: 1.4em;

    @media only screen and (min-width: 734px) {
      font-size: 2em;
    }

    a {
      color: inherit; /* blue colors for links too */
      text-decoration: inherit; /* no underline */
    }
  }

  h2 {
    margin: 0;
    font-size: 1em;

    @media only screen and (min-width: 734px) {
      font-size: 1.5em;
    }
  }
`;

const Space = styled.div`
  height: 6em;

  @media only screen and (min-width: 734px) {
    height: 7em;
  }
`;

const CurrentView = (props: {
  stage: Stage;
  columns: ColumnState[];
  discussCardIndex: number;
  sessionId: string;
  actions: ActionState[];
}) => {
  const { stage, columns, discussCardIndex, sessionId, actions } = props;
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
          cardIndex={discussCardIndex}
          actions={actions}
        />
      );
    case Stage.End:
      return <EndRetroView sessionId={sessionId} actions={actions} />;
  }
};

export const App = () => {
  const [appState, setState] = useState(getAppState());
  useMemo(() => onStateChange((newState) => setState(newState)), []);
  // view selector depending on the app stage
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Title>
          <h1>
            <a href="/">⚡️ Free retro 🗣️</a>
          </h1>
          {appState.retroName ? <h2>{`"${appState.retroName}"`}</h2> : <></>}
        </Title>
        <Space />
        <CurrentView
          sessionId={appState.sessionId}
          columns={appState.columns ?? []}
          discussCardIndex={appState.discussCardIndex?.value ?? 0}
          stage={appState.stage}
          actions={appState.actions ?? []}
        />
      </AppContainer>
    </DndProvider>
  );
};
