const MAX_TITLE_LENGTH = 70;
const MAX_DESCRIPTION_LENGTH = 160;
const BRAND_SUFFIX = " | EDU TMT Steel";
export const BLOG_AUTHOR_ORGANIZATION = "EDU TMT Steel Limited";

export function getPersonAuthorName(authorName?: string | null) {
  const name = authorName?.trim();
  if (!name || name.includes("@") || /edu tmt steel|\b(team|editorial)\b/i.test(name)) {
    return null;
  }
  return name;
}

export function getBlogDisplayAuthorName(authorName?: string | null) {
  return getPersonAuthorName(authorName) || BLOG_AUTHOR_ORGANIZATION;
}

export function getBlogSeoTitle(title: string, seoTitle?: string | null) {
  const customTitle = seoTitle?.trim();
  if (customTitle) return customTitle.slice(0, MAX_TITLE_LENGTH);

  const articleTitle = title.trim();
  const availableTitleLength = MAX_TITLE_LENGTH - BRAND_SUFFIX.length;
  if (articleTitle.length <= availableTitleLength) return articleTitle + BRAND_SUFFIX;

  return articleTitle.slice(0, availableTitleLength - 1).trimEnd() + "…" + BRAND_SUFFIX;
}

export function getBlogSeoDescription(
  seoDescription?: string | null,
  excerpt?: string | null,
  body?: string | null,
) {
  const bodySummary = body
    ?.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/^\s{0,3}(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/gm, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const description =
    seoDescription?.trim() ||
    excerpt?.trim() ||
    bodySummary ||
    "Construction material guides and practical building advice from EDU TMT Steel in Abuja.";
  const normalized = description.replace(/\s+/g, " ");
  if (normalized.length <= MAX_DESCRIPTION_LENGTH) return normalized;

  const shortened = normalized.slice(0, MAX_DESCRIPTION_LENGTH - 1);
  const wordBoundary = shortened.lastIndexOf(" ");
  const excerptEnd =
    wordBoundary >= MAX_DESCRIPTION_LENGTH * 0.65 ? wordBoundary : shortened.length;
  return shortened.slice(0, excerptEnd).trimEnd() + "…";
}

export const BLOG_SEO_LIMITS = {
  title: MAX_TITLE_LENGTH,
  description: MAX_DESCRIPTION_LENGTH,
};
