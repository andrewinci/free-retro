import { getAppState } from "./automerge-state";
import { getUser, setUserName } from "./user";

const getTotalVotesPerUser = () => {
  const { columns } = getAppState();
  const totCards =
    columns?.map((c) => c.groups.length).reduce((a, b) => a + b, 0) ?? 0;
  return Math.ceil(Math.max(3, totCards * 0.6));
};

export const getRemainingUserVotes = () => {
  const { id } = getUser() ?? setUserName();
  const { columns } = getAppState();
  const total =
    columns
      ?.flatMap((c) => c.groups)
      .map((c) => c.votes[id]?.value ?? 0)
      .reduce((a, b) => a + b, 0) ?? 0;
  // each user has 5 votes max
  //todo: adapt depending on the number of users
  // and cards
  return getTotalVotesPerUser() - total;
};
