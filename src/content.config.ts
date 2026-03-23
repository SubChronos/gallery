import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from 'astro/loaders';

const gallery = defineCollection({
  // Le decimos a Astro DÓNDE buscar los archivos Markdown
  loader: glob({ pattern: "**/*.md", base: "./src/content/gallery" }),

  schema: ({ image }) => z.object({
    title: z.string(),
    year: z.number(),
    source: z.url(),
    artistName: z.string(),
    artistImage: image(),
    imageGallery: image(),
    imageThumbnail: image(),
    imageHeroSmall: image(),
    imageHeroLarge: image(),
    }),
});

export const collections = { gallery };