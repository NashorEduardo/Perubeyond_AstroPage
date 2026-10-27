import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const toursCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/tours" }),
  schema: z.object({
    title: z.string(),
    price: z.string(), 
    duration: z.string(),
    image: z.string(),
    wetravelUuid: z.string().optional(),
    featured: z.boolean().optional(),
    description: z.string().optional(),
    availability: z.string().optional(),
    frequency: z.string().optional(),
    difficulty: z.string().optional(),
    includes: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),
    itinerary: z.array(z.object({
      day: z.number(),
      title: z.string(),
      description: z.string().optional(),
      activities: z.array(z.string()).optional(),
      images: z.array(z.string()).optional(),
    })).optional(),
    gallery: z.array(z.string()).optional(),
    videoUrl: z.string().optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    targetKeyword: z.string().optional(),
    pubDate: z.string().optional(),
    date: z.string().optional(),
    updatedDate: z.string().optional(),
    author: z.string().default('Peru Beyond'),
    category: z.string().default('Destinos Imperdibles'),
    heroImage: z.string(),
    heroPosition: z.string().optional(),
    imgAlbum: z.array(z.string()).optional(),
    readingTime: z.string().optional(),
    readTime: z.string().optional(),
    views: z.string().optional(),
    featured: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    quickStats: z.union([
      z.record(z.string(), z.string()),
      z.array(z.object({ label: z.string(), value: z.string() })),
    ]).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    relatedTours: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'tours': toursCollection,
  'blog': blogCollection,
};
