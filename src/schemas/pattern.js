/**
 * Shared pattern schema — single source of truth.
 *
 * Accepts a Zod instance so it works with both `astro/zod` (content config)
 * and the standalone `zod` package (validation script).
 *
 * Derived from docs/patterns/2 - Pattern_Template.md
 */

/**
 * @param {import('zod/v4')} z
 */
export function createPatternSchema(z) {
  return z
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
        return expected[prefix] === data.pattern_type;
      },
      { message: 'pattern_id prefix must match pattern_type (I=implementation, A=architectural, D=design, P=process)' },
    );
}

export const EXPECTED_SECTIONS = [
  'Intent',
  'Context',
  'Issues',
  'Motivating Example',
  'Solution',
  'Implementation Examples',
  'Consequences',
  'Known Uses',
  'References',
];
