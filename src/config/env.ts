import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  SANITY_API_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  QUOTE_RECIPIENT_EMAIL: z.string().email(),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten())
  throw new Error('Environment validation failed. App cannot start.')
}

export const env = parsed.data
