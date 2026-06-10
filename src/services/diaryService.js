/**
 * Browser-based Diary Card storage (no database), namespaced per user — the
 * same approach used for accounts and moods, so it works on Vercel with no
 * backend. Each week is keyed by its Monday date (YYYY-MM-DD).
 *
 * Data shape per week:
 *   {
 *     weekStartDate, weekEndDate,
 *     primaryEmotions:   [ { name, ratings: number[7] (0–5) } x5 ],  // user-named
 *     secondaryEmotions: [ { name, ratings: number[7] (0–5) } x5 ],  // user-named
 *     skills:            { [skill]: ('Y'|'N')[7] },
 *     feltAfter:         (''|'Better'|'Same'|'Worse')[7],
 *     updatedAt
 *   }
 */
import { getCurrentUser } from './authService.js';
import { SKILLS, DAYS, EMOTION_ROWS } from '../data/diary.js';
import { getWeekStart, getWeekEnd, toISODate } from '../utils/week.js';

const storageKey = () => {
  const user = getCurrentUser();
  if (!user) throw new Error('You must be logged in');
  return `youmatter_diary_${user.id}`;
};

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey())) || {};
  } catch {
    return {};
  }
};

const writeAll = (map) =>
  localStorage.setItem(storageKey(), JSON.stringify(map));

/** Blank, user-named emotion rows. */
const emptyEmotionRows = () =>
  Array.from({ length: EMOTION_ROWS }, () => ({
    name: '',
    ratings: DAYS.map(() => 0),
  }));

/** Build a blank week. */
export const createEmptyWeek = (weekStart) => {
  const skills = {};
  SKILLS.forEach((s) => {
    skills[s] = DAYS.map(() => 'N');
  });

  return {
    weekStartDate: toISODate(weekStart),
    weekEndDate: toISODate(getWeekEnd(weekStart)),
    primaryEmotions: emptyEmotionRows(),
    secondaryEmotions: emptyEmotionRows(),
    skills,
    feltAfter: DAYS.map(() => ''),
    updatedAt: null,
  };
};

/** True when a stored week matches the current data shape. */
const isValidShape = (w) =>
  w &&
  Array.isArray(w.primaryEmotions) &&
  Array.isArray(w.secondaryEmotions) &&
  w.primaryEmotions[0] &&
  Array.isArray(w.primaryEmotions[0].ratings);

/** Get a saved week by id (Monday date), or null. */
export const getWeek = (weekId) => {
  const w = readAll()[weekId];
  return isValidShape(w) ? w : null;
};

/** Load the week for a date — a saved copy or a fresh blank one. */
export const loadWeek = (weekStart) => {
  const id = toISODate(getWeekStart(weekStart));
  return getWeek(id) || createEmptyWeek(weekStart);
};

/** Insert or update a week (POST /api/diary equivalent). */
export const saveWeek = (week) => {
  const all = readAll();
  all[week.weekStartDate] = { ...week, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[week.weekStartDate];
};

/** All saved weeks, newest first (GET /api/diary equivalent). */
export const getWeeks = () =>
  Object.values(readAll())
    .filter(isValidShape)
    .sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate));

/** True when a week contains anything worth saving. */
export const weekHasData = (week) => {
  const anyEmotion = (rows) =>
    rows.some((r) => r.name.trim() !== '' || r.ratings.some((v) => v > 0));
  const anySkill = Object.values(week.skills).some((days) =>
    days.some((v) => v === 'Y')
  );
  const anyFelt = week.feltAfter.some((v) => v);
  return (
    anyEmotion(week.primaryEmotions) ||
    anyEmotion(week.secondaryEmotions) ||
    anySkill ||
    anyFelt
  );
};
