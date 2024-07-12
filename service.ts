import db from "./db.json";

export function getUser(username: string, password: string) {
  return db.users.find(
    (user) => user.username === username && user.password === password,
  );
}
