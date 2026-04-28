import { defineCollection, z } from 'astro:content';
// 1. Importamos el loader de glob para archivos locales
import { glob } from 'astro/loaders';

//import { getCollection } from 'astro:content';
//export async function getStaticPaths() {
//  const tours = await getCollection('tours');
//  return tours.map(tour => ({
//    params: { slug: tour.id }, // O usa tour.slug si tu loader lo genera
//    props: { tour },
//  }));
//}

const toursCollection = defineCollection({
  // 2. CAMBIO CLAVE: Usamos loader en lugar de type: 'content'
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

     // Preguntas Frecuentes 
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = {
  'tours': toursCollection,
};