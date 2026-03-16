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
  schema: z
    .object({
      // --- Core pattern metadata ---
      title: z.string(),
      pattern_id: z.string().regex(/^[IADP]-\d{3}$/, 'Pattern ID must match {I|A|D|P}-NNN format'),
      pattern_type: z.enum(['implementation', 'architectural', 'design', 'process']),
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
    })
    .refine(
      (data) => {
        const prefix = data.pattern_id.charAt(0);
        const expected = { I: 'implementation', A: 'architectural', D: 'design', P: 'process' };
        return expected[prefix as keyof typeof expected] === data.pattern_type;
      },
      { message: 'pattern_id prefix must match pattern_type (I=implementation, A=architectural, D=design, P=process)' },
    ),
});

export const collections = { patterns };
