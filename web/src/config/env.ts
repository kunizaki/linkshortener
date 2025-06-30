import {z} from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5173),
    VITE_URL_API: z.string().default('http://localhost:5173'),
})

const _env = envSchema.safeParse(import.meta.env)

if (!_env.success) {
    console.error('❌ Invalid environment variables', _env.error.format())

    throw new Error('Invalid environment variables')
}

export const env = _env.data
