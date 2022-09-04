import { getAllGroups } from "./state";
import { getUser, setUserName } from "./user";

const getTotalVotesPerUser = () => {
  return Math.ceil(Math.max(3, getAllGroups().length * 0.4));
};

export const getRemainingUserVotes = () => {
  const { id } = getUser() ?? setUserName();
  const total =
    getAllGroups()
      .map((c) => c.votes[id]?.value ?? 0)
      .reduce((a, b) => a + b, 0) ?? 0;
  // each user has 5 votes max
  //todo: adapt depending on the number of users
  // and cards
  return getTotalVotesPerUser() - total;
};
