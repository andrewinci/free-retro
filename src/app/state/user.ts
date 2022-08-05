import { User } from ".";
import { randomId } from "../helper/random";

const USER_KEY = "free-retro:user";
const DEFAULT_USER = "Coolio";

export function getUser(): User {
  const user = localStorage.getItem(USER_KEY);
  if (user) {
    return JSON.parse(user) as User;
  } else {
    return setUserName(DEFAULT_USER);
  }
}

export function setUserName(username: string): User {
  const user = getUser();
  const newUser = user ? { ...user, username } : { id: randomId(), username };
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  return newUser;
}
