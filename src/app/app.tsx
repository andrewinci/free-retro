import { useMemo, useState } from "react";
import styled from "styled-components";
import { ColumnState, Stage, ActionState, Id } from "./state";
import { getAppState, onStateChange } from "./state/automerge-state";
import { BoardPage, DiscussPage, EndRetroPage } from "./pages";
import { CreateRetroPage, JoinRetroPage } from "./pagesv2";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { getAllGroups } from "./state/state";
import { MantineProvider } from "@mantine/core";

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
  columnsData: Record<Id, ColumnState>;
  discussCardIndex: number;
  sessionId: string;
  actions: Record<Id, ActionState>;
}) => {
  const { stage, columnsData, discussCardIndex, sessionId, actions } = props;
  switch (stage) {
    case Stage.Join:
      return <JoinRetroPage />;
    case Stage.Create:
      return <CreateRetroPage />;
    case Stage.AddTickets:
      return (
        <BoardPage columnsData={columnsData} stage={stage} readOnly={false} />
      );
    case Stage.Group:
      return (
        <BoardPage columnsData={columnsData} stage={stage} readOnly={true} />
      );
    case Stage.Vote:
      return (
        <BoardPage columnsData={columnsData} stage={stage} readOnly={true} />
      );
    case Stage.Discuss:
      return (
        <DiscussPage
          cards={getAllGroups()}
          cardIndex={discussCardIndex}
          actions={actions}
        />
      );
    case Stage.End:
      return <EndRetroPage sessionId={sessionId} actions={actions} />;
  }
};

export const App = () => {
  const [appState, setState] = useState(getAppState());
  useMemo(() => onStateChange((newState) => setState(newState)), []);
  // view selector depending on the app stage
  return (
    <DndProvider backend={HTML5Backend}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Title className="example">
          <h1>
            <a href="/">⚡️ Free retro 🗣️</a>
          </h1>
          {appState.retroName ? <h2>{`"${appState.retroName}"`}</h2> : <></>}
        </Title>
        <Space />
        <CurrentView
          sessionId={appState.sessionId}
          columnsData={appState.columns ?? {}}
          discussCardIndex={appState.discussCardIndex?.value ?? 0}
          stage={appState.stage}
          actions={appState.actions ?? {}}
        />
      </MantineProvider>
    </DndProvider>
  );
};
