import articles from '../data/articles.js';

/**
 * Articles are static content shipped with the app (no backend needed), so the
 * site works anywhere — including a plain static deploy on Vercel.
 * These helpers keep an async signature so pages can keep their loading states.
 */

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all articles, optionally filtered by category.
 * @param {string} [category] - category name or "All"
 */
export const getArticles = async (category) => {
  await delay();
  if (!category || category === 'All') return articles;
  return articles.filter((a) => a.category === category);
};

/**
 * Get a single article by id. Throws if not found.
 */
export const getArticleById = async (id) => {
  await delay();
  const article = articles.find((a) => a.id === id);
  if (!article) throw new Error('Article not found');
  return article;
};
