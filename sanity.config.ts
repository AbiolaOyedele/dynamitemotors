import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { serviceSchema } from './sanity/schemas/service.schema'
import { offerSchema } from './sanity/schemas/offer.schema'
import { testimonialSchema } from './sanity/schemas/testimonial.schema'

export default defineConfig({
  name: 'dynamite-motors',
  title: 'Dynamite Motors',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [serviceSchema, offerSchema, testimonialSchema],
  },
})
