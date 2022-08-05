import { User } from ".";
import { randomId } from "../helper/random";

const USER_KEY = "free-retro:user";

export function getUser(): User | null {
  const user = localStorage.getItem(USER_KEY);
  if (user) {
    return JSON.parse(user) as User;
  } else {
    return null;
  }
}

export function setUserName(username = "username"): User {
  const user = getUser();
  const newUser = user ? { ...user, username } : { id: randomId(), username };
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  return newUser;
}
