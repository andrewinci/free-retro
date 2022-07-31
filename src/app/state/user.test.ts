import { getUser, setUserName, User } from ".";

describe("User store", () => {
  const USER_KEY = "free-retro:user";
  beforeEach(() => localStorage.clear());
  it("returns null if the user state doesn't exist", () => {
    const user = getUser();
    expect(user).toBeNull();
  });
  it("returns the user if stored", () => {
    // arrange
    const testUser: User = { id: "123-3221-321", username: "test" };
    localStorage.setItem(USER_KEY, JSON.stringify(testUser));
    // act
    const user = getUser();
    // assert
    expect(user).toEqual(testUser);
  });
  it("doesn't update the user id on username change", () => {
    // arrange
    const newUsername = "test-username";
    const testUser: User = { id: "123-3221-321", username: "test" };
    localStorage.setItem(USER_KEY, JSON.stringify(testUser));
    // act
    const user = setUserName(newUsername);
    // assert
    expect(user.id).toEqual(testUser.id);
    expect(user.username).toEqual(newUsername);
  });
  it("creates the user if id doesn't exists on username set", () => {
    // arrange
    const newUsername = "test new username";
    // act
    const user = setUserName(newUsername);
    // assert
    const newUser = JSON.parse(localStorage.getItem(USER_KEY)!!) as User;
    expect(newUser).toEqual(user);
  });
});
