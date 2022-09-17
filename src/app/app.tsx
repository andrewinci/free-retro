import { useMemo, useState } from "react";
import { ColumnState, Stage, ActionState, Id } from "./state";
import { getAppState, onStateChange } from "./state/automerge-state";
import { BoardPage, DiscussPage } from "./pages";
import { CreateRetroPage, JoinRetroPage, EndRetroPage } from "./pages";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import * as State from "./state";
import {
  ActionIcon,
  AppShell,
  Button,
  Grid,
  Group,
  Header,
  MantineProvider,
  Stack,
  Title,
} from "@mantine/core";
import styled from "@emotion/styled";
import { ActionSidebar, StageText } from "./components";
import { IconArrowRight } from "@tabler/icons";

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
          cards={State.getAllGroups()}
          cardIndex={discussCardIndex}
        />
      );
    case Stage.End:
      return <EndRetroPage sessionId={sessionId} actions={actions} />;
  }
};

const AppHeader = ({
  stage,
  retroName,
  onShowActionClick,
}: {
  stage: Stage;
  retroName: string;
  onShowActionClick: () => void;
}) => {
  // view selector depending on the app stage
  const changeStage = async (change: "next" | "back") => {
    const res = confirm(
      `Before moving to the next stage, make sure that everyone is ready to go ahead.\nClick ok to go to the next stage`
    );
    if (res) {
      await State.changeStage(change);
    }
  };
  const showActionButton = stage != Stage.Join && stage != Stage.Create;
  const showNextButton = showActionButton && stage != Stage.End;

  return (
    <Header height={80}>
      <Grid m={0} style={{ height: "100%" }} align={"center"}>
        <Grid.Col span={4}>
          <StageText votes={State.getRemainingUserVotes()} stage={stage} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack spacing={0} align={"center"} style={{ minWidth: "185px" }}>
            <UnstyledLink href="/">
              <Title order={2}>⚡️ Free retro 🗣️</Title>
            </UnstyledLink>
            {retroName && <Title italic order={5}>{`"${retroName}"`}</Title>}
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Group mr={8} position="right" noWrap>
            <Button
              hidden={!showActionButton}
              onClick={() => onShowActionClick()}>
              Actions
            </Button>
            {showNextButton && (
              <ActionIcon
                title="next step"
                onClick={async () => await changeStage("next")}
                size="xl">
                <IconArrowRight size={100} />
              </ActionIcon>
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </Header>
  );
};

export const App = () => {
  const [appState, setState] = useState(getAppState());
  const [sidebarHidden, setSidebarHidden] = useState(true);
  useMemo(() => onStateChange((newState) => setState(newState)), []);
  const { stage, retroName, sessionId, columns, discussCardIndex, actions } =
    appState;
  useMemo(() => {
    if (appState.stage == Stage.Discuss) setSidebarHidden(false);
  }, [appState.stage]);

  return (
    <DndProvider backend={HTML5Backend}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AutoWidthAppShell
          style={{ width: "auto" }}
          padding="md"
          header={
            <AppHeader
              onShowActionClick={() => setSidebarHidden(!sidebarHidden)}
              retroName={retroName ?? ""}
              stage={stage}
            />
          }
          aside={
            <ActionSidebar hidden={sidebarHidden} actions={appState.actions} />
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}>
          <CurrentView
            sessionId={sessionId}
            columnsData={columns ?? {}}
            discussCardIndex={discussCardIndex?.value ?? 0}
            stage={stage}
            actions={actions ?? {}}
          />
        </AutoWidthAppShell>
      </MantineProvider>
    </DndProvider>
  );
};

const UnstyledLink = styled.a`
  padding-top: 4px;
  color: inherit;
  text-decoration: inherit;
`;

const AutoWidthAppShell = styled(AppShell)`
  main {
    width: 100vw;
    overflow-x: auto;
  }
`;
