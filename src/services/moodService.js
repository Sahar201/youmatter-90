/**
 * Browser-based mood tracking (no database).
 *
 * Each user's mood entries are saved in localStorage, namespaced by user id,
 * so different accounts on the same device keep separate histories.
 */
import { getCurrentUser } from './authService.js';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const storageKey = () => {
  const user = getCurrentUser();
  if (!user) throw new Error('You must be logged in');
  return `youmatter_moods_${user.id}`;
};

const readMoods = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey())) || [];
  } catch {
    return [];
  }
};

const writeMoods = (moods) =>
  localStorage.setItem(storageKey(), JSON.stringify(moods));

/** Create a new mood entry for the current user. */
export const createMood = async ({ mood, note }) => {
  await delay();
  const moods = readMoods();
  const entry = {
    _id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),
    mood,
    note: (note || '').trim(),
    date: new Date().toISOString(),
  };
  moods.push(entry);
  writeMoods(moods);
  return entry;
};

/** Get the current user's mood entries (newest first), optionally limited. */
export const getMoods = async (limit) => {
  await delay();
  const moods = readMoods().sort((a, b) => new Date(b.date) - new Date(a.date));
  return limit ? moods.slice(0, limit) : moods;
};

/** Delete a mood entry by id. */
export const deleteMood = async (id) => {
  await delay();
  const moods = readMoods().filter((m) => m._id !== id);
  writeMoods(moods);
  return { message: 'Mood entry deleted', id };
};
