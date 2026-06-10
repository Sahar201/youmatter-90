import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext.jsx';
import {
  PRIMARY_EMOTIONS,
  SECONDARY_EMOTIONS,
  SKILLS,
  DAYS,
  RATINGS,
  FELT_AFTER,
} from '../data/diary.js';
import {
  loadWeek,
  saveWeek,
  getWeeks,
  weekHasData,
} from '../services/diaryService.js';
import {
  getWeekStart,
  addWeeks,
  formatWeekRange,
  isCurrentWeek,
} from '../utils/week.js';
import styles from '../styles/DiaryCard.module.css';

/** Tint an emotion cell from white (0) → teal (5). */
const ratingTint = (value) =>
  value > 0 ? `rgba(74, 155, 142, ${0.08 + value * 0.14})` : 'transparent';

const DiaryCard = () => {
  const toast = useToast();

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [week, setWeek] = useState(() => loadWeek(getWeekStart(new Date())));
  const [readOnly, setReadOnly] = useState(false);
  const [history, setHistory] = useState([]);
  const [savedAt, setSavedAt] = useState(null);

  const dirty = useRef(false);
  const saveTimer = useRef(null);

  const refreshHistory = useCallback(() => setHistory(getWeeks()), []);

  // Load the selected week whenever it changes.
  useEffect(() => {
    setWeek(loadWeek(weekStart));
    dirty.current = false;
  }, [weekStart]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  // Persist the saved-at timestamp from the loaded week.
  useEffect(() => {
    setSavedAt(week.updatedAt || null);
  }, [week.weekStartDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback(
    (nextWeek, { silent } = {}) => {
      const saved = saveWeek(nextWeek);
      setSavedAt(saved.updatedAt);
      refreshHistory();
      if (!silent) toast.success('Your week has been saved 🌿');
    },
    [refreshHistory, toast]
  );

  // Debounced autosave whenever the week changes from a user edit.
  useEffect(() => {
    if (!dirty.current) return undefined;
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (weekHasData(week)) persist(week, { silent: true });
    }, 700);
    return () => window.clearTimeout(saveTimer.current);
  }, [week, persist]);

  // Generic immutable update helper; marks the week dirty so autosave runs.
  const mutate = (mutator) => {
    dirty.current = true;
    setWeek((prev) => {
      const next = structuredClone(prev);
      mutator(next);
      return next;
    });
  };

  const setEmotionName = (group, rowIndex, value) =>
    mutate((w) => {
      w[group][rowIndex].name = value;
    });

  const setEmotionRating = (group, rowIndex, dayIndex, value) =>
    mutate((w) => {
      w[group][rowIndex].ratings[dayIndex] = Number(value);
    });

  const toggleSkill = (skill, dayIndex) =>
    mutate((w) => {
      w.skills[skill][dayIndex] = w.skills[skill][dayIndex] === 'Y' ? 'N' : 'Y';
    });

  const setFelt = (dayIndex, value) =>
    mutate((w) => {
      w.feltAfter[dayIndex] = value;
    });

  const handleSaveClick = () => {
    window.clearTimeout(saveTimer.current);
    persist(week);
  };

  const goToWeek = (n) => {
    setReadOnly(false);
    setWeekStart((prev) => addWeeks(prev, n));
  };

  const viewHistoryWeek = (weekStartDate) => {
    setReadOnly(true);
    setWeekStart(getWeekStart(new Date(`${weekStartDate}T00:00:00`)));
  };

  // Dates shown in the column headers (Mon 9, Tue 10, …).
  const dayDates = DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d.getDate();
  });

  const renderEmotionRows = (group) =>
    week[group].map((row, rowIndex) => (
      <tr key={`${group}-${rowIndex}`}>
        <th scope="row" className={styles.rowLabel}>
          <input
            type="text"
            className={styles.emotionInput}
            value={row.name}
            placeholder="Enter emotion…"
            onChange={(e) => setEmotionName(group, rowIndex, e.target.value)}
            disabled={readOnly}
            aria-label={`Emotion ${rowIndex + 1} name`}
          />
        </th>
        {DAYS.map((day, i) => (
          <td key={day} style={{ backgroundColor: ratingTint(row.ratings[i]) }}>
            <select
              className={styles.select}
              value={row.ratings[i]}
              onChange={(e) => setEmotionRating(group, rowIndex, i, e.target.value)}
              disabled={readOnly}
              aria-label={`${row.name || `Emotion ${rowIndex + 1}`} on ${day}`}
            >
              {RATINGS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </td>
        ))}
      </tr>
    ));

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">Diary Card</h1>
        <p className="section-subtitle">
          A gentle, structured way to notice your feelings and the skills that help.
        </p>

        {/* ---------------------- Intro ---------------------- */}
        <motion.section
          className={styles.intro}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>
            We all go through moments where emotions feel too big to understand.
            This card is your safe space to put those feelings into words.
          </p>
          <p>
            After reading our articles and trying our breathing, grounding, and
            mindfulness skills, this is where you come to track how you are doing.
          </p>
          <p>
            Whenever you feel anxious, sad, or overwhelmed, open this card, find
            your feeling, rate it 0–5, mark which skill you used, and tell us if it
            helped.
          </p>

          <div className={styles.legend}>
            <div>
              <span className={styles.legendLabel}>Primary emotions — examples</span>
              <div className={styles.chips}>
                {PRIMARY_EMOTIONS.map((e) => (
                  <span key={e} className={styles.chip}>{e}</span>
                ))}
              </div>
            </div>
            <div>
              <span className={styles.legendLabel}>Secondary emotions — examples</span>
              <div className={styles.chips}>
                {SECONDARY_EMOTIONS.map((e) => (
                  <span key={e} className={`${styles.chip} ${styles.chipAlt}`}>{e}</span>
                ))}
              </div>
            </div>
            <div>
              <span className={styles.legendLabel}>Skills</span>
              <div className={styles.chips}>
                {SKILLS.map((s) => (
                  <span key={s} className={`${styles.chip} ${styles.chipGold}`}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          <p className={styles.howto}>
            Write your own emotions in the blank rows, rate each 0–5, mark which
            skills you used (Y/N), note how you felt after, and save your week.
          </p>
        </motion.section>

        {/* ---------------------- Week selector ---------------------- */}
        <div className={styles.weekBar}>
          <button
            className={styles.weekArrow}
            onClick={() => goToWeek(-1)}
            aria-label="Previous week"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
          <div className={styles.weekLabel}>
            <i className="fa-regular fa-calendar" />
            <span>{formatWeekRange(weekStart)}</span>
            {isCurrentWeek(weekStart) && <span className={styles.thisWeek}>This week</span>}
          </div>
          <button
            className={styles.weekArrow}
            onClick={() => goToWeek(1)}
            aria-label="Next week"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>

        {readOnly && (
          <div className={styles.readOnlyBanner}>
            <span>
              <i className="fa-regular fa-eye" /> Viewing a past week (read only).
            </span>
            <button className={styles.editBtn} onClick={() => setReadOnly(false)}>
              <i className="fa-solid fa-pen" /> Edit this week
            </button>
          </div>
        )}

        {/* ---------------------- Diary table ---------------------- */}
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.cornerCell}>Emotion / Skill</th>
                {DAYS.map((day, i) => (
                  <th key={day} className={styles.dayHead}>
                    <span>{day}</span>
                    <small>{dayDates[i]}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={styles.sectionRow}>
                <th colSpan={8}>Primary Emotions — write your own</th>
              </tr>
              {renderEmotionRows('primaryEmotions')}

              <tr className={styles.sectionRow}>
                <th colSpan={8}>Secondary Emotions — write your own</th>
              </tr>
              {renderEmotionRows('secondaryEmotions')}

              <tr className={styles.sectionRow}>
                <th colSpan={8}>Skills Used</th>
              </tr>
              {SKILLS.map((skill) => (
                <tr key={skill}>
                  <th scope="row" className={styles.rowLabel}>{skill}</th>
                  {DAYS.map((day, i) => {
                    const yes = week.skills[skill][i] === 'Y';
                    return (
                      <td key={day}>
                        <button
                          type="button"
                          className={`${styles.skillToggle} ${yes ? styles.skillYes : ''}`}
                          onClick={() => toggleSkill(skill, i)}
                          disabled={readOnly}
                          aria-label={`${skill} on ${day}: ${yes ? 'yes' : 'no'}`}
                        >
                          {yes ? 'Y' : 'N'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr className={styles.sectionRow}>
                <th colSpan={8}>How I Felt After</th>
              </tr>
              <tr>
                <th scope="row" className={styles.rowLabel}>Felt after skills</th>
                {DAYS.map((day, i) => (
                  <td key={day}>
                    <select
                      className={`${styles.select} ${styles.feltSelect}`}
                      value={week.feltAfter[i]}
                      onChange={(e) => setFelt(i, e.target.value)}
                      disabled={readOnly}
                      aria-label={`How you felt after on ${day}`}
                    >
                      <option value="">—</option>
                      {FELT_AFTER.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ---------------------- Save ---------------------- */}
        <div className={styles.saveBar}>
          <span className={styles.savedNote}>
            {savedAt ? (
              <>
                <i className="fa-solid fa-cloud-arrow-up" /> Saved automatically ·{' '}
                {new Date(savedAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </>
            ) : (
              <>
                <i className="fa-regular fa-floppy-disk" /> Changes save automatically.
              </>
            )}
          </span>
          {!readOnly && (
            <button className="btn btn-primary" onClick={handleSaveClick}>
              <i className="fa-solid fa-heart" /> Save This Week
            </button>
          )}
        </div>

        {/* ---------------------- History ---------------------- */}
        <section className={styles.history}>
          <h2 className={styles.historyTitle}>Past Weeks</h2>
          {history.length === 0 ? (
            <p className={styles.historyEmpty}>
              Your saved weeks will appear here once you start tracking.
            </p>
          ) : (
            <div className={styles.historyList}>
              {history.map((w) => {
                const active = w.weekStartDate === week.weekStartDate;
                return (
                  <button
                    key={w.weekStartDate}
                    className={`${styles.historyItem} ${active ? styles.historyActive : ''}`}
                    onClick={() => viewHistoryWeek(w.weekStartDate)}
                  >
                    <span className={styles.historyRange}>
                      <i className="fa-regular fa-calendar-check" />
                      {formatWeekRange(new Date(`${w.weekStartDate}T00:00:00`))}
                    </span>
                    <i className="fa-solid fa-arrow-right" />
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DiaryCard;
