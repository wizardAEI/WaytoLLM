export const giscusConfig = {
  repo: import.meta.env.VITE_GISCUS_REPO ?? "wizardAEI/WaytoLLM",
  repoId: import.meta.env.VITE_GISCUS_REPO_ID ?? "",
  category: import.meta.env.VITE_GISCUS_CATEGORY ?? "Comments",
  categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID ?? "",
};

export const isGiscusConfigured = Boolean(
  giscusConfig.repo && giscusConfig.repoId && giscusConfig.categoryId
);
