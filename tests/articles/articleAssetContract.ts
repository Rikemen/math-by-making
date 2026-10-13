import fs from "node:fs";
import path from "node:path";

export interface ArticleAssetContract {
  articleTitle: string;
  directory: string;
  files: readonly string[];
}

export const requiredFiles = (articleTitle: string, directory: string, files: readonly string[]): ArticleAssetContract => ({
  articleTitle,
  directory,
  files,
});

export const validateRequiredFiles = ({ articleTitle, directory, files }: ArticleAssetContract): string[] =>
  files.filter((file) => !fs.existsSync(path.resolve(directory, file))).map((file) => `${articleTitle}: ${file} がありません`);
