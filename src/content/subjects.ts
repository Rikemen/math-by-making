import type { SubjectMeta } from "@/content/types";

export const linearAlgebraSubject: SubjectMeta = {
  slug: "linear-algebra",
  title: "線形代数",
  description: "ベクトルと行列を使い、空間とその変換を手を動かして学びます。",
  status: "published",
  href: "/subjects/linear-algebra",
};

const plannedSubject = (slug: string, title: string, description: string): SubjectMeta => ({
  slug,
  title,
  description,
  status: "planned",
  href: `/subjects/${slug}`,
});

export const subjects: readonly SubjectMeta[] = [
  linearAlgebraSubject,
  plannedSubject("calculus", "微分積分", "変化と蓄積を数式とコードで学びます。"),
  plannedSubject("differential-equations", "微分方程式", "変化を記述する方程式と現象のつながりを学びます。"),
  plannedSubject("probability-statistics", "確率・統計学", "不確実さとデータの規則性を実験から学びます。"),
  plannedSubject("complex-analysis", "複素関数", "複素数の世界で関数が描く構造を学びます。"),
  plannedSubject("differential-geometry", "微分幾何学", "曲線や曲面の形を微分を使って学びます。"),
  plannedSubject("number-theory", "整数論", "整数に潜む規則と証明を計算から探ります。"),
  plannedSubject("mechanics", "力学", "運動の法則を数式とシミュレーションで学びます。"),
  plannedSubject("electromagnetism", "電磁気学", "電場と磁場のふるまいを可視化して学びます。"),
  plannedSubject("electronics", "電子工作", "回路を組み、測り、物理法則を確かめます。"),
  plannedSubject("relativity", "相対性理論", "時間と空間の関係を思考実験から学びます。"),
  plannedSubject("quantum-mechanics", "量子力学", "ミクロな世界の確率的なふるまいを学びます。"),
];
