import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Pattern schema — derived from docs/patterns/2 - Pattern_Template.md
 *
 * Frontmatter captures queryable fields for Astro content collections.
 * The full pattern template structure lives in the markdown body.
 */
const patterns = defineCollection({
  loader: glob({ base: './src/content/patterns', pattern: '**/*.md' }),
  schema: z.object({
    // --- Core pattern metadata ---
    title: z.string(),
    pattern_id: z.string(), // e.g. RSE-HASS-001
    alternative_names: z.array(z.string()).optional(),
    keywords: z.array(z.string()).min(1),
    hass_domains: z.array(z.string()).min(1),
    version: z.string().optional(), // semver e.g. "1.0.0"
    author: z.string(),
    last_updated: z.coerce.date(),

    // --- Extraction-pipeline provenance (optional) ---
    source_type: z
      .enum([
        'interview-transcript',
        'talk-transcript',
        'manual-notes',
        'slides',
        'mixed',
      ])
      .optional(),
    source_ref: z.string().optional(),
    confidence: z.number().min(0).max(1).optional(),
  }),
});

export const collections = { patterns };
