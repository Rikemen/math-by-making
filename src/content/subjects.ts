import type { SubjectMeta } from "@/content/types";

export const linearAlgebraSubject: SubjectMeta = {
  slug: "linear-algebra",
  title: "線形代数",
  description: "ベクトルと行列を使い、空間とその変換を手を動かして学びます。",
  status: "published",
  href: "/subjects/linear-algebra",
};

export const subjects: readonly SubjectMeta[] = [linearAlgebraSubject];
