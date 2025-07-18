import {z} from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(["development", "production"]).default("production"),
	DATABASE_URL: z
		.string()
		.default("postgresql://postgres:postgres@db:5432/database"),
	POSTGRES_USER: z.string().default("postgres"),
	POSTGRES_PASSWORD: z.string().default("postgres"),
	POSTGRES_DB: z.string().default("database"),

	CLOUDFLARE_ACCOUNT_ID: z.string(),
	CLOUDFLARE_ACCESS_KEY_ID: z.string(),
	CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
	CLOUDFLARE_BUCKET: z.string(),
	CLOUDFLARE_PUBLIC_URL: z.string(),
});

export const env = envSchema.parse(process.env);
