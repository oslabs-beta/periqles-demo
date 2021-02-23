//DEMO USER CLASSES, FUNCTIONS AND INFO

// DemoUser class:
class DemoUser {
  constructor(userId, username, password, email, gender, pizzaTopping, age) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.email = email;
    this.gender = gender;
    this.pizzaTopping = pizzaTopping;
    this.age = age;
  }
}

// Mock database seeded with initial user
const demoUsersById = new Map([
  [0, new DemoUser('0', 'bob', 'anna', 'bob@bob.io', 'MALE', 'HAWAIIAN', 10)],
]);

// Seed initial user
let nextUserId = 1;

function getDemoUser(userId) {
  return demoUsersById.get(userId);
}
function getDemoUserOrThrow(userId) {
  const demoUser = getDemoUser(userId);
  if (!demoUser) {
    throw new Error(`Invariant exception, DemoUser ${userId} not found`);
  }

  return demoUser;
}

function getLastDemoUserOrThrow() {
  let lastDemoUser;
  const demoUsersIterator = demoUsersById[Symbol.iterator]();

  for (const userItem of demoUsersIterator) {
    lastDemoUser = userItem[1];
  }

  return lastDemoUser;
}

function getAllUsers() {
  let demoUserList = [];
  const demoUsersIterator = demoUsersById[Symbol.iterator]();

  for (const userItem of demoUsersIterator) {
    demoUserList.push(userItem[1]);
  }

  return demoUserList;
}

// addUser function
function addUser({
  userId,
  username,
  password,
  email,
  gender,
  pizzaTopping,
  age,
}) {
  const newUser = new DemoUser(
    `${nextUserId++}`,
    username,
    password,
    email,
    gender,
    pizzaTopping,
    age,
  );
  demoUsersById.set(newUser.userId, newUser);
  return newUser;
}

module.exports = {
  DemoUser,
  getDemoUserOrThrow,
  getLastDemoUserOrThrow,
  getAllUsers,
  addUser,
};
