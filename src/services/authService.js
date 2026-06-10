/**
 * Browser-based authentication (no database).
 *
 * Accounts are saved in localStorage so they persist on the user's device and
 * work on Vercel without any server-side storage.
 * NOTE: This is intended for a personal / demo app. Passwords live only in the
 * browser and are not suitable for sensitive, multi-user production use.
 */

const USERS_KEY = 'youmatter_users';
const SESSION_KEY = 'youmatter_user';
const TOKEN_KEY = 'youmatter_token';

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email });

// Simulate a tiny async delay so the UI's loading states behave naturally.
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

/** Create a new account. Throws if the email is already registered. */
export const register = async ({ name, email, password }) => {
  await delay();
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account with that email already exists');
  }

  const user = {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),
    name: name.trim(),
    email: normalizedEmail,
    password, // stored locally only
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);

  return { user: publicUser(user), message: 'Account created successfully' };
};

/** Log in with email + password. Throws on invalid credentials. */
export const login = async ({ email, password }) => {
  await delay();
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(
    (u) => u.email === normalizedEmail && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const token = `local.${user.id}.${Date.now()}`;
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser(user)));
  localStorage.setItem(TOKEN_KEY, token);

  return { user: publicUser(user), token, message: 'Logged in successfully' };
};

/** Return the currently logged-in user, or null. */
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

/** Clear the current session (keeps registered accounts). */
export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
