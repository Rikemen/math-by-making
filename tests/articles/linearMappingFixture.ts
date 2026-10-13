import fs from "node:fs";
import path from "node:path";

export const articleDirectory = path.resolve(process.cwd(), "public/articles/linear-algebra/linear-mapping");
export const articleHtml = fs.readFileSync(path.resolve(articleDirectory, "index.html"), "utf8");

export const parseArticle = (): Document => new DOMParser().parseFromString(articleHtml, "text/html");
