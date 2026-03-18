import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { createPatternSchema } from './schemas/pattern.js';

const patterns = defineCollection({
  loader: glob({ base: './src/content/patterns', pattern: '**/*.md' }),
  schema: createPatternSchema(z),
});

export const collections = { patterns };
