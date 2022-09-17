import { getAllGroups } from "./state";
import { getUser, setUserName } from "./user";

const getTotalVotesPerUser = () => {
  return Math.ceil(Math.min(Math.max(3, getAllGroups().length * 0.4), 6));
};

export const getRemainingUserVotes = () => {
  const { id } = getUser() ?? setUserName();
  const total =
    getAllGroups()
      .map((c) => c.votes[id]?.value ?? 0)
      .reduce((a, b) => a + b, 0) ?? 0;
  return getTotalVotesPerUser() - total;
};
