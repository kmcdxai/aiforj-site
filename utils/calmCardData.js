import { TECHNIQUES } from '../app/techniques/data';
import { getInterventionById } from '../data/interventions';
import { ARCHETYPE_CARDS, HELP_PAGE_CARDS } from '../data/contentCards';

const BASE_URL = 'https://aiforj.com';

function cleanText(value = '', fallback = '') {
  const text = String(value || fallback).replace(/\s+/g, ' ').trim();
  return text || fallback;
}

function shorten(text, maxLength = 120) {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}...`;
}

function getTechniqueShortName(technique) {
  return cleanText(technique?.title)
    .split(':')[0]
    .replace(' Technique', '')
    .replace(/^The\s+/i, '')
    .trim();
}

function getPathFromUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

function getTechniqueTeasers(technique) {
  const titles = (technique?.steps || [])
    .filter((step) => step?.title && step.type !== 'rating')
    .map((step) => cleanText(step.title))
    .filter(Boolean)
    .slice(0, 2);

  if (titles.length) {
    return titles;
  }

  return ['Open the guided flow', 'Notice how your body feels after'];
}

function getInterventionTeasers(intervention) {
  const technique = intervention?.canonicalTechniqueSlug
    ? TECHNIQUES.find((candidate) => candidate.slug === intervention.canonicalTechniqueSlug)
    : null;

  if (technique) {
    return getTechniqueTeasers(technique);
  }

  const firstLine = intervention?.description
    ? shorten(intervention.description.split(/[.!?]/)[0], 72)
    : null;

  return [
    firstLine || cleanText(intervention?.interactionLabel, 'Follow the guided prompts'),
    'Track your shift before and after',
  ];
}

function buildTechniqueCard(technique, kind = 'technique') {
  if (!technique) return null;

  const shortName = getTechniqueShortName(technique);
  const targetUrl = `${BASE_URL}/${kind === 'gift' ? 'gift' : 'techniques'}/${technique.slug}`;
  const subtitle = cleanText(technique.subtitle, 'Guided emotional first aid');
  const promise = kind === 'gift'
    ? `Open when you need calm. Guided support in ${technique.time}.`
    : `Guided emotional first aid in ${technique.time}.`;

  return {
    kind,
    slug: technique.slug,
    eyebrow: kind === 'gift' ? 'Send Calm' : subtitle.replace(/^For\s+/i, ''),
    title: shortName,
    promise,
    teaserSteps: getTechniqueTeasers(technique),
    duration: technique.time,
    modality: cleanText(technique.modality, 'Clinically guided'),
    targetUrl,
    pathLabel: getPathFromUrl(targetUrl),
    footer: 'Built by Kevin, psychiatric NP candidate',
  };
}

function buildInterventionCard(intervention) {
  if (!intervention) return null;

  const targetUrl = `${BASE_URL}/intervention/${intervention.id}`;

  return {
    kind: 'intervention',
    slug: intervention.id,
    eyebrow: `${intervention.emotionEmoji || ''} ${intervention.emotionLabel || 'Emotional First Aid'}`.trim(),
    title: cleanText(intervention.title || intervention.name, 'Guided intervention'),
    promise: `A guided ${String(intervention.emotionLabel || 'emotional').toLowerCase()} reset in ${intervention.duration}.`,
    teaserSteps: getInterventionTeasers(intervention),
    duration: intervention.duration,
    modality: cleanText(intervention.modality, 'Clinically guided'),
    targetUrl,
    pathLabel: getPathFromUrl(targetUrl),
    footer: 'Private mood-shift tracking on your device',
  };
}

function buildContentCard(entry, kind, basePath) {
  if (!entry) return null;

  const targetUrl = `${BASE_URL}/${basePath}/${entry.slug}`;

  return {
    kind,
    slug: entry.slug,
    eyebrow: cleanText(entry.eyebrow, kind === 'help' ? 'Help guide' : 'Emotional archetype'),
    title: cleanText(entry.title, 'Guided support'),
    promise: cleanText(entry.promise, 'Evidence-informed emotional first aid.'),
    teaserSteps: (entry.teaserSteps || [])
      .map((step) => cleanText(step))
      .filter(Boolean)
      .slice(0, 2),
    duration: cleanText(entry.duration, 'Quick guide'),
    modality: cleanText(entry.modality, 'Clinically informed guide'),
    targetUrl,
    pathLabel: getPathFromUrl(targetUrl),
    footer: cleanText(
      entry.footer,
      kind === 'help'
        ? 'Private emotional first aid on AIForj'
        : 'Patterns are guides, not diagnoses'
    ),
  };
}

export function getCalmCardData({ kind = 'technique', slug }) {
  if (!slug) return null;

  if (kind === 'intervention') {
    return buildInterventionCard(getInterventionById(slug));
  }

  if (kind === 'help') {
    const entry = HELP_PAGE_CARDS[slug];
    if (!entry) return null;
    return buildContentCard({ slug, ...entry }, 'help', 'help');
  }

  if (kind === 'archetype') {
    const entry = ARCHETYPE_CARDS[slug];
    if (!entry) return null;
    return buildContentCard(
      { slug, ...entry },
      'archetype',
      'archetypes'
    );
  }

  const technique = TECHNIQUES.find((candidate) => candidate.slug === slug);
  if (!technique) return null;

  return buildTechniqueCard(technique, kind);
}
