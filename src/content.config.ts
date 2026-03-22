import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from 'astro/loaders';

const gallery = defineCollection({
  // Le decimos a Astro DÓNDE buscar los archivos Markdown
  loader: glob({ pattern: "**/*.md", base: "./src/content/gallery" }),

  schema: z.object({
    title: z.string(),
    author: z.string(),
    imageHeroLarge: z.string(),
    imageHeroSmall: z.string(),
    imageGallery: z.string(),
    imageThumbnail: z.string(),
    }),
});

export const collections = { gallery };