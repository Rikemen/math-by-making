import { articles } from "@/content/articles";
import { subjects } from "@/content/subjects";
import type { ArticleMeta, SubjectMeta } from "@/content/types";

export const getSubjectBySlug = (subjectSlug: string): SubjectMeta | undefined => subjects.find(({ slug }) => slug === subjectSlug);

export const getTopLevelArticlesBySubjectSlug = (subjectSlug: string): ArticleMeta[] =>
  articles.filter((article) => article.subjectSlug === subjectSlug && !article.parentSlug);

export const getSubArticlesByParentSlug = (parentSlug: string): ArticleMeta[] =>
  articles.filter((article) => article.parentSlug === parentSlug);

export const getAllArticlesBySubjectSlug = (subjectSlug: string): ArticleMeta[] =>
  articles.filter((article) => article.subjectSlug === subjectSlug);

export const getArticlesBySubjectSlug = (subjectSlug: string): ArticleMeta[] =>
  getTopLevelArticlesBySubjectSlug(subjectSlug);
