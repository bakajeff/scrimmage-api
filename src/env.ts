import { config } from "dotenv";
import { z } from "zod";

config({
	path: ".env.local",
	quiet: true,
});

const schema = z.object({
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	PORT: z.number().default(3000),
});

export const env = schema.parse(process.env);
