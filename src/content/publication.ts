import type { PublicationStatus } from "@/content/types";

export type PublicationLabelKey = "publication.published" | "publication.planned";

export const isPublished = (status: PublicationStatus): boolean => status === "published";

export const getPublicationLabelKey = (status: PublicationStatus): PublicationLabelKey => {
  if (isPublished(status)) return "publication.published";
  return "publication.planned";
};
