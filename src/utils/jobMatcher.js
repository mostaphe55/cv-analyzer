// src/utils/jobMatcher.js

import { JOB_SOURCES } from "../data/jobSources.js";

/**
 * Generate a real search URL for a Somali job portal.
 */

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getJobSource(job) {
  const requestedSource = normalize(job?.source);

  return (
    JOB_SOURCES.find(
      (source) =>
        normalize(source.id) === requestedSource ||
        normalize(source.name) === requestedSource,
    ) || JOB_SOURCES[0]
  );
}

function getSearchQuery(job) {
  return [job?.title, job?.company, job?.location || "Hargeisa", "Somalia"]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function generateJobLink(job) {
  if (!job || JOB_SOURCES.length === 0) {
    return {
      source: "Official Job Search",
      applyUrl: "",
      website: "",
      verified: false,
    };
  }

  const source = getJobSource(job);

  const query = encodeURIComponent(getSearchQuery(job));

  return {
    source: source.name,

    applyUrl: `${source.searchUrl}${query}`,

    website: source.baseUrl,

    verified: true,
  };
}
