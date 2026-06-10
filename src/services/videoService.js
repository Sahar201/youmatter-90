import videos from '../data/videos.js';

/**
 * Videos are static content shipped with the app (no backend needed), so the
 * Mindful Library works on any deploy, including a static site on Vercel.
 */

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all videos, optionally filtered by category.
 * @param {string} [category] - category name or "All Topics"
 */
export const getVideos = async (category) => {
  await delay();
  if (!category || category === 'All Topics' || category === 'All') return videos;
  return videos.filter((v) => v.category === category);
};

/**
 * Get a single video by id. Throws if not found.
 */
export const getVideoById = async (id) => {
  await delay();
  const video = videos.find((v) => v.id === id);
  if (!video) throw new Error('Video not found');
  return video;
};
