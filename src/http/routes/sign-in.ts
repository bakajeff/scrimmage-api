import { db } from "@/db/connection";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import bcrypt from "bcryptjs";
import { authentication } from "../authentication";

export const signIn = new Elysia()
	.error({
		UNAUTHORIZED: UnauthorizedError,
	})
	.onError(({ error, code, status }) => {
		switch (code) {
			case "UNAUTHORIZED":
				return status(401, error.message);
		}
	})
	.use(authentication)
	.post(
		"/sign-in",
		async ({ body, set, signIn }) => {
			const { email, password } = body;

			const [account] = await db
				.select()
				.from(accounts)
				.where(eq(accounts.email, email));

			if (!account) {
				throw new UnauthorizedError();
			}

			const doesPasswordMatch = await bcrypt.compare(
				password,
				account.password,
			);

			if (!doesPasswordMatch) {
				throw new UnauthorizedError();
			}

			await signIn({
				sub: account.id,
			});

			set.status = 200;
		},
		{
			body: z.object({
				email: z.email(),
				password: z.string(),
			}),
		},
	);
